import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { DASHBOARD_REPORT_SUMMARIES } from "@/lib/mock/reports";
import { EmptyState } from "@/components/potential/EmptyState";

export const Route = createFileRoute("/app/reports/")({
  component: ReportsIndex,
  head: () => ({
    meta: [
      { title: "Evidence Reports — Potential" },
      {
        name: "description",
        content: "Evidence-based reports. No scores. No rankings. Humans decide.",
      },
    ],
  }),
});

function ReportsIndex() {
  const reports = DASHBOARD_REPORT_SUMMARIES;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60"
      />

      <div className="relative mx-auto max-w-[1000px] px-10 pb-32 pt-10">
        <div className="rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            Workspace
          </div>
          <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
            Evidence Reports
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Every report exists to help a human decide — never to score, rank, or recommend.
          </p>
        </div>

        <div className="mt-12">
          {reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No evidence reports yet"
              description="Reports appear here once an interview has been completed and its evidence reviewed."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {reports.map((report, i) => (
                <Link
                  key={`${report.id}-${i}`}
                  to="/app/reports/$id/evidence"
                  params={{ id: report.id }}
                  className="group rounded-2xl border border-hairline/60 bg-background/50 p-6 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-hairline hover:shadow-soft"
                >
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                    <FileText className="h-3 w-3" /> Evidence report
                  </div>
                  <div className="mt-3 font-display text-[22px] leading-tight text-foreground">
                    {report.name}{" "}
                    <span className="font-normal text-muted-foreground">· {report.role}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {report.summary}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
