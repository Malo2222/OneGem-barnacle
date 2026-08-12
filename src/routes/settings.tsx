import { createFileRoute } from "@tanstack/react-router";
import { LogOut, ShieldCheck, Smartphone } from "lucide-react";
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
        content: "Install Gem to your home screen and manage your private account.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = useSession();

  return (
    <AppShell title="Settings" subtitle={session?.user.email ?? ""}>
      <div className="mx-auto max-w-md space-y-4">
        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="size-4 text-gold" /> Put Gem on your iPhone
          </h2>
          <ol className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <li>1. Open this URL in Safari on the iPhone 14.</li>
            <li>2. Share sheet → Add to Home Screen → name it Gem.</li>
            <li>3. Launch from the icon — full screen, no browser chrome.</li>
            <li>4. Sign in once; the session stays for weeks.</li>
          </ol>
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-gold" /> How replying works
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Apple sandboxes Messages, Instagram and Snapchat — no app or shortcut can post for you
            without getting the account banned. Gem instead copies your typed reply and deep-links
            straight into that person's real chat, so you paste and hit send. Opening a deep link
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