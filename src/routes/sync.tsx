import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Copy, KeyRound, RefreshCw, ShieldCheck, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/gem/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDeviceToken, useDeviceTokens, useRevokeDeviceToken, useSession } from "@/hooks/useGem";

export const Route = createFileRoute("/sync")({
  head: () => ({
    meta: [
      { title: "Sync — Gem" },
      {
        name: "description",
        content: "Generate a private device key for the Gem ingest bridge and learn how to send messages from iOS Shortcuts and Back Tap.",
      },
      { property: "og:title", content: "Sync — Gem" },
      {
        property: "og:description",
        content: "Private sync keys and iOS automation for Gem.",
      },
    ],
  }),
  component: SyncPage,
});

function SyncPage() {
  const { session } = useSession();
  const userId = session?.user.id ?? null;
  const { data: tokens = [] } = useDeviceTokens();
  const createToken = useCreateDeviceToken();
  const revokeToken = useRevokeDeviceToken();
  const [name, setName] = useState("iPhone 14");
  const [generated, setGenerated] = useState("");

  const endpoint = useMemo(
    () => (typeof window !== "undefined" ? new URL("/api/public/ingest", window.location.origin).toString() : "/api/public/ingest"),
    [],
  );

  const generateKey = () => {
    if (!userId) return;
    const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    setGenerated(token);
    createToken.mutate({ user_id: userId, name, token });
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.message("Copy failed — long-press and copy manually.");
    }
  };

  return (
    <AppShell title="Sync" subtitle="Private ingest keys for your devices">
      <div className="mx-auto max-w-md space-y-4">
        <section className="gem-surface rounded-[1.6rem] p-5">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="size-4 text-gold" />
            <h2 className="text-sm font-semibold">Generate a device key</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-name">Device name</Label>
            <Input
              id="device-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-2xl bg-surface-2"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              onClick={generateKey}
              className="gem-brand h-11 flex-1 rounded-2xl text-sm font-semibold"
            >
              <RefreshCw className="mr-2 size-4" /> Generate
            </Button>
            {generated ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => copy(generated)}
                className="h-11 rounded-2xl"
              >
                <Copy className="size-4" />
              </Button>
            ) : null}
          </div>

          {generated ? (
            <div className="mt-4 rounded-2xl border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Current device key</p>
              <code className="break-all text-[11px] text-gold">{generated}</code>
            </div>
          ) : null}
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Wifi className="size-4 text-gold" />
            <h2 className="text-sm font-semibold">Ingest endpoint</h2>
          </div>
          <div className="rounded-2xl border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
            <p className="break-all text-[11px] text-foreground">{endpoint}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => copy(endpoint)}
            className="mt-3 h-10 w-full rounded-2xl text-xs"
          >
            <Copy className="mr-2 size-3.5" /> Copy endpoint
          </Button>
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-gold" />
            <h2 className="text-sm font-semibold">Connected devices</h2>
          </div>
          <div className="space-y-2">
            {tokens.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active device keys yet.</p>
            ) : (
              tokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-surface-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{token.name ?? "Unnamed device"}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{token.token}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => revokeToken.mutate(token.id)}
                    className="h-8 rounded-full px-2 text-[10px] text-destructive"
                    disabled={!token.active}
                  >
                    Revoke
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="gem-surface rounded-[1.6rem] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ArrowRight className="size-4 text-gold" /> iOS Shortcut + Back Tap
          </h2>
          <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>1. Open Shortcuts, tap +, and create a new shortcut named “Gem ingest”.</li>
            <li>2. Add “Get Clipboard” or “Ask for Input”, then “Get Contents of URL”.</li>
            <li>3. Set the URL to the endpoint above and method to POST with JSON like: {`{"device_key":"YOUR_KEY","text":"{{clipboard}}"}`}</li>
            <li>4. Add “Show Result” to confirm success, then save it to your Home Screen.</li>
            <li>5. Open Settings → Accessibility → Touch → Back Tap → Double Tap / Triple Tap → Run Shortcut → choose “Gem ingest”.</li>
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
