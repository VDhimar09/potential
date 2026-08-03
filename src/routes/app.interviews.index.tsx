import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { roleService } from "@/services/roleService";
import { candidateService } from "@/services/candidateService";
import { interviewService } from "@/services/interviewService";
import {
  groupInterviewStatus,
  INTERVIEW_STATUS_GROUP_LABEL,
  type InterviewStatusGroup,
} from "@/lib/interviewStatus";
import { EmptyState } from "@/components/potential/EmptyState";
import { NewInterviewDialog } from "@/components/potential/NewInterviewDialog";
import type { InterviewWithRelations } from "@/db/repositories/interviewRepository";

export const Route = createFileRoute("/app/interviews/")({
  component: InterviewsIndex,
  loader: async ({ context }) => {
    const [interviews, roles, candidates] = await Promise.all([
      interviewService.listInterviews({ workspaceId: context.workspaceId }),
      roleService.listRoles({ workspaceId: context.workspaceId }),
      candidateService.listCandidates({ workspaceId: context.workspaceId }),
    ]);
    return { interviews, roles, candidates };
  },
  head: () => ({
    meta: [
      { title: "Interviews — Potential" },
      { name: "description", content: "Every interview this workspace has in motion." },
    ],
  }),
});

const GROUPS: InterviewStatusGroup[] = ["draft", "in_progress", "completed"];

function InterviewsIndex() {
  const { interviews, roles, candidates } = Route.useLoaderData();
  const { workspaceId } = Route.useRouteContext();

  const byGroup: Record<InterviewStatusGroup, InterviewWithRelations[]> = {
    draft: [],
    in_progress: [],
    completed: [],
  };
  for (const interview of interviews) {
    byGroup[groupInterviewStatus(interview.status)].push(interview);
  }

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
              Interviews
            </h1>
          </div>
          <NewInterviewDialog workspaceId={workspaceId} roles={roles} candidates={candidates} />
        </div>

        <div className="mt-12">
          {interviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No interviews yet"
              description="Pair a candidate with a role to schedule your first interview."
              action={
                <NewInterviewDialog
                  workspaceId={workspaceId}
                  roles={roles}
                  candidates={candidates}
                />
              }
            />
          ) : (
            <div className="space-y-12">
              {GROUPS.map((group) => (
                <section key={group}>
                  <div className="mb-5 flex items-baseline gap-2">
                    <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {INTERVIEW_STATUS_GROUP_LABEL[group]}
                    </h2>
                    <span className="text-[12px] text-muted-foreground/70">
                      {byGroup[group].length}
                    </span>
                  </div>
                  {byGroup[group].length === 0 ? (
                    <p className="text-[13px] text-muted-foreground/70">Nothing here.</p>
                  ) : (
                    <div className="space-y-2">
                      {byGroup[group].map((interview) => (
                        <Link
                          key={interview.id}
                          to="/app/interviews/$id"
                          params={{ id: interview.id }}
                          className="group flex items-center gap-4 rounded-2xl border border-hairline/60 bg-background/50 px-5 py-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-medium text-foreground">
                              {interview.candidate.firstName} {interview.candidate.lastName}
                            </div>
                            <div className="text-[12px] text-muted-foreground">
                              {interview.role.title}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
