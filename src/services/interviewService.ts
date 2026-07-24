import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Evidence, EvidenceGapAnalysis } from "@/domain";
import { createOpenAIEvidenceClient, extractEvidence } from "@/ai/evidence";
import { analyzeEvidenceGaps, createOpenAIGapAnalysisClient } from "@/ai/gaps";

/**
 * Thrown by the service layer whenever the Evidence Engine can't be reached or
 * refuses a request — components/stores only ever need to handle this one type,
 * regardless of what actually went wrong underneath (network, OpenAI, schema).
 */
export class InterviewServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "InterviewServiceError";
  }
}

const analyseResponseInputSchema = z.object({
  question: z.string().min(1),
  response: z.string().min(1),
  competencies: z.array(z.string().min(1)).min(1),
});

// The JSON-serializable shape that actually crosses the client/server boundary —
// deliberately its own type (not ai/evidence's ExtractEvidenceInput, which uses a
// readonly array) since that's a stricter, unrelated internal contract.
export type AnalyseResponseInput = z.infer<typeof analyseResponseInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place the OpenAI client and API key exist, so the
 * Evidence Engine — and the credentials it needs — are never shipped to the
 * browser.
 */
const analyseResponseServerFn = createServerFn({ method: "POST" })
  .validator(analyseResponseInputSchema)
  .handler(async ({ data }): Promise<Evidence[]> => {
    try {
      const client = createOpenAIEvidenceClient();
      const result = await extractEvidence(data, client);
      return result.evidence;
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't analyse that response.", error);
    }
  });

/**
 * The only entry point React components (or the interview store) should use to
 * reach the Evidence Engine — never call extractEvidence() directly from UI code.
 */
async function analyseResponse(input: AnalyseResponseInput): Promise<Evidence[]> {
  try {
    return await analyseResponseServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't analyse that response.", error);
  }
}

const analyzeGapsInputSchema = z.object({
  competencies: z.array(z.string().min(1)).min(1),
  objectives: z.array(z.string().min(1)).min(1),
  evidence: z.array(
    z.object({
      competency: z.string().min(1),
      quote: z.string().min(1),
      reasoning: z.string().min(1),
      strength: z.enum(["strong", "moderate", "weak"]),
    }),
  ),
});

export type AnalyzeGapsInput = z.infer<typeof analyzeGapsInputSchema>;

/**
 * Runs on the server only, for the same reason analyseResponseServerFn does: the
 * Gap Analysis Engine's OpenAI client and API key must never reach the browser.
 */
const analyzeGapsServerFn = createServerFn({ method: "POST" })
  .validator(analyzeGapsInputSchema)
  .handler(async ({ data }): Promise<EvidenceGapAnalysis> => {
    try {
      const client = createOpenAIGapAnalysisClient();
      return await analyzeEvidenceGaps(data, client);
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't analyse evidence gaps.", error);
    }
  });

/**
 * The only entry point React components (or the interview store) should use to
 * reach the Gap Analysis Engine — never call analyzeEvidenceGaps() directly from
 * UI code.
 */
async function analyzeGaps(input: AnalyzeGapsInput): Promise<EvidenceGapAnalysis> {
  try {
    return await analyzeGapsServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't analyse evidence gaps.", error);
  }
}

export const interviewService = {
  analyseResponse,
  analyzeGaps,
};
