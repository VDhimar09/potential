import { useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, FileText, Play } from "lucide-react";
import { interviewService } from "@/services/interviewService";
import { groupInterviewStatus, INTERVIEW_STATUS_GROUP_LABEL } from "@/lib/interviewStatus";

export const Route = createFileRoute("/app/interviews/$id")({
  component: InterviewDetail,
  loader: async ({ params }) => {
    const interview = await interviewService.getInterview({ interviewId: params.id });
    if (!interview) throw notFound();
    return { interview };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.interview.candidate.firstName} ${loaderData.interview.candidate.lastName} · ${loaderData.interview.role.title} — Potential`
          : "Interview — Potential",
      },
      { name: "description", content: "One interview's status, participants, and evidence." },
    ],
  }),
});

function formatTimestamp(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function InterviewDetail() {
  const { interview } = Route.useLoaderData();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const group = groupInterviewStatus(interview.status);
  const isComplete = group === "completed";

  async function handleStartOrContinue() {
    if (group === "draft") {
      setIsUpdating(true);
      try {
        await interviewService.updateInterviewStatus({
          interviewId: interview.id,
          status: "IN_PROGRESS",
        });
        await router.invalidate();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Potential couldn't update that interview.",
        );
        setIsUpdating(false);
        return;
      }
      setIsUpdating(false);
    }
    router.navigate({ to: "/app/interviews/console" });
  }

  async function handleMarkComplete() {
    setIsUpdating(true);
    try {
      await interviewService.updateInterviewStatus({
        interviewId: interview.id,
        status: "COMPLETED",
      });
      await router.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Potential couldn't update that interview.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60"
      />

      <div className="relative mx-auto max-w-[860px] px-10 pb-32 pt-10">
        <Link
          to="/app/interviews"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Interviews
        </Link>

        <div className="mt-8 rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            {INTERVIEW_STATUS_GROUP_LABEL[group]}
          </div>
          <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
            {interview.candidate.firstName} {interview.candidate.lastName}
          </h1>
          <div className="mt-3 text-[15px] text-muted-foreground">{interview.role.title}</div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <DetailStat label="Scheduled" value={formatTimestamp(interview.scheduledAt)} />
          <DetailStat label="Started" value={formatTimestamp(interview.startedAt)} />
          <DetailStat label="Completed" value={formatTimestamp(interview.completedAt)} />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          {!isComplete && (
            <button
              onClick={handleStartOrContinue}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />{" "}
              {group === "draft" ? "Start interview" : "Continue in console"}
            </button>
          )}

          {!isComplete && (
            <button
              onClick={handleMarkComplete}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline/70 bg-background/60 px-4 py-2 text-[13px] text-foreground backdrop-blur transition-colors hover:bg-background disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" /> Mark interview complete
            </button>
          )}

          {isComplete ? (
            <Link
              to="/app/reports/$id/evidence"
              params={{ id: interview.id }}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              <FileText className="h-3.5 w-3.5" /> View evidence report
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline/50 px-4 py-2 text-[13px] text-muted-foreground/70">
              <FileText className="h-3.5 w-3.5" /> Evidence report available once complete
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline/60 bg-background/50 p-5 backdrop-blur-xl">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-foreground">{value}</div>
    </div>
  );
}
