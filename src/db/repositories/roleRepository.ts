import { prisma } from "@/db/client";
import type { EmploymentType, Role, RoleStatus } from "@/generated/prisma/client";

async function create(data: {
  workspaceId: string;
  title: string;
  department?: string;
  employmentType?: EmploymentType;
  status?: RoleStatus;
}): Promise<Role> {
  return prisma.role.create({ data });
}

async function findById(id: string): Promise<Role | null> {
  return prisma.role.findUnique({ where: { id } });
}

/** Ordered newest-first so a workspace's most recently opened roles list first. */
async function findByWorkspace(workspaceId: string): Promise<Role[]> {
  return prisma.role.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
}

async function updateStatus(id: string, status: RoleStatus): Promise<Role> {
  return prisma.role.update({ where: { id }, data: { status } });
}

export const roleRepository = {
  create,
  findById,
  findByWorkspace,
  updateStatus,
};
