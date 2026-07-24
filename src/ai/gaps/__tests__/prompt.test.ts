import { describe, expect, it } from "vitest";
import { buildEvidenceGapAnalysisUserPrompt, EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT } from "../prompt";

describe("buildEvidenceGapAnalysisUserPrompt", () => {
  it("includes competencies, objectives, and evidence quotes", () => {
    const prompt = buildEvidenceGapAnalysisUserPrompt({
      competencies: ["Systems thinking", "Leadership"],
      objectives: ["Understand leadership"],
      evidence: [
        {
          competency: "Systems thinking",
          quote: "I built two prototypes to test throughput.",
          reasoning: "Validated a decision through direct experimentation.",
          strength: "strong",
        },
      ],
    });

    expect(prompt).toContain("Systems thinking, Leadership");
    expect(prompt).toContain("Understand leadership");
    expect(prompt).toContain("I built two prototypes to test throughput.");
  });

  it("says plainly that no evidence has been collected when the evidence array is empty", () => {
    const prompt = buildEvidenceGapAnalysisUserPrompt({
      competencies: ["Systems thinking"],
      objectives: ["Understand leadership"],
      evidence: [],
    });

    expect(prompt).toContain("No evidence has been collected yet.");
  });
});

describe("EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT", () => {
  it("instructs the model never to score, rank, or make a hiring recommendation", () => {
    expect(EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT).toMatch(/do not score, rank, or judge/i);
    expect(EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT).toMatch(/hiring recommendation/i);
  });

  it("instructs the model never to generate interview questions", () => {
    expect(EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT).toMatch(/do not generate interview questions/i);
  });
});
