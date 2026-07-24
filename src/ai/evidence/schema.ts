import { z } from "zod";
import type { EvidenceExtractionResult } from "@/domain";

/**
 * Builds the Structured Output schema for one extraction call, constrained to the
 * specific competencies being assessed in that interview. Grounding the competency
 * enum per-call (rather than accepting a free-form string) stops the model from
 * inventing competencies that were never part of the interview plan.
 *
 * The `z.ZodType<EvidenceExtractionResult>` return annotation is load-bearing: it
 * makes TypeScript reject this function the moment the schema's inferred shape
 * drifts from the domain model in src/domain/evidence.ts, so the two can never
 * silently fall out of sync.
 */
export function buildEvidenceExtractionSchema(
  competencies: readonly string[],
): z.ZodType<EvidenceExtractionResult> {
  if (competencies.length === 0) {
    throw new Error("buildEvidenceExtractionSchema requires at least one competency");
  }

  const competencyEnum = z.enum(competencies as [string, ...string[]]);

  const evidenceItemSchema = z.object({
    competency: competencyEnum,
    quote: z.string().min(1),
    reasoning: z.string().min(1),
    strength: z.enum(["strong", "moderate", "weak"]),
  });

  return z.object({
    evidence: z.array(evidenceItemSchema),
    competenciesWithoutEvidence: z.array(competencyEnum),
  });
}
