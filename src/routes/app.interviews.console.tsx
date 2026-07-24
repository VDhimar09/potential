import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mic, Pause, Circle, FileText, Sparkles, ChevronRight, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALEX_MORGAN } from "@/lib/mock/candidates";
import { INTERVIEW_TIMELINE, CANDIDATE_OBJECTIVES } from "@/lib/mock/interviews";
import { EVIDENCE_NODES, EVIDENCE_EDGES } from "@/lib/mock/evidence";
import { useInterviewStore } from "@/stores/interviewStore";
import type { InterviewReflection } from "@/domain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/app/interviews/console")({
  component: LiveInterview,
  head: () => ({
    meta: [
      { title: "Live interview — Potential" },
      { name: "description", content: "A calm, evidence-first live interview workspace." },
    ],
  }),
});

function LiveInterview() {
  const [elapsed, setElapsed] = useState(34 * 60 + 12);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const transcript = useInterviewStore((s) => s.transcript);
  const evidence = useInterviewStore((s) => s.evidence);
  const gapAnalysis = useInterviewStore((s) => s.gapAnalysis);
  const followUpSuggestion = useInterviewStore((s) => s.followUpSuggestion);
  const reflection = useInterviewStore((s) => s.reflection);
  const isAnalysing = useInterviewStore((s) => s.isAnalysing);
  const error = useInterviewStore((s) => s.error);
  const submitResponse = useInterviewStore((s) => s.submitResponse);
  const finishInterview = useInterviewStore((s) => s.finishInterview);
  const dismissReflection = useInterviewStore((s) => s.dismissReflection);
  const clearError = useInterviewStore((s) => s.clearError);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    clearError();
  }, [error, clearError]);

  // Reflection Check decided the interview already looks complete — a calm
  // confirmation, not a modal requiring a decision.
  useEffect(() => {
    if (!reflection || !reflection.isComplete) return;
    toast.success("This interview appears complete — every competency and objective has supporting evidence so far.");
    dismissReflection();
  }, [reflection, dismissReflection]);

  const [draftResponse, setDraftResponse] = useState("");

  function handleSubmitResponse() {
    const response = draftResponse.trim();
    if (!response || isAnalysing) return;
    const question = [...transcript].reverse().find((line) => line.speaker === "You")?.text ?? "";
    // The interview's objectives and its competencies are the same list today —
    // there is no separate "objectives" mock source yet.
    const competencies = CANDIDATE_OBJECTIVES.map((o) => o.label);
    const objectives = competencies;
    setDraftResponse("");
    void submitResponse({ question, response, competencies, objectives });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-hairline/70 bg-background/80 px-6 backdrop-blur-2xl">
        <Link to="/app" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Workspace
        </Link>
        <div className="h-4 w-px bg-hairline" />
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[12px] font-medium text-foreground">Recording</span>
          <span className="text-[12px] tabular-nums text-muted-foreground">{mm}:{ss}</span>
        </div>
        <div className="mx-auto text-[12px] text-muted-foreground">
          <span className="text-foreground">{ALEX_MORGAN.name}</span> · {ALEX_MORGAN.role} · Exploring <span className="text-foreground">leadership</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground">
            <Pause className="h-3.5 w-3.5" /> Pause
          </button>
          <button
            onClick={finishInterview}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground/[0.06] px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-foreground/[0.09]"
          >
            <Circle className="h-2.5 w-2.5 fill-current" /> End interview
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr_380px]">
        {/* LEFT — candidate */}
        <aside className="border-r border-hairline/70 bg-surface/40 p-7">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary/70 to-secondary text-[14px] font-medium text-secondary-foreground shadow-soft">
              AM
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald" />
            </div>
            <div>
              <div className="text-[15px] font-medium">{ALEX_MORGAN.name}</div>
              <div className="text-[12px] text-muted-foreground">{ALEX_MORGAN.role} · {ALEX_MORGAN.location}</div>
            </div>
          </div>

          <div className="mt-7 space-y-1.5 text-[13px]">
            <SidebarRow label="Experience" value={ALEX_MORGAN.experienceYears ?? ""} />
            <SidebarRow label="Last role" value={ALEX_MORGAN.lastRole ?? ""} />
            <SidebarRow label="Timezone" value={ALEX_MORGAN.timezone ?? ""} />
          </div>

          <SectionTitle>CV summary</SectionTitle>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {ALEX_MORGAN.cvSummary}
          </p>

          <SectionTitle>Projects</SectionTitle>
          <ul className="space-y-1 text-[12px]">
            {(ALEX_MORGAN.projects ?? []).map((p) => (
              <li key={p} className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground">
                {p}
              </li>
            ))}
          </ul>

          <SectionTitle>Objectives</SectionTitle>
          <div className="space-y-1.5">
            {CANDIDATE_OBJECTIVES.map((o) => (
              <div key={o.label} className="flex items-center gap-2 text-[12px]">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  o.state === "done" && "bg-emerald",
                  o.state === "active" && "bg-secondary glow-pulse",
                  o.state === "next" && "bg-muted-foreground/40",
                )} />
                <span className={o.state === "next" ? "text-muted-foreground" : "text-foreground"}>{o.label}</span>
              </div>
            ))}
          </div>

          <SectionTitle>Timeline</SectionTitle>
          <ol className="relative space-y-3.5 border-l border-hairline/70 pl-4">
            {INTERVIEW_TIMELINE.map((t) => (
              <li key={t.t} className="relative">
                <span className={cn(
                  "absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-surface",
                  t.kind === "start" && "bg-muted-foreground/50",
                  t.kind === "evidence" && "bg-emerald",
                  t.kind === "pivot" && "bg-secondary",
                  t.kind === "pending" && "bg-amber-500 glow-pulse",
                )} />
                <div className="text-[10px] font-medium tabular-nums text-muted-foreground/70">{t.t}</div>
                <div className="text-[12px] leading-snug text-foreground">{t.label}</div>
              </li>
            ))}
          </ol>
        </aside>

        {/* CENTRE — conversation */}
        <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-25 aurora-drift" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-32 h-40 bg-gradient-to-t from-background to-transparent" />

          <div className="relative flex-1 overflow-y-auto px-12 py-14">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
                <span className="h-px w-6 bg-hairline" />
                Live conversation
              </div>
              <div className="mt-3 font-display text-[32px] leading-tight text-foreground">
                Exploring leadership.
              </div>
              <p className="mt-2 max-w-md text-[13px] text-muted-foreground">
                Potential is listening for how Alex leads through disagreement.
              </p>

              <div className="mt-12 space-y-9">
                {transcript.map((line, i) => (
                  <div key={i} className="rise-in" style={{ animationDelay: `${Math.min(i, 12) * 80}ms` }}>
                    <div className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
                      <span className={line.speaker === "You" ? "text-muted-foreground/70" : "text-secondary"}>{line.speaker}</span>
                      <span className="tabular-nums text-muted-foreground/50">{line.t}</span>
                    </div>
                    <p className={cn(
                      "mt-2 text-[17px] leading-[1.7] tracking-[-0.005em]",
                      line.speaker === "You" ? "text-muted-foreground" : "text-foreground",
                    )}>
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Waveform + composer */}
          <div className="relative">
            <div className="mx-6 mb-6 rounded-2xl border border-hairline/60 bg-background/70 shadow-elegant backdrop-blur-2xl">
              <div className="flex items-center gap-4 px-5 py-4">
                <button className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105">
                  <Mic className="h-4 w-4" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-secondary/30 glow-pulse" />
                </button>
                <Waveform />
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">Voice</div>
                  <div className="text-[13px] text-foreground">Streaming</div>
                </div>
              </div>
              <div className="border-t border-hairline/60 px-5 py-2.5 text-center text-[11px] text-muted-foreground/80">
                Potential is listening for evidence. It never coaches, hints, or suggests answers.
              </div>
            </div>

            <div className="mx-6 mb-6 rounded-2xl border border-hairline/60 bg-background/70 shadow-elegant backdrop-blur-2xl">
              <div className="flex items-start gap-3 px-5 py-4">
                <textarea
                  value={draftResponse}
                  onChange={(e) => setDraftResponse(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitResponse();
                    }
                  }}
                  placeholder="Type or paste what the candidate just said…"
                  rows={2}
                  className="flex-1 resize-none bg-transparent text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={handleSubmitResponse}
                  disabled={isAnalysing || draftResponse.trim().length === 0}
                  className="btn-primary-gradient inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> {isAnalysing ? "Analysing…" : "Analyse response"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — reasoning */}
        <aside className="relative border-l border-hairline/70 bg-surface/40 p-7">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-aurora-soft opacity-70" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="text-[12px] font-medium text-foreground">Potential intelligence</div>
              <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">Live</span>
            </div>

            <div className="mt-6">
              <Label>Current objective</Label>
              <div className="mt-1.5 font-display text-[24px] leading-tight text-foreground">Understand leadership</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                Not "did they lead well" — but "have I heard enough to fairly understand how they lead."
              </p>
            </div>

            {isAnalysing && <AnalysingState />}

            <ReasoningBlock title="Evidence collected" tone="ok">
              {evidence.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  No evidence captured yet. Submit a response below to begin.
                </p>
              ) : (
                evidence.map((e, i) => (
                  <BulletItem key={i}>
                    <span className="font-medium text-foreground">{e.competency}:</span> {e.reasoning}
                  </BulletItem>
                ))
              )}
            </ReasoningBlock>

            <ReasoningBlock title="Evidence still needed" tone="pending">
              {!gapAnalysis ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Submit a response to see what evidence is still missing.
                </p>
              ) : gapAnalysis.missingCompetencies.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Every assessed competency has supporting evidence so far.
                </p>
              ) : (
                gapAnalysis.missingCompetencies.map((gap, i) => (
                  <BulletItem key={i}>
                    <span className="font-medium text-foreground">{gap.competency}:</span> {gap.explanation}
                  </BulletItem>
                ))
              )}
            </ReasoningBlock>

            <ReasoningBlock title="Current understanding" tone="neutral">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {gapAnalysis?.summary ?? "Submit a response to see Potential's understanding so far."}
              </p>
            </ReasoningBlock>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-5">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
              <div className="relative">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-secondary">
                  <ChevronRight className="h-3 w-3" /> Suggested follow-up
                </div>
                <p className="mt-3 text-[15px] leading-snug text-foreground">
                  {followUpSuggestion?.question ?? "Submit a response to see Potential's suggested follow-up."}
                </p>
                {followUpSuggestion && (
                  <div className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>
                      <span className="font-medium text-foreground/80">{followUpSuggestion.addressesCompetency}</span> ·{" "}
                      {followUpSuggestion.reason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <SectionTitle>Evidence map</SectionTitle>
            <Constellation />
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80">
              Bright nodes glow with evidence. Dim nodes are still being explored. Hover to reveal supporting moments.
            </p>

            <Link
              to="/app/reports/$id"
              params={{ id: ALEX_MORGAN.id }}
              className="mt-6 flex items-center justify-between rounded-xl border border-hairline/70 bg-background/60 p-3.5 backdrop-blur transition-colors hover:bg-background"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[13px] text-foreground">Preview evidence report</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        </aside>
      </div>

      <InterviewReflectionModal
        reflection={reflection && !reflection.isComplete ? reflection : null}
        onAskOneMore={dismissReflection}
        onDismiss={dismissReflection}
        candidateId={ALEX_MORGAN.id}
      />
    </div>
  );
}

function Waveform() {
  const bars = Array.from({ length: 48 });
  return (
    <div className="flex h-10 flex-1 items-center gap-[3px]">
      {bars.map((_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.6)) * 60 + (i % 5) * 6;
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-secondary/40 to-secondary"
            style={{
              height: `${Math.min(h, 90)}%`,
              animation: `glow-pulse ${1.2 + (i % 7) * 0.15}s ease-in-out infinite`,
              animationDelay: `${i * 30}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function Constellation() {
  return (
    <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hairline/60 bg-background/60 backdrop-blur">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora-soft opacity-60" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {EVIDENCE_EDGES.map(([a, b], i) => {
          const na = EVIDENCE_NODES.find(n => n.id === a)!;
          const nb = EVIDENCE_NODES.find(n => n.id === b)!;
          const opacity = Math.min(na.strength, nb.strength);
          return (
            <line
              key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="currentColor"
              className="text-secondary"
              strokeWidth="0.3"
              opacity={0.15 + opacity * 0.55}
            />
          );
        })}
      </svg>
      {EVIDENCE_NODES.map((n) => (
        <div
          key={n.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div
            className={cn(
              "rounded-full transition-all group-hover:scale-125",
              n.strength > 0.6 ? "bg-emerald" : n.strength > 0.3 ? "bg-secondary" : "bg-muted-foreground/40",
            )}
            style={{
              width: `${8 + n.strength * 12}px`,
              height: `${8 + n.strength * 12}px`,
              boxShadow: n.strength > 0.5 ? `0 0 ${8 + n.strength * 20}px oklch(0.68 0.15 258 / ${n.strength * 0.55})` : undefined,
            }}
          />
          <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {n.label}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-muted-foreground transition-opacity group-hover:opacity-0">
            {n.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">{label}</span>
      <span className="text-[12px] text-foreground">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-2.5 mt-7 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">{children}</div>;
}

function ReasoningBlock({ title, tone, children }: { title: string; tone: "ok" | "pending" | "neutral"; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "ok" && "bg-emerald",
          tone === "pending" && "bg-amber-500 glow-pulse",
          tone === "neutral" && "bg-muted-foreground/50",
        )} />
        <Label>{title}</Label>
      </div>
      <div className="mt-2.5 space-y-1.5">{children}</div>
    </div>
  );
}

const ANALYSING_STEPS = ["Reading response", "Extracting evidence", "Mapping competencies"];

function AnalysingState() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-secondary">
          <Sparkles className="h-3 w-3 glow-pulse" /> Analysing response…
        </div>
        <div className="mt-3 space-y-1.5">
          {ANALYSING_STEPS.map((step, i) => (
            <div
              key={step}
              className="rise-in flex items-center gap-2 text-[13px] text-foreground"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <Check className="h-3 w-3 text-emerald" /> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[13px] leading-snug text-foreground">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Reflection Check's result, surfaced only when gaps remain. It shows exactly
 * what's already been collected and the follow-up already suggested — it never
 * generates a new one, and nothing here scores or judges the candidate.
 */
function InterviewReflectionModal({
  reflection,
  onAskOneMore,
  onDismiss,
  candidateId,
}: {
  reflection: InterviewReflection | null;
  onAskOneMore: () => void;
  onDismiss: () => void;
  candidateId: string;
}) {
  return (
    <Dialog open={reflection !== null} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="max-w-xl rounded-2xl border border-hairline/70 bg-background/95 p-7 shadow-elegant backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal text-foreground">Interview reflection</DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
            Potential checked whether the evidence collected so far fairly covers this interview — never how the candidate performed.
          </DialogDescription>
        </DialogHeader>

        {reflection && (
          <div className="max-h-[55vh] space-y-6 overflow-y-auto pr-1">
            <ReflectionSection title="Evidence collected">
              {reflection.evidence.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">No evidence captured yet.</p>
              ) : (
                reflection.evidence.map((e, i) => (
                  <BulletItem key={i}>
                    <span className="font-medium text-foreground">{e.competency}:</span> {e.reasoning}
                  </BulletItem>
                ))
              )}
            </ReflectionSection>

            <ReflectionSection title="Competencies still to explore">
              {reflection.remainingCompetencyGaps.length === 0 && reflection.remainingObjectiveGaps.length === 0 ? (
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Nothing has been analysed yet — submit at least one response before finishing.
                </p>
              ) : (
                <>
                  {reflection.remainingCompetencyGaps.map((gap, i) => (
                    <BulletItem key={`competency-${i}`}>
                      <span className="font-medium text-foreground">{gap.competency}:</span> {gap.explanation}
                    </BulletItem>
                  ))}
                  {reflection.remainingObjectiveGaps.map((gap, i) => (
                    <BulletItem key={`objective-${i}`}>
                      <span className="font-medium text-foreground">{gap.objective}:</span> {gap.explanation}
                    </BulletItem>
                  ))}
                </>
              )}
            </ReflectionSection>

            {reflection.followUpSuggestion && (
              <ReflectionSection title="Suggested follow-up">
                <p className="text-[13px] leading-relaxed text-foreground">{reflection.followUpSuggestion.question}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">{reflection.followUpSuggestion.addressesCompetency}</span>{" "}
                  · {reflection.followUpSuggestion.reason}
                </p>
              </ReflectionSection>
            )}
          </div>
        )}

        <DialogFooter className="mt-2 gap-2 sm:justify-between">
          <Button variant="outline" onClick={onAskOneMore} className="rounded-full">
            Ask one more question
          </Button>
          <Button asChild className="rounded-full bg-foreground text-background hover:opacity-90">
            <Link to="/app/reports/$id" params={{ id: candidateId }} onClick={onDismiss}>
              Finish interview
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReflectionSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{title}</Label>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}
