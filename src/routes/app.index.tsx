import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Play,
  Sparkles,
  FileText,
  Briefcase,
  Users,
  Plus,
  Command,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { roleService } from "@/services/roleService";
import { candidateService } from "@/services/candidateService";
import { interviewService } from "@/services/interviewService";
import { groupInterviewStatus, INTERVIEW_STATUS_GROUP_LABEL } from "@/lib/interviewStatus";
import { DASHBOARD_REPORT_SUMMARIES } from "@/lib/mock/reports";
import { EmptyState } from "@/components/potential/EmptyState";

export const Route = createFileRoute("/app/")({
  component: HomeWorkspace,
  loader: async ({ context }) => {
    const [roles, candidates, interviews] = await Promise.all([
      roleService.listRoles({ workspaceId: context.workspaceId }),
      candidateService.listCandidates({ workspaceId: context.workspaceId }),
      interviewService.listInterviews({ workspaceId: context.workspaceId }),
    ]);
    return {
      recentRoles: roles.slice(0, 4),
      recentCandidates: candidates.slice(0, 5),
      recentInterviews: interviews.slice(0, 5),
      inProgressInterview: interviews.find((i) => groupInterviewStatus(i.status) === "in_progress"),
    };
  },
  head: () => ({
    meta: [
      { title: "Home — Potential" },
      {
        name: "description",
        content: "A calm workspace for hiring decisions grounded in evidence.",
      },
    ],
  }),
});

const STATUS_GROUP_DOT: Record<string, string> = {
  draft: "bg-muted-foreground/60",
  in_progress: "bg-secondary glow-pulse",
  completed: "bg-emerald",
};

