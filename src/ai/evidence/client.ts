import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { z } from "zod";

export interface EvidenceModelRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodTypeAny;
  schemaName: string;
}

/**
 * The port `extractEvidence` depends on. It is expressed in our own terms (prompts,
 * a zod schema) rather than mirroring the OpenAI SDK's request shape, so unit tests
 * can implement it with a plain object and never need a real API key or network
 * access — only `createOpenAIEvidenceClient` below knows the OpenAI SDK exists.
 */
export interface EvidenceExtractionClient {
  parse(request: EvidenceModelRequest): Promise<unknown>;
}

/**
 * Adapts the real OpenAI Responses API (Structured Outputs) to the
 * EvidenceExtractionClient port. Pass an existing `OpenAI` instance to reuse
 * shared configuration (API key, org, base URL); otherwise one is constructed
 * from the standard `OPENAI_API_KEY` environment variable.
 */
export function createOpenAIEvidenceClient(
  client: OpenAI = new OpenAI(),
): EvidenceExtractionClient {
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
