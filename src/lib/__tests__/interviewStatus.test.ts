import { describe, expect, it } from "vitest";
import { groupInterviewStatus } from "../interviewStatus";
import type { InterviewStatus } from "@/generated/prisma/client";

describe("groupInterviewStatus", () => {
  it.each<[InterviewStatus, string]>([
    ["DRAFT", "draft"],
    ["SCHEDULED", "draft"],
    ["IN_PROGRESS", "in_progress"],
    ["COMPLETED", "completed"],
    ["REVIEWED", "completed"],
    ["ARCHIVED", "completed"],
  ])("buckets %s as %s", (status, expected) => {
    expect(groupInterviewStatus(status)).toBe(expected);
  });
});
