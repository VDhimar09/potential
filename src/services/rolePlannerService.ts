import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { InterviewBlueprint } from "@/domain";
import { analyzeRole as analyzeRoleWithAI, createOpenAIRolePlannerClient } from "@/ai/role-planner";

/**
 * Thrown by the service layer whenever the Role Planner can't be reached or
 * refuses a request — components only ever need to handle this one type,
 * regardless of what actually went wrong underneath (network, OpenAI, schema).
 */
export class RolePlannerServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "RolePlannerServiceError";
  }
}

const analyzeRoleInputSchema = z.object({
  jobDescription: z.string().min(1),
});

export type AnalyzeRoleInput = z.infer<typeof analyzeRoleInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place the OpenAI client and API key exist, so the
 * Role Planner — and the credentials it needs — are never shipped to the browser.
 */
const analyzeRoleServerFn = createServerFn({ method: "POST" })
  .validator(analyzeRoleInputSchema)
  .handler(async ({ data }): Promise<InterviewBlueprint> => {
    try {
      const client = createOpenAIRolePlannerClient();
      return await analyzeRoleWithAI(data, client);
    } catch (error) {
      throw new RolePlannerServiceError("Potential couldn't analyse that job description.", error);
    }
  });

/**
 * The only entry point React components should use to reach the Role Planner —
 * never call analyzeRole() from @/ai/role-planner directly from UI code.
 */
async function analyzeRole(input: AnalyzeRoleInput): Promise<InterviewBlueprint> {
  try {
    return await analyzeRoleServerFn({ data: input });
  } catch (error) {
    if (error instanceof RolePlannerServiceError) throw error;
    throw new RolePlannerServiceError("Potential couldn't analyse that job description.", error);
  }
}

export const rolePlannerService = {
  analyzeRole,
};
