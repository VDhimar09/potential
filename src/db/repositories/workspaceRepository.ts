import { prisma } from "@/db/client";
import type { Workspace } from "@/generated/prisma/client";

/**
 * Minimal on purpose — Sprint 4.2 only needs enough to create a Workspace and
 * look it up as the parent of a WorkspaceMember. Workspace settings, billing,
 * etc. are Phase 2 concerns and don't belong here yet.
 */

async function create(data: { name: string; slug: string }): Promise<Workspace> {
  return prisma.workspace.create({ data });
}

async function findById(id: string): Promise<Workspace | null> {
  return prisma.workspace.findUnique({ where: { id } });
}

async function findBySlug(slug: string): Promise<Workspace | null> {
  return prisma.workspace.findUnique({ where: { slug } });
}

export const workspaceRepository = {
  create,
  findById,
  findBySlug,
};
