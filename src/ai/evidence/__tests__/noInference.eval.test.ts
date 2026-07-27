import { describe, expect, it } from "vitest";
import { extractEvidence } from "../extractEvidence";
import { createOpenAIEvidenceClient } from "../client";

/**
 * A real evaluation, not a unit test: it calls the actual OpenAI Responses API
 * (no fake client) to verify the model itself — not just our orchestration
 * code — honours Potential's core rule: evidence must be grounded in what the
 * candidate actually said, never inferred from what they didn't say.
 *
 * Skipped automatically without OPENAI_API_KEY, since it needs network access
 * and a real key, and its output is non-deterministic (it's a live LLM call).
 * Run it deliberately:
 *   OPENAI_API_KEY=... npx vitest run noInference.eval
 */
describe.skipIf(!process.env.OPENAI_API_KEY)(
  "evidence extraction (real model) — does not infer unstated capability",
  () => {
    it("never credits Leadership when the response is a solo technical narrative that never mentions another person", async () => {
      const client = createOpenAIEvidenceClient();

      const response =
        "I noticed the checkout API was timing out under load. I profiled the query plan, added " +
        "a connection pool, and cut the number of round trips per request from six to two. p95 " +
        "latency dropped from 800ms to 120ms.";

      const result = await extractEvidence(
        {
          question: "Tell me about a time you led a team through a difficult decision.",
          response,
          competencies: ["Systems thinking", "Leadership"],
        },
        client,
      );

      // The response never mentions another person, a team, or influencing anyone — so
      // the model must not invent leadership evidence just because the question asked for it.
      const leadershipEvidence = result.evidence.filter((e) => e.competency === "Leadership");
      expect(leadershipEvidence).toHaveLength(0);
      expect(result.competenciesWithoutEvidence).toContain("Leadership");

      // Every quote the model does return must be grounded — an exact substring of what the
      // candidate actually said, never a paraphrase or an invented detail.
      for (const item of result.evidence) {
        expect(response).toContain(item.quote);
      }
    }, 30_000);
  },
);
