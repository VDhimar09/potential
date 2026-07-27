import {
  createOpenAIStructuredOutputClient,
  type StructuredOutputClient,
  type StructuredOutputRequest,
} from "../shared/structuredOutputClient";

export type EvidenceModelRequest = StructuredOutputRequest;

/**
 * The port `extractEvidence` depends on. It is expressed in our own terms (prompts,
 * a zod schema) rather than mirroring the OpenAI SDK's request shape, so unit tests
 * can implement it with a plain object and never need a real API key or network
 * access — only `createOpenAIEvidenceClient` below knows the OpenAI SDK exists.
 */
export type EvidenceExtractionClient = StructuredOutputClient;

/**
 * Adapts the real OpenAI Responses API (Structured Outputs) to the
 * EvidenceExtractionClient port. Pass an existing `OpenAI` instance to reuse
 * shared configuration (API key, org, base URL); otherwise one is constructed
 * from the standard `OPENAI_API_KEY` environment variable.
 *
 * Every AI module makes this exact same kind of call, so the implementation
 * lives once in shared/structuredOutputClient.ts.
 */
export const createOpenAIEvidenceClient = createOpenAIStructuredOutputClient;
