import { z } from "zod";
import type { FollowUpSuggestion } from "@/domain";

/**
 * Builds the Structured Output schema for one follow-up call, constrained to the
 * competencies the gap analysis actually referenced. Grounding `addressesCompetency`
 * to that enum (rather than a free-form string) stops the model from targeting a
 * competency outside the interview's actual list.
 *
 * The `z.ZodType<FollowUpSuggestion>` return annotation is load-bearing: it makes
 * TypeScript reject this function the moment the schema's inferred shape drifts
 * from the domain model in src/domain/followup.ts.
 *
 * The schema describes a single object, not an array — "exactly one follow-up" is
 * therefore a structural guarantee, not something validated after the fact.
 */
export function buildFollowUpSuggestionSchema(
  competencies: readonly string[],
): z.ZodType<FollowUpSuggestion> {
  if (competencies.length === 0) {
    throw new Error("buildFollowUpSuggestionSchema requires at least one competency");
  }

  const competencyEnum = z.enum(competencies as [string, ...string[]]);

  return z.object({
    question: z.string().min(1),
    reason: z.string().min(1),
    addressesCompetency: competencyEnum,
  });
}
