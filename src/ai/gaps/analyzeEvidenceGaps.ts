import { z } from "zod";
import type { EvidenceGapAnalysis } from "@/domain";
import { buildEvidenceGapAnalysisSchema } from "./schema";
import { buildEvidenceGapAnalysisUserPrompt, EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT } from "./prompt";
import type { AnalyzeEvidenceGapsInput } from "./prompt";
import type { GapAnalysisClient } from "./client";
import { EvidenceGapAnalysisError } from "./errors";
import { parseStructuredCompletion } from "../shared/parseStructuredCompletion";
import { evidenceInputSchema } from "../shared/evidenceSchema";

// Structured Outputs works with any model in the gpt-4o line or newer; override via
// options.model (or this env var) as the model lineup evolves.
const DEFAULT_MODEL = process.env.OPENAI_GAP_ANALYSIS_MODEL ?? "gpt-4o-mini";

const analyzeEvidenceGapsInputSchema = z.object({
  competencies: z.array(z.string().min(1)).min(1, "at least one competency is required"),
  objectives: z.array(z.string().min(1)).min(1, "at least one objective is required"),
  // Evidence may legitimately be empty — an interview that hasn't produced any
  // evidence yet is exactly the case this module needs to report on.
  evidence: z.array(evidenceInputSchema),
});

export interface AnalyzeEvidenceGapsOptions {
  model?: string;
}

/**
 * Evaluates how complete the evidence collected so far is against the
 * competencies and objectives being assessed. Pure orchestration: validates its
 * input, builds a per-call schema + prompt, delegates the model call to the
 * injected client, then re-validates the model's output before trusting it — so
 * a caller can never receive an EvidenceGapAnalysis that doesn't match the domain
 * model in src/domain/gaps.ts, regardless of what the model actually returned.
 *
 * This module only ever judges completeness. It never scores, ranks, recommends
 * a hiring outcome, or generates a follow-up question — those are explicitly out
 * of scope here.
 */
export async function analyzeEvidenceGaps(
  input: AnalyzeEvidenceGapsInput,
  client: GapAnalysisClient,
  options: AnalyzeEvidenceGapsOptions = {},
): Promise<EvidenceGapAnalysis> {
  const validatedInput = analyzeEvidenceGapsInputSchema.parse(input);
  const schema = buildEvidenceGapAnalysisSchema(
    validatedInput.competencies,
    validatedInput.objectives,
  );
  const userPrompt = buildEvidenceGapAnalysisUserPrompt(validatedInput);

  return parseStructuredCompletion({
    client,
    request: {
      model: options.model ?? DEFAULT_MODEL,
      systemPrompt: EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT,
      userPrompt,
      schema,
      schemaName: "evidence_gap_analysis",
    },
    schema,
    schemaLabel: "gap analysis schema",
    ErrorClass: EvidenceGapAnalysisError,
  });
}
