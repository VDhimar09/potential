import { z } from "zod";
import type { EvidenceExtractionResult } from "@/domain";
import { buildEvidenceExtractionSchema } from "./schema";
import { buildEvidenceExtractionUserPrompt, EVIDENCE_EXTRACTION_SYSTEM_PROMPT } from "./prompt";
import type { ExtractEvidenceInput } from "./prompt";
import type { EvidenceExtractionClient } from "./client";
import { EvidenceExtractionError } from "./errors";

// Structured Outputs works with any model in the gpt-4o line or newer; override via
// options.model (or this env var) as the model lineup evolves.
const DEFAULT_MODEL = process.env.OPENAI_EVIDENCE_MODEL ?? "gpt-4o-mini";

const extractEvidenceInputSchema = z.object({
  question: z.string().min(1, "question must not be empty"),
  response: z.string().min(1, "response must not be empty"),
  competencies: z.array(z.string().min(1)).min(1, "at least one competency is required"),
});

export interface ExtractEvidenceOptions {
  model?: string;
}

/**
 * Transforms a single candidate response into typed Evidence, grounded to the
 * competencies currently being assessed. Pure orchestration: validates its input,
 * builds a per-call schema + prompt, delegates the model call to the injected
 * client, then re-validates the model's output before trusting it — so a caller
 * can never receive an EvidenceExtractionResult that doesn't match the domain
 * model in src/domain/evidence.ts, regardless of what the model actually returned.
 */
export async function extractEvidence(
  input: ExtractEvidenceInput,
  client: EvidenceExtractionClient,
  options: ExtractEvidenceOptions = {},
): Promise<EvidenceExtractionResult> {
  const validatedInput = extractEvidenceInputSchema.parse(input);
  const schema = buildEvidenceExtractionSchema(validatedInput.competencies);
  const userPrompt = buildEvidenceExtractionUserPrompt(validatedInput);

  const rawOutput = await client.parse({
    model: options.model ?? DEFAULT_MODEL,
    systemPrompt: EVIDENCE_EXTRACTION_SYSTEM_PROMPT,
    userPrompt,
    schema,
    schemaName: "evidence_extraction",
  });

  if (rawOutput == null) {
    throw new EvidenceExtractionError(
      "The model returned no parsable output (it may have refused the request).",
    );
  }

  const result = schema.safeParse(rawOutput);
  if (!result.success) {
    throw new EvidenceExtractionError(
      `Model output did not match the expected evidence schema: ${result.error.message}`,
      result.error,
    );
  }

  return result.data;
}
