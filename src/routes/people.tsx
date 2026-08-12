import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Pin,
  Plus,
  Trash2,
  X,
  Download,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { PlatformBadge } from "@/components/gem/PlatformBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useContacts,
  useDeleteContact,
  useDeleteHandle,
  useHandles,
  useSaveContact,
  useSaveHandle,
  useUserId,
} from "@/hooks/useGem";
import { PLATFORMS, initials, type Platform } from "@/lib/gem";
import {
  parseVCard,
  pickDeviceContacts,
  isAlikeName,
} from "@/lib/contact-sync";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/people")({
  head: () => ({
    meta: [
      { title: "People & handles — Gem" },
      {
        name: "description",
        content:
          "Merge one person's iMessage, Instagram, Snapchat and email handles into a single Gem contact with a photo and accent colour.",
      },
      { property: "og:title", content: "People & handles — Gem" },
      {
        property: "og:description",
        content: "Merge every account a person uses into a single Gem contact.",
      },
    ],
  }),
  component: People,
});

function People() {
  const { data: contacts = [] } = useContacts();
  const { data: handles = [] } = useHandles();
  const saveContact = useSaveContact();
  const deleteContact = useDeleteContact();
  const saveHandle = useSaveHandle();
  const deleteHandle = useDeleteHandle();
  const userId = useUserId();

  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("imessage");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  const vcardInputRef = useRef<HTMLInputElement>(null);

  const addPerson = async () => {
    if (!userId || !name.trim()) return;
    await saveContact.mutateAsync({
      user_id: userId,
      display_name: name.trim(),
      position: contacts.length,
    });
    setName("");
    toast.success("Person added");
  };

  const handleDeviceImport = async () => {
    if (!userId) return;
    const deviceContacts = await pickDeviceContacts();
    if (!deviceContacts.length) {
      toast.message(
        "No contacts selected or browser contacts picker unsupported",
      );
      return;
    }

    let count = 0;
    for (const dc of deviceContacts) {
      // Find existing contact by alike name
      const existing = contacts.find((c) =>
        isAlikeName(c.display_name, dc.displayName),
      );
      let cId = existing?.id;

      if (!cId) {
        cId = await saveContact.mutateAsync({
          user_id: userId,
          display_name: dc.displayName,
          position: contacts.length + count,
        });
      }

      for (const phone of dc.phoneNumbers) {
        await saveHandle
          .mutateAsync({
            user_id: userId,
            contact_id: cId,
            platform: "sms",
            value: phone,
          })
          .catch(() => undefined);
      }

      for (const email of dc.emails) {
        await saveHandle
          .mutateAsync({
            user_id: userId,
            contact_id: cId,
            platform: "email",
            value: email,
          })
          .catch(() => undefined);
      }
      count++;
    }
    toast.success(`Imported & merged ${count} contacts from device`);
  };

  const handleVCardFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const text = await file.text();
    const parsedCards = parseVCard(text);
    if (!parsedCards.length) {
      toast.error("Could not parse vCard contacts");
      return;
    }

    let count = 0;
    for (const card of parsedCards) {
      const existing = contacts.find((c) =>
        isAlikeName(c.display_name, card.displayName),
      );
      let cId = existing?.id;

      if (!cId) {
        cId = await saveContact.mutateAsync({
          user_id: userId,
          display_name: card.displayName,
          position: contacts.length + count,
        });
      }

      for (const phone of card.phoneNumbers) {
        await saveHandle
          .mutateAsync({
            user_id: userId,
            contact_id: cId,
            platform: "sms",
            value: phone,
          })
          .catch(() => undefined);
      }

      for (const email of card.emails) {
        await saveHandle
          .mutateAsync({
            user_id: userId,
            contact_id: cId,
            platform: "email",
            value: email,
          })
          .catch(() => undefined);
      }

      for (const soc of card.socialHandles) {
        await saveHandle
          .mutateAsync({
            user_id: userId,
            contact_id: cId,
            platform: soc.platform as Platform,
            value: soc.value,
          })
          .catch(() => undefined);
      }
      count++;
    }
    toast.success(`Merged ${count} contacts from vCard file`);
  };

  const addHandle = async (contactId: string) => {
    if (!userId || !value.trim()) return;
    try {
      await saveHandle.mutateAsync({
        user_id: userId,
        contact_id: contactId,
        platform,
        value: value.trim(),
        label: label.trim() || null,
      });
      setValue("");
      setLabel("");
    } catch {
      toast.error("That handle already exists");
    }
  };

  return (
    <AppShell title="People" subtitle="One person, every account">
      <div className="mx-auto max-w-md space-y-4">
        {/* Import & Sync Action Bar */}
        <div className="gem-surface rounded-[1.6rem] p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Automatic Identity Merge
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeviceImport}
                className="h-8 rounded-full text-xs gap-1.5 border-primary/30"
              >
                <UserCheck className="size-3.5 text-primary" /> Phone Contacts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => vcardInputRef.current?.click()}
                className="h-8 rounded-full text-xs gap-1.5 border-primary/30"
              >
                <Download className="size-3.5 text-primary" /> Import .VCF
              </Button>
              <input
                ref={vcardInputRef}
                type="file"
                accept=".vcf,text/vcard"
                onChange={handleVCardFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add person manually (e.g. Chloe)"
              className="h-11 rounded-2xl border-border bg-surface-2 text-sm"
            />
            <Button
              onClick={addPerson}
              aria-label="Add person"
              className="gem-brand size-11 shrink-0 rounded-full p-0 text-primary-foreground shadow-md"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {contacts.map((c) => {
          const own = handles.filter((h) => h.contact_id === c.id);
          const expanded = open === c.id;
          return (
            <div key={c.id} className="gem-surface rounded-[1.6rem] p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-primary-foreground"
                  style={{
                    backgroundImage: c.accent
                      ? `linear-gradient(135deg, ${c.accent}, var(--gold))`
                      : "var(--gradient-brand)",
                  }}
                >
                  {c.avatar_url ? (
                    <img
                      src={c.avatar_url}
                      alt={c.display_name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    initials(c.display_name)
                  )}
                </div>
                <button
                  onClick={() => setOpen(expanded ? null : c.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate font-semibold">{c.display_name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {own.length ? (
                      own.map((h) => (
                        <PlatformBadge
                          key={h.id}
                          platform={h.platform}
                          size="xs"
                        />
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        No handles yet
                      </span>
                    )}
                  </div>
                </button>
                <button
                  aria-label="Pin"
                  onClick={() =>
                    userId &&
                    saveContact.mutate({
                      id: c.id,
                      user_id: userId,
                      display_name: c.display_name,
                      pinned: !c.pinned,
                    })
                  }
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border border-border",
                    c.pinned ? "text-gold" : "text-muted-foreground",
                  )}
                >
                  <Pin
                    className="size-4"
                    fill={c.pinned ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {expanded ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <div className="space-y-1.5">
                    <Label>Photo URL</Label>
                    <Input
                      defaultValue={c.avatar_url ?? ""}
                      onBlur={(e) =>
                        userId &&
                        saveContact.mutate({
                          id: c.id,
                          user_id: userId,
                          display_name: c.display_name,
                          avatar_url: e.target.value || null,
                        })
                      }
                      placeholder="https://…"
                      className="h-10 rounded-xl bg-surface-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Accent colour</Label>
                    <Input
                      type="color"
                      defaultValue={c.accent ?? "#8b5cf6"}
                      onBlur={(e) =>
                        userId &&
                        saveContact.mutate({
                          id: c.id,
                          user_id: userId,
                          display_name: c.display_name,
                          accent: e.target.value,
                        })
                      }
                      className="h-10 w-20 rounded-xl bg-surface-2 p-1"
                    />
                  </div>

                  <ul className="space-y-2">
                    {own.map((h) => (
                      <li
                        key={h.id}
                        className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm"
                      >
                        <PlatformBadge platform={h.platform} size="xs" />
                        <span className="min-w-0 flex-1 truncate">
                          {h.value}
                        </span>
                        {h.label ? (
                          <span className="text-[10px] text-muted-foreground">
                            {h.label}
                          </span>
                        ) : null}
                        <button
                          aria-label="Remove handle"
                          onClick={() => deleteHandle.mutate(h.id)}
                          className="text-muted-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 rounded-2xl border border-dashed border-border p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[11px] transition-all active:scale-95",
                            platform === p.id
                              ? "border-transparent gem-brand text-primary-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={
                        platform === "imessage" || platform === "sms"
                          ? "+15551234567"
                          : platform === "email"
                            ? "name@school.edu"
                            : "@username"
                      }
                      className="h-10 rounded-xl bg-surface-2 text-sm"
                    />
                    <Input
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Label (optional) — e.g. second account"
                      className="h-10 rounded-xl bg-surface-2 text-sm"
                    />
                    <Button
                      onClick={() => addHandle(c.id)}
                      className="gem-brand h-10 w-full rounded-xl text-sm font-semibold text-primary-foreground"
                    >
                      Add handle
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => deleteContact.mutate(c.id)}
                    className="h-9 w-full gap-1.5 rounded-xl text-xs text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Delete {c.display_name}
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
