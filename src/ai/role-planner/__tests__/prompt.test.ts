import { describe, expect, it } from "vitest";
import { buildAnalyzeRoleUserPrompt, ROLE_PLANNER_SYSTEM_PROMPT } from "../prompt";

describe("buildAnalyzeRoleUserPrompt", () => {
  it("includes the job description verbatim", () => {
    const prompt = buildAnalyzeRoleUserPrompt({
      jobDescription: "We are looking for a Staff Engineer to own our platform's reliability.",
    });

    expect(prompt).toContain(
      "We are looking for a Staff Engineer to own our platform's reliability.",
    );
  });
});

describe("ROLE_PLANNER_SYSTEM_PROMPT", () => {
  it("forbids writing interview questions", () => {
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/do not write interview questions/i);
  });

  it("forbids ranking or weighting competencies", () => {
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/do not rank, weight, or order/i);
  });

  it("forbids predicting candidate performance", () => {
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/do not predict how any candidate will perform/i);
  });

  it("forbids hiring recommendations", () => {
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/do not make any hiring recommendation/i);
  });

  it("frames the output as a draft for the interviewer to edit", () => {
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/draft/i);
    expect(ROLE_PLANNER_SYSTEM_PROMPT).toMatch(/interviewer reviews, edits, and decides/i);
  });
});
