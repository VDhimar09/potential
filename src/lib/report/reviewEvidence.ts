import type { EvidenceReviewAction, EvidenceReviewState } from "@/domain";

export function createInitialReviewState(): EvidenceReviewState {
  return { status: "pending" };
}

/**
 * Applies a single human review decision to a piece of evidence. Pure and
 * deterministic so the UI's review state stays predictable — no AI output
 * becomes permanent by itself; it only ever changes state through one of
 * these explicit, human-driven actions.
 */
export function applyEvidenceReviewAction(
  current: EvidenceReviewState,
  action: EvidenceReviewAction,
): EvidenceReviewState {
  switch (action.type) {
    case "accept":
      return { ...current, status: "accepted" };
    case "edit":
      return { ...current, status: "edited", editedQuote: action.quote };
    case "remove":
      return { ...current, status: "removed" };
    case "restore":
      return { ...current, status: "pending", editedQuote: undefined };
    case "setNote":
      return { ...current, note: action.note };
  }
}
