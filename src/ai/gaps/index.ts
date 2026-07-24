export { analyzeEvidenceGaps } from "./analyzeEvidenceGaps";
export type { AnalyzeEvidenceGapsOptions } from "./analyzeEvidenceGaps";

export { buildEvidenceGapAnalysisUserPrompt, EVIDENCE_GAP_ANALYSIS_SYSTEM_PROMPT } from "./prompt";
export type { AnalyzeEvidenceGapsInput } from "./prompt";

export { buildEvidenceGapAnalysisSchema } from "./schema";

export { createOpenAIGapAnalysisClient } from "./client";
export type { GapAnalysisClient, GapAnalysisModelRequest } from "./client";

export { EvidenceGapAnalysisError } from "./errors";
