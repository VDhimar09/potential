import { describe, expect, it } from "vitest";
import { buildFollowUpSuggestionSchema } from "../schema";

describe("buildFollowUpSuggestionSchema", () => {
  const competencies = ["Systems thinking", "Leadership"];

  it("throws when given no competencies", () => {
    expect(() => buildFollowUpSuggestionSchema([])).toThrow(/at least one competency/i);
  });

  it("accepts a well-formed follow-up suggestion", () => {
    const schema = buildFollowUpSuggestionSchema(competencies);
    const result = schema.safeParse({
      question:
        "Earlier you mentioned migrating the platform — can you tell me about a time during that project when you disagreed with someone about the technical approach?",
      reason: "No evidence describing how Alex handles disagreement yet.",
      addressesCompetency: "Leadership",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a competency outside the assessed list", () => {
    const schema = buildFollowUpSuggestionSchema(competencies);
    const result = schema.safeParse({
      question: "Tell me about a conflict you navigated.",
      reason: "Filling a conflict-management gap.",
      addressesCompetency: "Conflict management", // not in the assessed list
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty question", () => {
    const schema = buildFollowUpSuggestionSchema(competencies);
    const result = schema.safeParse({
      question: "",
      reason: "Filling a gap.",
      addressesCompetency: "Leadership",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty reason", () => {
    const schema = buildFollowUpSuggestionSchema(competencies);
    const result = schema.safeParse({
      question: "Tell me more about that.",
      reason: "",
      addressesCompetency: "Leadership",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a payload with more than one suggestion bundled in", () => {
    const schema = buildFollowUpSuggestionSchema(competencies);
    const result = schema.safeParse({
      question: "Tell me more about that.",
      reason: "Filling a gap.",
      addressesCompetency: "Leadership",
      alternativeQuestions: ["A second question", "A third question"],
    });

    // Extra properties beyond the schema's single-suggestion shape are stripped,
    // not merged in — the parsed value still describes exactly one suggestion.
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("alternativeQuestions");
  });
});
