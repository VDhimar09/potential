import { describe, expect, it } from "vitest";
import { buildEvidenceGapAnalysisSchema } from "../schema";

describe("buildEvidenceGapAnalysisSchema", () => {
  const competencies = ["Systems thinking", "Leadership"];
  const objectives = ["Understand leadership", "Explore systems thinking"];

  it("throws when given no competencies", () => {
    expect(() => buildEvidenceGapAnalysisSchema([], objectives)).toThrow(
      /at least one competency/i,
    );
  });

  it("throws when given no objectives", () => {
    expect(() => buildEvidenceGapAnalysisSchema(competencies, [])).toThrow(
      /at least one objective/i,
    );
  });

  it("accepts a well-formed gap analysis result", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "Systems thinking is well covered; leadership evidence is still thin.",
      coveredCompetencies: ["Systems thinking"],
      missingCompetencies: [
        {
          competency: "Leadership",
          explanation: "No evidence of leading through disagreement yet.",
        },
      ],
      completedObjectives: ["Explore systems thinking"],
      incompleteObjectives: [
        {
          objective: "Understand leadership",
          explanation: "Only one leadership example has been given so far.",
        },
      ],
      gaps: [
        {
          capability: "Leadership",
          status: "missing",
          reason: "No evidence of leading through disagreement yet.",
          suggestedFocus: "Listen for how they've handled team disagreement.",
          priority: "high",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("accepts a fully-covered result with empty gap arrays", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "Both competencies are well supported by the evidence collected.",
      coveredCompetencies: competencies,
      missingCompetencies: [],
      completedObjectives: objectives,
      incompleteObjectives: [],
      gaps: [],
    });

    expect(result.success).toBe(true);
  });

  it("accepts a partial gap alongside a fully missing one", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "Some leadership evidence exists but doesn't fully address disagreement handling.",
      coveredCompetencies: [],
      missingCompetencies: [
        { competency: "Systems thinking", explanation: "No evidence collected yet." },
        { competency: "Leadership", explanation: "Only indirect evidence so far." },
      ],
      completedObjectives: [],
      incompleteObjectives: [
        { objective: "Understand leadership", explanation: "Only indirect evidence so far." },
      ],
      gaps: [
        {
          capability: "Systems thinking",
          status: "missing",
          reason: "No evidence collected yet.",
          suggestedFocus: "Ask about a technical decision made under uncertainty.",
          priority: "medium",
        },
        {
          capability: "Leadership",
          status: "partial",
          reason: "Only indirect evidence so far.",
          suggestedFocus: "Listen for how they've handled direct disagreement.",
          priority: "high",
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a competency outside the assessed list", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: ["Communication"], // not in the assessed list
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a gaps entry referencing a capability outside the assessed list", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [{ competency: "Leadership", explanation: "Not yet demonstrated." }],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [
        {
          capability: "Communication", // not in the assessed list, and not in missingCompetencies
          status: "missing",
          reason: "Not yet demonstrated.",
          suggestedFocus: "Ask about a time they had to explain a decision.",
          priority: "low",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects when gaps doesn't match the competencies listed in missingCompetencies", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [
        { competency: "Leadership", explanation: "Not yet demonstrated." },
        { competency: "Systems thinking", explanation: "Not yet demonstrated." },
      ],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [
        // Only one of the two missing competencies has a corresponding gap.
        {
          capability: "Leadership",
          status: "missing",
          reason: "Not yet demonstrated.",
          suggestedFocus: "Ask about a time they had to lead through disagreement.",
          priority: "high",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a gaps entry with an invalid status", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [{ competency: "Leadership", explanation: "Not yet demonstrated." }],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [
        {
          capability: "Leadership",
          status: "not-covered-at-all", // not a valid status
          reason: "Not yet demonstrated.",
          suggestedFocus: "Ask about a time they had to lead through disagreement.",
          priority: "high",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an objective outside the assessed list", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: ["Ship a project"], // not in the assessed list
      incompleteObjectives: [],
      gaps: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing competency with no explanation", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [{ competency: "Leadership", explanation: "" }],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty summary", () => {
    const schema = buildEvidenceGapAnalysisSchema(competencies, objectives);
    const result = schema.safeParse({
      summary: "",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [],
    });

    expect(result.success).toBe(false);
  });
});
