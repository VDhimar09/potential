import { AiModuleError } from "../shared/AiModuleError";

export class EvidenceExtractionError extends AiModuleError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "EvidenceExtractionError";
  }
}
