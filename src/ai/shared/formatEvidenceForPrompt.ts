import type { Evidence } from "@/domain";

/**
 * Renders a collected-evidence list for inclusion in a prompt. Shared because
 * the Gap Analysis and Follow-up prompts both need this identical rendering
 * of "what's been collected so far".
 */
export function formatEvidenceForPrompt(evidence: readonly Evidence[]): string {
  if (evidence.length === 0) {
    return "No evidence has been collected yet.";
  }

  return evidence
    .map(
      (e, i) =>
        `${i + 1}. [${e.competency}] "${e.quote}" — ${e.reasoning} (strength: ${e.strength})`,
    )
    .join("\n");
}
