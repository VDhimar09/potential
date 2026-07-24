import { z } from "zod";
import type { FollowUpSuggestion } from "@/domain";
import { buildFollowUpSuggestionSchema } from "./schema";
import { buildFollowUpUserPrompt, FOLLOW_UP_SYSTEM_PROMPT } from "./prompt";
import type { AnalyzeFollowUpInput } from "./prompt";
import type { FollowUpGenerationClient } from "./client";
import { FollowUpGenerationError } from "./errors";

// Structured Outputs works with any model in the gpt-4o line or newer; override via
// options.model (or this env var) as the model lineup evolves.
const DEFAULT_MODEL = process.env.OPENAI_FOLLOWUP_MODEL ?? "gpt-4o-mini";

const evidenceInputSchema = z.object({
  competency: z.string().min(1),
  quote: z.string().min(1),
  reasoning: z.string().min(1),
  strength: z.enum(["strong", "moderate", "weak"]),
});

const competencyGapInputSchema = z.object({
  competency: z.string().min(1),
  explanation: z.string().min(1),
});

const objectiveGapInputSchema = z.object({
  objective: z.string().min(1),
  explanation: z.string().min(1),
});

const gapAnalysisInputSchema = z
  .object({
    summary: z.string().min(1),
    coveredCompetencies: z.array(z.string().min(1)),
    missingCompetencies: z.array(competencyGapInputSchema),
    completedObjectives: z.array(z.string().min(1)),
    incompleteObjectives: z.array(objectiveGapInputSchema),
  })
  // The competency enum this call grounds `addressesCompetency` against is derived
  // entirely from the gap analysis (see analyzeFollowUp below), so there must be at
  // least one competency in it — otherwise there is nothing for a follow-up to target.
  .refine(
    (gapAnalysis) =>
      gapAnalysis.coveredCompetencies.length > 0 || gapAnalysis.missingCompetencies.length > 0,
    {
      message: "gapAnalysis must reference at least one competency",
    },
  );

const analyzeFollowUpInputSchema = z.object({
  latestResponse: z.string().min(1, "latestResponse must not be empty"),
  // Evidence may legitimately be empty — an interview that hasn't produced any
  // evidence yet can still receive a follow-up suggestion.
  evidence: z.array(evidenceInputSchema),
  gapAnalysis: gapAnalysisInputSchema,
});

export interface AnalyzeFollowUpOptions {
  model?: string;
}

/**
 * Recommends a single next question the interviewer could ask, grounded in the
 * candidate's latest response, the evidence collected so far, and the current gap
 * analysis. Pure orchestration: validates its input, builds a per-call schema +
 * prompt, delegates the model call to the injected client, then re-validates the
 * model's output before trusting it — so a caller can never receive a
 * FollowUpSuggestion that doesn't match the domain model in src/domain/followup.ts,
 * regardless of what the model actually returned.
 *
 * This module only ever suggests what to ask next. It never scores, ranks, or
 * recommends a hiring outcome, and it never returns more than one suggestion.
 */
export async function analyzeFollowUp(
  input: AnalyzeFollowUpInput,
  client: FollowUpGenerationClient,
  options: AnalyzeFollowUpOptions = {},
): Promise<FollowUpSuggestion> {
  const validatedInput = analyzeFollowUpInputSchema.parse(input);

  const competencies = Array.from(
    new Set([
      ...validatedInput.gapAnalysis.coveredCompetencies,
      ...validatedInput.gapAnalysis.missingCompetencies.map((gap) => gap.competency),
    ]),
  );
  const schema = buildFollowUpSuggestionSchema(competencies);
  const userPrompt = buildFollowUpUserPrompt(validatedInput);

  const rawOutput = await client.parse({
    model: options.model ?? DEFAULT_MODEL,
    systemPrompt: FOLLOW_UP_SYSTEM_PROMPT,
    userPrompt,
    schema,
    schemaName: "follow_up_suggestion",
  });

  if (rawOutput == null) {
    throw new FollowUpGenerationError(
      "The model returned no parsable output (it may have refused the request).",
    );
  }

  const result = schema.safeParse(rawOutput);
  if (!result.success) {
    throw new FollowUpGenerationError(
      `Model output did not match the expected follow-up schema: ${result.error.message}`,
      result.error,
    );
  }

  return result.data;
}
