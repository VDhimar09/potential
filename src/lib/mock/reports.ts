import type { CompetencyReport, ReportTimelineEntry, ReportSummary } from "@/domain";

export const COMPETENCY_REPORTS: CompetencyReport[] = [
  {
    name: "Systems thinking",
    confidence: "High",
    summary:
      "Alex reasons about failure modes before they occur and validates ideas through direct experimentation.",
    evidence: [
      {
        quote:
          "I didn't have the runtime data to be sure — so I built two small prototypes over a weekend to test throughput at realistic load.",
        t: "09:04",
      },
      {
        quote:
          "We had to think about failure modes we hadn't yet seen — so we designed for the worst credible scenario, not the average one.",
        t: "09:22",
      },
    ],
  },
  {
    name: "Ownership",
    confidence: "High",
    summary: "Takes responsibility for ambiguous work that sits outside a clear owner.",
    evidence: [
      {
        quote:
          "It wasn't my project on paper, but nobody else was going to unblock it, so I took the ambiguity as mine.",
        t: "09:11",
      },
    ],
  },
  {
    name: "Leadership",
    confidence: "Partial",
    summary:
      "Leads through evidence and clarity. Behaviour under sustained disagreement is not yet observed.",
    evidence: [
      {
        quote:
          "I try to lead through evidence, not authority — if I can show why, people will usually come with me.",
        t: "09:31",
      },
    ],
    gap: "Direct conflict management not yet observed.",
  },
  {
    name: "Communication",
    confidence: "High",
    summary: "Writes so that decisions survive without them in the room.",
    evidence: [
      {
        quote:
          "I wrote a two-page memo because the decision needed to survive without me in the room.",
        t: "09:18",
      },
    ],
  },
  {
    name: "Conflict management",
    confidence: "Limited",
    summary:
      "The conversation did not surface enough situations to understand how Alex handles direct conflict.",
    evidence: [],
    gap: "No direct evidence collected. A short follow-up conversation is recommended.",
  },
];

export const REPORT_TIMELINE: ReportTimelineEntry[] = [
  { t: "09:00", label: "Interview began", kind: "start" },
  { t: "09:03", label: "Systems thinking · prototype example", kind: "evidence" },
  { t: "09:11", label: "Ownership · taking ambiguity", kind: "evidence" },
  { t: "09:18", label: "Communication · written memo", kind: "evidence" },
  { t: "09:31", label: "Leadership · influence through evidence", kind: "partial" },
  { t: "09:44", label: "Conflict management · not reached", kind: "gap" },
];

// NOTE: both entries share `id: "alex-morgan"` in the original mock data (Jordan Reyes'
// card links to Alex Morgan's report). Preserved as-is — this refactor only relocates
// the data, it does not change behaviour.
export const DASHBOARD_REPORT_SUMMARIES: ReportSummary[] = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    role: "Staff Engineer",
    summary: "Strong evidence across systems thinking. Leadership requires further exploration.",
  },
  {
    id: "alex-morgan",
    name: "Jordan Reyes",
    role: "Product Designer",
    summary: "Clear evidence of craft and decision-making. Async collaboration partially observed.",
  },
];
