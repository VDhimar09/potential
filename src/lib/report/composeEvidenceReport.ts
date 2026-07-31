import type {
  CompetencyEvidenceReport,
  EvidenceGap,
  EvidenceGapAnalysis,
  EvidenceReport,
  EvidenceReportMetadata,
  FollowUpSuggestion,
  InterviewBlueprint,
  InterviewTurn,
} from "@/domain";
import { buildTracedEvidence } from "./traceability";
import { determineCoverageLevel, summarizeCoverage } from "./coverage";
import { buildOverallSummary } from "./summary";

export interface ComposeEvidenceReportInput {
  blueprint: InterviewBlueprint;
  turns: readonly InterviewTurn[];
  gapAnalysis: EvidenceGapAnalysis | null;
  followUpHistory: readonly FollowUpSuggestion[];
  metadata: EvidenceReportMetadata;
}

/**
 * Falls back to the coarser `missingCompetencies` list when the richer
 * `gaps` array isn't present — `EvidenceGapAnalysis.gaps` is optional so
 * older consumers of the gap analysis engine keep working (see its
 * definition in `@/domain/gaps`), but a report should still show a gap for
 * a competency the analysis flagged as missing.
 */
function buildRemainingGaps(
  competency: string,
  gapAnalysis: EvidenceGapAnalysis | null,
): EvidenceGap[] {
  if (!gapAnalysis) return [];

  const fromGaps = gapAnalysis.gaps?.filter((gap) => gap.capability === competency) ?? [];
  if (fromGaps.length > 0) return fromGaps;

  const missing = gapAnalysis.missingCompetencies.find((gap) => gap.competency === competency);
  if (!missing) return [];

  return [
    {
      capability: missing.competency,
      status: "missing",
      reason: missing.explanation,
      suggestedFocus: missing.explanation,
      priority: "medium",
    },
  ];
}

/**
 * Composes the Explainable Evidence Report from outputs the pipeline has
 * already produced (Role Planner, Evidence Extraction, Evidence Gap
 * Analysis, Adaptive Follow-up) — a pure, deterministic reshaping with no
 * additional model calls, no scoring, and no hire/reject signal anywhere in
 * its output.
 */
export function composeEvidenceReport(input: ComposeEvidenceReportInput): EvidenceReport {
  const tracedEvidence = buildTracedEvidence(input.turns);

  const competencies: CompetencyEvidenceReport[] = input.blueprint.competencies.map(
    (competency) => {
      const evidence = tracedEvidence.filter((item) => item.competency === competency);
      return {
        competency,
        coverage: determineCoverageLevel(competency, evidence, input.gapAnalysis),
        evidence,
        remainingGaps: buildRemainingGaps(competency, input.gapAnalysis),
        suggestedFollowUps: input.followUpHistory.filter(
          (followUp) => followUp.addressesCompetency === competency,
        ),
      };
    },
  );

  const coverage = summarizeCoverage(competencies);

  return {
    metadata: input.metadata,
    overallSummary: buildOverallSummary(coverage, input.gapAnalysis),
    coverage,
    competencies,
  };
}
