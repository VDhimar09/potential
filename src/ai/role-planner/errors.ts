import { AiModuleError } from "../shared/AiModuleError";

export class RolePlannerError extends AiModuleError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "RolePlannerError";
  }
}
