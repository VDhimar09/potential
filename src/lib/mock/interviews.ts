import type { TranscriptLine, InterviewTimelineEntry, Objective } from "@/domain";

export const TRANSCRIPT: TranscriptLine[] = [
  {
    speaker: "You",
    text: "Tell me about a project where you had to make a call without full information.",
    t: "09:02",
  },
  {
    speaker: "Alex",
    text: "We were rebuilding the ingestion pipeline. Half the team believed we should keep the existing Kafka topology, the other half wanted to move to a pull-based model.",
    t: "09:03",
  },
  {
    speaker: "Alex",
    text: "I didn't have the runtime data to be sure — so I built two small prototypes over a weekend to test throughput at realistic load. That gave us evidence to decide.",
    t: "09:04",
  },
  {
    speaker: "You",
    text: "How did the team react when you presented that?",
    t: "09:05",
  },
  {
    speaker: "Alex",
    text: "Honestly there was still disagreement. One of the senior folks pushed back hard on the pull-based approach…",
    t: "09:06",
  },
];

export const INTERVIEW_TIMELINE: InterviewTimelineEntry[] = [
  { t: "09:00", kind: "start", label: "Interview began" },
  { t: "09:03", kind: "evidence", label: "Evidence · Problem solving under ambiguity" },
  { t: "09:04", kind: "evidence", label: "Evidence · Project ownership" },
  { t: "09:05", kind: "pivot", label: "Adaptive pivot → leadership signals" },
  { t: "09:06", kind: "pending", label: "Listening for conflict management…" },
];

export const CANDIDATE_OBJECTIVES: Objective[] = [
  { label: "Systems thinking", state: "done" },
  { label: "Ownership", state: "done" },
  { label: "Leadership", state: "active" },
  { label: "Conflict management", state: "next" },
];
