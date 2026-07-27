export interface CompetencyGap {
  competency: string;
  /** Grounded only in the evidence supplied — never a generic placeholder. */
  explanation: string;
}

export interface ObjectiveGap {
  objective: string;
  explanation: string;
}

export type EvidenceGapStatus = "missing" | "partial";

/** How urgent it is for the interviewer to pursue this gap next, given the
 * interview's remaining time — never a judgement of the candidate. */
export type EvidenceGapPriority = "high" | "medium" | "low";

/**
 * A single capability that the evidence collected so far doesn't yet fully
 * support — the richer, capability-first counterpart to CompetencyGap above.
 * Grounded the same way everywhere it's produced: `capability` must be one of
 * the competencies actually being assessed, never invented.
 */
export interface EvidenceGap {
  capability: string;
  status: EvidenceGapStatus;
  /** Why this is a gap, grounded only in the evidence supplied. */
  reason: string;
  /** What to listen for next — never a question to ask, never a hiring signal. */
  suggestedFocus: string;
  priority: EvidenceGapPriority;
}

export interface EvidenceGapAnalysis {
  summary: string;
  coveredCompetencies: string[];
  missingCompetencies: CompetencyGap[];
  completedObjectives: string[];
  incompleteObjectives: ObjectiveGap[];
  /**
   * Optional on this type so existing consumers (analyzeFollowUp's input,
   * reflectionCheck, interviewStore) don't need to change — but the Evidence
   * Gap Analysis engine's own output schema always requires it.
   */
  gaps?: EvidenceGap[];
}
