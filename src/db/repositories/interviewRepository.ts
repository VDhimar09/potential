import { prisma } from "@/db/client";
import type { Interview, InterviewStatus } from "@/generated/prisma/client";

async function create(data: {
  workspaceId: string;
  roleId: string;
  candidateId: string;
  status?: InterviewStatus;
  scheduledAt?: Date;
}): Promise<Interview> {
  return prisma.interview.create({ data });
}

async function findById(id: string): Promise<Interview | null> {
  return prisma.interview.findUnique({ where: { id } });
}

/** Ordered newest-first so a workspace's most recently created interviews list first. */
async function findByWorkspace(workspaceId: string): Promise<Interview[]> {
  return prisma.interview.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
}

async function updateStatus(id: string, status: InterviewStatus): Promise<Interview> {
  return prisma.interview.update({ where: { id }, data: { status } });
}

export const interviewRepository = {
  create,
  findById,
  findByWorkspace,
  updateStatus,
};
