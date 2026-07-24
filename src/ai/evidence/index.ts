export { extractEvidence } from "./extractEvidence";
export type { ExtractEvidenceOptions } from "./extractEvidence";

export { buildEvidenceExtractionUserPrompt, EVIDENCE_EXTRACTION_SYSTEM_PROMPT } from "./prompt";
export type { ExtractEvidenceInput } from "./prompt";

export { buildEvidenceExtractionSchema } from "./schema";

export { createOpenAIEvidenceClient } from "./client";
export type { EvidenceExtractionClient, EvidenceModelRequest } from "./client";

export { EvidenceExtractionError } from "./errors";
