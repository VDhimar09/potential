import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  interviewRepository,
  type InterviewWithRelations,
} from "@/db/repositories/interviewRepository";
import type { Interview } from "@/generated/prisma/client";

/**
 * Thrown by the service layer whenever an interview operation fails —
 * components only ever need to handle this one type, regardless of what went
 * wrong underneath (validation, a missing role/candidate, a DB outage).
 */
export class InterviewServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "InterviewServiceError";
  }
}

const interviewStatusSchema = z.enum([
  "DRAFT",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "REVIEWED",
  "ARCHIVED",
]);

const createInterviewInputSchema = z.object({
  workspaceId: z.string().min(1),
  roleId: z.string().min(1),
  candidateId: z.string().min(1),
  scheduledAt: z.coerce.date().optional(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place Prisma is reachable from a service, so the DB
 * connection is never shipped to the browser.
 */
const createInterviewServerFn = createServerFn({ method: "POST" })
  .validator(createInterviewInputSchema)
  .handler(async ({ data }): Promise<Interview> => {
    try {
      return await interviewRepository.create(data);
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't create that interview.", error);
    }
  });

/**
 * The only entry point React components should use to create an interview —
 * never call interviewRepository directly from UI code.
 */
async function createInterview(input: CreateInterviewInput): Promise<Interview> {
  try {
    return await createInterviewServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't create that interview.", error);
  }
}

const listInterviewsInputSchema = z.object({ workspaceId: z.string().min(1) });

export type ListInterviewsInput = z.infer<typeof listInterviewsInputSchema>;

const listInterviewsServerFn = createServerFn({ method: "POST" })
  .validator(listInterviewsInputSchema)
  .handler(async ({ data }): Promise<InterviewWithRelations[]> => {
    try {
      return await interviewRepository.findByWorkspace(data.workspaceId);
    } catch (error) {
      throw new InterviewServiceError(
        "Potential couldn't load that workspace's interviews.",
        error,
      );
    }
  });

async function listInterviews(input: ListInterviewsInput): Promise<InterviewWithRelations[]> {
  try {
    return await listInterviewsServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't load that workspace's interviews.", error);
  }
}

const listInterviewsByRoleInputSchema = z.object({ roleId: z.string().min(1) });

export type ListInterviewsByRoleInput = z.infer<typeof listInterviewsByRoleInputSchema>;

const listInterviewsByRoleServerFn = createServerFn({ method: "POST" })
  .validator(listInterviewsByRoleInputSchema)
  .handler(async ({ data }): Promise<InterviewWithRelations[]> => {
    try {
      return await interviewRepository.findByRole(data.roleId);
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't load that role's interviews.", error);
    }
  });

async function listInterviewsByRole(
  input: ListInterviewsByRoleInput,
): Promise<InterviewWithRelations[]> {
  try {
    return await listInterviewsByRoleServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't load that role's interviews.", error);
  }
}

const listInterviewsByCandidateInputSchema = z.object({ candidateId: z.string().min(1) });

export type ListInterviewsByCandidateInput = z.infer<typeof listInterviewsByCandidateInputSchema>;

const listInterviewsByCandidateServerFn = createServerFn({ method: "POST" })
  .validator(listInterviewsByCandidateInputSchema)
  .handler(async ({ data }): Promise<InterviewWithRelations[]> => {
    try {
      return await interviewRepository.findByCandidate(data.candidateId);
    } catch (error) {
      throw new InterviewServiceError(
        "Potential couldn't load that candidate's interviews.",
        error,
      );
    }
  });

async function listInterviewsByCandidate(
  input: ListInterviewsByCandidateInput,
): Promise<InterviewWithRelations[]> {
  try {
    return await listInterviewsByCandidateServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't load that candidate's interviews.", error);
  }
}

const getInterviewInputSchema = z.object({ interviewId: z.string().min(1) });

export type GetInterviewInput = z.infer<typeof getInterviewInputSchema>;

const getInterviewServerFn = createServerFn({ method: "POST" })
  .validator(getInterviewInputSchema)
  .handler(async ({ data }): Promise<InterviewWithRelations | null> => {
    try {
      return await interviewRepository.findById(data.interviewId);
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't load that interview.", error);
    }
  });

async function getInterview(input: GetInterviewInput): Promise<InterviewWithRelations | null> {
  try {
    return await getInterviewServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't load that interview.", error);
  }
}

const updateInterviewStatusInputSchema = z.object({
  interviewId: z.string().min(1),
  status: interviewStatusSchema,
});

export type UpdateInterviewStatusInput = z.infer<typeof updateInterviewStatusInputSchema>;

const updateInterviewStatusServerFn = createServerFn({ method: "POST" })
  .validator(updateInterviewStatusInputSchema)
  .handler(async ({ data }): Promise<Interview> => {
    try {
      return await interviewRepository.updateStatus(data.interviewId, data.status);
    } catch (error) {
      throw new InterviewServiceError("Potential couldn't update that interview's status.", error);
    }
  });

async function updateInterviewStatus(input: UpdateInterviewStatusInput): Promise<Interview> {
  try {
    return await updateInterviewStatusServerFn({ data: input });
  } catch (error) {
    if (error instanceof InterviewServiceError) throw error;
    throw new InterviewServiceError("Potential couldn't update that interview's status.", error);
  }
}

export const interviewService = {
  createInterview,
  listInterviews,
  listInterviewsByRole,
  listInterviewsByCandidate,
  getInterview,
  updateInterviewStatus,
};
