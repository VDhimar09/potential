import { describe, expect, it, vi } from "vitest";
import { analyzeRole } from "../analyzeRole";
import { RolePlannerError } from "../errors";
import type { RolePlannerClient, RolePlannerModelRequest } from "../client";

const baseInput = {
  jobDescription:
    "We are looking for a Staff Engineer to own our platform's reliability and mentor senior engineers.",
};

const wellFormedBlueprint = {
  roleTitle: "Staff Engineer, Platform",
  roleSummary: "Owns the reliability and evolution of shared platform infrastructure.",
  keyResponsibilities: ["Design distributed systems", "Mentor senior engineers"],
  competencies: ["Systems thinking", "Mentorship"],
  interviewObjectives: ["Understand how they approach ambiguous system design"],
  evidencePlan: [
    {
      competency: "Systems thinking",
      guidance: "Listen for a real design trade-off they navigated.",
    },
    {
      competency: "Mentorship",
      guidance: "Listen for a concrete example of raising someone's bar.",
    },
  ],
};

function fakeClient(parse: RolePlannerClient["parse"]): RolePlannerClient {
  return { parse };
}

describe("analyzeRole", () => {
  it("returns the model's validated blueprint on a well-formed response", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue(wellFormedBlueprint));

    const result = await analyzeRole(baseInput, client);

    expect(result).toEqual(wellFormedBlueprint);
  });

  it("sends the system prompt, built user prompt, and default model to the client", async () => {
    const parse = vi.fn().mockResolvedValue(wellFormedBlueprint);
    const client = fakeClient(parse);

    await analyzeRole(baseInput, client);

    expect(parse).toHaveBeenCalledTimes(1);
    const request = parse.mock.calls[0][0] as RolePlannerModelRequest;
    expect(request.model).toBe("gpt-4o-mini");
    expect(request.systemPrompt).toMatch(/do not write interview questions/i);
    expect(request.userPrompt).toContain(baseInput.jobDescription);
    expect(request.schemaName).toBe("interview_blueprint");
  });

  it("honours an explicit model override", async () => {
    const parse = vi.fn().mockResolvedValue(wellFormedBlueprint);
    const client = fakeClient(parse);

    await analyzeRole(baseInput, client, { model: "gpt-4o" });

    const request = parse.mock.calls[0][0] as RolePlannerModelRequest;
    expect(request.model).toBe("gpt-4o");
  });

  it("throws when the client returns no parsable output (refusal)", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue(null));

    await expect(analyzeRole(baseInput, client)).rejects.toBeInstanceOf(RolePlannerError);
  });

  it("throws when the client's output does not match the blueprint schema", async () => {
    const client = fakeClient(vi.fn().mockResolvedValue({ roleTitle: "..." })); // missing required fields

    await expect(analyzeRole(baseInput, client)).rejects.toBeInstanceOf(RolePlannerError);
  });

  it("throws when the evidence plan references a competency outside the blueprint's own list", async () => {
    const client = fakeClient(
      vi.fn().mockResolvedValue({
        ...wellFormedBlueprint,
        evidencePlan: [{ competency: "Communication", guidance: "Not a listed competency." }],
      }),
    );

    await expect(analyzeRole(baseInput, client)).rejects.toBeInstanceOf(RolePlannerError);
  });

  it("rejects invalid input (empty job description) before ever calling the client", async () => {
    const parse = vi.fn();
    const client = fakeClient(parse);

    await expect(analyzeRole({ jobDescription: "" }, client)).rejects.toThrow();
    expect(parse).not.toHaveBeenCalled();
  });
});
