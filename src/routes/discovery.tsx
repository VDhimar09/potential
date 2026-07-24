import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discovery")({
  head: () => ({
    meta: [
      { title: "Discovery — Potential" },
      {
        name: "description",
        content:
          "Potential is a personal AI product exploring how technology can help hiring teams better understand candidate capability without replacing human judgement.",
      },
      { property: "og:title", content: "Discovery — Potential" },
      {
        property: "og:description",
        content:
          "A personal AI product in discovery. Research, design, and experimentation into evidence-based hiring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discovery,
});

type Status = "done" | "active" | "next";

const MILESTONES: { label: string; status: Status; note: string }[] = [
  {
    label: "Founder research",
    status: "done",
    note: "Conversations with hiring managers, engineers, and candidates about where interviews break down.",
  },
  {
    label: "Product philosophy",
    status: "done",
    note: "Evidence over scoring. Follow-ups over answers. Humans always decide.",
  },
  {
    label: "UX exploration",
    status: "done",
    note: "The workspace, the reasoning panel, the evidence constellation — the shape of the product.",
  },
  {
    label: "Product prototype",
    status: "done",
    note: "The interface you're looking at. A working sketch of how Potential might feel.",
  },
  {
    label: "AI reasoning engine",
    status: "active",
    note: "Modelling interview objectives, evidence collection, and where evidence is still missing.",
  },
  {
    label: "Live conversation",
    status: "next",
    note: "Real-time voice with adaptive follow-ups that never suggest answers.",
  },
  {
    label: "Evidence model",
    status: "next",
    note: "How competencies connect, when signal is strong enough, and what to explore next.",
  },
  {
    label: "User feedback",
    status: "next",
    note: "Testing with hiring teams and candidates to sharpen the philosophy.",
  },
  {
    label: "MVP",
    status: "next",
    note: "A first version teams can try alongside their real interviews.",
  },
];

function Discovery() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Aurora backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-aurora-soft opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-radial-fade" />

      <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-20 md:pt-32 md:pb-32">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
          </span>
          Potential · in discovery
        </div>

        {/* Manifesto */}
        <h1 className="mt-8 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[64px]">
          A personal exploration of how technology can help hiring teams{" "}
          <span className="text-gradient">better understand people</span> — without replacing human
          judgement.
        </h1>

        <div className="mt-10 max-w-2xl space-y-5 text-[17px] leading-[1.65] text-foreground/85">
          <p>
            Potential is a personal AI product exploring how technology can help hiring teams
            better understand candidate capability without replacing human judgement.
          </p>
          <p>
            This project is inspired by my own interview experiences and is evolving through
            research, design, and experimentation.
          </p>
        </div>

        {/* Roadmap */}
        <section className="mt-20">
          <div className="mb-8 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Where the work is
              </div>
              <h2 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
                An honest roadmap
              </h2>
            </div>
            <div className="hidden text-[11px] text-muted-foreground md:block">
              4 done · 1 active · 4 ahead
            </div>
          </div>

          <ol className="relative border-l border-hairline pl-8">
            {MILESTONES.map((m, i) => (
              <Milestone key={m.label} index={i} {...m} />
            ))}
          </ol>
        </section>

        {/* Footer note + CTA */}
        <section className="mt-24 rounded-3xl border border-hairline bg-surface p-8 md:p-10">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            A note
          </div>
          <p className="mt-3 font-display text-2xl leading-[1.25] text-foreground md:text-[28px]">
            "I built Potential because I've left interviews remembering what I wanted to say only
            after the pressure had passed. This is my exploration of a bigger question — and it's
            still finding its shape."
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/app/interviews/console"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Step into the workspace
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
            >
              Read the philosophy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Milestone({
  label,
  status,
  note,
  index,
}: {
  label: string;
  status: Status;
  note: string;
  index: number;
}) {
  return (
    <li
      className="relative pb-8 last:pb-0"
      style={{ animation: `rise-in 0.7s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both` }}
    >
      {/* Node */}
      <span
        className={cn(
          "absolute -left-[41px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border",
          status === "done" && "border-emerald/30 bg-emerald-soft",
          status === "active" && "border-secondary/40 bg-background",
          status === "next" && "border-hairline bg-background",
        )}
      >
        {status === "done" && <Check className="h-3 w-3 text-emerald" strokeWidth={2.5} />}
        {status === "active" && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
        )}
        {status === "next" && <span className="h-1.5 w-1.5 rounded-full bg-hairline" />}
      </span>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3
          className={cn(
            "text-[17px] font-medium tracking-tight",
            status === "next" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {label}
        </h3>
        <StatusPill status={status} />
      </div>
      <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{note}</p>
    </li>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    done: { label: "Shipped", cls: "border-emerald/25 bg-emerald-soft/60 text-emerald" },
    active: { label: "In progress", cls: "border-secondary/25 bg-secondary/10 text-secondary" },
    next: { label: "Ahead", cls: "border-hairline bg-surface text-muted-foreground" },
  } as const;
  const v = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
        v.cls,
      )}
    >
      {v.label}
    </span>
  );
}
