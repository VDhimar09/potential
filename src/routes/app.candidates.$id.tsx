import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { candidateService } from "@/services/candidateService";
import { roleService } from "@/services/roleService";
import { interviewService } from "@/services/interviewService";
import { groupInterviewStatus, INTERVIEW_STATUS_GROUP_LABEL } from "@/lib/interviewStatus";
import { EmptyState } from "@/components/potential/EmptyState";
import { NewInterviewDialog } from "@/components/potential/NewInterviewDialog";

export const Route = createFileRoute("/app/candidates/$id")({
  component: CandidateDetail,
  loader: async ({ context, params }) => {
    const candidate = await candidateService.getCandidate({ candidateId: params.id });
    if (!candidate) throw notFound();
    const [interviews, roles] = await Promise.all([
      interviewService.listInterviewsByCandidate({ candidateId: params.id }),
      roleService.listRoles({ workspaceId: context.workspaceId }),
    ]);
    return { candidate, interviews, roles };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.candidate.firstName} ${loaderData.candidate.lastName} — Potential`
          : "Candidate — Potential",
      },
      { name: "description", content: "A candidate's interviews, gathered in one place." },
    ],
  }),
});

const STATUS_GROUP_DOT: Record<string, string> = {
  draft: "bg-muted-foreground/60",
  in_progress: "bg-secondary glow-pulse",
  completed: "bg-emerald",
};

function CandidateDetail() {
  const { candidate, interviews, roles } = Route.useLoaderData();
  const { workspaceId } = Route.useRouteContext();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60"
      />

      <div className="relative mx-auto max-w-[900px] px-10 pb-32 pt-10">
        <div className="flex items-center justify-between">
          <Link
            to="/app/candidates"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Candidates
          </Link>
          <Link
            to="/app/journey/$id"
            params={{ id: candidate.id }}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline/70 bg-background/60 px-3 py-1.5 text-[12px] text-muted-foreground backdrop-blur transition-colors hover:bg-background hover:text-foreground"
          >
            <RouteIcon className="h-3.5 w-3.5" /> View journey
          </Link>
        </div>

        <div className="mt-8 flex items-end justify-between rise-in">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
              Candidate
            </div>
            <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <div className="mt-3 text-[15px] text-muted-foreground">{candidate.email}</div>
          </div>
          <NewInterviewDialog
            workspaceId={workspaceId}
            roles={roles}
            candidates={[candidate]}
            defaultCandidateId={candidate.id}
            trigger={
              <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90">
                <MessageSquare className="h-3.5 w-3.5" /> New interview
              </button>
            }
          />
        </div>

        <div className="mt-14">
          <div className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Interviews for this candidate
          </div>
          {interviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No interviews yet"
              description="Create an interview to pair this candidate with a role."
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
                        {interview.role.title}
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
