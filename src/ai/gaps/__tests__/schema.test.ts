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
    });

    expect(result.success).toBe(false);
  });
});
