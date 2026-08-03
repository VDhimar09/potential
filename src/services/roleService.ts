import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { roleRepository } from "@/db/repositories/roleRepository";
import type { Role } from "@/generated/prisma/client";

/**
 * Thrown by the service layer whenever a role operation fails — components
 * only ever need to handle this one type, regardless of what went wrong
 * underneath (validation, a missing workspace, a DB outage).
 */
export class RoleServiceError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = "RoleServiceError";
  }
}

const employmentTypeSchema = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);
const roleStatusSchema = z.enum(["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]);

const createRoleInputSchema = z.object({
  workspaceId: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1).optional(),
  employmentType: employmentTypeSchema.optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleInputSchema>;

/**
 * Runs on the server only (compiled away from the client bundle by TanStack
 * Start): this is the one place Prisma is reachable from a service, so the DB
 * connection is never shipped to the browser.
 */
const createRoleServerFn = createServerFn({ method: "POST" })
  .validator(createRoleInputSchema)
  .handler(async ({ data }): Promise<Role> => {
    try {
      return await roleRepository.create(data);
    } catch (error) {
      throw new RoleServiceError("Potential couldn't create that role.", error);
    }
  });

/**
 * The only entry point React components should use to create a role — never
 * call roleRepository directly from UI code.
 */
async function createRole(input: CreateRoleInput): Promise<Role> {
  try {
    return await createRoleServerFn({ data: input });
  } catch (error) {
    if (error instanceof RoleServiceError) throw error;
    throw new RoleServiceError("Potential couldn't create that role.", error);
  }
}

const listRolesInputSchema = z.object({ workspaceId: z.string().min(1) });

export type ListRolesInput = z.infer<typeof listRolesInputSchema>;

const listRolesServerFn = createServerFn({ method: "POST" })
  .validator(listRolesInputSchema)
  .handler(async ({ data }): Promise<Role[]> => {
    try {
      return await roleRepository.findByWorkspace(data.workspaceId);
    } catch (error) {
      throw new RoleServiceError("Potential couldn't load that workspace's roles.", error);
    }
  });

async function listRoles(input: ListRolesInput): Promise<Role[]> {
  try {
    return await listRolesServerFn({ data: input });
  } catch (error) {
    if (error instanceof RoleServiceError) throw error;
    throw new RoleServiceError("Potential couldn't load that workspace's roles.", error);
  }
}

const getRoleInputSchema = z.object({ roleId: z.string().min(1) });

export type GetRoleInput = z.infer<typeof getRoleInputSchema>;

const getRoleServerFn = createServerFn({ method: "POST" })
  .validator(getRoleInputSchema)
  .handler(async ({ data }): Promise<Role | null> => {
    try {
      return await roleRepository.findById(data.roleId);
    } catch (error) {
      throw new RoleServiceError("Potential couldn't load that role.", error);
    }
  });

async function getRole(input: GetRoleInput): Promise<Role | null> {
  try {
    return await getRoleServerFn({ data: input });
  } catch (error) {
    if (error instanceof RoleServiceError) throw error;
    throw new RoleServiceError("Potential couldn't load that role.", error);
  }
}

const updateRoleStatusInputSchema = z.object({
  roleId: z.string().min(1),
  status: roleStatusSchema,
});

export type UpdateRoleStatusInput = z.infer<typeof updateRoleStatusInputSchema>;

const updateRoleStatusServerFn = createServerFn({ method: "POST" })
  .validator(updateRoleStatusInputSchema)
  .handler(async ({ data }): Promise<Role> => {
    try {
      return await roleRepository.updateStatus(data.roleId, data.status);
    } catch (error) {
      throw new RoleServiceError("Potential couldn't update that role's status.", error);
    }
  });

async function updateRoleStatus(input: UpdateRoleStatusInput): Promise<Role> {
  try {
    return await updateRoleStatusServerFn({ data: input });
  } catch (error) {
    if (error instanceof RoleServiceError) throw error;
    throw new RoleServiceError("Potential couldn't update that role's status.", error);
  }
}

export const roleService = {
  createRole,
  listRoles,
  getRole,
  updateRoleStatus,
};
