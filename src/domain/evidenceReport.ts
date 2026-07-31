import type { Evidence } from "./evidence";
import type { EvidenceGap } from "./gaps";
import type { FollowUpSuggestion } from "./followup";

/**
 * Where a piece of evidence came from, so an interviewer can always inspect
 * why it exists. Deliberately observable-only: the question asked and an
 * excerpt of what the candidate actually said — never a model's reasoning
 * process.
 */
export interface EvidenceSource {
  turnIndex: number;
  question: string;
  responseExcerpt: string;
  t: string;
}

export interface TracedEvidence extends Evidence {
  /** Stable id for this evidence item within a report — used to key human review state. */
  id: string;
  source: EvidenceSource;
}

/**
 * How well a competency is currently supported by evidence. Deliberately not
 * a score: it is derived from the Evidence Gap Analysis engine's own
 * missing/partial judgement, refined by evidence strength — never a new
 * judgement invented by the report itself.
 */
export type CoverageLevel = "strong" | "partial" | "missing";

export interface CompetencyEvidenceReport {
  competency: string;
  coverage: CoverageLevel;
  evidence: TracedEvidence[];
  remainingGaps: EvidenceGap[];
  suggestedFollowUps: FollowUpSuggestion[];
}

export interface EvidenceCoverage {
  strong: string[];
  partial: string[];
  missing: string[];
}

export interface EvidenceReportMetadata {
  interviewId: string;
  candidateId: string;
  candidateName: string;
  roleId: string;
  roleTitle: string;
  /** ISO 8601 timestamp of when this report was composed. */
  generatedAt: string;
}

export interface EvidenceReport {
  metadata: EvidenceReportMetadata;
  /** Deterministic, template-based synthesis of the coverage counts and gap analysis summary — never a new AI call. */
  overallSummary: string;
  coverage: EvidenceCoverage;
  competencies: CompetencyEvidenceReport[];
}
