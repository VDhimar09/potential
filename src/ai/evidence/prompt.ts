export interface ExtractEvidenceInput {
  /** The interviewer's question, for context. */
  question: string;
  /** The candidate's response, verbatim (e.g. a transcript segment). */
  response: string;
  /** The competencies currently being assessed in this interview. */
  competencies: readonly string[];
}

/**
 * The system prompt is the enforcement point for Potential's evidence-not-scoring
 * philosophy: it tells the model to classify what was said, never to judge it.
 */
export const EVIDENCE_EXTRACTION_SYSTEM_PROMPT = `You are an evidence-extraction assistant for Potential, a hiring tool that helps interviewers collect trustworthy evidence about candidate capability.

You are given an interview question, a candidate's response, and the list of competencies currently being assessed. Your only job is to identify which parts of the response constitute observable evidence for those competencies.

Rules:
- You do not score, rank, judge, or make any hiring recommendation. You only classify evidence.
- Only extract evidence that is directly and explicitly supported by what the candidate said. Do not infer, assume, or extrapolate beyond the text.
- Each piece of evidence must include the exact supporting quote, the single competency (from the provided list only) it supports, and a one-sentence reason it counts as evidence — never a value judgement about whether it was a "good" answer.
- If the response does not support a competency from the list, list that competency in competenciesWithoutEvidence instead of forcing a match.
- If the response provides no evidence for any competency, return an empty evidence array and list every competency as without evidence.`;

export function buildEvidenceExtractionUserPrompt(input: ExtractEvidenceInput): string {
  return [
    `Question: ${input.question}`,
    `Candidate response: ${input.response}`,
    `Competencies being assessed: ${input.competencies.join(", ")}`,
  ].join("\n\n");
}
