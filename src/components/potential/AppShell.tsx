import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Briefcase,
  MessageSquare,
  FileText,
  Route as RouteIcon,
  Command,
  Plus,
} from "lucide-react";
import { Logo } from "@/components/potential/Logo";
import { ThemeToggle } from "@/components/potential/ThemeToggle";
import { cn } from "@/lib/utils";
import { SIDEBAR_RECENT as RECENT } from "@/lib/mock/navigation";

const NAV: Array<{ to: string; label: string; icon: typeof Home; color: string; exact?: boolean }> =
  [
    { to: "/app", label: "Home", icon: Home, color: "text-brand", exact: true },
    { to: "/app/roles/new", label: "New role", icon: Plus, color: "text-violet" },
    {
      to: "/app/interviews/console",
      label: "Live interview",
      icon: MessageSquare,
      color: "text-sky",
    },
    {
      to: "/app/reports/alex-morgan",
      label: "Evidence report",
      icon: FileText,
      color: "text-emerald",
    },
    {
      to: "/app/journey/alex-morgan",
      label: "Candidate journey",
      icon: RouteIcon,
      color: "text-purple",
    },
  ];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar — Linear/Arc style */}
        <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col border-r border-hairline/60 bg-sidebar px-3 py-5 md:flex">
          <Link to="/app" className="flex items-center gap-2 px-2 py-1">
            <Logo />
            <ThemeToggle className="ml-auto" />
          </Link>

          <div className="mt-6 px-2">
            <div className="group flex h-9 items-center gap-2 rounded-xl border border-hairline/70 bg-background/80 px-2.5 text-xs text-muted-foreground shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_1px_2px_-1px_rgb(30_30_60/0.04)] transition-all focus-within:border-brand/40 focus-within:ai-glow">
              <Command className="h-3.5 w-3.5 text-brand/70" />
              <span className="flex-1 font-medium">Quick jump</span>
              <kbd className="mono-label rounded-md border border-hairline bg-surface px-1.5 py-0.5 text-[9px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-out",
                    active
                      ? "bg-brand/[0.09] text-brand shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset]"
                      : "text-muted-foreground hover:bg-foreground/[0.035] hover:text-foreground",
                  )}
                >
                  <item.icon
                    strokeWidth={active ? 2 : 1.6}
                    className={cn(
                      "h-[17px] w-[17px] transition-colors",
                      active ? "text-brand" : cn(item.color, "opacity-75 group-hover:opacity-100"),
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 px-2">
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
              Recent
            </div>
            <div className="mt-2 space-y-0.5">
              {RECENT.map((r) => (
                <Link
                  key={r.label}
                  to={r.to}
                  className="block truncate rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-lg border border-hairline/70 bg-background/50 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
              </span>
              Discovery build
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Potential is a personal exploration of evidence-based hiring. Humans always decide.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
