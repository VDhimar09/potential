import { describe, expect, it } from "vitest";
import { buildEvidenceExtractionSchema } from "../schema";

describe("buildEvidenceExtractionSchema", () => {
  const competencies = ["Systems thinking", "Leadership"];

  it("throws when given no competencies", () => {
    expect(() => buildEvidenceExtractionSchema([])).toThrow(/at least one competency/i);
  });

  it("accepts a well-formed extraction result", () => {
    const schema = buildEvidenceExtractionSchema(competencies);
    const result = schema.safeParse({
      evidence: [
        {
          competency: "Systems thinking",
          quote: "I built two prototypes to test throughput before deciding.",
          reasoning: "Validated a technical decision through direct experimentation.",
          strength: "strong",
        },
      ],
      competenciesWithoutEvidence: ["Leadership"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a competency outside the assessed list", () => {
    const schema = buildEvidenceExtractionSchema(competencies);
    const result = schema.safeParse({
      evidence: [
        {
          competency: "Communication", // not in the assessed list
          quote: "...",
          reasoning: "...",
          strength: "moderate",
        },
      ],
      competenciesWithoutEvidence: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid strength value", () => {
    const schema = buildEvidenceExtractionSchema(competencies);
    const result = schema.safeParse({
      evidence: [
        {
          competency: "Leadership",
          quote: "...",
          reasoning: "...",
          strength: "definitely", // not one of strong/moderate/weak
        },
      ],
      competenciesWithoutEvidence: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty quote or reasoning", () => {
    const schema = buildEvidenceExtractionSchema(competencies);
    const result = schema.safeParse({
      evidence: [{ competency: "Leadership", quote: "", reasoning: "", strength: "weak" }],
      competenciesWithoutEvidence: [],
    });

    expect(result.success).toBe(false);
  });

  it("accepts an extraction with no evidence found", () => {
    const schema = buildEvidenceExtractionSchema(competencies);
    const result = schema.safeParse({
      evidence: [],
      competenciesWithoutEvidence: competencies,
    });

    expect(result.success).toBe(true);
  });
});
