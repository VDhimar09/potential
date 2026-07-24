import { describe, expect, it } from "vitest";
import { buildEvidenceExtractionUserPrompt, EVIDENCE_EXTRACTION_SYSTEM_PROMPT } from "../prompt";

describe("buildEvidenceExtractionUserPrompt", () => {
  it("includes the question, response, and competencies verbatim", () => {
    const prompt = buildEvidenceExtractionUserPrompt({
      question: "Tell me about a hard decision.",
      response: "We shipped a prototype to settle the debate.",
      competencies: ["Systems thinking", "Ownership"],
    });

    expect(prompt).toContain("Tell me about a hard decision.");
    expect(prompt).toContain("We shipped a prototype to settle the debate.");
    expect(prompt).toContain("Systems thinking, Ownership");
  });
});

describe("EVIDENCE_EXTRACTION_SYSTEM_PROMPT", () => {
  it("instructs the model never to score or judge the candidate", () => {
    expect(EVIDENCE_EXTRACTION_SYSTEM_PROMPT).toMatch(/do not score, rank, judge/i);
  });
});
