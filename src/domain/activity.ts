export type ActivityTone = "evidence" | "reasoning" | "pause" | "done";

export interface ActivityItem {
  who: string;
  what: string;
  when: string;
  tone: ActivityTone;
}
