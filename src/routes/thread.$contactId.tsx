import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Send,
  Clock,
  BellOff,
  Bell,
  Flame,
  FileText,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  useAddMessage,
  useContacts,
  useHandles,
  useMarkRead,
  useMessages,
  useSaveContact,
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
        content:
          "Merged cross-platform conversation with one-tap reply hand-off.",
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
  const saveContact = useSaveContact();
  const userId = useUserId();

  const contact = contacts.find((c) => c.id === contactId);
  const myHandles = useMemo(
    () => handles.filter((h) => h.contact_id === contactId),
    [handles, contactId],
  );
  const [activeHandleId, setActiveHandleId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  // Notes & Info State
  const [notes, setNotes] = useState(contact?.notes ?? "");
  const [showNotes, setShowNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Mute & Schedule States
  const [isMuted, setIsMuted] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    if (contact?.notes !== undefined) setNotes(contact.notes ?? "");
  }, [contact?.notes]);

  useEffect(() => {
    if (!activeHandleId && myHandles[0]) setActiveHandleId(myHandles[0].id);
  }, [myHandles, activeHandleId]);

  useEffect(() => {
    if (
      contactId &&
      messages.some((m) => !m.read && m.direction === "incoming")
    ) {
      markRead.mutate(contactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, messages.length]);

  const activeHandle = myHandles.find((h) => h.id === activeHandleId) ?? null;

  // Relationship & "Hot Watch" Intelligence Metrics
  const metrics = useMemo(() => {
    const incoming = messages.filter((m) => m.direction === "incoming");
    const outgoing = messages.filter((m) => m.direction === "outgoing");
    const total = messages.length;

    const ratioIn =
      total > 0 ? Math.round((incoming.length / total) * 100) : 50;
    const ratioOut = total > 0 ? 100 - ratioIn : 50;

    const avgInWords =
      incoming.length > 0
        ? Math.round(
            incoming.reduce((acc, m) => acc + m.body.split(/\s+/).length, 0) /
              incoming.length,
          )
        : 0;

    const avgOutWords =
      outgoing.length > 0
        ? Math.round(
            outgoing.reduce((acc, m) => acc + m.body.split(/\s+/).length, 0) /
              outgoing.length,
          )
        : 0;

    let hotStatus = "Equal Balance";
    if (ratioIn > 60) hotStatus = "They text you more";
    else if (ratioOut > 60) hotStatus = "You text them more";

    // Late-night detection (10 PM to 5 AM)
    const lastMsg = [...messages].sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
    )[0];
    let isLateNight = false;
    let lateTimeStr = "";
    if (lastMsg) {
      const d = new Date(lastMsg.sent_at);
      const hrs = d.getHours();
      if (hrs >= 22 || hrs <= 5) {
        isLateNight = true;
        lateTimeStr = d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    return {
      ratioIn,
      ratioOut,
      avgInWords,
      avgOutWords,
      hotStatus,
      isLateNight,
      lateTimeStr,
    };
  }, [messages]);

  const handleSaveNotes = async () => {
    if (!contact || !userId) return;
    setIsSavingNotes(true);
    try {
      await saveContact.mutateAsync({
        id: contact.id,
        user_id: userId,
        display_name: contact.display_name,
        notes,
      });
      toast.success("Notes saved for " + contact.display_name);
      setShowNotes(false);
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handoff = async (scheduledTime?: Date) => {
    if (!draft.trim() || !activeHandle || !userId) {
      toast.error("Add a handle for this person first");
      return;
    }

    if (scheduledTime) {
      await addMessage.mutateAsync({
        user_id: userId,
        contact_id: contactId,
        handle_id: activeHandle.id,
        platform: activeHandle.platform,
        direction: "outgoing",
        body: `[Scheduled for ${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}] ${draft}`,
        read: true,
        sent_at: scheduledTime.toISOString(),
      });
      toast.success(
        `Scheduled text for ${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}!`,
      );
      setDraft("");
      setShowSchedule(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(draft);
      toast.success(
        `Copied — opening ${platformMeta(activeHandle.platform).label}. Paste & send.`,
      );
    } catch {
      toast.message(
        "Copy blocked by the browser — long-press your text to copy.",
      );
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
      subtitle={
        myHandles.map((h) => platformMeta(h.platform).label).join(" · ") ||
        "No handles yet"
      }
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label="Toggle mute"
            className={cn(
              "flex size-10 items-center justify-center rounded-full border border-border transition-all",
              isMuted
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-surface-2 text-muted-foreground hover:text-foreground",
            )}
          >
            {isMuted ? (
              <BellOff className="size-4" />
            ) : (
              <Bell className="size-4" />
            )}
          </button>
          <Link
            to="/"
            aria-label="Back to inbox"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-md space-y-3 pb-52">
        {/* Subtle Late-Night Card Signal */}
        {metrics.isLateNight ? (
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs text-amber-300 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-400 animate-pulse" />
              <span>
                Late night activity ({metrics.lateTimeStr}) — card subtly
                shifting to amber tone
              </span>
            </div>
          </div>
        ) : null}

        {/* Hot Watch & Intelligence Bar */}
        <div className="gem-surface rounded-3xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5 text-gold">
              <Flame className="size-4" /> Hot Watch Status: {metrics.hotStatus}
            </span>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1 text-[11px] text-primary hover:underline font-mono"
            >
              <FileText className="size-3" /> Notes & Info{" "}
              {showNotes ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="rounded-2xl border border-border bg-surface-2 p-2 text-center">
              <p className="font-mono text-foreground font-bold">
                {metrics.ratioIn}% Them / {metrics.ratioOut}% You
              </p>
              <p className="text-[10px]">Message Volume Ratio</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-2 p-2 text-center">
              <p className="font-mono text-foreground font-bold">
                ~{metrics.avgInWords} words / ~{metrics.avgOutWords} words
              </p>
              <p className="text-[10px]">Avg Text Length</p>
            </div>
          </div>

          {/* Collapsible Notes Section */}
          <AnimatePresence>
            {showNotes ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 border-t border-border overflow-hidden"
              >
                <p className="text-xs font-medium text-foreground">
                  Notes & Info for {contact?.display_name}:
                </p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add birthday, Matcha preferences, how you met, key dates..."
                  className="min-h-20 text-xs rounded-xl border-border bg-background"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="gem-brand w-full py-1.5 rounded-xl text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all"
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Messages Feed */}
        {messages.length === 0 ? (
          <div className="gem-surface rounded-3xl p-8 text-center text-sm text-muted-foreground">
            No messages captured for {contact?.display_name ?? "this person"}{" "}
            yet.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex",
                  m.direction === "outgoing" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-[1.4rem] px-4 py-2.5 text-sm shadow-[var(--shadow-bubble)]",
                    m.direction === "outgoing"
                      ? "gem-brand text-primary-foreground"
                      : metrics.isLateNight
                        ? "bg-amber-950/40 border border-amber-500/30 text-amber-100"
                        : "gem-surface",
                  )}
                >
                  <div className="mb-1 flex items-center gap-1.5 opacity-80">
                    <PlatformBadge platform={m.platform} size="xs" />
                    <span className="text-[10px]">{timeAgo(m.sent_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Bottom Composer Bar */}
      <div className="fixed inset-x-0 bottom-20 z-20 px-4">
        <div className="gem-surface gem-float mx-auto max-w-md rounded-[1.6rem] p-3 space-y-2">
          {/* Handle Pickers */}
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex flex-wrap gap-1.5">
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
                <Link
                  to="/people"
                  className="text-[11px] text-primary underline"
                >
                  Add a handle for this person
                </Link>
              ) : null}
            </div>

            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className={cn(
                "flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-all",
                showSchedule
                  ? "border-gold text-gold bg-gold/10"
                  : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
              )}
            >
              <Clock className="size-3" /> Schedule
            </button>
          </div>

          {/* Schedule Delay Options */}
          <AnimatePresence>
            {showSchedule ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]"
              >
                <button
                  onClick={() => handoff(new Date(Date.now() + 15 * 60 * 1000))}
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20"
                >
                  +15 Mins
                </button>
                <button
                  onClick={() => handoff(new Date(Date.now() + 60 * 60 * 1000))}
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20"
                >
                  +1 Hour
                </button>
                <button
                  onClick={() => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    tom.setHours(9, 0, 0, 0);
                    handoff(tom);
                  }}
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold font-semibold hover:bg-gold/20"
                >
                  Tomorrow 9 AM
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Input & Send */}
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
              onClick={() => handoff()}
              aria-label="Copy and open chat"
              className="gem-brand flex size-11 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-transform active:scale-95"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <ExternalLink className="size-3" /> Send copies your text and opens
            the real chat — nothing is posted for you.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
