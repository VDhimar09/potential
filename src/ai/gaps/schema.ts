import { z } from "zod";
import type { EvidenceGapAnalysis } from "@/domain";

/**
 * Builds the Structured Output schema for one gap-analysis call, constrained to the
 * exact competencies and objectives being assessed. As with the Evidence Engine,
 * grounding both enums per-call stops the model from inventing a competency or
 * objective that was never part of this interview.
 *
 * The `z.ZodType<EvidenceGapAnalysis>` return annotation is load-bearing: it makes
 * TypeScript reject this function the moment the schema's inferred shape drifts
 * from the domain model in src/domain/gaps.ts, so the two can never silently fall
 * out of sync.
 */
export function buildEvidenceGapAnalysisSchema(
  competencies: readonly string[],
  objectives: readonly string[],
): z.ZodType<EvidenceGapAnalysis> {
  if (competencies.length === 0) {
    throw new Error("buildEvidenceGapAnalysisSchema requires at least one competency");
  }
  if (objectives.length === 0) {
    throw new Error("buildEvidenceGapAnalysisSchema requires at least one objective");
  }

  const competencyEnum = z.enum(competencies as [string, ...string[]]);
  const objectiveEnum = z.enum(objectives as [string, ...string[]]);

  const competencyGapSchema = z.object({
    competency: competencyEnum,
    explanation: z.string().min(1),
  });

  const objectiveGapSchema = z.object({
    objective: objectiveEnum,
    explanation: z.string().min(1),
  });

  return z.object({
    summary: z.string().min(1),
    coveredCompetencies: z.array(competencyEnum),
    missingCompetencies: z.array(competencyGapSchema),
    completedObjectives: z.array(objectiveEnum),
    incompleteObjectives: z.array(objectiveGapSchema),
  });
}
