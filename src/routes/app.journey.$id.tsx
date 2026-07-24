import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Sparkles, Check, Circle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyItem } from "@/domain";
import { ALEX_MORGAN } from "@/lib/mock/candidates";
import { JOURNEY } from "@/lib/mock/journey";

export const Route = createFileRoute("/app/journey/$id")({
  component: CandidateJourney,
  head: ({ params }) => ({
    meta: [
      { title: `Journey · ${params.id} — Potential` },
      { name: "description", content: "The full journey of a candidate through Potential." },
    ],
  }),
});

function CandidateJourney() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60" />

      <div className="relative mx-auto max-w-[860px] px-8 pb-32 pt-10">
        <div className="flex items-center justify-between">
          <Link to="/app" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Workspace
          </Link>
          <Link
            to="/app/reports/$id"
            params={{ id: ALEX_MORGAN.id }}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText className="h-3.5 w-3.5" /> View evidence report
          </Link>
        </div>

        <header className="mt-10 rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Candidate journey</div>
          <h1 className="mt-3 font-display text-[52px] leading-[1.05] tracking-tight text-foreground md:text-[64px]">
            {ALEX_MORGAN.name}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Every conversation, every piece of evidence, and every decision Potential made — in the order it happened. Nothing hidden.
          </p>
        </header>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-4 text-[12px] text-muted-foreground">
          <Legend color="bg-muted-foreground/60" label="Conversation" />
          <Legend color="bg-emerald" label="Evidence captured" />
          <Legend color="bg-secondary" label="AI reasoning" />
          <Legend color="bg-foreground" label="Milestone" />
          <Legend color="bg-amber-500" label="Competency in focus" />
        </div>

        {/* Timeline */}
        <ol className="relative mt-10 border-l border-hairline/70 pl-8">
          {JOURNEY.map((item, i) => (
            <li key={i} className="relative rise-in pb-8" style={{ animationDelay: `${i * 40}ms` }}>
              <TimelineDot kind={item.kind} />
              <div className="text-[10px] font-medium tabular-nums text-muted-foreground/70">{item.t}</div>
              <JourneyCard item={item} />
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-hairline/70 bg-background/60 p-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Explainable AI</div>
          <p className="mt-2 font-display text-[22px] leading-tight text-foreground">
            Every follow-up Potential suggested is here — with the reason behind it.
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            The AI never coached, never suggested answers, never scored. It only decided what it still needed to understand.
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineDot({ kind }: { kind: JourneyItem["kind"] }) {
  const map = {
    conversation: "bg-muted-foreground/60",
    evidence: "bg-emerald",
    reasoning: "bg-secondary",
    milestone: "bg-foreground",
    competency: "bg-amber-500",
  } as const;
  return (
    <span
      className={cn(
        "absolute -left-[35px] top-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-background",
        map[kind],
      )}
    />
  );
}

function JourneyCard({ item }: { item: JourneyItem }) {
  switch (item.kind) {
    case "conversation":
      return (
        <div className="mt-1">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">{item.who}</div>
          <p className={cn(
            "mt-1 text-[15px] leading-relaxed",
            item.who === "You" ? "text-muted-foreground" : "text-foreground",
          )}>
            {item.text}
          </p>
        </div>
      );
    case "evidence":
      return (
        <div className="mt-1 flex items-start gap-2 rounded-xl border border-emerald/25 bg-emerald/[0.05] p-4">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald">Evidence · {item.competency}</div>
            <div className="mt-1 text-[14px] leading-snug text-foreground">{item.note}</div>
          </div>
        </div>
      );
    case "reasoning":
      return (
        <div className="mt-1 flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/[0.05] p-4">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-secondary">AI reasoning</div>
            <div className="mt-1 text-[14px] leading-snug text-foreground">{item.note}</div>
            {item.gap && <div className="mt-2 text-[12px] text-muted-foreground">Gap · {item.gap}</div>}
          </div>
        </div>
      );
    case "milestone":
      return (
        <div className="mt-1 flex items-center gap-2">
          <Circle className="h-3 w-3 fill-current text-foreground" />
          <div className="font-display text-xl text-foreground">{item.label}</div>
        </div>
      );
    case "competency":
      return (
        <div className="mt-1 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/[0.06] px-3 py-1 text-[12px] font-medium text-foreground">
          <MessageSquare className="h-3 w-3 text-amber-500" />
          {item.label}
        </div>
      );
  }
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {label}
    </div>
  );
}
