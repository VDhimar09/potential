import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { candidateService } from "@/services/candidateService";
import { EmptyState } from "@/components/potential/EmptyState";
import { NewCandidateDialog } from "@/components/potential/NewCandidateDialog";

export const Route = createFileRoute("/app/candidates/")({
  component: CandidatesIndex,
  loader: async ({ context }) => {
    const candidates = await candidateService.listCandidates({ workspaceId: context.workspaceId });
    return { candidates };
  },
  head: () => ({
    meta: [
      { title: "Candidates — Potential" },
      { name: "description", content: "Every candidate this workspace is considering." },
    ],
  }),
});

function CandidatesIndex() {
  const { candidates } = Route.useLoaderData();
  const { workspaceId } = Route.useRouteContext();

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
              Candidates
            </h1>
          </div>
          <NewCandidateDialog workspaceId={workspaceId} />
        </div>

        <div className="mt-12">
          {candidates.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No candidates yet"
              description="Add a candidate to start scheduling interviews with them."
              action={<NewCandidateDialog workspaceId={workspaceId} />}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {candidates.map((candidate) => (
                <Link
                  key={candidate.id}
                  to="/app/candidates/$id"
                  params={{ id: candidate.id }}
                  className="group rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                >
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                    <Users className="h-3 w-3" /> Candidate
                  </div>
                  <div className="mt-3 font-display text-[22px] leading-tight text-foreground">
                    {candidate.firstName} {candidate.lastName}
                  </div>
                  <div className="mt-2 text-[12px] text-muted-foreground">{candidate.email}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
