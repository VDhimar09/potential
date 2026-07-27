import type { Evidence, EvidenceGapAnalysis } from "@/domain";
import { formatEvidenceForPrompt } from "../shared/formatEvidenceForPrompt";

export interface AnalyzeFollowUpInput {
  /** What the candidate just said, most recently. */
  latestResponse: string;
  /** Evidence already extracted from the candidate's responses so far. */
  evidence: readonly Evidence[];
  /** The current gap analysis — what's missing or incomplete, and why. */
  gapAnalysis: EvidenceGapAnalysis;
}

/**
 * The system prompt is the enforcement point for this module's one job: recommend
 * exactly one follow-up question that would help collect missing evidence — never
 * a list of options, never a score, rank, or hiring signal, and never a repeat of
 * ground already covered.
 */
export const FOLLOW_UP_SYSTEM_PROMPT = `You are a follow-up question assistant for Potential, a hiring tool that helps interviewers collect trustworthy evidence about candidate capability.

You are given the candidate's latest response, the evidence collected so far, and a gap analysis describing which competencies and objectives are missing or incomplete. Your only job is to recommend ONE follow-up question the interviewer could ask next to collect the missing evidence.

Rules:
- Recommend exactly one follow-up question. Never propose multiple options or a list.
- Ground the question in the evidence and gap analysis supplied — reference something the candidate actually said, and target a specific missing competency or incomplete objective. Never invent a scenario the candidate hasn't described.
- Avoid generic behavioural questions ("tell me about a time you...") that could apply to any interview. The question should read like a natural next step in this specific conversation.
- Never repeat or rephrase a question that has already been asked, as reflected in the evidence already collected.
- Do not infer or credit a capability the candidate hasn't demonstrated.
- You do not score, rank, or judge the candidate, and you do not make any hiring recommendation.
- Never mention confidence scores, probabilities, or any numeric rating.
- The goal is to collect missing evidence — nothing else. You do not decide whether the candidate is a good fit.`;

export function buildFollowUpUserPrompt(input: AnalyzeFollowUpInput): string {
  const evidenceDescription = formatEvidenceForPrompt(input.evidence);

  const missingDescription =
    input.gapAnalysis.missingCompetencies.length === 0
      ? "None — every assessed competency is covered so far."
      : input.gapAnalysis.missingCompetencies
          .map((gap) => `- ${gap.competency}: ${gap.explanation}`)
          .join("\n");

  const incompleteDescription =
    input.gapAnalysis.incompleteObjectives.length === 0
      ? "None — every objective is complete so far."
      : input.gapAnalysis.incompleteObjectives
          .map((gap) => `- ${gap.objective}: ${gap.explanation}`)
          .join("\n");

  return [
    `Candidate's latest response: "${input.latestResponse}"`,
    `Evidence collected so far:\n${evidenceDescription}`,
    `Gap analysis summary: ${input.gapAnalysis.summary}`,
    `Missing competencies:\n${missingDescription}`,
    `Incomplete objectives:\n${incompleteDescription}`,
  ].join("\n\n");
}
