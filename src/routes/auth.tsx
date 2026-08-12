import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/gem-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useGem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to Gem — Your unified message inbox" },
      {
        name: "description",
        content:
          "Private sign-in for Gem, the one place where your iMessage, Instagram, Snapchat and email conversations live together.",
      },
      { property: "og:title", content: "Sign in to Gem" },
      {
        property: "og:description",
        content: "Private access to your unified Gem message inbox.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/" });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 15%, color-mix(in oklab, var(--primary) 55%, transparent), transparent), radial-gradient(40% 30% at 80% 90%, color-mix(in oklab, var(--gold) 30%, transparent), transparent)",
        }}
      />
      <div className="gem-surface gem-float relative z-10 w-full max-w-sm rounded-[2rem] p-7">
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Gem logo"
            width={72}
            height={72}
            className="size-18 h-16 w-16"
          />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            <span className="gem-gradient-text">Gem</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every conversation. One place.
          </p>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl bg-surface-2"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl bg-surface-2"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="gem-brand h-12 w-full rounded-2xl text-base font-semibold text-primary-foreground shadow-[var(--shadow-bubble)] transition-transform active:scale-[0.98]"
          >
            {busy
              ? "One sec…"
              : mode === "signup"
                ? "Create account"
                : "Unlock Gem"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin"
            ? "First time? Create your account"
            : "Already set up? Sign in"}
        </button>
      </div>
    </div>
  );
}
