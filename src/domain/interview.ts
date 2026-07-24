export type ProgressState = "done" | "active" | "next";

export interface Objective {
  label: string;
  state: ProgressState;
}

export interface TranscriptLine {
  speaker: "You" | "Alex";
  text: string;
  t: string;
}

export type InterviewTimelineKind = "start" | "evidence" | "pivot" | "pending";

export interface InterviewTimelineEntry {
  t: string;
  kind: InterviewTimelineKind;
  label: string;
}

export type InterviewStatusTone = "live" | "warm" | "done";

export interface RecentInterviewSummary {
  name: string;
  role: string;
  status: string;
  elapsed: string;
  tone: InterviewStatusTone;
  detail: string;
}
