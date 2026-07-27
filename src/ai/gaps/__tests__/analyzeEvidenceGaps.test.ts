import { describe, expect, it, vi } from "vitest";
import { analyzeEvidenceGaps } from "../analyzeEvidenceGaps";
import { EvidenceGapAnalysisError } from "../errors";
import type { GapAnalysisClient, GapAnalysisModelRequest } from "../client";

const baseInput = {
  competencies: ["Systems thinking", "Leadership"],
  objectives: ["Understand leadership"],
  evidence: [
    {
      competency: "Systems thinking",
      quote: "I built two prototypes over a weekend to test throughput.",
      reasoning: "Validated a technical decision through direct experimentation.",
      strength: "strong" as const,
    },
  ],
};

function fakeClient(parse: GapAnalysisClient["parse"]): GapAnalysisClient {
  return { parse };
}

describe("analyzeEvidenceGaps", () => {
  it("returns the model's validated gap analysis on a well-formed response", async () => {
    const modelOutput = {
      summary: "Systems thinking is well covered; leadership evidence is still thin.",
      coveredCompetencies: ["Systems thinking"],
      missingCompetencies: [
        {
          competency: "Leadership",
          explanation: "No evidence of leading through disagreement yet.",
        },
      ],
      completedObjectives: [],
      incompleteObjectives: [
        { objective: "Understand leadership", explanation: "Only indirect evidence so far." },
      ],
      gaps: [
        {
          capability: "Leadership",
          status: "missing" as const,
          reason: "No evidence of leading through disagreement yet.",
          suggestedFocus: "Listen for how they've handled team disagreement.",
          priority: "high" as const,
        },
      ],
    };
    const client = fakeClient(vi.fn().mockResolvedValue(modelOutput));

    const result = await analyzeEvidenceGaps(baseInput, client);

    expect(result).toEqual(modelOutput);
  });

  it("handles empty evidence — everything is missing/incomplete", async () => {
    const modelOutput = {
      summary: "No evidence has been collected yet.",
      coveredCompetencies: [],
      missingCompetencies: [
        { competency: "Systems thinking", explanation: "No evidence collected yet." },
        { competency: "Leadership", explanation: "No evidence collected yet." },
      ],
      completedObjectives: [],
      incompleteObjectives: [
        { objective: "Understand leadership", explanation: "No evidence collected yet." },
      ],
      gaps: [
        {
          capability: "Systems thinking",
          status: "missing" as const,
          reason: "No evidence collected yet.",
          suggestedFocus: "Ask about a technical decision made under uncertainty.",
          priority: "medium" as const,
        },
        {
          capability: "Leadership",
          status: "missing" as const,
          reason: "No evidence collected yet.",
          suggestedFocus: "Ask about a time they had to lead through disagreement.",
          priority: "high" as const,
        },
      ],
    };
    const parse = vi.fn().mockResolvedValue(modelOutput);
    const client = fakeClient(parse);

    const result = await analyzeEvidenceGaps({ ...baseInput, evidence: [] }, client);

    expect(result).toEqual(modelOutput);
    const request = parse.mock.calls[0][0] as GapAnalysisModelRequest;
    expect(request.userPrompt).toContain("No evidence has been collected yet.");
  });

  it("sends the system prompt, built user prompt, and default model to the client", async () => {
    const parse = vi.fn().mockResolvedValue({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [],
    });
    const client = fakeClient(parse);

    await analyzeEvidenceGaps(baseInput, client);

    expect(parse).toHaveBeenCalledTimes(1);
    const request = parse.mock.calls[0][0] as GapAnalysisModelRequest;
    expect(request.model).toBe("gpt-4o-mini");
    expect(request.systemPrompt).toMatch(/do not score, rank, or judge/i);
    expect(request.schemaName).toBe("evidence_gap_analysis");
  });

  it("honours an explicit model override", async () => {
    const parse = vi.fn().mockResolvedValue({
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [],
    });
    const client = fakeClient(parse);

    await analyzeEvidenceGaps(baseInput, client, { model: "gpt-4o" });

    const request = parse.mock.calls[0][0] as GapAnalysisModelRequest;
    expect(request.model).toBe("gpt-4o");
  });

  it("throws when the client returns no parsable output (refusal)", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue(null));

    await expect(analyzeEvidenceGaps(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceGapAnalysisError,
    );
  });

  it("throws when the client's output does not match the gap analysis schema", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue({ summary: "..." })); // missing required fields

    await expect(analyzeEvidenceGaps(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceGapAnalysisError,
    );
  });

  it("throws when the client references a competency outside the assessed list", async () => {
    const client = fakeClient(
      vi.fn().mockResolvedValue({
        summary: "...",
        coveredCompetencies: ["Communication"],
        missingCompetencies: [],
        completedObjectives: [],
        incompleteObjectives: [],
        gaps: [],
      }),
    );

    await expect(analyzeEvidenceGaps(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceGapAnalysisError,
    );
  });

  it("rejects invalid input (no competencies) before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    await expect(analyzeEvidenceGaps({ ...baseInput, competencies: [] }, client)).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });

  it("rejects invalid input (no objectives) before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    await expect(analyzeEvidenceGaps({ ...baseInput, objectives: [] }, client)).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });
});
