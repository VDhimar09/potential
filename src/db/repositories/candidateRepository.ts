import { prisma } from "@/db/client";
import type { Candidate, CandidateStatus } from "@/generated/prisma/client";

async function create(data: {
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  notes?: string;
  status?: CandidateStatus;
}): Promise<Candidate> {
  return prisma.candidate.create({ data });
}

async function findById(id: string): Promise<Candidate | null> {
  return prisma.candidate.findUnique({ where: { id } });
}

/** Ordered newest-first so a workspace's most recently added candidates list first. */
async function findByWorkspace(workspaceId: string): Promise<Candidate[]> {
  return prisma.candidate.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
}

async function updateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
  return prisma.candidate.update({ where: { id }, data: { status } });
}

export const candidateRepository = {
  create,
  findById,
  findByWorkspace,
  updateStatus,
};
