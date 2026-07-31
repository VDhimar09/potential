import type { EvidenceCoverage, EvidenceGapAnalysis } from "@/domain";

function competencyCount(count: number): string {
  return `${count} ${count === 1 ? "competency" : "competencies"}`;
}

/**
 * Composes a deterministic, template-based overview from the coverage
 * counts and the Evidence Gap Analysis engine's own summary — never a new
 * AI call, and never a judgement about the candidate's quality, only about
 * how much evidence has been collected so far.
 */
export function buildOverallSummary(
  coverage: EvidenceCoverage,
  gapAnalysis: EvidenceGapAnalysis | null,
): string {
  const total = coverage.strong.length + coverage.partial.length + coverage.missing.length;
  const coverageLine =
    total === 0
      ? "No competencies have been assessed yet."
      : `${competencyCount(coverage.strong.length)} with strong evidence, ` +
        `${competencyCount(coverage.partial.length)} with partial evidence, ` +
        `${competencyCount(coverage.missing.length)} with no evidence yet, ` +
        `out of ${total} assessed.`;

  return gapAnalysis?.summary ? `${coverageLine} ${gapAnalysis.summary}` : coverageLine;
}
