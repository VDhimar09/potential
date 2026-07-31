import type { Evidence } from "./evidence";

/**
 * One interviewer question + candidate response turn, together with the
 * evidence extracted from it. This is the atomic unit the Explainable
 * Evidence Report traces every quote back to — without it, an Evidence item
 * has no way to point back to the question or response it came from.
 */
export interface InterviewTurn {
  turnIndex: number;
  question: string;
  response: string;
  t: string;
  evidence: Evidence[];
}
