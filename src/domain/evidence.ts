export interface EvidenceNode {
  id: string;
  label: string;
  strength: number;
  x: number;
  y: number;
}

export type EvidenceEdge = [string, string];

// Below: the shape of a single piece of evidence as extracted from a candidate's
// response (e.g. by the AI evidence-extraction module), distinct from EvidenceNode
// above, which is a UI-graph representation of aggregated evidence strength.

export type EvidenceStrength = "strong" | "moderate" | "weak";

export interface Evidence {
  /** Which competency this observation supports. */
  competency: string;
  /** The exact supporting span from the candidate's response. */
  quote: string;
  /** Why this quote counts as evidence for the competency — never a score. */
  reasoning: string;
  strength: EvidenceStrength;
}

export interface EvidenceExtractionResult {
  evidence: Evidence[];
  /** Competencies that were being assessed but found no support in this response. */
  competenciesWithoutEvidence: string[];
}
