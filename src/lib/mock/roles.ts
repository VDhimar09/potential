import type { RoleObjectiveSuggestion, OpenRole } from "@/domain";

export const OPEN_ROLES: OpenRole[] = [
  { title: "Staff Engineer, Platform", competencies: 6, candidates: 4, updated: "2 days ago" },
  { title: "Senior Product Manager", competencies: 5, candidates: 3, updated: "5 days ago" },
  { title: "Product Designer, Systems", competencies: 5, candidates: 2, updated: "1 week ago" },
];

export const SUGGESTED_OBJECTIVES: RoleObjectiveSuggestion[] = [
  {
    title: "Systems thinking under ambiguity",
    why: "Role requires designing platforms without full requirements.",
  },
  {
    title: "Cross-functional leadership",
    why: "Position sits between product, design and eng.",
  },
  {
    title: "Technical depth in distributed systems",
    why: "JD emphasises reliability of shared infrastructure.",
  },
  {
    title: "Mentorship and team craft",
    why: "Expected to raise the bar for adjacent engineers.",
  },
];

export const SUGGESTED_COMPETENCIES: string[] = [
  "Systems thinking",
  "Technical depth",
  "Communication",
  "Ownership",
  "Mentorship",
  "Decision making",
];

export const DEFAULT_COMPETENCIES: string[] = ["Systems thinking", "Technical depth", "Ownership"];

export const DEFAULT_INTERVIEW_PLAN: string[] = [
  "Warm opening — recent work the candidate is proud of",
  "Depth probe — systems thinking through a real project",
  "Leadership signals — how they influence without authority",
  "Reflection — what they would do differently",
];
