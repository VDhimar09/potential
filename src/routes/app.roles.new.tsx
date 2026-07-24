import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, Upload, Check, Plus, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SUGGESTED_OBJECTIVES,
  SUGGESTED_COMPETENCIES,
  DEFAULT_COMPETENCIES,
  DEFAULT_INTERVIEW_PLAN,
} from "@/lib/mock/roles";

export const Route = createFileRoute("/app/roles/new")({
  component: CreateRole,
  head: () => ({
    meta: [
      { title: "New role — Potential" },
      { name: "description", content: "Design an interview plan grounded in evidence." },
    ],
  }),
});

function CreateRole() {
  const [title, setTitle] = useState("Staff Engineer, Platform");
  const [jd, setJd] = useState("");
  const [comps, setComps] = useState<string[]>(DEFAULT_COMPETENCIES);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-aurora-soft opacity-60" />

      <div className="relative mx-auto max-w-[900px] px-8 pb-32 pt-10">
        <Link to="/app" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Workspace
        </Link>

        <div className="mt-8 rise-in">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">New role</div>
          <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight text-foreground md:text-[56px]">
            What are you hiring for?
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Describe the role. Potential will suggest interview objectives and the evidence worth collecting — humans always shape the final plan.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Role title */}
          <Field label="Role title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-hairline/70 bg-transparent pb-3 font-display text-3xl text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground/40"
              placeholder="e.g. Staff Engineer, Platform"
            />
          </Field>

          {/* JD */}
          <Field
            label="Job description"
            help="Paste the JD or upload a file. Potential will analyse it to suggest objectives."
          >
            <div className="rounded-xl border border-hairline/70 bg-background/60 transition-shadow focus-within:shadow-soft">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here…"
                rows={8}
                className="w-full resize-none bg-transparent p-4 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <div className="flex items-center justify-between border-t border-hairline/70 px-3 py-2.5">
                <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground">
                  <Upload className="h-3.5 w-3.5" /> Upload PDF
                </button>
                <button
                  onClick={() => setAnalyzed(true)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                    jd.length > 40
                      ? "bg-foreground text-background hover:opacity-90"
                      : "cursor-not-allowed bg-muted text-muted-foreground",
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Suggest objectives
                </button>
              </div>
            </div>
          </Field>

          {/* AI suggestions */}
          {analyzed && (
            <div className="rise-in">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="text-[13px] font-medium text-foreground">Potential's suggestions</div>
                <div className="text-[11px] text-muted-foreground">Accept, edit, or ignore</div>
              </div>
              <div className="space-y-2">
                {SUGGESTED_OBJECTIVES.map((o) => {
                  const active = objectives.includes(o.title);
                  return (
                    <button
                      key={o.title}
                      onClick={() =>
                        setObjectives((prev) =>
                          prev.includes(o.title) ? prev.filter((x) => x !== o.title) : [...prev, o.title],
                        )
                      }
                      className={cn(
                        "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                        active
                          ? "border-secondary/40 bg-secondary/[0.06] shadow-soft"
                          : "border-hairline/70 bg-background/60 hover:border-hairline",
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        active ? "border-secondary bg-secondary text-secondary-foreground" : "border-hairline",
                      )}>
                        {active && <Check className="h-3 w-3" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-foreground">{o.title}</div>
                        <div className="mt-1 text-[12px] text-muted-foreground">{o.why}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Competencies */}
          <Field label="Competencies" help="What capability must this role demonstrate?">
            <div className="flex flex-wrap gap-2">
              {comps.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/70 py-1 pl-3 pr-1.5 text-[13px]">
                  {c}
                  <button
                    onClick={() => setComps(comps.filter(x => x !== c))}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {SUGGESTED_COMPETENCIES.filter((c) => !comps.includes(c)).map((c) => (
                <button
                  key={c}
                  onClick={() => setComps([...comps, c])}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-hairline px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" /> {c}
                </button>
              ))}
            </div>
          </Field>

          {/* Interview plan */}
          <Field label="Interview plan" help="Potential drafts a natural flow. You can rearrange freely.">
            <ol className="space-y-2">
              {DEFAULT_INTERVIEW_PLAN.map((step, i) => (
                <li key={step} className="flex items-start gap-4 rounded-xl border border-hairline/70 bg-background/60 p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[11px] font-medium tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-[14px] text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </Field>
        </div>

        {/* Sticky action */}
        <div className="mt-12 flex items-center justify-between border-t border-hairline/70 pt-6">
          <div className="text-[12px] text-muted-foreground">
            Draft saved · {objectives.length || 0} objectives selected
          </div>
          <Button asChild className="rounded-full bg-foreground text-background hover:opacity-90">
            <Link to="/app/interviews/console">
              Open interview workspace <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        {help && <div className="mt-1 text-[12px] text-muted-foreground/80">{help}</div>}
      </div>
      {children}
    </div>
  );
}
