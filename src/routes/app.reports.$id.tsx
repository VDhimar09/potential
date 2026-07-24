import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Quote, ArrowRight, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Confidence } from "@/domain";
import { ALEX_MORGAN } from "@/lib/mock/candidates";
import { COMPETENCY_REPORTS as COMPETENCIES, REPORT_TIMELINE as TIMELINE } from "@/lib/mock/reports";

export const Route = createFileRoute("/app/reports/$id")({
  component: EvidenceReport,
  head: ({ params }) => ({
    meta: [
      { title: `Evidence report · ${params.id} — Potential` },
      { name: "description", content: "An evidence-based report. No scores. No rankings. Humans decide." },
    ],
  }),
});

function EvidenceReport() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora opacity-30 aurora-drift" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora-soft opacity-80" />

      <div className="relative mx-auto max-w-[920px] px-10 pb-32 pt-10">
        <div className="flex items-center justify-between">
          <Link to="/app" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Workspace
          </Link>
          <Link
            to="/app/journey/$id"
            params={{ id: ALEX_MORGAN.id }}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline/70 bg-background/60 px-3 py-1.5 text-[12px] text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-foreground"
          >
            <RouteIcon className="h-3.5 w-3.5" /> View journey
          </Link>
        </div>

        <header className="mt-14 rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">Evidence report</div>
          <h1 className="mt-4 font-display text-[64px] leading-[1.02] tracking-tight text-foreground md:text-[80px]">
            {ALEX_MORGAN.name}
          </h1>
          <div className="mt-3 text-[15px] text-muted-foreground">{ALEX_MORGAN.role} · Interview conducted 12 April, 2027</div>
        </header>

        {/* Capability summary */}
        <section className="mt-16">
          <SectionEyebrow>Capability summary</SectionEyebrow>
          <p className="mt-5 max-w-2xl font-display text-[30px] leading-[1.25] text-foreground md:text-[36px]">
            Alex leads through evidence rather than authority. Strong signals across systems thinking, ownership and written communication.
            <span className="text-muted-foreground"> Their behaviour under direct conflict has not yet been observed.</span>
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-hairline/70 bg-background/60 px-4 py-2 text-[12px] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Potential does not recommend hire or reject. This report exists to help humans decide.
          </div>
        </section>

        {/* Evidence by competency */}
        <section className="mt-20">
          <SectionEyebrow>Evidence by competency</SectionEyebrow>
          <div className="mt-6 space-y-4">
            {COMPETENCIES.map((c) => (
              <div key={c.name} className="rounded-[24px] border border-hairline/60 bg-background/60 p-8 backdrop-blur-xl transition-shadow hover:shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[28px] leading-tight text-foreground">{c.name}</h3>
                    <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{c.summary}</p>
                  </div>
                  <ConfidenceBadge confidence={c.confidence} />
                </div>

                {c.evidence.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {c.evidence.map((e, i) => (
                      <blockquote key={i} className="group flex gap-3 rounded-xl border border-hairline/40 bg-surface/50 p-4 transition-colors hover:bg-surface">
                        <Quote className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] leading-relaxed text-foreground">"{e.quote}"</p>
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="tabular-nums">{e.t}</span>
                            <span>·</span>
                            <button className="inline-flex items-center gap-1 text-secondary opacity-70 transition-opacity hover:opacity-100">
                              Open in transcript <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </blockquote>
                    ))}
                  </div>
                )}

                {c.gap && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 glow-pulse" />
                    <span className="text-[13px] leading-relaxed text-foreground">
                      <span className="font-medium text-amber-700 dark:text-amber-400">Still to understand · </span>
                      <span className="text-muted-foreground">{c.gap}</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Conversation timeline */}
        <section className="mt-20">
          <SectionEyebrow>Conversation journey</SectionEyebrow>
          <ol className="relative mt-8 space-y-5 border-l border-hairline/70 pl-8">
            {TIMELINE.map((t) => (
              <li key={t.t} className="relative">
                <span className={cn(
                  "absolute -left-[35px] top-1.5 flex h-3 w-3 rounded-full border-2 border-background",
                  t.kind === "start" && "bg-muted-foreground/60",
                  t.kind === "evidence" && "bg-emerald",
                  t.kind === "partial" && "bg-amber-500",
                  t.kind === "gap" && "bg-muted-foreground/30",
                )} />
                <div className="text-[11px] font-medium tabular-nums text-muted-foreground/70">{t.t}</div>
                <div className="text-[14px] text-foreground">{t.label}</div>
              </li>
            ))}
          </ol>
        </section>

        {/* Areas & follow-up */}
        <section className="mt-20 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-hairline/60 bg-background/60 p-8 backdrop-blur-xl">
            <SectionEyebrow>Areas needing exploration</SectionEyebrow>
            <ul className="mt-5 space-y-3 text-[14px] text-foreground">
              <li className="flex items-start gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 glow-pulse" /> Direct conflict management</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 glow-pulse" /> Async collaboration across timezones</li>
              <li className="flex items-start gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 glow-pulse" /> Mentorship at scale</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[24px] border border-secondary/30 bg-secondary/[0.06] p-8">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
            <div className="relative">
              <SectionEyebrow>Suggested human follow-up</SectionEyebrow>
              <p className="mt-5 text-[15px] leading-relaxed text-foreground">
                A 30-minute conversation focused on a project where Alex disagreed with a peer they respected. The intent is to hear how they navigate — not to test them.
              </p>
              <Link
                to="/app/interviews/console"
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary hover:opacity-80"
              >
                Schedule follow-up <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">{children}</div>;
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const map = {
    High: { dot: "bg-emerald", text: "text-emerald", glow: "shadow-[0_0_18px_oklch(0.68_0.12_168/0.5)]" },
    Partial: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", glow: "shadow-[0_0_14px_oklch(0.78_0.14_80/0.4)]" },
    Limited: { dot: "bg-muted-foreground/40", text: "text-muted-foreground", glow: "" },
  } as const;
  const m = map[confidence];
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2 rounded-full border border-hairline/70 bg-background/70 px-3 py-1.5 text-[11px] backdrop-blur">
        <span className={cn("h-2 w-2 rounded-full", m.dot, m.glow)} />
        <span className="uppercase tracking-[0.14em] text-muted-foreground/70">Confidence</span>
        <span className={cn("font-medium", m.text)}>{confidence}</span>
      </div>
    </div>
  );
}
