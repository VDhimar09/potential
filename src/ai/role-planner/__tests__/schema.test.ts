import { describe, expect, it } from "vitest";
import { buildInterviewBlueprintSchema } from "../schema";

describe("buildInterviewBlueprintSchema", () => {
  const wellFormedBlueprint = {
    roleTitle: "Staff Engineer, Platform",
    roleSummary: "Owns the reliability and evolution of shared platform infrastructure.",
    keyResponsibilities: ["Design distributed systems", "Mentor senior engineers"],
    competencies: ["Systems thinking", "Mentorship"],
    interviewObjectives: ["Understand how they approach ambiguous system design"],
    evidencePlan: [
      {
        competency: "Systems thinking",
        guidance: "Listen for a real design trade-off they navigated.",
      },
      {
        competency: "Mentorship",
        guidance: "Listen for a concrete example of raising someone's bar.",
      },
    ],
  };

  it("accepts a well-formed blueprint", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse(wellFormedBlueprint);

    expect(result.success).toBe(true);
  });

  it("rejects an evidence plan item referencing a competency outside the blueprint's own list", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({
      ...wellFormedBlueprint,
      evidencePlan: [
        { competency: "Communication", guidance: "Not in the competencies list above." },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty role title", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, roleTitle: "" });

    expect(result.success).toBe(false);
  });

  it("rejects an empty role summary", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, roleSummary: "" });

    expect(result.success).toBe(false);
  });

  it("rejects an empty key responsibilities list", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, keyResponsibilities: [] });

    expect(result.success).toBe(false);
  });

  it("rejects an empty competencies list", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, competencies: [] });

    expect(result.success).toBe(false);
  });

  it("rejects an empty interview objectives list", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, interviewObjectives: [] });

    expect(result.success).toBe(false);
  });

  it("rejects an empty evidence plan", () => {
    const schema = buildInterviewBlueprintSchema();
    const result = schema.safeParse({ ...wellFormedBlueprint, evidencePlan: [] });

    expect(result.success).toBe(false);
  });
});
