export interface Candidate {
  id: string;
  name: string;
  role: string;
  location?: string;
  experienceYears?: string;
  lastRole?: string;
  timezone?: string;
  cvSummary?: string;
  projects?: string[];
}
