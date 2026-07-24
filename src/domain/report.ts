export type Confidence = "High" | "Partial" | "Limited";

export interface EvidenceQuote {
  quote: string;
  t: string;
}

export interface CompetencyReport {
  name: string;
  confidence: Confidence;
  summary: string;
  evidence: EvidenceQuote[];
  gap?: string;
}

export type ReportTimelineKind = "start" | "evidence" | "partial" | "gap";

export interface ReportTimelineEntry {
  t: string;
  label: string;
  kind: ReportTimelineKind;
}

export interface ReportSummary {
  id: string;
  name: string;
  role: string;
  summary: string;
}
