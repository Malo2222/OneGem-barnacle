import { useState, useMemo, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Pin,
  Sparkles,
  MessageCircle,
  ZoomIn,
  ZoomOut,
  Maximize,
  Flame,
  Clock,
  FileText,
  Move,
} from "lucide-react";
import { PlatformBadge } from "./PlatformBadge";
import { initials, timeAgo } from "@/lib/gem";
import type { Contact, Handle, Message } from "@/hooks/useGem";

type Node = {
  contact: Contact;
  x: number;
  y: number;
  radius: number;
  handles: Handle[];
  unreadCount: number;
  lastMsg: Message | undefined;
  ratio: number;
  hotStatus: string;
};

const CANVAS_W = 800;
const CANVAS_H = 800;
const CENTER = { x: 400, y: 400 };
const MIN_NODE_DIST = 90;

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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragPan = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const nodes = useMemo(() => {
    if (contacts.length === 0) return [];

    const raw = contacts.map((c, i) => {
      const ownHandles = handles.filter((h) => h.contact_id === c.id);
      const ownMessages = messages.filter((m) => m.contact_id === c.id);
      const unreadCount = ownMessages.filter(
        (m) => !m.read && m.direction === "incoming",
      ).length;
      const lastMsg = [...ownMessages].sort(
        (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
      )[0];

      const incomingCount = ownMessages.filter((m) => m.direction === "incoming").length;
      const outgoingCount = ownMessages.filter((m) => m.direction === "outgoing").length;
      const totalCount = incomingCount + outgoingCount;
      const ratio = totalCount > 0 ? Math.round((incomingCount / totalCount) * 100) : 50;

      let hotStatus = "Balanced";
      if (ratio > 60) hotStatus = "They text more";
      else if (ratio < 40) hotStatus = "You text more";

      // Node radius scales with message count (min 28, max 48)
      const nodeRadius = Math.min(48, Math.max(28, 28 + totalCount * 2));

      return {
        contact: c,
        angle: (2 * Math.PI * i) / contacts.length,
        radius: 0,
        nodeRadius,
        handles: ownHandles,
        unreadCount,
        lastMsg,
        ratio,
        hotStatus,
      };
    });

    // Collision-free radial layout: spread nodes across rings
    const rings = [
      { radius: 130, capacity: 6 },
      { radius: 230, capacity: 10 },
      { radius: 330, capacity: 16 },
    ];

    let placed = 0;
    for (const ring of rings) {
      const remaining = raw.slice(placed, placed + ring.capacity);
      if (remaining.length === 0) break;
      const angleStep = (2 * Math.PI) / remaining.length;
      for (let j = 0; j < remaining.length; j++) {
        const node = remaining[j]!;
        node.radius = ring.radius;
        node.angle = angleStep * j - Math.PI / 2;
        placed++;
      }
    }

    // If more contacts than ring capacity, place them on an outer ring
    if (placed < raw.length) {
      const remaining = raw.slice(placed);
      const outerRadius = 430;
      const angleStep = (2 * Math.PI) / remaining.length;
      for (let j = 0; j < remaining.length; j++) {
        remaining[j]!.radius = outerRadius;
        remaining[j]!.angle = angleStep * j - Math.PI / 2;
      }
    }

    return raw.map((r) => ({
      ...r,
      x: CENTER.x + r.radius * Math.cos(r.angle),
      y: CENTER.y + r.radius * Math.sin(r.angle),
    })) as Node[];
  }, [contacts, handles, messages]);

  const selectedNode = nodes.find((n) => n.contact.id === selectedId) ?? null;

  const fitView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dragPan.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  }, [pan]);

  const onCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragPan.current) return;
    const dx = e.clientX - dragPan.current.startX;
    const dy = e.clientY - dragPan.current.startY;
    setPan({ x: dragPan.current.panX + dx, y: dragPan.current.panY + dy });
  }, []);

  const onCanvasMouseUp = useCallback(() => {
    dragPan.current = null;
  }, []);

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-3xl border border-primary/20 bg-black/90 gem-blueprint-grid gem-hud-glass select-none">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface/80 px-3.5 py-1.5 backdrop-blur-md text-xs">
          <Sparkles className="size-3.5 text-gold animate-pulse" />
          <span className="font-mono text-[11px] tracking-wider text-primary uppercase flex items-center gap-1.5">
            Spatial Map <Move className="size-3 text-muted-foreground" />
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
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            aria-label="Zoom out"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            onClick={fitView}
            aria-label="Fit view"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <Maximize className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Pannable Canvas */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onMouseLeave={onCanvasMouseUp}
      >
        <motion.div
          animate={{ scale: zoom, x: pan.x, y: pan.y }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="relative origin-center"
          style={{ width: CANVAS_W, height: CANVAS_H, left: `calc(50% - ${CANVAS_W / 2}px)`, top: `calc(50% - ${CANVAS_H / 2}px)` }}
        >
          {/* Center anchor */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: CENTER.x, top: CENTER.y }}
          >
            <div className="size-16 rounded-full border border-primary/20 gem-hud-glow opacity-30" />
          </div>

          {/* Connection lines from center to each node */}
          <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
            {nodes.map((n) => (
              <line
                key={`line-${n.contact.id}`}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={n.x}
                y2={n.y}
                stroke="oklch(0.5 0.1 280 / 0.15)"
                strokeWidth={1}
              />
            ))}
          </svg>

          {/* Nodes — avatar only, no cards */}
          {nodes.map((n) => {
            const isSelected = selectedId === n.contact.id;
            return (
              <motion.div
                key={n.contact.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: n.x, top: n.y }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(isSelected ? null : n.contact.id);
                }}
              >
                <div
                  className={`relative flex items-center justify-center rounded-full border-2 font-bold text-primary-foreground transition-all duration-300 ${
                    isSelected
                      ? "border-gold ring-2 ring-gold/40 gem-hud-glow"
                      : "border-primary/30 hover:border-primary/60"
                  }`}
                  style={{
                    width: n.nodeRadius * 2,
                    height: n.nodeRadius * 2,
                    fontSize: n.nodeRadius > 38 ? "0.875rem" : "0.75rem",
                    backgroundImage: n.contact.accent
                      ? `linear-gradient(135deg, ${n.contact.accent}, color-mix(in oklab, ${n.contact.accent} 55%, var(--gold)))`
                      : "var(--gradient-brand)",
                    boxShadow: "var(--shadow-bubble)",
                  }}
                >
                  {n.contact.avatar_url ? (
                    <img
                      src={n.contact.avatar_url}
                      alt={n.contact.display_name}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    initials(n.contact.display_name)
                  )}

                  {n.unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-extrabold text-white animate-bounce">
                      {n.unreadCount}
                    </span>
                  ) : null}

                  {n.contact.pinned ? (
                    <Pin className="absolute -bottom-1 -right-1 size-3.5 text-gold fill-gold" />
                  ) : null}
                </div>

                {/* Name label only — no card */}
                <span
                  className="mt-1.5 block max-w-[100px] truncate text-center text-[11px] font-medium text-white/80"
                >
                  {n.contact.display_name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Shared Detail Panel — bottom of canvas */}
      <AnimatePresence>
        {selectedNode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl border border-primary/30 bg-surface/95 p-4 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-start gap-3">
              {/* Mini avatar */}
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                style={{
                  backgroundImage: selectedNode.contact.accent
                    ? `linear-gradient(135deg, ${selectedNode.contact.accent}, color-mix(in oklab, ${selectedNode.contact.accent} 55%, var(--gold)))`
                    : "var(--gradient-brand)",
                }}
              >
                {selectedNode.contact.avatar_url ? (
                  <img
                    src={selectedNode.contact.avatar_url}
                    alt={selectedNode.contact.display_name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  initials(selectedNode.contact.display_name)
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-sm text-white">
                    {selectedNode.contact.display_name}
                  </span>
                  {selectedNode.lastMsg ? (
                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {timeAgo(selectedNode.lastMsg.sent_at)}
                    </span>
                  ) : null}
                </div>

                {/* Platform badges */}
                {selectedNode.handles.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedNode.handles.map((h) => (
                      <PlatformBadge key={h.id} platform={h.platform} size="xs" />
                    ))}
                  </div>
                ) : null}

                {/* Last message */}
                {selectedNode.lastMsg ? (
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground italic">
                    "{selectedNode.lastMsg.body}"
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-500">No captured texts</p>
                )}

                {/* Notes */}
                {selectedNode.contact.notes ? (
                  <p className="mt-1.5 line-clamp-2 text-[11px] text-gold/90 font-mono flex items-start gap-1">
                    <FileText className="size-2.5 shrink-0 mt-0.5" />
                    {selectedNode.contact.notes}
                  </p>
                ) : null}

                {/* Ratio + status */}
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="text-gold font-mono flex items-center gap-0.5">
                    <Flame className="size-2.5" /> {selectedNode.ratio}% Them
                  </span>
                  <span>{selectedNode.hotStatus}</span>
                </div>
              </div>
            </div>

            <Link
              to="/thread/$contactId"
              params={{ contactId: selectedNode.contact.id }}
              className="gem-brand mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
            >
              <MessageCircle className="size-3.5" /> Open Thread
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Empty state */}
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No contacts to map yet</p>
        </div>
      ) : null}
    </div>
  );
}
