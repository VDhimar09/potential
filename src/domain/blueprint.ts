export interface EvidencePlanItem {
  competency: string;
  /** What kind of evidence would demonstrate this competency — never a question to ask. */
  guidance: string;
}

export interface InterviewBlueprint {
  roleTitle: string;
  roleSummary: string;
  keyResponsibilities: string[];
  /** Presented as a flat set — never ranked or weighted by importance. */
  competencies: string[];
  interviewObjectives: string[];
  evidencePlan: EvidencePlanItem[];
}
