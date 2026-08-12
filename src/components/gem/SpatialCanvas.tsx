import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Pin,
  Sparkles,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  FileText,
  Flame,
  Move,
} from "lucide-react";
import { PlatformBadge } from "./PlatformBadge";
import { initials, timeAgo } from "@/lib/gem";
import type { Contact, Handle, Message } from "@/hooks/useGem";

export function SpatialCanvas({
  contacts,
  handles,
  messages,
}: {
  contacts: Contact[];
  handles: Handle[];
  messages: Message[];
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );

  // Calculate free-floating orbital nodes with initial positions and relationship intelligence
  const nodes = useMemo(() => {
    const center = { x: 340, y: 320 };
    return contacts.map((c, i) => {
      const radius = 120 + (i % 3) * 60;
      const angle = (2 * Math.PI * i) / (contacts.length || 1);
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);

      const ownHandles = handles.filter((h) => h.contact_id === c.id);
      const ownMessages = messages.filter((m) => m.contact_id === c.id);
      const unreadCount = ownMessages.filter(
        (m) => !m.read && m.direction === "incoming",
      ).length;
      const lastMsg = [...ownMessages].sort(
        (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
      )[0];

      const incomingCount = ownMessages.filter(
        (m) => m.direction === "incoming",
      ).length;
      const outgoingCount = ownMessages.filter(
        (m) => m.direction === "outgoing",
      ).length;
      const totalCount = incomingCount + outgoingCount;
      const ratio =
        totalCount > 0 ? Math.round((incomingCount / totalCount) * 100) : 50;

      let hotStatus = "Balanced";
      if (ratio > 60) hotStatus = "They text more";
      else if (ratio < 40) hotStatus = "You text more";

      return {
        contact: c,
        x,
        y,
        handles: ownHandles,
        unreadCount,
        lastMsg,
        ratio,
        hotStatus,
      };
    });
  }, [contacts, handles, messages]);

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-3xl border border-primary/20 bg-black/90 gem-blueprint-grid gem-hud-glass select-none">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface/80 px-3.5 py-1.5 backdrop-blur-md text-xs">
          <Sparkles className="size-3.5 text-gold animate-pulse" />
          <span className="font-mono text-[11px] tracking-wider text-primary uppercase flex items-center gap-1.5">
            Free-Float Spatial Space{" "}
            <Move className="size-3 text-muted-foreground" />
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface/80 p-1 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
            aria-label="Zoom in"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
            aria-label="Zoom out"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            aria-label="Reset view"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Free-Float Matrix */}
      <div className="relative size-full overflow-hidden">
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative size-full origin-center min-w-[700px] min-h-[700px]"
        >
          {/* Blueprint Center Anchor */}
          <div className="absolute left-[340px] top-[320px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="size-24 rounded-full border border-primary/20 gem-hud-glow animate-ping opacity-20" />
          </div>

          {/* Draggable Contact Nodes */}
          {nodes.map(
            ({
              contact,
              x,
              y,
              handles: ownHandles,
              unreadCount,
              lastMsg,
              ratio,
              hotStatus,
            }) => {
              const isSelected = selectedContactId === contact.id;

              return (
                <motion.div
                  key={contact.id}
                  drag
                  dragConstraints={{
                    left: -250,
                    right: 650,
                    top: -250,
                    bottom: 650,
                  }}
                  initial={{ x, y }}
                  animate={{
                    y: [y, y - 6, y],
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
                >
                  <div
                    onClick={() =>
                      setSelectedContactId(isSelected ? null : contact.id)
                    }
                    className="group relative flex flex-col items-center"
                  >
                    {/* Node Avatar Circle */}
                    <div
                      className="relative flex size-14 items-center justify-center rounded-full border-2 border-primary/40 text-sm font-bold text-primary-foreground transition-all duration-300 group-hover:border-gold gem-hud-glow"
                      style={{
                        backgroundImage: contact.accent
                          ? `linear-gradient(135deg, ${contact.accent}, var(--gold))`
                          : "var(--gradient-brand)",
                      }}
                    >
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt={contact.display_name}
                          className="size-full rounded-full object-cover"
                        />
                      ) : (
                        initials(contact.display_name)
                      )}

                      {unreadCount > 0 ? (
                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-extrabold text-white animate-bounce">
                          {unreadCount}
                        </span>
                      ) : null}

                      {contact.pinned ? (
                        <Pin className="absolute -bottom-1 -right-1 size-3.5 text-gold fill-gold" />
                      ) : null}
                    </div>

                    {/* Integrated Node Card with Notes & Info */}
                    <div className="mt-2 w-48 rounded-2xl border border-primary/20 bg-black/85 p-3 text-center backdrop-blur-md shadow-2xl transition-all group-hover:border-primary/50">
                      <span className="truncate font-semibold text-xs text-white block">
                        {contact.display_name}
                      </span>

                      {/* Display Written User Notes / Info */}
                      {contact.notes ? (
                        <p className="mt-1 line-clamp-2 text-[10px] text-gold/90 font-mono flex items-center justify-center gap-1">
                          <FileText className="size-2.5 shrink-0" />{" "}
                          {contact.notes}
                        </p>
                      ) : null}

                      {/* Last Message Preview */}
                      {lastMsg ? (
                        <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground italic">
                          "{lastMsg.body}"
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] text-gray-500">
                          No captured texts
                        </p>
                      )}

                      {/* Relationship Ratio & Handles */}
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px]">
                        <span className="text-gold font-mono flex items-center gap-0.5">
                          <Flame className="size-2.5" /> {ratio}% Them
                        </span>
                        <div className="flex gap-1">
                          {ownHandles.map((h) => (
                            <PlatformBadge
                              key={h.id}
                              platform={h.platform}
                              size="xs"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Action Menu */}
                    {isSelected ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-2xl border border-primary/40 bg-black/95 p-3 text-left text-xs text-white backdrop-blur-xl shadow-2xl z-30"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                          <span className="font-bold text-gold">
                            {contact.display_name}
                          </span>
                          {lastMsg ? (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />{" "}
                              {timeAgo(lastMsg.sent_at)}
                            </span>
                          ) : null}
                        </div>

                        <div className="my-2 space-y-1 text-[10px] text-gray-300">
                          <p>
                            <b>Status:</b> {hotStatus}
                          </p>
                          {contact.notes ? (
                            <p className="text-gold">
                              <b>Note:</b> {contact.notes}
                            </p>
                          ) : null}
                        </div>

                        <Link
                          to="/thread/$contactId"
                          params={{ contactId: contact.id }}
                          className="gem-brand flex w-full items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
                        >
                          <MessageCircle className="size-3.5" /> Open Thread &
                          Notes
                        </Link>
                      </motion.div>
                    ) : null}
                  </div>
                </motion.div>
              );
            },
          )}
        </motion.div>
      </div>
    </div>
  );
}
