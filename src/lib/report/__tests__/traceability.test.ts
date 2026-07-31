import { describe, expect, it } from "vitest";
import { buildTracedEvidence } from "../traceability";
import type { InterviewTurn } from "@/domain";

describe("buildTracedEvidence", () => {
  it("attaches each evidence item's source turn, question, and response excerpt", () => {
    const turns: InterviewTurn[] = [
      {
        turnIndex: 0,
        question: "Tell me about a hard decision.",
        response: "We had to pick between two approaches without full data.",
        t: "09:04",
        evidence: [
          {
            competency: "Systems thinking",
            quote: "We had to pick between two approaches without full data.",
            reasoning: "Made a decision under uncertainty.",
            strength: "strong",
          },
        ],
      },
    ];

    const traced = buildTracedEvidence(turns);

    expect(traced).toHaveLength(1);
    expect(traced[0].competency).toBe("Systems thinking");
    expect(traced[0].source).toEqual({
      turnIndex: 0,
      question: "Tell me about a hard decision.",
      responseExcerpt: "We had to pick between two approaches without full data.",
      t: "09:04",
    });
  });

  it("assigns a stable, unique id to each evidence item across turns", () => {
    const turns: InterviewTurn[] = [
      {
        turnIndex: 0,
        question: "Q1",
        response: "R1",
        t: "09:00",
        evidence: [
          { competency: "A", quote: "q1", reasoning: "r1", strength: "strong" },
          { competency: "B", quote: "q2", reasoning: "r2", strength: "weak" },
        ],
      },
      {
        turnIndex: 1,
        question: "Q2",
        response: "R2",
        t: "09:05",
        evidence: [{ competency: "A", quote: "q3", reasoning: "r3", strength: "moderate" }],
      },
    ];

    const traced = buildTracedEvidence(turns);
    const ids = traced.map((item) => item.id);

    expect(ids).toEqual(["0-0", "0-1", "1-0"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("truncates long responses to a readable excerpt without cutting mid-word", () => {
    const longResponse = "word ".repeat(100).trim();
    const turns: InterviewTurn[] = [
      {
        turnIndex: 0,
        question: "Q",
        response: longResponse,
        t: "09:00",
        evidence: [{ competency: "A", quote: "word", reasoning: "r", strength: "strong" }],
      },
    ];

    const [traced] = buildTracedEvidence(turns);

    expect(traced.source.responseExcerpt.length).toBeLessThan(longResponse.length);
    expect(traced.source.responseExcerpt.endsWith("…")).toBe(true);
    expect(traced.source.responseExcerpt.endsWith(" …")).toBe(false);
  });

  it("returns an empty list when there are no turns", () => {
    expect(buildTracedEvidence([])).toEqual([]);
  });
});
