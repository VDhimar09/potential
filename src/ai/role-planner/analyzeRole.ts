import { z } from "zod";
import type { InterviewBlueprint } from "@/domain";
import { buildInterviewBlueprintSchema } from "./schema";
import { buildAnalyzeRoleUserPrompt, ROLE_PLANNER_SYSTEM_PROMPT } from "./prompt";
import type { AnalyzeRoleInput } from "./prompt";
import type { RolePlannerClient } from "./client";
import { RolePlannerError } from "./errors";

// Structured Outputs works with any model in the gpt-4o line or newer; override via
// options.model (or this env var) as the model lineup evolves.
const DEFAULT_MODEL = process.env.OPENAI_ROLE_PLANNER_MODEL ?? "gpt-4o-mini";

const analyzeRoleInputSchema = z.object({
  jobDescription: z.string().min(1, "jobDescription must not be empty"),
});

export interface AnalyzeRoleOptions {
  model?: string;
}

/**
 * Transforms a pasted job description into a draft Interview Blueprint. Pure
 * orchestration: validates its input, builds the schema + prompt, delegates the
 * model call to the injected client, then re-validates the model's output before
 * trusting it — so a caller can never receive an InterviewBlueprint that doesn't
 * match the domain model in src/domain/blueprint.ts, regardless of what the model
 * actually returned.
 *
 * This module only ever drafts a blueprint for review. It never writes interview
 * questions, ranks competencies, predicts candidate success, or makes a hiring
 * recommendation.
 */
export async function analyzeRole(
  input: AnalyzeRoleInput,
  client: RolePlannerClient,
  options: AnalyzeRoleOptions = {},
): Promise<InterviewBlueprint> {
  const validatedInput = analyzeRoleInputSchema.parse(input);
  const schema = buildInterviewBlueprintSchema();
  const userPrompt = buildAnalyzeRoleUserPrompt(validatedInput);

  const rawOutput = await client.parse({
    model: options.model ?? DEFAULT_MODEL,
    systemPrompt: ROLE_PLANNER_SYSTEM_PROMPT,
    userPrompt,
    schema,
    schemaName: "interview_blueprint",
  });

  if (rawOutput == null) {
    throw new RolePlannerError(
      "The model returned no parsable output (it may have refused the request).",
    );
  }

  const result = schema.safeParse(rawOutput);
  if (!result.success) {
    throw new RolePlannerError(
      `Model output did not match the expected interview blueprint schema: ${result.error.message}`,
      result.error,
    );
  }

  return result.data;
}
