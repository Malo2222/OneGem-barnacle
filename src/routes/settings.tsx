import { createFileRoute } from "@tanstack/react-router";
import {
  LogOut,
  ShieldCheck,
  Smartphone,
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useGem";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Gem" },
      {
        name: "description",
        content:
          "Install Gem on your iPhone home screen, review how the reply hand-off works, and manage your private account.",
      },
      { property: "og:title", content: "Settings — Gem" },
      {
        property: "og:description",
        content:
          "Install Gem to your home screen and manage your private account.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = useSession();
  const [copied, setCopied] = useState(false);

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/public/ingest`
      : "";

  const copyWebhook = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("Ingest Webhook URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell title="Settings" subtitle={session?.user.email ?? ""}>
      <div className="mx-auto max-w-md space-y-4">
        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="size-4 text-gold" /> Put Gem on your iPhone
          </h2>
          <ol className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>1. Open this URL in Safari on your phone.</li>
            <li>2. Share sheet → Add to Home Screen → name it Gem.</li>
            <li>3. Launch from the icon — full screen PWA widget behavior.</li>
            <li>4. Sign in once; session stays logged in.</li>
          </ol>
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Terminal className="size-4 text-gold" /> Automatic SMSBridge
            Webhook
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Configure your Mac Shortcuts or Notification bridge to POST incoming
            messages automatically:
          </p>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-2 p-2.5 text-[11px] font-mono text-primary">
            <span className="truncate max-w-[260px]">
              {webhookUrl || "/api/public/ingest"}
            </span>
            <button
              onClick={copyWebhook}
              className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-gold" /> How replying works
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Apple sandboxes Messages, Instagram and Snapchat — no app or
            shortcut can post for you without getting the account banned. Gem
            instead copies your typed reply and deep-links straight into that
            person's real chat, so you paste and hit send. Opening a deep link
            never sends a snap, opens a story, or fires a read receipt.
          </p>
        </section>

        <Button
          variant="ghost"
          onClick={() => supabase.auth.signOut()}
          className="h-11 w-full gap-2 rounded-2xl text-sm text-destructive"
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>
    </AppShell>
  );
}
