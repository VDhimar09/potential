import type { RecentCandidateLink } from "@/domain";

// NOTE: all three links point to the same journey route in the original mock data.
// Preserved as-is — this refactor only relocates the data, it does not change behaviour.
export const SIDEBAR_RECENT: RecentCandidateLink[] = [
  { label: "Alex Morgan · Staff Eng", to: "/app/journey/alex-morgan" },
  { label: "Priya Shah · Product", to: "/app/journey/alex-morgan" },
  { label: "Jordan Reyes · Design", to: "/app/journey/alex-morgan" },
];
