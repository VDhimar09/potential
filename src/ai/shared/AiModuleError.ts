/**
 * Base class for the AI layer's per-module error types. Centralises the
 * cause-handling boilerplate every module's error class needs — `cause` must
 * be omitted entirely rather than passed as `undefined`, or Node prints a
 * spurious `[cause]: undefined` — so each module's class only has to set
 * `name`.
 */
export abstract class AiModuleError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
  }
}
