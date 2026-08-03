import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Plus } from "lucide-react";
import { roleService } from "@/services/roleService";
import { EmptyState } from "@/components/potential/EmptyState";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/roles/")({
  component: RolesIndex,
  loader: async ({ context }) => {
    const roles = await roleService.listRoles({ workspaceId: context.workspaceId });
    return { roles };
  },
  head: () => ({
    meta: [
      { title: "Roles — Potential" },
      { name: "description", content: "Every role this workspace is hiring for." },
    ],
  }),
});

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

function RolesIndex() {
  const { roles } = Route.useLoaderData();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60"
      />

      <div className="relative mx-auto max-w-[1000px] px-10 pb-32 pt-10">
        <div className="flex items-end justify-between rise-in">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
              Workspace
            </div>
            <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
              Roles
            </h1>
          </div>
          <Button asChild className="gap-1.5">
            <Link to="/app/roles/new">
              <Plus className="h-3.5 w-3.5" /> New role
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          {roles.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No roles yet"
              description="Create a role to start designing an interview plan grounded in evidence."
              action={
                <Button asChild className="gap-1.5">
                  <Link to="/app/roles/new">
                    <Plus className="h-3.5 w-3.5" /> New role
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map((role) => (
                <Link
                  key={role.id}
                  to="/app/roles/$id"
                  params={{ id: role.id }}
                  className="group rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                >
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                    <Briefcase className="h-3 w-3" /> {STATUS_LABEL[role.status] ?? role.status}
                  </div>
                  <div className="mt-3 font-display text-[22px] leading-tight text-foreground">
                    {role.title}
                  </div>
                  {role.department && (
                    <div className="mt-2 text-[12px] text-muted-foreground">{role.department}</div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
