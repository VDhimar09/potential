import { AiModuleError } from "../shared/AiModuleError";

export class FollowUpGenerationError extends AiModuleError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "FollowUpGenerationError";
  }
}
