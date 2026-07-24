export interface CompetencyGap {
  competency: string;
  /** Grounded only in the evidence supplied — never a generic placeholder. */
  explanation: string;
}

export interface ObjectiveGap {
  objective: string;
  explanation: string;
}

export interface EvidenceGapAnalysis {
  summary: string;
  coveredCompetencies: string[];
  missingCompetencies: CompetencyGap[];
  completedObjectives: string[];
  incompleteObjectives: ObjectiveGap[];
}
