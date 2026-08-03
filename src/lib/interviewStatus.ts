import type { InterviewStatus } from "@/generated/prisma/client";

export type InterviewStatusGroup = "draft" | "in_progress" | "completed";

const GROUP_BY_STATUS: Record<InterviewStatus, InterviewStatusGroup> = {
  DRAFT: "draft",
  SCHEDULED: "draft",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  REVIEWED: "completed",
  ARCHIVED: "completed",
};

export const INTERVIEW_STATUS_GROUP_LABEL: Record<InterviewStatusGroup, string> = {
  draft: "Draft",
  in_progress: "In progress",
  completed: "Completed",
};

/** Buckets the full InterviewStatus enum into the three lanes the workspace UI shows. */
export function groupInterviewStatus(status: InterviewStatus): InterviewStatusGroup {
  return GROUP_BY_STATUS[status];
}
