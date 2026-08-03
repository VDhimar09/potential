import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { workspaceRepository } from "@/db/repositories/workspaceRepository";
import { workspaceMemberRepository } from "@/db/repositories/workspaceMemberRepository";
import type { Workspace, WorkspaceMember } from "@/generated/prisma/client";

/**
 * Thrown by the service layer whenever a workspace/member operation fails —
 * components only ever need to handle this one type, regardless of what went
 * wrong underneath (validation, a unique-constraint violation, a DB outage).
 */
export class WorkspaceServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "WorkspaceServiceError";
  }
}

/**
 * There's no auth/session layer yet, so every visitor shares one workspace.
 * Idempotent: looks up the fixed "default" slug and creates it on first run.
 * Replace with real workspace resolution once accounts exist.
 */
const DEFAULT_WORKSPACE_SLUG = "default";
const DEFAULT_WORKSPACE_NAME = "Default Workspace";

const getOrCreateDefaultWorkspaceServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Workspace> => {
    try {
      const existing = await workspaceRepository.findBySlug(DEFAULT_WORKSPACE_SLUG);
      if (existing) return existing;
      return await workspaceRepository.create({
        name: DEFAULT_WORKSPACE_NAME,
        slug: DEFAULT_WORKSPACE_SLUG,
      });
    } catch (error) {
      throw new WorkspaceServiceError("Potential couldn't load the default workspace.", error);
    }
  },
);

async function getOrCreateDefaultWorkspace(): Promise<Workspace> {
  try {
    return await getOrCreateDefaultWorkspaceServerFn();
  } catch (error) {
    if (error instanceof WorkspaceServiceError) throw error;
    throw new WorkspaceServiceError("Potential couldn't load the default workspace.", error);
  }
}

const createWorkspaceInputSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place Prisma is reachable from a service, so the DB
 * connection is never shipped to the browser.
 */
const createWorkspaceServerFn = createServerFn({ method: "POST" })
  .validator(createWorkspaceInputSchema)
  .handler(async ({ data }): Promise<Workspace> => {
    try {
      return await workspaceRepository.create(data);
    } catch (error) {
      throw new WorkspaceServiceError("Potential couldn't create that workspace.", error);
    }
  });

/**
 * The only entry point React components should use to create a workspace —
 * never call workspaceRepository directly from UI code.
 */
async function createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
  try {
    return await createWorkspaceServerFn({ data: input });
  } catch (error) {
    if (error instanceof WorkspaceServiceError) throw error;
    throw new WorkspaceServiceError("Potential couldn't create that workspace.", error);
  }
}

const addMemberInputSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "INTERVIEWER"]).optional(),
});

export type AddMemberInput = z.infer<typeof addMemberInputSchema>;

const addMemberServerFn = createServerFn({ method: "POST" })
  .validator(addMemberInputSchema)
  .handler(async ({ data }): Promise<WorkspaceMember> => {
    try {
      return await workspaceMemberRepository.create(data);
    } catch (error) {
      throw new WorkspaceServiceError("Potential couldn't add that workspace member.", error);
    }
  });

/**
 * The only entry point React components should use to add a workspace member —
 * never call workspaceMemberRepository directly from UI code.
 */
async function addMember(input: AddMemberInput): Promise<WorkspaceMember> {
  try {
    return await addMemberServerFn({ data: input });
  } catch (error) {
    if (error instanceof WorkspaceServiceError) throw error;
    throw new WorkspaceServiceError("Potential couldn't add that workspace member.", error);
  }
}

const listMembersInputSchema = z.object({ workspaceId: z.string().min(1) });

export type ListMembersInput = z.infer<typeof listMembersInputSchema>;

const listMembersServerFn = createServerFn({ method: "POST" })
  .validator(listMembersInputSchema)
  .handler(async ({ data }): Promise<WorkspaceMember[]> => {
    try {
      return await workspaceMemberRepository.findByWorkspace(data.workspaceId);
    } catch (error) {
      throw new WorkspaceServiceError("Potential couldn't load workspace members.", error);
    }
  });

async function listMembers(input: ListMembersInput): Promise<WorkspaceMember[]> {
  try {
    return await listMembersServerFn({ data: input });
  } catch (error) {
    if (error instanceof WorkspaceServiceError) throw error;
    throw new WorkspaceServiceError("Potential couldn't load workspace members.", error);
  }
}

export const workspaceService = {
  createWorkspace,
  getOrCreateDefaultWorkspace,
  addMember,
  listMembers,
};
