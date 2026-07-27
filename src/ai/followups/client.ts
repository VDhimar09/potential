import {
  createOpenAIStructuredOutputClient,
  type StructuredOutputClient,
  type StructuredOutputRequest,
} from "../shared/structuredOutputClient";

export type FollowUpModelRequest = StructuredOutputRequest;

/**
 * The port `analyzeFollowUp` depends on. Expressed in our own terms (prompts, a
 * zod schema) rather than the OpenAI SDK's request shape, so unit tests can
 * implement it with a plain object and never need a real API key or network
 * access — only `createOpenAIFollowUpClient` below knows the OpenAI SDK exists.
 */
export type FollowUpGenerationClient = StructuredOutputClient;

/**
 * Adapts the real OpenAI Responses API (Structured Outputs) to the
 * FollowUpGenerationClient port. Pass an existing `OpenAI` instance to reuse
 * shared configuration (API key, org, base URL); otherwise one is constructed
 * from the standard `OPENAI_API_KEY` environment variable.
 *
 * Every AI module makes this exact same kind of call, so the implementation
 * lives once in shared/structuredOutputClient.ts.
 */
export const createOpenAIFollowUpClient = createOpenAIStructuredOutputClient;
