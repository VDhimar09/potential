import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { candidateRepository } from "@/db/repositories/candidateRepository";
import type { Candidate } from "@/generated/prisma/client";

/**
 * Thrown by the service layer whenever a candidate operation fails —
 * components only ever need to handle this one type, regardless of what went
 * wrong underneath (validation, a missing workspace, a DB outage).
 */
export class CandidateServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "CandidateServiceError";
  }
}

const candidateStatusSchema = z.enum([
  "NEW",
  "SCREENING",
  "INTERVIEWING",
  "OFFERED",
  "HIRED",
  "WITHDRAWN",
  "REJECTED",
]);

const createCandidateInputSchema = z.object({
  workspaceId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  linkedinUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
  notes: z.string().min(1).optional(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place Prisma is reachable from a service, so the DB
 * connection is never shipped to the browser.
 */
const createCandidateServerFn = createServerFn({ method: "POST" })
  .validator(createCandidateInputSchema)
  .handler(async ({ data }): Promise<Candidate> => {
    try {
      return await candidateRepository.create(data);
    } catch (error) {
      throw new CandidateServiceError("Potential couldn't create that candidate.", error);
    }
  });

/**
 * The only entry point React components should use to create a candidate —
 * never call candidateRepository directly from UI code.
 */
async function createCandidate(input: CreateCandidateInput): Promise<Candidate> {
  try {
    return await createCandidateServerFn({ data: input });
  } catch (error) {
    if (error instanceof CandidateServiceError) throw error;
    throw new CandidateServiceError("Potential couldn't create that candidate.", error);
  }
}

const listCandidatesInputSchema = z.object({ workspaceId: z.string().min(1) });

export type ListCandidatesInput = z.infer<typeof listCandidatesInputSchema>;

const listCandidatesServerFn = createServerFn({ method: "POST" })
  .validator(listCandidatesInputSchema)
  .handler(async ({ data }): Promise<Candidate[]> => {
    try {
      return await candidateRepository.findByWorkspace(data.workspaceId);
    } catch (error) {
      throw new CandidateServiceError(
        "Potential couldn't load that workspace's candidates.",
        error,
      );
    }
  });

async function listCandidates(input: ListCandidatesInput): Promise<Candidate[]> {
  try {
    return await listCandidatesServerFn({ data: input });
  } catch (error) {
    if (error instanceof CandidateServiceError) throw error;
    throw new CandidateServiceError("Potential couldn't load that workspace's candidates.", error);
  }
}

const getCandidateInputSchema = z.object({ candidateId: z.string().min(1) });

export type GetCandidateInput = z.infer<typeof getCandidateInputSchema>;

const getCandidateServerFn = createServerFn({ method: "POST" })
  .validator(getCandidateInputSchema)
  .handler(async ({ data }): Promise<Candidate | null> => {
    try {
      return await candidateRepository.findById(data.candidateId);
    } catch (error) {
      throw new CandidateServiceError("Potential couldn't load that candidate.", error);
    }
  });

async function getCandidate(input: GetCandidateInput): Promise<Candidate | null> {
  try {
    return await getCandidateServerFn({ data: input });
  } catch (error) {
    if (error instanceof CandidateServiceError) throw error;
    throw new CandidateServiceError("Potential couldn't load that candidate.", error);
  }
}

const updateCandidateStatusInputSchema = z.object({
  candidateId: z.string().min(1),
  status: candidateStatusSchema,
});

export type UpdateCandidateStatusInput = z.infer<typeof updateCandidateStatusInputSchema>;

const updateCandidateStatusServerFn = createServerFn({ method: "POST" })
  .validator(updateCandidateStatusInputSchema)
  .handler(async ({ data }): Promise<Candidate> => {
    try {
      return await candidateRepository.updateStatus(data.candidateId, data.status);
    } catch (error) {
      throw new CandidateServiceError("Potential couldn't update that candidate's status.", error);
    }
  });

async function updateCandidateStatus(input: UpdateCandidateStatusInput): Promise<Candidate> {
  try {
    return await updateCandidateStatusServerFn({ data: input });
  } catch (error) {
    if (error instanceof CandidateServiceError) throw error;
    throw new CandidateServiceError("Potential couldn't update that candidate's status.", error);
  }
}

export const candidateService = {
  createCandidate,
  listCandidates,
  getCandidate,
  updateCandidateStatus,
};
