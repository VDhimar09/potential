import { describe, expect, it } from "vitest";
import { buildFollowUpUserPrompt, FOLLOW_UP_SYSTEM_PROMPT } from "../prompt";
import type { AnalyzeFollowUpInput } from "../prompt";

const baseInput: AnalyzeFollowUpInput = {
  latestResponse: "We migrated the platform over about six weeks.",
  evidence: [
    {
      competency: "Systems thinking",
      quote: "I built two prototypes over a weekend to test throughput.",
      reasoning: "Validated a technical decision through direct experimentation.",
      strength: "strong",
    },
  ],
  gapAnalysis: {
    summary: "Systems thinking is well covered; leadership evidence is still thin.",
    coveredCompetencies: ["Systems thinking"],
    missingCompetencies: [
      { competency: "Leadership", explanation: "No evidence of leading through disagreement yet." },
    ],
    completedObjectives: [],
    incompleteObjectives: [
      { objective: "Understand leadership", explanation: "Only indirect evidence so far." },
    ],
  },
};

describe("buildFollowUpUserPrompt", () => {
  it("includes the latest response, evidence, and gap analysis detail", () => {
    const prompt = buildFollowUpUserPrompt(baseInput);

    expect(prompt).toContain("We migrated the platform over about six weeks.");
    expect(prompt).toContain("I built two prototypes over a weekend to test throughput.");
    expect(prompt).toContain(
      "Systems thinking is well covered; leadership evidence is still thin.",
    );
    expect(prompt).toContain("Leadership: No evidence of leading through disagreement yet.");
    expect(prompt).toContain("Understand leadership: Only indirect evidence so far.");
  });

  it("handles empty evidence", () => {
    const prompt = buildFollowUpUserPrompt({ ...baseInput, evidence: [] });

    expect(prompt).toContain("No evidence has been collected yet.");
  });

  it("handles a gap analysis with nothing missing or incomplete", () => {
    const prompt = buildFollowUpUserPrompt({
      ...baseInput,
      gapAnalysis: {
        ...baseInput.gapAnalysis,
        missingCompetencies: [],
        incompleteObjectives: [],
      },
    });

    expect(prompt).toContain("None — every assessed competency is covered so far.");
    expect(prompt).toContain("None — every objective is complete so far.");
  });
});

describe("FOLLOW_UP_SYSTEM_PROMPT", () => {
  it("instructs the model to recommend exactly one follow-up, grounded and non-generic", () => {
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/exactly one follow-up question/i);
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/never propose multiple options/i);
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/avoid generic behavioural questions/i);
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/never repeat or rephrase a question/i);
  });

  it("forbids scoring, ranking, hiring recommendations, and confidence scores", () => {
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/do not score, rank, or judge/i);
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/hiring recommendation/i);
    expect(FOLLOW_UP_SYSTEM_PROMPT).toMatch(/confidence scores/i);
  });
});
