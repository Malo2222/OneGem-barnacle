
SUPABASE_PROJECT_ID="zqwwgcfahfzckmapilhs"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_IIBKeW7ACXK4_EnM57Pl7A_j3VvTeUh"
SUPABASE_URL="https://zqwwgcfahfzckmapilhs.supabase.co"
VITE_SUPABASE_PROJECT_ID="zqwwgcfahfzckmapilhs"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_IIBKeW7ACXK4_EnM57Pl7A_j3VvTeUh"
VITE_SUPABASE_URL="https://zqwwgcfahfzckmapilhs.supabase.co"
sneaking my .env shi in here
# Gem — Unified Social Inbox (build plan)

## Reality constraints (read first)
- iOS sandboxes Snapchat / Instagram / iMessage. No app, Shortcut, or website can silently scrape their chats.
  Anything that claims otherwise gets your accounts banned or simply cannot run.
- What IS possible and is what Gem does:
  1. **Manual/assisted capture**: paste or share notification text / chat text into Gem (share sheet, paste, or typed).
  2. **Identity merge**: one person = one Gem contact, with many handles (imessage/sms/instagram x2/snapchat/email).
  3. **Unified thread view** with per-platform badges.
  4. **Reply bridge**: type in Gem -> tap Send -> text is copied to clipboard AND the native app deep-links straight
     to that person's chat -> you paste + send. One tap, no notification side effects (no snap sent, no story viewed).
  5. **Email (school)**: only channel that can be fully automated later (IMAP via a server function).
- Delivery: web app (PWA). Add to Home Screen on the 14 = looks/behaves like a native app, no Xcode, no $99 dev account.
  Later the same UI can be wrapped in a Swift WKWebView shell if you want App Store/native push.

## Steps
1. [x] Plan file (this).
2. [x] Enable backend (Postgres + auth) — password-protected, per-user RLS.
3. [x] Schema: profiles, contacts, handles, messages, + indexes, grants, RLS.
4. [x] Design system: black / purple / gold, light+dark, bubbly floating UI, in styles.css.
5. [x] Auth route (/auth) + protected shell.
6. [x] Inbox: floating bubble list, avatars, search, pin/reorder, unread dots, platform badges.
7. [x] Thread view: merged messages across platforms, badges, compose box -> copy + deep link.
8. [x] Capture screen: paste raw notification text -> parse sender + body -> route to contact (create/merge).
9. [x] Contact editor: name, photo URL, color, handles per platform, ordering.
10. [x] Settings: theme toggle, deep-link behavior, AI digest hook placeholder.
11. [x] SEO/meta + manifest for PWA install.
12. [ ] You verify on device; then optional: AI digest (Lovable AI), IMAP email pull, Mac SMSBridge POST endpoint.

## Deep link table
- iMessage/SMS: `sms:+1XXXXXXXXXX`
- Instagram: `instagram://user?username=handle` (opens profile -> Message)
- Snapchat: `snapchat://add/username` / fallback `https://www.snapchat.com/add/username`
- Email: `mailto:addr`
No deep link sends anything by itself — nothing fires a snap, story, or read receipt.

## Future ingest endpoint (already reserved)
`POST /api/public/ingest` with a token -> insert messages. That is where the Mac SMSBridge digest lands.
