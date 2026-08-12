import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddMessage,
  useContacts,
  useHandles,
  useMarkRead,
  useMessages,
  useUserId,
} from "@/hooks/useGem";
import { deepLink, platformMeta, timeAgo, webFallback } from "@/lib/gem";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/thread/$contactId")({
  head: () => ({
    meta: [
      { title: "Conversation — Gem" },
      {
        name: "description",
        content:
          "A single merged conversation across iMessage, Instagram, Snapchat and email, with one-tap reply hand-off.",
      },
      { property: "og:title", content: "Conversation — Gem" },
      {
        property: "og:description",
        content: "Merged cross-platform conversation with one-tap reply hand-off.",
      },
    ],
  }),
  component: Thread,
});

function Thread() {
  const { contactId } = useParams({ from: "/thread/$contactId" });
  const { data: contacts = [] } = useContacts();
  const { data: handles = [] } = useHandles();
  const { data: messages = [] } = useMessages(contactId);
  const addMessage = useAddMessage();
  const markRead = useMarkRead();
  const userId = useUserId();

  const contact = contacts.find((c) => c.id === contactId);
  const myHandles = useMemo(
    () => handles.filter((h) => h.contact_id === contactId),
    [handles, contactId],
  );
  const [activeHandleId, setActiveHandleId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!activeHandleId && myHandles[0]) setActiveHandleId(myHandles[0].id);
  }, [myHandles, activeHandleId]);

  useEffect(() => {
    if (contactId && messages.some((m) => !m.read && m.direction === "incoming")) {
      markRead.mutate(contactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, messages.length]);

  const activeHandle = myHandles.find((h) => h.id === activeHandleId) ?? null;

  const handoff = async () => {
    if (!draft.trim() || !activeHandle || !userId) {
      toast.error("Add a handle for this person first");
      return;
    }
    try {
      await navigator.clipboard.writeText(draft);
      toast.success(`Copied — opening ${platformMeta(activeHandle.platform).label}. Paste & send.`);
    } catch {
      toast.message("Copy blocked by the browser — long-press your text to copy.");
    }
    await addMessage.mutateAsync({
      user_id: userId,
      contact_id: contactId,
      handle_id: activeHandle.id,
      platform: activeHandle.platform,
      direction: "outgoing",
      body: draft,
      read: true,
    });
    const url = deepLink(activeHandle.platform, activeHandle.value);
    setDraft("");
    window.location.href = url;
    const fallback = webFallback(activeHandle.platform, activeHandle.value);
    if (fallback) setTimeout(() => window.open(fallback, "_blank"), 1200);
  };

  return (
    <AppShell
      title={contact?.display_name ?? "Conversation"}
      subtitle={myHandles.map((h) => platformMeta(h.platform).label).join(" · ") || "No handles yet"}
      action={
        <Link
          to="/"
          aria-label="Back to inbox"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
      }
    >
      <div className="mx-auto max-w-md space-y-3 pb-44">
        {messages.length === 0 ? (
          <div className="gem-surface rounded-3xl p-8 text-center text-sm text-muted-foreground">
            No messages captured for {contact?.display_name ?? "this person"} yet.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.direction === "outgoing" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-[1.4rem] px-4 py-2.5 text-sm shadow-[var(--shadow-bubble)]",
                  m.direction === "outgoing"
                    ? "gem-brand text-primary-foreground"
                    : "gem-surface",
                )}
              >
                <div className="mb-1 flex items-center gap-1.5 opacity-80">
                  <PlatformBadge platform={m.platform} size="xs" />
                  <span className="text-[10px]">{timeAgo(m.sent_at)}</span>
                </div>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed inset-x-0 bottom-24 z-20 px-4">
        <div className="gem-surface gem-float mx-auto max-w-md rounded-[1.6rem] p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {myHandles.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveHandleId(h.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all active:scale-95",
                  activeHandleId === h.id
                    ? "border-transparent gem-brand text-primary-foreground"
                    : "border-border bg-surface-2 text-muted-foreground",
                )}
              >
                <PlatformBadge platform={h.platform} size="xs" />
                {h.label ?? h.value}
              </button>
            ))}
            {myHandles.length === 0 ? (
              <Link to="/people" className="text-[11px] text-primary underline">
                Add a handle for this person
              </Link>
            ) : null}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder={
                activeHandle
                  ? `Message ${contact?.display_name ?? ""} on ${platformMeta(activeHandle.platform).label}`
                  : "Add a handle first"
              }
              className="max-h-32 min-h-11 resize-none rounded-2xl border-border bg-surface-2 text-sm"
            />
            <button
              onClick={handoff}
              aria-label="Copy and open chat"
              className="gem-brand flex size-11 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-transform active:scale-95"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
            <ExternalLink className="size-3" /> Send copies your text and opens the real chat —
            nothing is posted for you.
          </p>
        </div>
      </div>
    </AppShell>
  );
}