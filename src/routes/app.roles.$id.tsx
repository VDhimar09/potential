import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { roleService } from "@/services/roleService";
import { candidateService } from "@/services/candidateService";
import { interviewService } from "@/services/interviewService";
import { groupInterviewStatus, INTERVIEW_STATUS_GROUP_LABEL } from "@/lib/interviewStatus";
import { EmptyState } from "@/components/potential/EmptyState";
import { NewInterviewDialog } from "@/components/potential/NewInterviewDialog";

export const Route = createFileRoute("/app/roles/$id")({
  component: RoleDetail,
  loader: async ({ context, params }) => {
    const role = await roleService.getRole({ roleId: params.id });
    if (!role) throw notFound();
    const [interviews, candidates] = await Promise.all([
      interviewService.listInterviewsByRole({ roleId: params.id }),
      candidateService.listCandidates({ workspaceId: context.workspaceId }),
    ]);
    return { role, interviews, candidates };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.role.title} — Potential` : "Role — Potential" },
      { name: "description", content: "A role's interviews, gathered in one place." },
    ],
  }),
});

const STATUS_GROUP_DOT: Record<string, string> = {
  draft: "bg-muted-foreground/60",
  in_progress: "bg-secondary glow-pulse",
  completed: "bg-emerald",
};

function RoleDetail() {
  const { role, interviews, candidates } = Route.useLoaderData();
  const { workspaceId } = Route.useRouteContext();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60"
      />

      <div className="relative mx-auto max-w-[900px] px-10 pb-32 pt-10">
        <Link
          to="/app/roles"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Roles
        </Link>

        <div className="mt-8 flex items-end justify-between rise-in">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
              {role.department ?? "Role"}
            </div>
            <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
              {role.title}
            </h1>
          </div>
          <NewInterviewDialog
            workspaceId={workspaceId}
            roles={[role]}
            candidates={candidates}
            defaultRoleId={role.id}
            trigger={
              <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90">
                <MessageSquare className="h-3.5 w-3.5" /> New interview
              </button>
            }
          />
        </div>

        <div className="mt-14">
          <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Interviews for this role
          </div>
          {interviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No interviews yet"
              description="Create an interview to pair a candidate with this role."
            />
          ) : (
            <div className="space-y-2">
              {interviews.map((interview) => {
                const group = groupInterviewStatus(interview.status);
                return (
                  <Link
                    key={interview.id}
                    to="/app/interviews/$id"
                    params={{ id: interview.id }}
                    className="group flex items-center gap-4 rounded-2xl border border-hairline/60 bg-background/50 px-5 py-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                  >
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_GROUP_DOT[group])}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-medium text-foreground">
                        {interview.candidate.firstName} {interview.candidate.lastName}
                      </div>
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {INTERVIEW_STATUS_GROUP_LABEL[group]}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
