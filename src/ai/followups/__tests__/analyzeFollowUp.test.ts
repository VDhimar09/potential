import { describe, expect, it, vi } from "vitest";
import { analyzeFollowUp } from "../analyzeFollowUp";
import { FollowUpGenerationError } from "../errors";
import type { FollowUpGenerationClient, FollowUpModelRequest } from "../client";
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

function fakeClient(parse: FollowUpGenerationClient["parse"]): FollowUpGenerationClient {
  return { parse };
}

describe("analyzeFollowUp", () => {
  it("returns the model's validated follow-up suggestion on a well-formed response", async () => {
    const modelOutput = {
      question:
        "You mentioned the platform migration — did you ever disagree with a teammate about the approach?",
      reason: "No evidence describing how Alex handles disagreement yet.",
      addressesCompetency: "Leadership",
    };
    const client = fakeClient(vi.fn().mockResolvedValue(modelOutput));

    const result = await analyzeFollowUp(baseInput, client);

    expect(result).toEqual(modelOutput);
  });

  it("still produces a suggestion when no evidence has been collected", async () => {
    const modelOutput = {
      question: "What's a recent project where you had to make a technical trade-off?",
      reason: "No evidence collected yet for either competency.",
      addressesCompetency: "Leadership",
    };
    const parse = vi.fn().mockResolvedValue(modelOutput);
    const client = fakeClient(parse);

    const result = await analyzeFollowUp({ ...baseInput, evidence: [] }, client);

    expect(result).toEqual(modelOutput);
    const request = parse.mock.calls[0][0] as FollowUpModelRequest;
    expect(request.userPrompt).toContain("No evidence has been collected yet.");
  });

  it("sends the system prompt, built user prompt, and default model to the client", async () => {
    const parse = vi.fn().mockResolvedValue({
      question: "...",
      reason: "...",
      addressesCompetency: "Leadership",
    });
    const client = fakeClient(parse);

    await analyzeFollowUp(baseInput, client);

    expect(parse).toHaveBeenCalledTimes(1);
    const request = parse.mock.calls[0][0] as FollowUpModelRequest;
    expect(request.model).toBe("gpt-4o-mini");
    expect(request.systemPrompt).toMatch(/exactly one follow-up question/i);
    expect(request.schemaName).toBe("follow_up_suggestion");
  });

  it("honours an explicit model override", async () => {
    const parse = vi.fn().mockResolvedValue({
      question: "...",
      reason: "...",
      addressesCompetency: "Leadership",
    });
    const client = fakeClient(parse);

    await analyzeFollowUp(baseInput, client, { model: "gpt-4o" });

    const request = parse.mock.calls[0][0] as FollowUpModelRequest;
    expect(request.model).toBe("gpt-4o");
  });

  it("throws when the client returns no parsable output (refusal)", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue(null));

    await expect(analyzeFollowUp(baseInput, client)).rejects.toBeInstanceOf(
      FollowUpGenerationError,
    );
  });

  it("throws when the client's output does not match the follow-up schema", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue({ question: "..." })); // missing required fields

    await expect(analyzeFollowUp(baseInput, client)).rejects.toBeInstanceOf(
      FollowUpGenerationError,
    );
  });

  it("throws when the client references a competency outside the assessed list", async () => {
    const client = fakeClient(
      vi.fn().mockResolvedValue({
        question: "...",
        reason: "...",
        addressesCompetency: "Communication", // not covered or missing in the gap analysis
      }),
    );

    await expect(analyzeFollowUp(baseInput, client)).rejects.toBeInstanceOf(
      FollowUpGenerationError,
    );
  });

  it("rejects invalid input (empty latestResponse) before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    await expect(analyzeFollowUp({ ...baseInput, latestResponse: "" }, client)).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });

  it("rejects an empty gap analysis (no competencies referenced at all) before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    const emptyGapAnalysis = {
      summary: "No competencies have been assessed yet.",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
    };

    await expect(
      analyzeFollowUp({ ...baseInput, gapAnalysis: emptyGapAnalysis }, client),
    ).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });
});
