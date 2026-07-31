import { describe, expect, it } from "vitest";
import { determineCoverageLevel, summarizeCoverage } from "../coverage";
import type { CompetencyEvidenceReport, EvidenceGapAnalysis, TracedEvidence } from "@/domain";

function tracedEvidence(overrides: Partial<TracedEvidence> = {}): TracedEvidence {
  return {
    id: "0-0",
    competency: "Systems thinking",
    quote: "quote",
    reasoning: "reasoning",
    strength: "strong",
    source: { turnIndex: 0, question: "Q", responseExcerpt: "R", t: "09:00" },
    ...overrides,
  };
}

describe("determineCoverageLevel", () => {
  it("is missing when the gap analysis flags the competency as a missing competency", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "",
      coveredCompetencies: [],
      missingCompetencies: [{ competency: "Leadership", explanation: "No evidence yet." }],
      completedObjectives: [],
      incompleteObjectives: [],
    };

    expect(determineCoverageLevel("Leadership", [], gapAnalysis)).toBe("missing");
  });

  it("is partial when a matching gap entry has status partial", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "",
      coveredCompetencies: ["Leadership"],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
      gaps: [
        {
          capability: "Leadership",
          status: "partial",
          reason: "Only one example.",
          suggestedFocus: "Direct disagreement.",
          priority: "high",
        },
      ],
    };

    const evidence = [tracedEvidence({ competency: "Leadership", strength: "strong" })];

    expect(determineCoverageLevel("Leadership", evidence, gapAnalysis)).toBe("partial");
  });

  it("is strong when there is evidence and no gap analysis flags it", () => {
    const evidence = [tracedEvidence({ strength: "strong" })];
    expect(determineCoverageLevel("Systems thinking", evidence, null)).toBe("strong");
  });

  it("is partial when evidence exists but isn't uniformly strong", () => {
    const evidence = [
      tracedEvidence({ strength: "strong" }),
      tracedEvidence({ id: "0-1", strength: "weak" }),
    ];
    expect(determineCoverageLevel("Systems thinking", evidence, null)).toBe("partial");
  });

  it("is missing when there is no evidence at all and no gap analysis", () => {
    expect(determineCoverageLevel("Conflict management", [], null)).toBe("missing");
  });
});

describe("summarizeCoverage", () => {
  it("buckets competencies by coverage level", () => {
    const reports: CompetencyEvidenceReport[] = [
      {
        competency: "A",
        coverage: "strong",
        evidence: [],
        remainingGaps: [],
        suggestedFollowUps: [],
      },
      {
        competency: "B",
        coverage: "partial",
        evidence: [],
        remainingGaps: [],
        suggestedFollowUps: [],
      },
      {
        competency: "C",
        coverage: "missing",
        evidence: [],
        remainingGaps: [],
        suggestedFollowUps: [],
      },
      {
        competency: "D",
        coverage: "strong",
        evidence: [],
        remainingGaps: [],
        suggestedFollowUps: [],
      },
    ];

    expect(summarizeCoverage(reports)).toEqual({
      strong: ["A", "D"],
      partial: ["B"],
      missing: ["C"],
    });
  });

  it("returns empty buckets for an empty report list", () => {
    expect(summarizeCoverage([])).toEqual({ strong: [], partial: [], missing: [] });
  });
});
