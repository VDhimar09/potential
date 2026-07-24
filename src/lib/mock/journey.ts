import type { JourneyItem } from "@/domain";

export const JOURNEY: JourneyItem[] = [
  { kind: "milestone", t: "09:00", label: "Interview began" },
  { kind: "competency", t: "09:01", label: "Exploring · Systems thinking" },
  {
    kind: "conversation",
    t: "09:02",
    who: "You",
    text: "Tell me about a project where you had to make a call without full information.",
  },
  {
    kind: "conversation",
    t: "09:03",
    who: "Alex",
    text: "We were rebuilding the ingestion pipeline. Half the team believed we should keep Kafka; the other half wanted a pull-based model.",
  },
  {
    kind: "evidence",
    t: "09:03",
    competency: "Problem solving",
    note: "Framed a technical decision through direct experimentation.",
  },
  {
    kind: "conversation",
    t: "09:04",
    who: "Alex",
    text: "I didn't have the runtime data to be sure — so I built two prototypes over a weekend to test throughput.",
  },
  {
    kind: "evidence",
    t: "09:04",
    competency: "Ownership",
    note: "Took initiative outside their formal scope.",
  },
  {
    kind: "reasoning",
    t: "09:05",
    note: "Systems thinking looks well covered. Pivoting to leadership — that project involved a real disagreement.",
    gap: "Leadership evidence still limited.",
  },
  { kind: "competency", t: "09:06", label: "Exploring · Leadership" },
  {
    kind: "conversation",
    t: "09:06",
    who: "You",
    text: "How did the team react when you presented that?",
  },
  {
    kind: "conversation",
    t: "09:07",
    who: "Alex",
    text: "There was pushback from a senior engineer. I tried to lead with the data rather than my seniority.",
  },
  {
    kind: "evidence",
    t: "09:08",
    competency: "Leadership",
    note: "Influence-through-evidence pattern surfaced.",
  },
  {
    kind: "reasoning",
    t: "09:09",
    note: "Leadership signal is emerging — but I still haven't heard how Alex handles being wrong.",
    gap: "Conflict management not yet observed.",
  },
  { kind: "milestone", t: "09:44", label: "Interview closed" },
];