function HomeWorkspace() {
  const { recentRoles, recentCandidates, recentInterviews, inProgressInterview } =
    Route.useLoaderData();
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 5
      ? "Still up"
      : hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening";

  return (
    <div className="relative">
      {/* Ambient aurora backdrop + lavender-to-white hero wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-aurora opacity-35 aurora-drift"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-aurora-soft opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-wash"
      />

      <div className="relative mx-auto max-w-[1200px] px-10 pb-32 pt-16">
        {/* Greeting */}
        <div className="rise-in">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
            <span className="h-px w-6 bg-hairline" />
            Workspace
          </div>
          <h1 className="mt-5 font-display text-[60px] font-normal leading-[1.02] tracking-[-0.02em] text-foreground md:text-[80px]">
            {greeting}.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Potential is gathering evidence, not judgements — you decide when there's enough to
            understand each person fairly.
          </p>
        </div>

        {/* Continue interview — hero glass card */}
        {inProgressInterview ? (
          <Link
            to="/app/interviews/$id"
            params={{ id: inProgressInterview.id }}
            className="group relative mt-14 block overflow-hidden rounded-[22px] border border-hairline/70 bg-card shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_2px_4px_-2px_rgb(30_30_60/0.04),0_20px_50px_-24px_rgb(60_50_120/0.18)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_4px_10px_-4px_rgb(30_30_60/0.06),0_28px_60px_-24px_rgb(60_50_120/0.28)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-aurora opacity-45 aurora-drift"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card/70 via-card/40 to-card/70 backdrop-blur-2xl"
            />

            <div className="relative flex items-start justify-between gap-6 p-10">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-rose">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose glow-pulse opacity-90" />
                  </span>
                  In progress
                </div>
                <div className="mt-4 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-5xl">
                  Continue with{" "}
                  <span className="text-gradient">
                    {inProgressInterview.candidate.firstName}{" "}
                    {inProgressInterview.candidate.lastName}
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {inProgressInterview.role.title}
                </p>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-card text-brand shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_2px_6px_-1px_rgb(80_70_160/0.14),0_14px_32px_-10px_rgb(80_70_160/0.28)] ring-1 ring-hairline/70 transition-all duration-200 ease-out group-hover:scale-105 group-hover:shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_4px_10px_-1px_rgb(80_70_160/0.18),0_20px_44px_-12px_rgb(80_70_160/0.36)]">
                <Play className="h-5 w-5 translate-x-[1px] fill-current" />
              </div>
            </div>

            <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline/60 bg-card/50 px-10 py-5 text-[13px] backdrop-blur-xl">
              <span className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
                Enter workspace <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="relative mt-14 overflow-hidden rounded-[22px] border border-dashed border-hairline/70 bg-card/50 p-10 backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              Nothing in progress
            </div>
            <div className="mt-4 font-display text-3xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-4xl">
              No interview is currently underway.
            </div>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
              Create a role and a candidate, then schedule an interview to get started.
            </p>
            <Link
              to="/app/interviews"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Go to interviews
            </Link>
          </div>
        )}

        {/* Ask Potential — AI command bar */}
        <div className="group relative mt-8 ai-glow-hover">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-brand/40 via-violet/40 to-sky/40 opacity-60 blur-[6px] transition-opacity group-focus-within:opacity-90"
          />
          <div className="relative flex items-center gap-3 rounded-2xl border border-hairline/70 bg-card px-4 py-3.5 shadow-[0_1px_0_0_rgb(255_255_255/0.08)_inset,0_1px_2px_-1px_rgb(30_30_60/0.04),0_8px_24px_-14px_rgb(30_30_60/0.08)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg btn-primary-gradient">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <input
              type="text"
              placeholder="Ask Potential — “what evidence am I still missing for Alex?”"
              className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/80"
            />
            <span className="mono-label text-muted-foreground/70">Ai</span>
            <kbd className="flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>
        </div>

        {/* Two column layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column */}
          <div className="space-y-14">
            <Section
              title="Recent interviews"
              action={
                <Link
                  to="/app/interviews"
                  className="text-[12px] text-muted-foreground hover:text-foreground"
                >
                  All →
                </Link>
              }
            >
              {recentInterviews.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No interviews yet"
                  description="Interviews you schedule will show up here, grouped by draft, in progress, and completed."
                />
              ) : (
                <div className="space-y-2">
                  {recentInterviews.map((interview) => {
                    const group = groupInterviewStatus(interview.status);
                    return (
                      <Link
                        key={interview.id}
                        to="/app/interviews/$id"
                        params={{ id: interview.id }}
                        className="group flex items-center gap-4 rounded-2xl border border-hairline/60 bg-background/50 px-5 py-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:bg-background/80 hover:shadow-soft"
                      >
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.05] text-[13px] font-medium text-foreground">
                          {interview.candidate.firstName[0]}
                          {interview.candidate.lastName[0]}
                          <span
                            className={cn(
                              "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                              STATUS_GROUP_DOT[group],
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <div className="text-[15px] font-medium text-foreground">
                              {interview.candidate.firstName} {interview.candidate.lastName}
                            </div>
                            <div className="text-[12px] text-muted-foreground">
                              · {interview.role.title}
                            </div>
                          </div>
                        </div>
                        <div className="hidden text-right sm:block">
                          <div className="text-[12px] text-foreground">
                            {INTERVIEW_STATUS_GROUP_LABEL[group]}
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </Section>

            <Section
              title="Recent roles"
              action={
                <Link
                  to="/app/roles/new"
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-background/60 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur transition-colors hover:border-hairline hover:bg-background hover:text-foreground"
                >
                  <Plus className="h-3 w-3" /> New role
                </Link>
              }
            >
              {recentRoles.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No roles yet"
                  description="Create a role to start designing an interview plan grounded in evidence."
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {recentRoles.map((role) => (
                    <Link
                      key={role.id}
                      to="/app/roles/$id"
                      params={{ id: role.id }}
                      className="group cursor-pointer rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                        <Briefcase className="h-3 w-3" /> Role
                      </div>
                      <div className="mt-3 font-display text-[22px] leading-tight text-foreground">
                        {role.title}
                      </div>
                      {role.department && (
                        <div className="mt-3 text-[12px] text-muted-foreground">
                          {role.department}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-14">
            <Section
              title="Evidence reports"
              action={
                <Link
                  to="/app/reports"
                  className="text-[12px] text-muted-foreground hover:text-foreground"
                >
                  All →
                </Link>
              }
            >
              <div className="space-y-3">
                {DASHBOARD_REPORT_SUMMARIES.map((r, i) => (
                  <Link
                    key={`${r.id}-${i}`}
                    to="/app/reports/$id/evidence"
                    params={{ id: r.id }}
                    className="group block rounded-2xl border border-hairline/60 bg-background/50 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                      <FileText className="h-3 w-3" /> Evidence report
                    </div>
                    <div className="mt-2 text-[15px] font-medium text-foreground">
                      {r.name} <span className="font-normal text-muted-foreground">· {r.role}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      {r.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            <Section
              title="Recent candidates"
              action={
                <Link
                  to="/app/candidates"
                  className="text-[12px] text-muted-foreground hover:text-foreground"
                >
                  All →
                </Link>
              }
            >
              {recentCandidates.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No candidates yet"
                  description="Add a candidate to start scheduling interviews with them."
                />
              ) : (
                <div className="space-y-2">
                  {recentCandidates.map((candidate) => (
                    <Link
                      key={candidate.id}
                      to="/app/candidates/$id"
                      params={{ id: candidate.id }}
                      className="group flex items-center gap-3 rounded-2xl border border-hairline/60 bg-background/50 px-5 py-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-foreground">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-[12px] text-muted-foreground">{candidate.email}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              )}
            </Section>

            <div className="rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                Principle
              </div>
              <p className="mt-3 font-display text-[24px] leading-[1.2] text-foreground">
                Have we collected enough trustworthy evidence to fairly understand this candidate?
              </p>
              <p className="mt-3 text-[12px] text-muted-foreground">
                Potential never scores. You decide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
