import type {
  EvidenceGapAnalysis,
  EvidenceReportMetadata,
  FollowUpSuggestion,
  InterviewBlueprint,
  InterviewTurn,
} from "@/domain";
import { ALEX_MORGAN } from "./candidates";

// Fixture data for Alex Morgan's interview, consistent with the narrative
// already used by the mock evidence report (src/lib/mock/reports.ts) and
// mock transcript (src/lib/mock/interviews.ts) — reshaped here into the raw
// pipeline-shaped inputs (InterviewTurn, EvidenceGapAnalysis,
// FollowUpSuggestion) that composeEvidenceReport actually consumes.

export const ALEX_MORGAN_BLUEPRINT: InterviewBlueprint = {
  roleTitle: ALEX_MORGAN.role,
  roleSummary:
    "Owns architecture decisions for high-throughput data infrastructure and mentors senior engineers.",
  keyResponsibilities: [
    "Design and evolve the ingestion platform",
    "Make build-vs-buy and architecture tradeoffs",
    "Support engineers working through ambiguous, high-stakes problems",
  ],
  competencies: [
    "Systems thinking",
    "Ownership",
    "Leadership",
    "Communication",
    "Conflict management",
  ],
  interviewObjectives: [
    "Understand systems thinking",
    "Understand ownership",
    "Understand communication",
    "Understand leadership under conflict",
  ],
  evidencePlan: [
    { competency: "Systems thinking", guidance: "A decision made under technical uncertainty." },
    { competency: "Ownership", guidance: "Taking responsibility for ambiguous, unowned work." },
    { competency: "Leadership", guidance: "Influencing others without formal authority." },
    {
      competency: "Communication",
      guidance: "Making a decision legible to people not in the room.",
    },
    { competency: "Conflict management", guidance: "Navigating direct disagreement with a peer." },
  ],
};

export const ALEX_MORGAN_TURNS: InterviewTurn[] = [
  {
    turnIndex: 0,
    question: "Tell me about a project where you had to make a call without full information.",
    response:
      "We were rebuilding the ingestion pipeline. Half the team believed we should keep the existing Kafka topology, the other half wanted to move to a pull-based model. I didn't have the runtime data to be sure — so I built two small prototypes over a weekend to test throughput at realistic load. That gave us evidence to decide.",
    t: "09:04",
    evidence: [
      {
        competency: "Systems thinking",
        quote:
          "I didn't have the runtime data to be sure — so I built two small prototypes over a weekend to test throughput at realistic load.",
        reasoning:
          "Validated a technical decision through direct experimentation rather than assumption.",
        strength: "strong",
      },
    ],
  },
  {
    turnIndex: 1,
    question: "How did the team react when you presented that?",
    response:
      "Honestly there was still disagreement. One of the senior folks pushed back hard on the pull-based approach, but it wasn't my project on paper — nobody else was going to unblock it, so I took the ambiguity as mine.",
    t: "09:11",
    evidence: [
      {
        competency: "Ownership",
        quote:
          "It wasn't my project on paper, but nobody else was going to unblock it, so I took the ambiguity as mine.",
        reasoning:
          "Took responsibility for ambiguous work sitting outside a clearly assigned owner.",
        strength: "strong",
      },
    ],
  },
  {
    turnIndex: 2,
    question: "How did you get buy-in from people who disagreed with the direction?",
    response:
      "I wrote a two-page memo because the decision needed to survive without me in the room. I try to lead through evidence, not authority — if I can show why, people will usually come with me.",
    t: "09:31",
    evidence: [
      {
        competency: "Communication",
        quote:
          "I wrote a two-page memo because the decision needed to survive without me in the room.",
        reasoning:
          "Documented reasoning so the decision could be understood without the author present.",
        strength: "strong",
      },
      {
        competency: "Leadership",
        quote:
          "I try to lead through evidence, not authority — if I can show why, people will usually come with me.",
        reasoning:
          "Describes an influence style grounded in evidence, but doesn't yet describe a case of sustained disagreement.",
        strength: "moderate",
      },
    ],
  },
];

export const ALEX_MORGAN_GAP_ANALYSIS: EvidenceGapAnalysis = {
  summary:
    "Systems thinking, ownership, and communication are well supported. Leadership needs a concrete example under direct disagreement, and conflict management hasn't been explored yet.",
  coveredCompetencies: ["Systems thinking", "Ownership", "Communication", "Leadership"],
  missingCompetencies: [
    {
      competency: "Conflict management",
      explanation: "No direct evidence collected. A short follow-up conversation is recommended.",
    },
  ],
  completedObjectives: [
    "Understand systems thinking",
    "Understand ownership",
    "Understand communication",
  ],
  incompleteObjectives: [
    {
      objective: "Understand leadership under conflict",
      explanation:
        "Only one example of leading through evidence; no example yet of navigating disagreement directly.",
    },
  ],
  gaps: [
    {
      capability: "Leadership",
      status: "partial",
      reason:
        "Only one example of leading through evidence; direct conflict management not yet observed.",
      suggestedFocus: "A situation where the candidate disagreed with a peer they respected.",
      priority: "high",
    },
    {
      capability: "Conflict management",
      status: "missing",
      reason: "No direct evidence collected.",
      suggestedFocus: "A short follow-up conversation focused on handling disagreement.",
      priority: "high",
    },
  ],
};

export const ALEX_MORGAN_FOLLOW_UP_HISTORY: FollowUpSuggestion[] = [
  {
    question:
      "You mentioned leading through evidence — can you tell me about a time you disagreed with a peer you respected?",
    reason: "No evidence describing how the candidate handles direct disagreement yet.",
    addressesCompetency: "Leadership",
  },
];

export const ALEX_MORGAN_REPORT_METADATA: EvidenceReportMetadata = {
  interviewId: "int-alex-morgan-01",
  candidateId: ALEX_MORGAN.id,
  candidateName: ALEX_MORGAN.name,
  roleId: "role-staff-engineer",
  roleTitle: ALEX_MORGAN.role,
  generatedAt: "2027-04-12T09:45:00.000Z",
};
