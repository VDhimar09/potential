import { describe, expect, it } from "vitest";
import { evaluateInterviewReflection } from "../reflectionCheck";
import type { Evidence, EvidenceGapAnalysis, FollowUpSuggestion } from "@/domain";

const evidence: Evidence[] = [
  {
    competency: "Systems thinking",
    quote: "I built two prototypes over a weekend to test throughput.",
    reasoning: "Validated a technical decision through direct experimentation.",
    strength: "strong",
  },
];

const followUpSuggestion: FollowUpSuggestion = {
  question:
    "You mentioned the platform migration — did you ever disagree with a teammate about the approach?",
  reason: "No evidence describing how the candidate handles disagreement yet.",
  addressesCompetency: "Leadership",
};

describe("evaluateInterviewReflection", () => {
  it("is complete when the gap analysis has no missing competencies or incomplete objectives", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "Both competencies are well supported by the evidence collected.",
      coveredCompetencies: ["Systems thinking", "Leadership"],
      missingCompetencies: [],
      completedObjectives: ["Understand leadership"],
      incompleteObjectives: [],
    };

    const reflection = evaluateInterviewReflection(evidence, gapAnalysis, null);

    expect(reflection.isComplete).toBe(true);
    expect(reflection.remainingCompetencyGaps).toEqual([]);
    expect(reflection.remainingObjectiveGaps).toEqual([]);
  });

  it("is not complete when a competency is still missing", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "Leadership evidence is still thin.",
      coveredCompetencies: ["Systems thinking"],
      missingCompetencies: [
        {
          competency: "Leadership",
          explanation: "No evidence of leading through disagreement yet.",
        },
      ],
      completedObjectives: [],
      incompleteObjectives: [],
    };

    const reflection = evaluateInterviewReflection(evidence, gapAnalysis, followUpSuggestion);

    expect(reflection.isComplete).toBe(false);
    expect(reflection.remainingCompetencyGaps).toEqual(gapAnalysis.missingCompetencies);
  });

  it("is not complete when an objective is still incomplete, even with no missing competencies", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "Every competency has some support, but leadership needs more depth.",
      coveredCompetencies: ["Systems thinking", "Leadership"],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [
        { objective: "Understand leadership", explanation: "Only one shallow example so far." },
      ],
    };

    const reflection = evaluateInterviewReflection(evidence, gapAnalysis, null);

    expect(reflection.isComplete).toBe(false);
    expect(reflection.remainingObjectiveGaps).toEqual(gapAnalysis.incompleteObjectives);
  });

  it("is not complete when no gap analysis has been run yet", () => {
    const reflection = evaluateInterviewReflection([], null, null);

    expect(reflection.isComplete).toBe(false);
    expect(reflection.remainingCompetencyGaps).toEqual([]);
    expect(reflection.remainingObjectiveGaps).toEqual([]);
  });

  it("passes through the evidence and follow-up suggestion unchanged", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "...",
      coveredCompetencies: [],
      missingCompetencies: [{ competency: "Leadership", explanation: "..." }],
      completedObjectives: [],
      incompleteObjectives: [],
    };

    const reflection = evaluateInterviewReflection(evidence, gapAnalysis, followUpSuggestion);

    expect(reflection.evidence).toBe(evidence);
    expect(reflection.followUpSuggestion).toBe(followUpSuggestion);
  });
});
