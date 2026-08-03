import { prisma } from "@/db/client";
import type { Interview, InterviewStatus, Prisma } from "@/generated/prisma/client";

/**
 * Every interview view in the UI needs to show who and what it's for, so
 * role + candidate are always joined in — there's no query path that lists
 * or looks up an interview without them.
 */
const withRoleAndCandidate = {
  role: true,
  candidate: true,
} satisfies Prisma.InterviewInclude;

export type InterviewWithRelations = Prisma.InterviewGetPayload<{
  include: typeof withRoleAndCandidate;
}>;

async function create(data: {
  workspaceId: string;
  roleId: string;
  candidateId: string;
  status?: InterviewStatus;
  scheduledAt?: Date;
}): Promise<Interview> {
  return prisma.interview.create({ data });
}

async function findById(id: string): Promise<InterviewWithRelations | null> {
  return prisma.interview.findUnique({ where: { id }, include: withRoleAndCandidate });
}

/** Ordered newest-first so a workspace's most recently created interviews list first. */
async function findByWorkspace(workspaceId: string): Promise<InterviewWithRelations[]> {
  return prisma.interview.findMany({
    where: { workspaceId },
    include: withRoleAndCandidate,
    orderBy: { createdAt: "desc" },
  });
}

/** Ordered newest-first so a role's most recently created interviews list first. */
async function findByRole(roleId: string): Promise<InterviewWithRelations[]> {
  return prisma.interview.findMany({
    where: { roleId },
    include: withRoleAndCandidate,
    orderBy: { createdAt: "desc" },
  });
}

/** Ordered newest-first so a candidate's most recently created interviews list first. */
async function findByCandidate(candidateId: string): Promise<InterviewWithRelations[]> {
  return prisma.interview.findMany({
    where: { candidateId },
    include: withRoleAndCandidate,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Stamps startedAt/completedAt alongside the status transition they
 * represent — the schema models them as distinct columns specifically so
 * the interview timeline can be shown without re-deriving it from status
 * history.
 */
async function updateStatus(id: string, status: InterviewStatus): Promise<Interview> {
  const data: Prisma.InterviewUpdateInput = { status };
  if (status === "IN_PROGRESS") {
    data.startedAt = new Date();
  } else if (status === "COMPLETED" || status === "REVIEWED" || status === "ARCHIVED") {
    data.completedAt = new Date();
  }
  return prisma.interview.update({ where: { id }, data });
}

export const interviewRepository = {
  create,
  findById,
  findByWorkspace,
  findByRole,
  findByCandidate,
  updateStatus,
};
