export class FollowUpGenerationError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "FollowUpGenerationError";
  }
}
