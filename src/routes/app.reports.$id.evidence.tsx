import { useMemo, useReducer, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Quote, StickyNote, Pencil, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CompetencyEvidenceReport,
  CoverageLevel,
  EvidenceReviewAction,
  EvidenceReviewState,
  TracedEvidence,
} from "@/domain";
import { composeEvidenceReport } from "@/lib/report/composeEvidenceReport";
import { applyEvidenceReviewAction, createInitialReviewState } from "@/lib/report/reviewEvidence";
import {
  ALEX_MORGAN_BLUEPRINT,
  ALEX_MORGAN_FOLLOW_UP_HISTORY,
  ALEX_MORGAN_GAP_ANALYSIS,
  ALEX_MORGAN_REPORT_METADATA,
  ALEX_MORGAN_TURNS,
} from "@/lib/mock/interviewTurns";

export const Route = createFileRoute("/app/reports/$id/evidence")({
  component: ExplainableEvidenceReport,
  head: ({ params }) => ({
    meta: [
      { title: `Explainable evidence report · ${params.id} — Potential` },
      {
        name: "description",
        content:
          "Every piece of evidence traced back to the question and response it came from. No scores. No rankings. Humans decide.",
      },
    ],
  }),
});

type ReviewMap = Record<string, EvidenceReviewState>;

function reviewMapReducer(
  state: ReviewMap,
  update: { evidenceId: string; action: EvidenceReviewAction },
): ReviewMap {
  const current = state[update.evidenceId] ?? createInitialReviewState();
  return { ...state, [update.evidenceId]: applyEvidenceReviewAction(current, update.action) };
}

function formatGeneratedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function ExplainableEvidenceReport() {
  // Fixture data standing in for a persisted interview session — see the
  // module doc-comment in src/lib/mock/interviewTurns.ts. composeEvidenceReport
  // itself takes no fixture-specific shortcuts: swapping these four inputs for
  // real interviewStore state is the only change needed to make this live.
  const report = useMemo(
    () =>
      composeEvidenceReport({
        blueprint: ALEX_MORGAN_BLUEPRINT,
        turns: ALEX_MORGAN_TURNS,
        gapAnalysis: ALEX_MORGAN_GAP_ANALYSIS,
        followUpHistory: ALEX_MORGAN_FOLLOW_UP_HISTORY,
        metadata: ALEX_MORGAN_REPORT_METADATA,
      }),
    [],
  );

  const [reviewState, dispatchReview] = useReducer(reviewMapReducer, {});

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora opacity-30 aurora-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-aurora-soft opacity-80"
      />

      <div className="relative mx-auto max-w-[920px] px-10 pb-32 pt-10">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Workspace
        </Link>

        <header className="mt-14 rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
            Explainable evidence report
          </div>
          <h1 className="mt-4 font-display text-[64px] leading-[1.02] tracking-tight text-foreground md:text-[80px]">
            {report.metadata.candidateName}
          </h1>
          <div className="mt-3 text-[15px] text-muted-foreground">
            {report.metadata.roleTitle} · Generated {formatGeneratedAt(report.metadata.generatedAt)}
          </div>
        </header>

        <section className="mt-16">
          <SectionEyebrow>Overall summary</SectionEyebrow>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-foreground">
            {report.overallSummary}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-hairline/70 bg-background/60 px-4 py-2 text-[12px] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Potential does not recommend hire or reject. This report exists to help humans decide.
          </div>
        </section>

        <section className="mt-16">
          <SectionEyebrow>Evidence coverage</SectionEyebrow>
          <div className="mt-6 flex flex-wrap gap-3">
            <CoverageStat level="strong" competencies={report.coverage.strong} />
            <CoverageStat level="partial" competencies={report.coverage.partial} />
            <CoverageStat level="missing" competencies={report.coverage.missing} />
          </div>
        </section>

        <section className="mt-20">
          <SectionEyebrow>Evidence by competency</SectionEyebrow>
          <div className="mt-6 space-y-4">
            {report.competencies.map((competencyReport) => (
              <CompetencyCard
                key={competencyReport.competency}
                report={competencyReport}
                reviewState={reviewState}
                onReview={(evidenceId, action) => dispatchReview({ evidenceId, action })}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
      {children}
    </div>
  );
}

const COVERAGE_LABEL: Record<CoverageLevel, string> = {
  strong: "Strong evidence",
  partial: "Partial evidence",
  missing: "Missing evidence",
};

const COVERAGE_DOT: Record<CoverageLevel, string> = {
  strong: "bg-emerald",
  partial: "bg-amber-500",
  missing: "bg-muted-foreground/40",
};

function CoverageStat({ level, competencies }: { level: CoverageLevel; competencies: string[] }) {
  return (
    <div className="rounded-2xl border border-hairline/60 bg-background/60 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <span className={cn("h-2 w-2 rounded-full", COVERAGE_DOT[level])} />
        {COVERAGE_LABEL[level]}
      </div>
      <div className="mt-1 font-display text-[28px] text-foreground">{competencies.length}</div>
      {competencies.length > 0 && (
        <div className="mt-1 text-[12px] text-muted-foreground">{competencies.join(", ")}</div>
      )}
    </div>
  );
}

function CoverageBadge({ level }: { level: CoverageLevel }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-hairline/70 bg-background/70 px-3 py-1.5 text-[11px] backdrop-blur">
      <span className={cn("h-2 w-2 rounded-full", COVERAGE_DOT[level])} />
      <span className="font-medium text-foreground">{COVERAGE_LABEL[level]}</span>
    </div>
  );
}

function CompetencyCard({
  report,
  reviewState,
  onReview,
}: {
  report: CompetencyEvidenceReport;
  reviewState: ReviewMap;
  onReview: (evidenceId: string, action: EvidenceReviewAction) => void;
}) {
  return (
    <div className="rounded-[24px] border border-hairline/60 bg-background/60 p-8 backdrop-blur-xl transition-shadow hover:shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 className="font-display text-[28px] leading-tight text-foreground">
          {report.competency}
        </h3>
        <CoverageBadge level={report.coverage} />
      </div>

      {report.evidence.length > 0 && (
        <div className="mt-6 space-y-3">
          {report.evidence.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              review={reviewState[evidence.id] ?? createInitialReviewState()}
              onReview={(action) => onReview(evidence.id, action)}
            />
          ))}
        </div>
      )}

      {report.remainingGaps.length > 0 && (
        <div className="mt-5 space-y-2">
          {report.remainingGaps.map((gap, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 glow-pulse" />
              <span className="text-[13px] leading-relaxed text-foreground">
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Remaining gap ·{" "}
                </span>
                <span className="text-muted-foreground">{gap.reason}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {report.suggestedFollowUps.length > 0 && (
        <div className="mt-5 space-y-2">
          {report.suggestedFollowUps.map((followUp, i) => (
            <div
              key={i}
              className="rounded-xl border border-secondary/30 bg-secondary/[0.06] p-4 text-[13px] leading-relaxed text-foreground"
            >
              <span className="font-medium text-secondary">Suggested follow-up · </span>
              {followUp.question}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceCard({
  evidence,
  review,
  onReview,
}: {
  evidence: TracedEvidence;
  review: EvidenceReviewState;
  onReview: (action: EvidenceReviewAction) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuote, setDraftQuote] = useState(evidence.quote);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(review.note ?? "");

  const displayedQuote = review.editedQuote ?? evidence.quote;

  if (review.status === "removed") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-hairline/40 bg-surface/30 p-4 text-[13px] text-muted-foreground">
        <span>Evidence removed from this report.</span>
        <button
          type="button"
          onClick={() => onReview({ type: "restore" })}
          className="inline-flex items-center gap-1 text-secondary opacity-70 transition-opacity hover:opacity-100"
        >
          <RotateCcw className="h-3 w-3" /> Restore
        </button>
      </div>
    );
  }

  return (
    <blockquote className="group flex gap-3 rounded-xl border border-hairline/40 bg-surface/50 p-4 transition-colors hover:bg-surface">
      <Quote className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={draftQuote}
              onChange={(e) => setDraftQuote(e.target.value)}
              rows={2}
              aria-label="Edit evidence quote"
              className="w-full rounded-lg border border-hairline/60 bg-background/80 p-2 text-[15px] leading-relaxed text-foreground"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onReview({ type: "edit", quote: draftQuote });
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-hairline/60 px-2.5 py-1 text-[11px] text-foreground hover:bg-background"
              >
                <Check className="h-3 w-3" /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftQuote(displayedQuote);
                  setIsEditing(false);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-hairline/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-background"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-foreground">"{displayedQuote}"</p>
        )}

        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {evidence.reasoning}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          <span className="tabular-nums">{evidence.source.t}</span>
          <span>·</span>
          <span title={evidence.source.question}>Q: {evidence.source.question}</span>
          <span>·</span>
          <span title={evidence.source.responseExcerpt}>
            "{evidence.source.responseExcerpt.slice(0, 60)}
            {evidence.source.responseExcerpt.length > 60 ? "…" : ""}"
          </span>
        </div>

        {!isEditing && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
            <button
              type="button"
              onClick={() => onReview({ type: "accept" })}
              className={cn(
                "inline-flex items-center gap-1 transition-opacity hover:opacity-100",
                review.status === "accepted"
                  ? "text-emerald opacity-100"
                  : "text-muted-foreground opacity-70",
              )}
            >
              <Check className="h-3 w-3" /> Accept
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
            >
              <Pencil className="h-3 w-3" /> Edit wording
            </button>
            <button
              type="button"
              onClick={() => onReview({ type: "remove" })}
              className="inline-flex items-center gap-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-3 w-3" /> Remove
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNote((v) => !v)}
              className="inline-flex items-center gap-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
            >
              <StickyNote className="h-3 w-3" /> {review.note ? "Edit note" : "Add note"}
            </button>
          </div>
        )}

        {isAddingNote && (
          <div className="mt-2 flex gap-2">
            <input
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Interviewer note…"
              aria-label="Interviewer note"
              className="w-full rounded-lg border border-hairline/60 bg-background/80 p-2 text-[13px] text-foreground"
            />
            <button
              type="button"
              onClick={() => {
                onReview({ type: "setNote", note: draftNote });
                setIsAddingNote(false);
              }}
              className="shrink-0 rounded-full border border-hairline/60 px-2.5 py-1 text-[11px] text-foreground hover:bg-background"
            >
              Save
            </button>
          </div>
        )}

        {review.note && !isAddingNote && (
          <div className="mt-2 rounded-lg border border-hairline/40 bg-background/40 p-2 text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground">Note: </span>
            {review.note}
          </div>
        )}
      </div>
    </blockquote>
  );
}
