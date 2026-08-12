import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Crosshair, Minus, Plus, Search } from "lucide-react";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Input } from "@/components/ui/input";
import type { Contact, Handle, Message } from "@/hooks/useGem";
import { initials } from "@/lib/gem";
import { cn } from "@/lib/utils";

type Node = {
  contact: Contact;
  x: number;
  y: number;
  platforms: string[];
  lastPlatform?: string;
  unread: number;
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ~2.399963 rad
const RING = 190; // base spacing between spiral arms (world px)
const MIN_K = 0.35;
const MAX_K = 2.6;

/** Deterministic golden-angle spiral placement so the map is stable per person. */
function layout(contacts: Contact[]): { x: number; y: number }[] {
  return contacts.map((_, i) => {
    // Pinned/earliest people sit near the core; the spiral fans outward.
    const r = RING * Math.sqrt(i + 0.6);
    const a = i * GOLDEN;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
}

export function PeopleMap({
  contacts,
  handles,
  messages,
  userEmail,
}: {
  contacts: Contact[];
  handles: Handle[];
  messages: Message[];
  userEmail?: string | null;
}) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [k, setK] = useState(0.9);
  // Offset is measured from the container CENTER (world origin = the "you" hub).
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [flying, setFlying] = useState(false);

  const positions = useMemo(() => layout(contacts), [contacts]);

  const nodes = useMemo<Node[]>(() => {
    const last = new Map<string, Message>();
    const unread = new Map<string, number>();
    for (const m of messages) {
      if (!m.contact_id) continue;
      const prev = last.get(m.contact_id);
      if (!prev || new Date(m.sent_at) > new Date(prev.sent_at)) last.set(m.contact_id, m);
      if (!m.read && m.direction === "incoming")
        unread.set(m.contact_id, (unread.get(m.contact_id) ?? 0) + 1);
    }
    return contacts.map((c, i) => ({
      contact: c,
      x: positions[i]?.x ?? 0,
      y: positions[i]?.y ?? 0,
      platforms: [...new Set(handles.filter((h) => h.contact_id === c.id).map((h) => h.platform))],
      lastPlatform: last.get(c.id)?.platform,
      unread: unread.get(c.id) ?? 0,
    }));
  }, [contacts, handles, messages, positions]);

  const term = q.trim().toLowerCase();
  const matches = useCallback(
    (n: Node) =>
      !term
        ? true
        : n.contact.display_name.toLowerCase().includes(term) ||
          n.platforms.some((p) => p.includes(term)) ||
          handles.some((h) => h.contact_id === n.contact.id && h.value.toLowerCase().includes(term)),
    [term, handles],
  );

  const focusNode = useCallback((n: Node, zoom = 1.5) => {
    setFlying(true);
    setK(zoom);
    setOffset({ x: -n.x * zoom, y: -n.y * zoom });
    window.setTimeout(() => setFlying(false), 520);
  }, []);

  const recenter = useCallback(() => {
    setFlying(true);
    setK(0.9);
    setOffset({ x: 0, y: 0 });
    window.setTimeout(() => setFlying(false), 520);
  }, []);

  // Fly to the first match whenever the query changes.
  useEffect(() => {
    if (!term) return;
    const hit = nodes.find(matches);
    if (hit) focusNode(hit, 1.4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  // ---- Pan / zoom (pointer + wheel + pinch) --------------------------------
  const drag = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    start: { x: number; y: number };
    origin: { x: number; y: number };
    moved: number;
    pinchDist: number;
    pinchK: number;
  }>({
    pointers: new Map(),
    start: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
    moved: 0,
    pinchDist: 0,
    pinchK: 1,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const d = drag.current;
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    d.start = { x: e.clientX, y: e.clientY };
    d.origin = { ...offset };
    d.moved = 0;
    if (d.pointers.size === 2) {
      const [a, b] = [...d.pointers.values()];
      d.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      d.pinchK = k;
    }
    setFlying(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.pointers.has(e.pointerId)) return;
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (d.pointers.size === 2) {
      const [a, b] = [...d.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (d.pinchDist > 0) {
        const next = Math.min(MAX_K, Math.max(MIN_K, (d.pinchK * dist) / d.pinchDist));
        setK(next);
      }
      d.moved = 999;
      return;
    }
    const dx = e.clientX - d.start.x;
    const dy = e.clientY - d.start.y;
    d.moved = Math.max(d.moved, Math.hypot(dx, dy));
    setOffset({ x: d.origin.x + dx, y: d.origin.y + dy });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    d.pointers.delete(e.pointerId);
    if (d.pointers.size < 2) d.pinchDist = 0;
  };

  const onWheel = (e: React.WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Cursor position relative to container center (world origin at k=1, offset 0).
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    const factor = Math.exp(-e.deltaY * 0.0015);
    const next = Math.min(MAX_K, Math.max(MIN_K, k * factor));
    // Keep the world point under the cursor fixed while zooming.
    setOffset((o) => ({
      x: cx - ((cx - o.x) / k) * next,
      y: cy - ((cy - o.y) / k) * next,
    }));
    setK(next);
    setFlying(false);
  };

  const nudge = (dir: 1 | -1) => {
    const next = Math.min(MAX_K, Math.max(MIN_K, k * (dir > 0 ? 1.25 : 0.8)));
    setK(next);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      className="fixed inset-x-0 top-[4.5rem] bottom-24 z-0 touch-none overflow-hidden"
      role="application"
      aria-label="People map — pan and zoom, tap a person to open their thread"
    >
      {/* Blueprint grid + vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 gem-grid opacity-[0.5]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 42%, transparent 40%, var(--background) 92%)",
        }}
      />

      {/* World layer (origin pinned to container center) */}
      <div
        className="absolute left-1/2 top-1/2 will-change-transform"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${k})`,
          transformOrigin: "0 0",
          transition: flying ? "transform 500ms cubic-bezier(0.22,1,0.36,1)" : "none",
        }}
      >
        {/* Connective SVG lines from the hub to each node */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width="1"
          height="1"
        >
          {nodes.map((n) => {
            const on = matches(n);
            return (
              <line
                key={n.contact.id}
                x1={0}
                y1={0}
                x2={n.x}
                y2={n.y}
                stroke="var(--primary)"
                strokeWidth={1}
                strokeDasharray="2 6"
                style={{ opacity: on ? 0.32 : 0.06 }}
              />
            );
          })}
        </svg>

        {/* Hub — "you" */}
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex size-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-duration:3s]" />
            <span className="absolute inset-0 rounded-full border border-primary/40" />
            <span
              className="gem-brand flex size-11 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-foreground"
              style={{ boxShadow: "var(--shadow-bubble)" }}
            >
              You
            </span>
          </div>
          <p className="mt-1 max-w-[7rem] -translate-x-1/2 truncate text-center font-mono text-[9px] text-muted-foreground">
            {userEmail ?? "your network"}
          </p>
        </div>

        {/* Person nodes */}
        {nodes.map((n) => {
          const on = matches(n);
          return (
            <button
              key={n.contact.id}
              onClick={() => {
                if (drag.current.moved > 6) return; // was a pan, not a tap
                navigate({ to: "/thread/$contactId", params: { contactId: n.contact.id } });
              }}
              className={cn(
                "absolute flex flex-col items-center gap-1 outline-none transition-opacity",
                on ? "opacity-100" : "opacity-25",
              )}
              style={{ left: n.x, top: n.y, transform: "translate(-50%, -50%)" }}
              aria-label={`Open conversation with ${n.contact.display_name}`}
            >
              <span className="relative">
                <span
                  className="flex size-14 items-center justify-center overflow-hidden rounded-full text-base font-semibold text-primary-foreground ring-1 ring-border"
                  style={{
                    backgroundImage: n.contact.accent
                      ? `linear-gradient(135deg, ${n.contact.accent}, color-mix(in oklab, ${n.contact.accent} 55%, var(--gold)))`
                      : "var(--gradient-brand)",
                    boxShadow: n.unread > 0 ? "var(--shadow-float)" : "var(--shadow-bubble)",
                  }}
                >
                  {n.contact.avatar_url ? (
                    <img
                      src={n.contact.avatar_url}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    initials(n.contact.display_name)
                  )}
                </span>
                {n.contact.pinned ? (
                  <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-gold ring-2 ring-background" />
                ) : null}
                {n.unread > 0 ? (
                  <span className="gem-brand absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                    {n.unread}
                  </span>
                ) : null}
                {n.lastPlatform ? (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <PlatformBadge platform={n.lastPlatform} size="xs" />
                  </span>
                ) : null}
              </span>
              <span className="max-w-[6.5rem] truncate rounded-full bg-surface/80 px-2 py-0.5 text-center text-[11px] font-medium backdrop-blur-sm">
                {n.contact.display_name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-2">
        <div className="pointer-events-auto relative mx-auto max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the map"
            className="h-11 rounded-full border-border bg-surface/85 pl-11 text-sm backdrop-blur-xl"
          />
        </div>
      </div>

      {/* Zoom / recenter controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <MapBtn label="Zoom in" onClick={() => nudge(1)}>
          <Plus className="size-4" />
        </MapBtn>
        <MapBtn label="Zoom out" onClick={() => nudge(-1)}>
          <Minus className="size-4" />
        </MapBtn>
        <MapBtn label="Recenter" onClick={recenter}>
          <Crosshair className="size-4" />
        </MapBtn>
      </div>

      {contacts.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="gem-surface pointer-events-auto rounded-2xl px-5 py-4 text-center text-xs text-muted-foreground">
            No one on the map yet. Add people or import contacts.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function MapBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="gem-surface flex size-10 items-center justify-center rounded-full text-muted-foreground backdrop-blur-xl transition-transform active:scale-90"
    >
      {children}
    </button>
  );
}
