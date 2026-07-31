import { describe, expect, it } from "vitest";
import { composeEvidenceReport } from "../composeEvidenceReport";
import type { EvidenceGapAnalysis, InterviewBlueprint, InterviewTurn } from "@/domain";
import {
  ALEX_MORGAN_BLUEPRINT,
  ALEX_MORGAN_FOLLOW_UP_HISTORY,
  ALEX_MORGAN_GAP_ANALYSIS,
  ALEX_MORGAN_REPORT_METADATA,
  ALEX_MORGAN_TURNS,
} from "@/lib/mock/interviewTurns";

const blueprint: InterviewBlueprint = {
  roleTitle: "Staff Engineer",
  roleSummary: "Owns architecture decisions.",
  keyResponsibilities: [],
  competencies: ["Systems thinking", "Leadership", "Conflict management"],
  interviewObjectives: [],
  evidencePlan: [],
};

const turns: InterviewTurn[] = [
  {
    turnIndex: 0,
    question: "Tell me about a hard technical call.",
    response: "I ran two prototypes to compare throughput before deciding.",
    t: "09:04",
    evidence: [
      {
        competency: "Systems thinking",
        quote: "I ran two prototypes to compare throughput before deciding.",
        reasoning: "Validated the decision experimentally.",
        strength: "strong",
      },
    ],
  },
  {
    turnIndex: 1,
    question: "How do you influence people who disagree?",
    response: "I lead through evidence rather than authority.",
    t: "09:20",
    evidence: [
      {
        competency: "Leadership",
        quote: "I lead through evidence rather than authority.",
        reasoning: "Describes an influence style, but no example of resolving disagreement.",
        strength: "moderate",
      },
    ],
  },
];

const gapAnalysis: EvidenceGapAnalysis = {
  summary: "Leadership needs a concrete example; conflict management is unexplored.",
  coveredCompetencies: ["Systems thinking", "Leadership"],
  missingCompetencies: [
    { competency: "Conflict management", explanation: "No direct evidence collected." },
  ],
  completedObjectives: [],
  incompleteObjectives: [],
  gaps: [
    {
      capability: "Leadership",
      status: "partial",
      reason: "Only one example so far.",
      suggestedFocus: "A moment of direct disagreement.",
      priority: "high",
    },
  ],
};

const metadata = {
  interviewId: "int-1",
  candidateId: "cand-1",
  candidateName: "Jordan Reyes",
  roleId: "role-1",
  roleTitle: "Staff Engineer",
  generatedAt: "2027-04-12T09:45:00.000Z",
};

describe("composeEvidenceReport", () => {
  it("produces one competency report per blueprint competency, in order", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [],
      metadata,
    });

    expect(report.competencies.map((c) => c.competency)).toEqual([
      "Systems thinking",
      "Leadership",
      "Conflict management",
    ]);
  });

  it("assigns coverage levels consistent with the gap analysis and evidence strength", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [],
      metadata,
    });

    const byName = Object.fromEntries(report.competencies.map((c) => [c.competency, c]));
    expect(byName["Systems thinking"].coverage).toBe("strong");
    expect(byName["Leadership"].coverage).toBe("partial");
    expect(byName["Conflict management"].coverage).toBe("missing");
  });

  it("falls back to missingCompetencies for remaining gaps when gaps[] doesn't cover a competency", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [],
      metadata,
    });

    const conflictManagement = report.competencies.find(
      (c) => c.competency === "Conflict management",
    );
    expect(conflictManagement?.remainingGaps).toEqual([
      {
        capability: "Conflict management",
        status: "missing",
        reason: "No direct evidence collected.",
        suggestedFocus: "No direct evidence collected.",
        priority: "medium",
      },
    ]);
  });

  it("attaches only the follow-ups addressing each competency", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [
        { question: "Q1", reason: "R1", addressesCompetency: "Leadership" },
        { question: "Q2", reason: "R2", addressesCompetency: "Systems thinking" },
      ],
      metadata,
    });

    const leadership = report.competencies.find((c) => c.competency === "Leadership");
    expect(leadership?.suggestedFollowUps).toEqual([
      { question: "Q1", reason: "R1", addressesCompetency: "Leadership" },
    ]);
  });

  it("summarizes coverage and builds an overall summary from the composed report", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [],
      metadata,
    });

    expect(report.coverage).toEqual({
      strong: ["Systems thinking"],
      partial: ["Leadership"],
      missing: ["Conflict management"],
    });
    expect(report.overallSummary).toContain(gapAnalysis.summary);
  });

  it("passes metadata through unchanged", () => {
    const report = composeEvidenceReport({
      blueprint,
      turns,
      gapAnalysis,
      followUpHistory: [],
      metadata,
    });

    expect(report.metadata).toEqual(metadata);
  });

  it("is deterministic — the same inputs always produce an equivalent report", () => {
    const input = { blueprint, turns, gapAnalysis, followUpHistory: [], metadata };
    expect(composeEvidenceReport(input)).toEqual(composeEvidenceReport(input));
  });

  it("composes the full Alex Morgan fixture end-to-end without throwing", () => {
    const report = composeEvidenceReport({
      blueprint: ALEX_MORGAN_BLUEPRINT,
      turns: ALEX_MORGAN_TURNS,
      gapAnalysis: ALEX_MORGAN_GAP_ANALYSIS,
      followUpHistory: ALEX_MORGAN_FOLLOW_UP_HISTORY,
      metadata: ALEX_MORGAN_REPORT_METADATA,
    });

    expect(report.competencies).toHaveLength(ALEX_MORGAN_BLUEPRINT.competencies.length);
    expect(report.coverage.missing).toContain("Conflict management");
    expect(report.metadata).toEqual(ALEX_MORGAN_REPORT_METADATA);
  });
});
