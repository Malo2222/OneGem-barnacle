import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Inbox, Waypoints, Plus, Users, Settings } from "lucide-react";
import logo from "@/assets/gem-logo.png";
import { useSession } from "@/hooks/useGem";
import { ThemeToggle } from "./theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inbox", icon: Inbox },
  { to: "/map", label: "Map", icon: Waypoints },
  { to: "/capture", label: "Capture", icon: Plus },
  { to: "/people", label: "People", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <img src={logo} alt="Gem" width={64} height={64} className="size-16 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-64 opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 45%, transparent), transparent)",
        }}
      />
      <header className="relative z-10 flex items-center gap-3 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3">
        <img src={logo} alt="Gem logo" width={36} height={36} className="size-9 drop-shadow" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {title ?? <span className="gem-gradient-text">Gem</span>}
          </h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {action}
        <ThemeToggle />
      </header>

      <main className="relative z-10 px-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="gem-surface gem-float mx-auto flex max-w-md items-center justify-between rounded-full p-1.5 backdrop-blur-xl">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium transition-all active:scale-95",
                  active
                    ? "gem-brand text-primary-foreground shadow-[var(--shadow-bubble)]"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
