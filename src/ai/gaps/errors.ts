import { AiModuleError } from "../shared/AiModuleError";

export class EvidenceGapAnalysisError extends AiModuleError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "EvidenceGapAnalysisError";
  }
}
