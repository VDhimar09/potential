import type { z } from "zod";
import type { StructuredOutputClient, StructuredOutputRequest } from "./structuredOutputClient";

/**
 * Runs one structured-output call and returns validated data, or throws.
 * Every AI module's orchestration function (extractEvidence, analyzeFollowUp,
 * analyzeEvidenceGaps, analyzeRole) follows this exact request -> null-check
 * -> validate shape; this is the one place that logic lives.
 *
 * The error class is injected rather than thrown generically, so each module
 * keeps throwing its own named error type — callers, and existing tests, can
 * keep asserting `instanceof <ModuleSpecificError>`.
 */
export async function parseStructuredCompletion<T>(params: {
  client: StructuredOutputClient;
  request: StructuredOutputRequest;
  schema: z.ZodType<T>;
  schemaLabel: string;
  ErrorClass: new (message: string, cause?: unknown) => Error;
}): Promise<T> {
  const { client, request, schema, schemaLabel, ErrorClass } = params;

  const rawOutput = await client.parse(request);

  if (rawOutput == null) {
    throw new ErrorClass(
      "The model returned no parsable output (it may have refused the request).",
    );
  }

  const result = schema.safeParse(rawOutput);
  if (!result.success) {
    throw new ErrorClass(
      `Model output did not match the expected ${schemaLabel}: ${result.error.message}`,
      result.error,
    );
  }

  return result.data;
}
