import { describe, expect, it, vi } from "vitest";
import { extractEvidence } from "../extractEvidence";
import { EvidenceExtractionError } from "../errors";
import type { EvidenceExtractionClient, EvidenceModelRequest } from "../client";

const baseInput = {
  question: "Tell me about a decision you made without full information.",
  response:
    "I didn't have the runtime data, so I built two prototypes over a weekend to test throughput.",
  competencies: ["Systems thinking", "Leadership"],
};

function fakeClient(parse: EvidenceExtractionClient["parse"]): EvidenceExtractionClient {
  return { parse };
}

describe("extractEvidence", () => {
  it("returns the model's validated evidence on a well-formed response", async () => {
    const modelOutput = {
      evidence: [
        {
          competency: "Systems thinking",
          quote: "I built two prototypes over a weekend to test throughput.",
          reasoning: "Validated a technical decision through direct experimentation.",
          strength: "strong",
        },
      ],
      competenciesWithoutEvidence: ["Leadership"],
    };
    const parse = vi.fn().mockResolvedValue(modelOutput);
    const client = fakeClient(parse);

    const result = await extractEvidence(baseInput, client);

    expect(result).toEqual(modelOutput);
  });

  it("sends the system prompt, built user prompt, and default model to the client", async () => {
    const parse = vi
      .fn()
      .mockResolvedValue({ evidence: [], competenciesWithoutEvidence: baseInput.competencies });
    const client = fakeClient(parse);

    await extractEvidence(baseInput, client);

    expect(parse).toHaveBeenCalledTimes(1);
    const request = parse.mock.calls[0][0] as EvidenceModelRequest;
    expect(request.model).toBe("gpt-4o-mini");
    expect(request.systemPrompt).toMatch(/do not score, rank, judge/i);
    expect(request.userPrompt).toContain(baseInput.response);
    expect(request.schemaName).toBe("evidence_extraction");
  });

  it("honours an explicit model override", async () => {
    const parse = vi
      .fn()
      .mockResolvedValue({ evidence: [], competenciesWithoutEvidence: baseInput.competencies });
    const client = fakeClient(parse);

    await extractEvidence(baseInput, client, { model: "gpt-4o" });

    const request = parse.mock.calls[0][0] as EvidenceModelRequest;
    expect(request.model).toBe("gpt-4o");
  });

  it("throws when the client returns no parsable output", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue(null));

    await expect(extractEvidence(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceExtractionError,
    );
  });

  it("throws when the client's output does not match the evidence schema", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue({ evidence: "not an array" }));

    await expect(extractEvidence(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceExtractionError,
    );
  });

  it("throws when the client returns evidence for a competency outside the assessed list", async () => {
    const client = fakeClient(
      vi.fn().mockResolvedValue({
        evidence: [
          { competency: "Communication", quote: "...", reasoning: "...", strength: "weak" },
        ],
        competenciesWithoutEvidence: [],
      }),
    );

    await expect(extractEvidence(baseInput, client)).rejects.toBeInstanceOf(
      EvidenceExtractionError,
    );
  });

  it("rejects invalid input before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    await expect(extractEvidence({ ...baseInput, competencies: [] }, client)).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });
});
