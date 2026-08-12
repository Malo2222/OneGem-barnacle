import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pin, Search } from "lucide-react";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Input } from "@/components/ui/input";
import {
  useContacts,
  useHandles,
  useMessages,
  useSaveContact,
  useUserId,
} from "@/hooks/useGem";
import { initials, timeAgo } from "@/lib/gem";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gem — All your messages in one inbox" },
      {
        name: "description",
        content:
          "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox. This is because Graham doesn't give a fuck.",
      },
      { property: "og:title", content: "Gem — All your messages in one inbox" },
      {
        property: "og:description",
        content:
          "Gem merges iMessage, SMS, Instagram, Snapchat and email conversations into a single inbox. This is because Graham doesn't give a fuck.",
      },
    ],
  }),
  component: Inbox,
});

function Inbox() {
  const [q, setQ] = useState("");
  const { data: contacts = [], isLoading } = useContacts();
  const { data: handles = [] } = useHandles();
  const { data: messages = [] } = useMessages();
  const saveContact = useSaveContact();
  const userId = useUserId();

  const rows = useMemo(() => {
    const byContact = new Map<string, { last?: (typeof messages)[number]; unread: number }>();
    for (const m of messages) {
      if (!m.contact_id) continue;
      const entry = byContact.get(m.contact_id) ?? { unread: 0 };
      if (!entry.last || new Date(m.sent_at) > new Date(entry.last.sent_at)) entry.last = m;
      if (!m.read && m.direction === "incoming") entry.unread += 1;
      byContact.set(m.contact_id, entry);
    }
    const term = q.trim().toLowerCase();
    return contacts
      .map((c) => ({
        contact: c,
        platforms: [...new Set(handles.filter((h) => h.contact_id === c.id).map((h) => h.platform))],
        last: byContact.get(c.id)?.last,
        unread: byContact.get(c.id)?.unread ?? 0,
      }))
      .filter(({ contact, platforms, last }) =>
        !term
          ? true
          : contact.display_name.toLowerCase().includes(term) ||
            platforms.some((p) => p.includes(term)) ||
            (last?.body ?? "").toLowerCase().includes(term) ||
            handles
              .filter((h) => h.contact_id === contact.id)
              .some((h) => h.value.toLowerCase().includes(term)),
      );
  }, [contacts, handles, messages, q]);

  const move = (id: string, dir: -1 | 1) => {
    if (!userId) return;
    const idx = rows.findIndex((r) => r.contact.id === id);
    const target = rows[idx + dir];
    const current = rows[idx];
    if (!target || !current) return;
    saveContact.mutate({
      id: current.contact.id,
      user_id: userId,
      display_name: current.contact.display_name,
      position: target.contact.position + dir,
    });
  };

  return (
    <AppShell subtitle={`${contacts.length} people · ${messages.length} messages`}>
      <div className="mx-auto max-w-md">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, handles, messages"
            className="h-12 rounded-full border-border bg-surface-2 pl-11 text-sm"
          />
        </div>

        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="gem-surface mt-6 rounded-3xl p-8 text-center">
            <p className="text-sm font-medium">Nothing here yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add someone in <span className="text-foreground">People</span>, or paste a
              notification in <span className="text-foreground">Capture</span>.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ contact, platforms, last, unread }) => (
              <li key={contact.id} className="group relative">
                <Link
                  to="/thread/$contactId"
                  params={{ contactId: contact.id }}
                  className="gem-surface flex items-center gap-3.5 rounded-[1.6rem] p-3.5 transition-all active:scale-[0.985] hover:gem-float"
                >
                  <Avatar contact={contact} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold tracking-tight">
                        {contact.display_name}
                      </span>
                      {contact.pinned ? (
                        <Pin className="size-3 shrink-0 text-gold" fill="currentColor" />
                      ) : null}
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {last ? timeAgo(last.sent_at) : ""}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {last ? <PlatformBadge platform={last.platform} size="xs" /> : null}
                      <span className="truncate text-xs text-muted-foreground">
                        {last?.body ?? "No messages captured yet"}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {platforms.map((p) => (
                        <PlatformBadge key={p} platform={p} size="xs" />
                      ))}
                    </div>
                  </div>
                  {unread > 0 ? (
                    <span className="gem-brand flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </Link>
                <div className="absolute -right-1 top-1/2 hidden -translate-y-1/2 flex-col gap-1 group-hover:flex">
                  <button
                    aria-label="Move up"
                    onClick={() => move(contact.id, -1)}
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    aria-label="Move down"
                    onClick={() => move(contact.id, 1)}
                    className="flex size-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground"
                  >
                    <ArrowDown className="size-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function Avatar({
  contact,
}: {
  contact: { display_name: string; avatar_url: string | null; accent: string | null };
}) {
  return (
    <div
      className={cn(
        "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold text-primary-foreground",
      )}
      style={{
        backgroundImage: contact.accent
          ? `linear-gradient(135deg, ${contact.accent}, color-mix(in oklab, ${contact.accent} 55%, var(--gold)))`
          : "var(--gradient-brand)",
        boxShadow: "var(--shadow-bubble)",
      }}
    >
      {contact.avatar_url ? (
        <img
          src={contact.avatar_url}
          alt={contact.display_name}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        initials(contact.display_name)
      )}
    </div>
  );
}
