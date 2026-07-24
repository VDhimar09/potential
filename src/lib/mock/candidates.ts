import type { Candidate } from "@/domain";

export const ALEX_MORGAN: Candidate = {
  id: "alex-morgan",
  name: "Alex Morgan",
  role: "Staff Engineer",
  location: "Berlin",
  experienceYears: "9 years",
  lastRole: "Sr Eng, Ingestion",
  timezone: "CET",
  cvSummary:
    "Distributed systems engineer with a focus on data infrastructure. Led migration to event-driven ingestion at Loop; contributes to open-source stream processing.",
  projects: ["Ingestion v2 rewrite", "Async event sourcing lib", "On-call fairness project"],
};
