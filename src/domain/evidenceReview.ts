export type EvidenceReviewStatus = "pending" | "accepted" | "edited" | "removed";

/**
 * An interviewer's review decision on a single piece of evidence. No AI
 * output becomes permanent without landing here first — this is always
 * client-side draft state until a human acts on it.
 */
export interface EvidenceReviewState {
  status: EvidenceReviewStatus;
  editedQuote?: string;
  note?: string;
}

export type EvidenceReviewAction =
  | { type: "accept" }
  | { type: "edit"; quote: string }
  | { type: "remove" }
  | { type: "restore" }
  | { type: "setNote"; note: string };
