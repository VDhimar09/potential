import type { Evidence } from "./evidence";
import type { CompetencyGap, ObjectiveGap } from "./gaps";
import type { FollowUpSuggestion } from "./followup";

/**
 * The result of a Reflection Check: whether the interview has collected enough
 * evidence to fairly understand the candidate's capability. This evaluates the
 * completeness of the interview, never the quality of the candidate — there is
 * no score, rank, or hiring signal anywhere in this type.
 */
export interface InterviewReflection {
  isComplete: boolean;
  evidence: Evidence[];
  remainingCompetencyGaps: CompetencyGap[];
  remainingObjectiveGaps: ObjectiveGap[];
  /** The Adaptive Follow-up engine's existing suggestion — Reflection Check never generates its own. */
  followUpSuggestion: FollowUpSuggestion | null;
}
