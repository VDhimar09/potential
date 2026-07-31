import type {
  CompetencyEvidenceReport,
  CoverageLevel,
  EvidenceCoverage,
  EvidenceGapAnalysis,
  TracedEvidence,
} from "@/domain";

/**
 * Determines how well a single competency is currently supported, using only
 * judgements the pipeline has already made: the Evidence Gap Analysis
 * engine's missing/partial status takes precedence (it already reasoned
 * about completeness), and evidence strength only distinguishes strong vs.
 * partial coverage among competencies the gap analysis hasn't flagged.
 * Deterministic — the same inputs always produce the same coverage level.
 */
export function determineCoverageLevel(
  competency: string,
  evidenceForCompetency: readonly TracedEvidence[],
  gapAnalysis: EvidenceGapAnalysis | null,
): CoverageLevel {
  const isMissing = gapAnalysis?.missingCompetencies.some((gap) => gap.competency === competency);
  if (isMissing) return "missing";

  const matchingGap = gapAnalysis?.gaps?.find((gap) => gap.capability === competency);
  if (matchingGap?.status === "partial") return "partial";
  if (matchingGap?.status === "missing") return "missing";

  if (evidenceForCompetency.length === 0) return "missing";

  const allStrong = evidenceForCompetency.every((item) => item.strength === "strong");
  return allStrong ? "strong" : "partial";
}

/** Buckets competencies by coverage level for the report's summary section. */
export function summarizeCoverage(
  competencyReports: readonly CompetencyEvidenceReport[],
): EvidenceCoverage {
  const coverage: EvidenceCoverage = { strong: [], partial: [], missing: [] };
  for (const report of competencyReports) {
    coverage[report.coverage].push(report.competency);
  }
  return coverage;
}
