import { z } from "zod";
import type { Evidence } from "@/domain";

/**
 * Validates a single Evidence item as it crosses into an AI module (e.g. as
 * part of analyzeFollowUp's or analyzeEvidenceGaps's input). Shared because
 * both modules previously redefined this identical shape independently.
 *
 * The `z.ZodType<Evidence>` annotation is load-bearing: it makes TypeScript
 * reject this schema the moment its inferred shape drifts from the domain
 * model in src/domain/evidence.ts.
 */
export const evidenceInputSchema: z.ZodType<Evidence> = z.object({
  competency: z.string().min(1),
  quote: z.string().min(1),
  reasoning: z.string().min(1),
  strength: z.enum(["strong", "moderate", "weak"]),
});
