import { describe, expect, it } from "vitest";
import { buildOverallSummary } from "../summary";
import type { EvidenceGapAnalysis } from "@/domain";

describe("buildOverallSummary", () => {
  it("reports a zero-competency message when nothing has been assessed", () => {
    expect(buildOverallSummary({ strong: [], partial: [], missing: [] }, null)).toBe(
      "No competencies have been assessed yet.",
    );
  });

  it("uses singular 'competency' for a count of one", () => {
    const summary = buildOverallSummary({ strong: ["A"], partial: [], missing: [] }, null);
    expect(summary).toContain("1 competency with strong evidence");
  });

  it("uses plural 'competencies' for counts other than one", () => {
    const summary = buildOverallSummary({ strong: ["A", "B"], partial: [], missing: [] }, null);
    expect(summary).toContain("2 competencies with strong evidence");
    expect(summary).toContain("0 competencies with partial evidence");
  });

  it("appends the gap analysis summary when present", () => {
    const gapAnalysis: EvidenceGapAnalysis = {
      summary: "Leadership needs more depth.",
      coveredCompetencies: [],
      missingCompetencies: [],
      completedObjectives: [],
      incompleteObjectives: [],
    };

    const summary = buildOverallSummary({ strong: ["A"], partial: [], missing: [] }, gapAnalysis);

    expect(summary.endsWith("Leadership needs more depth.")).toBe(true);
  });

  it("omits the trailing gap analysis text when there is no gap analysis", () => {
    const summary = buildOverallSummary({ strong: ["A"], partial: [], missing: [] }, null);
    expect(summary).toBe(
      "1 competency with strong evidence, 0 competencies with partial evidence, 0 competencies with no evidence yet, out of 1 assessed.",
    );
  });
});
