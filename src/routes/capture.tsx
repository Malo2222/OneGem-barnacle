import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ClipboardPaste, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useAddMessage,
  useContacts,
  useHandles,
  useSaveContact,
  useSaveHandle,
  useUserId,
} from "@/hooks/useGem";
import { PLATFORMS, parseCapture, type Platform } from "@/lib/gem";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Capture a message — Gem" },
      {
        name: "description",
        content:
          "Paste a notification or chat text into Gem and it files the message under the right person and platform automatically.",
      },
      { property: "og:title", content: "Capture a message — Gem" },
      {
        property: "og:description",
        content: "Paste notification text and Gem files it under the right person.",
      },
    ],
  }),
  component: Capture,
});

function Capture() {
  const [raw, setRaw] = useState("");
  const [sender, setSender] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<Platform>("sms");
  const [contactId, setContactId] = useState<string>("");

  const { data: contacts = [] } = useContacts();
  const { data: handles = [] } = useHandles();
  const saveContact = useSaveContact();
  const saveHandle = useSaveHandle();
  const addMessage = useAddMessage();
  const userId = useUserId();
  const navigate = useNavigate();

  const parsed = useMemo(() => (raw ? parseCapture(raw) : null), [raw]);

  useEffect(() => {
    if (!parsed) return;
    setSender(parsed.sender);
    setBody(parsed.body);
    setPlatform(parsed.platform);
    const guess =
      contacts.find(
        (c) => c.display_name.toLowerCase() === parsed.sender.trim().toLowerCase(),
      ) ??
      contacts.find((c) =>
        handles.some(
          (h) =>
            h.contact_id === c.id &&
            h.value.replace(/^@/, "").toLowerCase() ===
              parsed.sender.trim().replace(/^@/, "").toLowerCase(),
        ),
      );
    setContactId(guess?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.sender, parsed?.body, parsed?.platform]);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) throw new Error("empty");
      setRaw(text);
    } catch {
      toast.message("Clipboard blocked — paste into the box manually.");
    }
  };

  const save = async () => {
    if (!userId) return;
    if (!body.trim()) {
      toast.error("Nothing to save yet");
      return;
    }
    try {
      let targetId = contactId;
      if (!targetId) {
        const name = sender.trim() || "Unknown";
        targetId = await saveContact.mutateAsync({
          user_id: userId,
          display_name: name,
          position: contacts.length,
        });
        if (sender.trim()) {
          await saveHandle
            .mutateAsync({
              user_id: userId,
              contact_id: targetId,
              platform,
              value: sender.trim(),
            })
            .catch(() => undefined);
        }
      }
      const handle = handles.find((h) => h.contact_id === targetId && h.platform === platform);
      await addMessage.mutateAsync({
        user_id: userId,
        contact_id: targetId,
        handle_id: handle?.id ?? null,
        platform,
        direction: "incoming",
        body: body.trim(),
        raw,
      });
      toast.success("Filed in Gem");
      setRaw("");
      setBody("");
      setSender("");
      navigate({ to: "/thread/$contactId", params: { contactId: targetId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  };

  return (
    <AppShell title="Capture" subtitle="Paste a notification, Gem sorts it">
      <div className="mx-auto max-w-md space-y-4">
        <div className="gem-surface rounded-[1.6rem] p-4">
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="raw">Pasted text</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={pasteFromClipboard}
              className="h-8 gap-1.5 rounded-full text-xs"
            >
              <ClipboardPaste className="size-3.5" /> Paste
            </Button>
          </div>
          <Textarea
            id="raw"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={5}
            placeholder={"Instagram\nChloe: hey are you up?"}
            className="resize-none rounded-2xl border-border bg-surface-2 text-sm"
          />
          {parsed ? (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkle className="size-3 text-gold" /> Detected{" "}
              <PlatformBadge platform={parsed.platform} size="xs" />
              {parsed.sender ? `from ${parsed.sender}` : "— set the sender below"}
            </p>
          ) : null}
        </div>

        <div className="gem-surface space-y-4 rounded-[1.6rem] p-4">
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-all active:scale-95",
                    platform === p.id
                      ? "border-transparent gem-brand text-primary-foreground"
                      : "border-border bg-surface-2 text-muted-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact">Person</Label>
            <select
              id="contact"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-surface-2 px-3 text-sm"
            >
              <option value="">➕ New person…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </div>

          {!contactId ? (
            <div className="space-y-1.5">
              <Label htmlFor="sender">Name / handle</Label>
              <Input
                id="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Chloe"
                className="h-11 rounded-2xl bg-surface-2"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="resize-none rounded-2xl border-border bg-surface-2 text-sm"
            />
          </div>

          <Button
            onClick={save}
            className="gem-brand h-12 w-full rounded-2xl font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            File it in Gem
          </Button>
        </div>
      </div>
    </AppShell>
  );
}