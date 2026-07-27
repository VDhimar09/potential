import { describe, expect, it } from "vitest";
import { analyzeEvidenceGaps } from "../analyzeEvidenceGaps";
import { createOpenAIGapAnalysisClient } from "../client";

/**
 * Real evaluations, not unit tests: they call the actual OpenAI Responses API
 * (no fake client) to verify the model itself — not just our orchestration
 * code — honours Evidence Gap Analysis's rules: report what's actually
 * missing, don't manufacture gaps where evidence already exists, and never
 * invent a capability outside the ones supplied.
 *
 * Skipped automatically without OPENAI_API_KEY, since these need network
 * access and a real key, and their output is non-deterministic (live LLM
 * calls). Run deliberately:
 *   OPENAI_API_KEY=... npx vitest run gapDetection.eval
 */
describe.skipIf(!process.env.OPENAI_API_KEY)("evidence gap analysis (real model)", () => {
  it("detects a competency with zero supporting evidence as a gap", async () => {
    const result = await analyzeEvidenceGaps(
      {
        competencies: ["Systems thinking", "Leadership"],
        objectives: ["Understand how they lead through disagreement"],
        evidence: [
          {
            competency: "Systems thinking",
            quote: "I profiled the query plan and cut round trips per request from six to two.",
            reasoning: "Diagnosed and resolved a performance bottleneck through direct analysis.",
            strength: "strong",
          },
        ],
      },
      createOpenAIGapAnalysisClient(),
    );

    const leadershipGap = result.gaps?.find((gap) => gap.capability === "Leadership");
    expect(leadershipGap).toBeDefined();
    expect(leadershipGap?.status).toBe("missing");
    expect(result.missingCompetencies.some((gap) => gap.competency === "Leadership")).toBe(true);
  }, 30_000);

  it("does not report a competency as a gap when strong direct evidence already covers it", async () => {
    const result = await analyzeEvidenceGaps(
      {
        competencies: ["Systems thinking", "Leadership"],
        objectives: ["Understand how they lead through disagreement"],
        evidence: [
          {
            competency: "Systems thinking",
            quote: "I profiled the query plan and cut round trips per request from six to two.",
            reasoning: "Diagnosed and resolved a performance bottleneck through direct analysis.",
            strength: "strong",
          },
          {
            competency: "Leadership",
            quote:
              "Two engineers disagreed on the migration approach, so I ran a structured review " +
              "with both of them, wrote up the tradeoffs, and we agreed on a plan together.",
            reasoning: "Directly led a team through a technical disagreement to a shared decision.",
            strength: "strong",
          },
        ],
      },
      createOpenAIGapAnalysisClient(),
    );

    expect(result.gaps ?? []).toHaveLength(0);
    expect(result.missingCompetencies).toHaveLength(0);
  }, 30_000);

  it("never references a capability outside the supplied competency list", async () => {
    const competencies = ["Systems thinking"];

    const result = await analyzeEvidenceGaps(
      {
        competencies,
        objectives: ["Understand their technical decision-making"],
        evidence: [],
      },
      createOpenAIGapAnalysisClient(),
    );

    for (const gap of result.gaps ?? []) {
      expect(competencies).toContain(gap.capability);
    }
    for (const gap of result.missingCompetencies) {
      expect(competencies).toContain(gap.competency);
    }
  }, 30_000);
});
