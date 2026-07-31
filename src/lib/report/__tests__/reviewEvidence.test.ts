import { describe, expect, it } from "vitest";
import { applyEvidenceReviewAction, createInitialReviewState } from "../reviewEvidence";

describe("createInitialReviewState", () => {
  it("starts pending with no edits or notes", () => {
    expect(createInitialReviewState()).toEqual({ status: "pending" });
  });
});

describe("applyEvidenceReviewAction", () => {
  it("accepts evidence", () => {
    const state = applyEvidenceReviewAction(createInitialReviewState(), { type: "accept" });
    expect(state.status).toBe("accepted");
  });

  it("edits the quote and marks the item edited", () => {
    const state = applyEvidenceReviewAction(createInitialReviewState(), {
      type: "edit",
      quote: "A revised quote.",
    });
    expect(state).toEqual({ status: "edited", editedQuote: "A revised quote." });
  });

  it("removes evidence", () => {
    const state = applyEvidenceReviewAction(createInitialReviewState(), { type: "remove" });
    expect(state.status).toBe("removed");
  });

  it("restores removed evidence back to pending and clears any edit", () => {
    const removed = applyEvidenceReviewAction(createInitialReviewState(), { type: "remove" });
    const restored = applyEvidenceReviewAction(removed, { type: "restore" });
    expect(restored).toEqual({ status: "pending", editedQuote: undefined });
  });

  it("sets a note without changing the status", () => {
    const accepted = applyEvidenceReviewAction(createInitialReviewState(), { type: "accept" });
    const noted = applyEvidenceReviewAction(accepted, {
      type: "setNote",
      note: "Worth revisiting.",
    });
    expect(noted).toEqual({ status: "accepted", note: "Worth revisiting." });
  });

  it("never mutates the input state", () => {
    const initial = createInitialReviewState();
    applyEvidenceReviewAction(initial, { type: "accept" });
    expect(initial).toEqual({ status: "pending" });
  });
});
