import { prisma } from "@/db/client";
import type { WorkspaceMember, WorkspaceMemberRole } from "@/generated/prisma/client";

async function create(data: {
  workspaceId: string;
  name: string;
  email: string;
  role?: WorkspaceMemberRole;
}): Promise<WorkspaceMember> {
  return prisma.workspaceMember.create({ data });
}

async function findById(id: string): Promise<WorkspaceMember | null> {
  return prisma.workspaceMember.findUnique({ where: { id } });
}

async function findByWorkspaceAndEmail(
  workspaceId: string,
  email: string,
): Promise<WorkspaceMember | null> {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_email: { workspaceId, email } },
  });
}

/** Ordered oldest-first so the workspace's earliest members (its founders) list first. */
async function findByWorkspace(workspaceId: string): Promise<WorkspaceMember[]> {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });
}

export const workspaceMemberRepository = {
  create,
  findById,
  findByWorkspaceAndEmail,
  findByWorkspace,
};
