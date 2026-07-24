import type {
  Evidence,
  EvidenceGapAnalysis,
  FollowUpSuggestion,
  InterviewReflection,
} from "@/domain";

/**
 * Reflection Check: orchestrates the already-computed outputs of Evidence
 * Extraction, Gap Analysis, and Adaptive Follow-up to decide whether the
 * interview has collected enough evidence to fairly understand the candidate's
 * capability. It is deliberately not an AI reasoning engine — it never calls a
 * model itself, it only reads results those engines have already produced.
 *
 * It evaluates the completeness of the interview, never the quality of the
 * candidate: there is no score, rank, or hiring signal anywhere in this
 * function or its output.
 */
export function evaluateInterviewReflection(
  evidence: Evidence[],
  gapAnalysis: EvidenceGapAnalysis | null,
  followUpSuggestion: FollowUpSuggestion | null,
): InterviewReflection {
  const remainingCompetencyGaps = gapAnalysis?.missingCompetencies ?? [];
  const remainingObjectiveGaps = gapAnalysis?.incompleteObjectives ?? [];

  return {
    // No gap analysis yet means completeness hasn't been established at all,
    // not that there's nothing left to explore.
    isComplete:
      gapAnalysis !== null &&
      remainingCompetencyGaps.length === 0 &&
      remainingObjectiveGaps.length === 0,
    evidence,
    remainingCompetencyGaps,
    remainingObjectiveGaps,
    followUpSuggestion,
  };
}
