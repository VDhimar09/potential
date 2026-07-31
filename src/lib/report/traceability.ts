import type { InterviewTurn, TracedEvidence } from "@/domain";

const RESPONSE_EXCERPT_MAX_LENGTH = 240;

/** Trims a response down to a readable excerpt without cutting mid-word. */
function excerpt(text: string, maxLength: number = RESPONSE_EXCERPT_MAX_LENGTH): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Flattens per-turn evidence into a single traced list, attaching each item's
 * source (the question, a response excerpt, and the turn it came from) so an
 * interviewer can always inspect why a piece of evidence exists. Purely a
 * reshaping of data Evidence Extraction already produced — no new evidence,
 * no scoring, no inference.
 */
export function buildTracedEvidence(turns: readonly InterviewTurn[]): TracedEvidence[] {
  return turns.flatMap((turn) =>
    turn.evidence.map((item, indexInTurn) => ({
      ...item,
      id: `${turn.turnIndex}-${indexInTurn}`,
      source: {
        turnIndex: turn.turnIndex,
        question: turn.question,
        responseExcerpt: excerpt(turn.response),
        t: turn.t,
      },
    })),
  );
}
