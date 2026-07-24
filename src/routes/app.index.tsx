import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play, Sparkles, FileText, Briefcase, Plus, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALEX_MORGAN } from "@/lib/mock/candidates";
import { RECENT_INTERVIEWS } from "@/lib/mock/interviews";
import { OPEN_ROLES } from "@/lib/mock/roles";
import { DASHBOARD_REPORT_SUMMARIES } from "@/lib/mock/reports";
import { ACTIVITY } from "@/lib/mock/activity";

export const Route = createFileRoute("/app/")({
  component: HomeWorkspace,
  head: () => ({
    meta: [
      { title: "Home — Potential" },
      { name: "description", content: "A calm workspace for hiring decisions grounded in evidence." },
    ],
  }),
});

function HomeWorkspace() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 5 ? "Still up" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative">
      {/* Ambient aurora backdrop + lavender-to-white hero wash */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-aurora opacity-35 aurora-drift" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-aurora-soft opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-wash"
      />


      <div className="relative mx-auto max-w-[1200px] px-10 pb-32 pt-16">
        {/* Greeting */}
        <div className="rise-in">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
            <span className="h-px w-6 bg-hairline" />
            Workspace · Wednesday
          </div>
          <h1 className="mt-5 font-display text-[60px] font-normal leading-[1.02] tracking-[-0.02em] text-foreground md:text-[80px]">
            {greeting}, Jamie.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Three conversations in motion. Potential is gathering evidence, not judgements — you decide when there's enough to understand each person fairly.
          </p>
        </div>

        {/* Continue interview — hero glass card */}
        <Link
          to="/app/interviews/console"
          className="group relative mt-14 block overflow-hidden rounded-[22px] border border-hairline/70 bg-card shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_2px_4px_-2px_rgb(30_30_60/0.04),0_20px_50px_-24px_rgb(60_50_120/0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_4px_10px_-4px_rgb(30_30_60/0.06),0_28px_60px_-24px_rgb(60_50_120/0.28)]"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-45 aurora-drift" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card/70 via-card/40 to-card/70 backdrop-blur-2xl" />

          <div className="relative flex items-start justify-between gap-6 p-10">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-rose">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose glow-pulse opacity-90" />
                </span>
                Live · 34 minutes in · voice
              </div>
              <div className="mt-4 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-5xl">
                Continue with <span className="text-gradient">{ALEX_MORGAN.name}</span>
              </div>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Exploring leadership. Potential is listening for evidence of how Alex responds to disagreement before closing the objective.
              </p>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-card text-brand shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_2px_6px_-1px_rgb(80_70_160/0.14),0_14px_32px_-10px_rgb(80_70_160/0.28)] ring-1 ring-hairline/70 transition-all duration-200 ease-out group-hover:scale-105 group-hover:shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_4px_10px_-1px_rgb(80_70_160/0.18),0_20px_44px_-12px_rgb(80_70_160/0.36)]">
              <Play className="h-5 w-5 translate-x-[1px] fill-current" />
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline/60 bg-card/50 px-10 py-5 text-[13px] backdrop-blur-xl">
            <MiniPill label="Objective" value="Leadership" />
            <MiniPill label="Evidence captured" value="Ownership · Decision making" tone="ok" />
            <MiniPill label="Listening for" value="Conflict resolution" tone="pending" />
            <span className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
              Enter workspace <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>



        {/* Ask Potential — AI command bar */}
        <div className="group relative mt-8 ai-glow-hover">
          <div aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/40 via-violet/40 to-sky/40 opacity-60 blur-[6px] transition-opacity group-focus-within:opacity-90" />
          <div className="relative flex items-center gap-3 rounded-2xl border border-hairline/70 bg-card px-4 py-3.5 shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_1px_2px_-1px_rgb(30_30_60/0.04),0_8px_24px_-14px_rgb(30_30_60/0.08)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg btn-primary-gradient">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Ask Potential — “what evidence am I still missing for Alex?”"
              className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/80"
            />
            <span className="mono-label text-muted-foreground/70">Ai</span>
            <kbd className="flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>

        {/* Two column layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column */}
          <div className="space-y-14">
            <Section
              title="In motion"
              action={<span className="text-[12px] text-muted-foreground">3 conversations</span>}
            >
              <div className="space-y-2">
                {RECENT_INTERVIEWS.map((i) => (
                  <Link
                    key={i.name}
                    to="/app/interviews/console"
                    className="group flex items-center gap-4 rounded-2xl border border-hairline/60 bg-background/50 px-5 py-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:bg-background/80 hover:shadow-soft"
                  >
                    <div className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium",
                      i.tone === "live" && "bg-secondary/15 text-secondary",
                      i.tone === "warm" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      i.tone === "done" && "bg-emerald/15 text-emerald",
                    )}>
                      {i.name.split(" ").map(n => n[0]).join("")}
                      {i.tone === "live" && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-background bg-secondary" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <div className="text-[15px] font-medium text-foreground">{i.name}</div>
                        <div className="text-[12px] text-muted-foreground">· {i.role}</div>
                      </div>
                      <div className="text-[12px] text-muted-foreground">{i.detail}</div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <div className="text-[12px] text-foreground">{i.status}</div>
                      <div className="text-[11px] text-muted-foreground">{i.elapsed}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </Section>

            <Section
              title="Open roles"
              action={
                <Link to="/app/roles/new" className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background/60 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur transition-colors hover:border-hairline hover:bg-background hover:text-foreground">
                  <Plus className="h-3 w-3" /> New role
                </Link>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {OPEN_ROLES.map((r) => (
                  <div key={r.title} className="group cursor-pointer rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft">
                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                      <Briefcase className="h-3 w-3" /> Role
                    </div>
                    <div className="mt-3 font-display text-[22px] leading-tight text-foreground">{r.title}</div>
                    <div className="mt-4 flex items-center gap-3 text-[12px] text-muted-foreground">
                      <span>{r.competencies} competencies</span>
                      <span className="text-hairline">·</span>
                      <span>{r.candidates} candidates</span>
                    </div>
                    <div className="mt-3 text-[11px] text-muted-foreground/70">Updated {r.updated}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-14">
            <Section
              title="Evidence reports"
              action={<Link to="/app/reports/$id" params={{ id: ALEX_MORGAN.id }} className="text-[12px] text-muted-foreground hover:text-foreground">All →</Link>}
            >
              <div className="space-y-3">
                {DASHBOARD_REPORT_SUMMARIES.map((r) => (
                  <Link
                    key={r.name}
                    to="/app/reports/$id"
                    params={{ id: r.id }}
                    className="group block rounded-2xl border border-hairline/60 bg-background/50 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                      <FileText className="h-3 w-3" /> Evidence report
                    </div>
                    <div className="mt-2 text-[15px] font-medium text-foreground">
                      {r.name} <span className="font-normal text-muted-foreground">· {r.role}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{r.summary}</p>
                  </Link>
                ))}
              </div>
            </Section>

            <Section title="Activity">
              <ol className="relative space-y-4 border-l border-hairline/70 pl-5">
                {ACTIVITY.map((a, i) => (
                  <li key={i} className="relative">
                    <span className={cn(
                      "absolute -left-[23px] top-1.5 h-2 w-2 rounded-full border-2 border-background",
                      a.tone === "evidence" && "bg-emerald",
                      a.tone === "reasoning" && "bg-secondary glow-pulse",
                      a.tone === "pause" && "bg-amber-500",
                      a.tone === "done" && "bg-muted-foreground/60",
                    )} />
                    <div className="text-[13px] leading-snug text-foreground">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground/70">{a.when}</div>
                  </li>
                ))}
              </ol>
            </Section>

            <div className="rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">Principle</div>
              <p className="mt-3 font-display text-[24px] leading-[1.2] text-foreground">
                Have we collected enough trustworthy evidence to fairly understand this candidate?
              </p>
              <p className="mt-3 text-[12px] text-muted-foreground">Potential never scores. You decide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniPill({ label, value, tone }: { label: string; value: string; tone?: "ok" | "pending" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">{label}</span>
      <span className={cn(
        "text-[13px] font-medium",
        tone === "ok" && "text-emerald",
        tone === "pending" && "text-amber-600 dark:text-amber-400",
        !tone && "text-foreground",
      )}>{value}</span>
    </div>
  );
}
