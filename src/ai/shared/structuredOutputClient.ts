import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { z } from "zod";

export interface StructuredOutputRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodTypeAny;
  schemaName: string;
}

/**
 * The port every AI module's orchestration function depends on. Expressed in
 * our own terms (prompts, a zod schema) rather than the OpenAI SDK's request
 * shape, so unit tests can implement it with a plain object and never need a
 * real API key or network access — only `createOpenAIStructuredOutputClient`
 * below knows the OpenAI SDK exists.
 */
export interface StructuredOutputClient {
  parse(request: StructuredOutputRequest): Promise<unknown>;
}

/**
 * Adapts the real OpenAI Responses API (Structured Outputs) to the
 * StructuredOutputClient port. Pass an existing `OpenAI` instance to reuse
 * shared configuration (API key, org, base URL); otherwise one is constructed
 * from the standard `OPENAI_API_KEY` environment variable.
 *
 * Shared by every AI module (evidence, gaps, followups, role-planner) — they
 * all make this exact same kind of call. Each module re-exports this under
 * its own name (e.g. `createOpenAIEvidenceClient`) so its public API is
 * unchanged.
 */
export function createOpenAIStructuredOutputClient(
  client: OpenAI = new OpenAI(),
): StructuredOutputClient {
  return {
    async parse({ model, systemPrompt, userPrompt, schema, schemaName }) {
      const response = await client.responses.parse({
        model,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        text: { format: zodTextFormat(schema, schemaName) },
      });
      return response.output_parsed;
    },
  };
}
