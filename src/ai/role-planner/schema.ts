import { z } from "zod";
import type { InterviewBlueprint } from "@/domain";

/**
 * Builds the Structured Output schema for one role-planning call.
 *
 * Unlike the Evidence, Gap Analysis, and Follow-up engines, this module has no
 * caller-supplied list to ground its output against — the competencies here are
 * the deliverable, not an input. Instead, internal consistency is enforced: every
 * `evidencePlan` entry must reference a competency that actually appears in the
 * blueprint's own `competencies` list, so the model can't plan evidence for a
 * capability it didn't actually propose.
 *
 * The `z.ZodType<InterviewBlueprint>` return annotation is load-bearing: it makes
 * TypeScript reject this function the moment the schema's inferred shape drifts
 * from the domain model in src/domain/blueprint.ts.
 */
export function buildInterviewBlueprintSchema(): z.ZodType<InterviewBlueprint> {
  const evidencePlanItemSchema = z.object({
    competency: z.string().min(1),
    guidance: z.string().min(1),
  });

  return z
    .object({
      roleTitle: z.string().min(1),
      roleSummary: z.string().min(1),
      keyResponsibilities: z.array(z.string().min(1)).min(1),
      competencies: z.array(z.string().min(1)).min(1),
      interviewObjectives: z.array(z.string().min(1)).min(1),
      evidencePlan: z.array(evidencePlanItemSchema).min(1),
    })
    .superRefine((blueprint, ctx) => {
      const competencySet = new Set(blueprint.competencies);
      blueprint.evidencePlan.forEach((item, index) => {
        if (!competencySet.has(item.competency)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `evidencePlan[${index}] references a competency ("${item.competency}") that isn't in the blueprint's own competencies list`,
            path: ["evidencePlan", index, "competency"],
          });
        }
      });
    });
}
