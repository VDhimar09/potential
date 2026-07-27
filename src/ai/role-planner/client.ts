import {
  createOpenAIStructuredOutputClient,
  type StructuredOutputClient,
  type StructuredOutputRequest,
} from "../shared/structuredOutputClient";

export type RolePlannerModelRequest = StructuredOutputRequest;

/**
 * The port `analyzeRole` depends on. Expressed in our own terms (prompts, a zod
 * schema) rather than the OpenAI SDK's request shape, so unit tests can implement
 * it with a plain object and never need a real API key or network access — only
 * `createOpenAIRolePlannerClient` below knows the OpenAI SDK exists.
 */
export type RolePlannerClient = StructuredOutputClient;

/**
 * Adapts the real OpenAI Responses API (Structured Outputs) to the
 * RolePlannerClient port. Pass an existing `OpenAI` instance to reuse shared
 * configuration (API key, org, base URL); otherwise one is constructed from the
 * standard `OPENAI_API_KEY` environment variable.
 *
 * Every AI module makes this exact same kind of call, so the implementation
 * lives once in shared/structuredOutputClient.ts.
 */
export const createOpenAIRolePlannerClient = createOpenAIStructuredOutputClient;
