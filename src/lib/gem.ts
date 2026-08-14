export type Platform = "imessage" | "sms" | "instagram" | "snapchat" | "email";

export const PLATFORMS: {
  id: Platform;
  label: string;
  short: string;
  color: string;
}[] = [
  {
    id: "imessage",
    label: "iMessage",
    short: "iM",
    color: "oklch(0.72 0.19 145)",
  },
  { id: "sms", label: "SMS", short: "SMS", color: "oklch(0.72 0.15 230)" },
  {
    id: "instagram",
    label: "Instagram",
    short: "IG",
    color: "oklch(0.68 0.22 15)",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    short: "SC",
    color: "oklch(0.86 0.17 100)",
  },
  { id: "email", label: "Email", short: "@", color: "oklch(0.66 0.13 280)" },
];

export const platformMeta = (id: string) =>
  PLATFORMS.find((p) => p.id === id) ?? {
    id: id as Platform,
    label: id,
    short: id.slice(0, 2).toUpperCase(),
    color: "oklch(0.6 0.05 300)",
  };

/** Deep links never send anything on their own — they only open the chat. */
export function deepLink(platform: string, value: string): string {
  const v = value.trim();
  switch (platform) {
    case "imessage":
    case "sms":
      return `sms:${v.replace(/[^\d+]/g, "")}`;
    case "instagram":
      return `instagram://user?username=${encodeURIComponent(v.replace(/^@/, ""))}`;
    case "snapchat":
      return `snapchat://add/${encodeURIComponent(v.replace(/^@/, ""))}`;
    case "email":
      return `mailto:${v}`;
    default:
      return "#";
  }
}

export function webFallback(platform: string, value: string): string | null {
  const v = value.trim().replace(/^@/, "");
  if (platform === "instagram") return `https://instagram.com/${v}`;
  if (platform === "snapchat") return `https://www.snapchat.com/add/${v}`;
  return null;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
}

export function normalizeHandle(value: string) {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function firstName(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)[0]?.toLowerCase() ?? "";
}

export function matchContact<T extends { id: string; display_name: string }>(
  sender: string,
  platform: Platform,
  contacts: T[],
  handles: { contact_id: string; platform: string; value: string }[],
) {
  const raw = sender.trim();
  if (!raw) return null;

  const exactName = raw.toLowerCase();
  const senderFirst = firstName(raw);
  const senderHandle = normalizeHandle(raw);
  const senderPhone = normalizePhone(raw);

  const byName = contacts.find((c) => c.display_name.trim().toLowerCase() === exactName);
  if (byName) return byName;

  const byHandle = handles.find((h) => {
    const samePlatform = h.platform === platform;
    const sameText = normalizeHandle(h.value) === senderHandle;
    const sameRawValue = h.value.trim().toLowerCase() === raw.toLowerCase();
    return samePlatform && (sameText || sameRawValue);
  });
  if (byHandle) return contacts.find((c) => c.id === byHandle.contact_id) ?? null;

  const byPhone = handles.find((h) => {
    if (h.platform !== "sms" && h.platform !== "imessage") return false;
    return normalizePhone(h.value) === senderPhone;
  });
  if (byPhone) return contacts.find((c) => c.id === byPhone.contact_id) ?? null;

  const firstNameMatch = contacts.find((c) => firstName(c.display_name) === senderFirst);
  if (firstNameMatch) return firstNameMatch;

  return null;
}

/**
 * Parses pasted notification text into { sender, body, platform }.
 * Handles the common iOS notification shapes:
 *   "Instagram\nChloe: hey are you up"
 *   "Chloe sent you a snap"
 *   "Chloe: hey"
 */
export function parseCapture(raw: string): {
  sender: string;
  body: string;
  platform: Platform;
} {
  const text = raw.trim();
  const lower = text.toLowerCase();
  let platform: Platform = "sms";
  if (lower.includes("instagram")) platform = "instagram";
  else if (lower.includes("snapchat") || lower.includes("snap"))
    platform = "snapchat";
  else if (lower.includes("imessage")) platform = "imessage";
  else if (lower.includes("mail") || /\S+@\S+\.\S+/.test(text))
    platform = "email";

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter(
      (l) =>
        !/^(instagram|snapchat|messages|imessage|mail|gmail|now|\d+m ago)$/i.test(
          l,
        ),
    );

  const joined = lines.join("\n");
  const colon = joined.match(/^([^:\n]{1,40}):\s*([\s\S]+)$/);
  if (colon)
    return { sender: colon[1]!.trim(), body: colon[2]!.trim(), platform };

  const snap = joined.match(
    /^(.{1,40}?)\s+(sent you a snap|sent you a chat|sent a message)/i,
  );
  if (snap)
    return { sender: snap[1]!.trim(), body: joined, platform: "snapchat" };

  if (lines.length > 1)
    return { sender: lines[0]!, body: lines.slice(1).join("\n"), platform };

  return { sender: "", body: joined, platform };
}
