export type JourneyItem =
  | { kind: "conversation"; t: string; who: "You" | "Alex"; text: string }
  | { kind: "evidence"; t: string; competency: string; note: string }
  | { kind: "reasoning"; t: string; note: string; gap?: string }
  | { kind: "milestone"; t: string; label: string }
  | { kind: "competency"; t: string; label: string };
