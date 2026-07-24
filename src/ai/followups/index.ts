export { analyzeFollowUp } from "./analyzeFollowUp";
export type { AnalyzeFollowUpOptions } from "./analyzeFollowUp";

export { buildFollowUpUserPrompt, FOLLOW_UP_SYSTEM_PROMPT } from "./prompt";
export type { AnalyzeFollowUpInput } from "./prompt";

export { buildFollowUpSuggestionSchema } from "./schema";

export { createOpenAIFollowUpClient } from "./client";
export type { FollowUpGenerationClient, FollowUpModelRequest } from "./client";

export { FollowUpGenerationError } from "./errors";
