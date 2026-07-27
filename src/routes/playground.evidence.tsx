import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Evidence } from "@/domain";
import { interviewService } from "@/services/interviewService";

export const Route = createFileRoute("/playground/evidence")({
  component: EvidencePlayground,
  head: () => ({
    meta: [{ title: "Evidence Extraction Playground — Potential" }],
  }),
});

function parseCompetencies(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
    ),
  );
}

function EvidencePlayground() {
  const [question, setQuestion] = useState("");
  const [competenciesText, setCompetenciesText] = useState("");
  const [response, setResponse] = useState("");
  const [evidence, setEvidence] = useState<Evidence[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const competencies = parseCompetencies(competenciesText);
  const canSubmit =
    question.trim().length > 0 &&
    response.trim().length > 0 &&
    competencies.length > 0 &&
    !isLoading;

  async function handleExtract() {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await interviewService.analyseResponse({
        question: question.trim(),
        response: response.trim(),
        competencies,
      });
      setEvidence(result);
    } catch (err) {
      setEvidence(null);
      setError(err instanceof Error ? err.message : "Evidence extraction failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Internal tool · not part of the product
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Evidence Extraction Playground
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Calls the Evidence Engine (src/ai/evidence) directly against the OpenAI Responses API.
          Nothing here is saved.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="question">Interview question</Label>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Tell me about a decision you made without full information."
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="competencies">Competencies being assessed (comma-separated)</Label>
          <Input
            id="competencies"
            value={competenciesText}
            onChange={(e) => setCompetenciesText(e.target.value)}
            placeholder="e.g. Systems thinking, Leadership"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="response">Candidate response</Label>
          <Textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Paste or write the candidate's response here…"
            rows={8}
            className="mt-1.5"
          />
        </div>

        <Button onClick={handleExtract} disabled={!canSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Extracting…
            </>
          ) : (
            "Extract Evidence"
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {evidence && (
        <div className="mt-8 space-y-3">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {evidence.length > 0
              ? `${evidence.length} evidence item${evidence.length === 1 ? "" : "s"} found`
              : "No evidence found in this response"}
          </div>
          {evidence.map((item, i) => (
            <EvidenceCard key={i} evidence={item} />
          ))}
        </div>
      )}
    </div>
  );
}

const STRENGTH_LABEL: Record<Evidence["strength"], string> = {
  strong: "Strong",
  moderate: "Moderate",
  weak: "Weak",
};

// Deliberately a qualitative badge, not a numeric score — Potential never scores
// candidates, and "confidence" here means how directly the quote supports the
// capability, not a hiring signal.
const STRENGTH_BADGE_CLASS: Record<Evidence["strength"], string> = {
  strong: "border-emerald/25 bg-emerald-soft/60 text-emerald",
  moderate: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  weak: "border-hairline bg-surface text-muted-foreground",
};

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <Field label="Capability">
          <div className="text-sm font-medium text-foreground">{evidence.competency}</div>
        </Field>

        <Field label="Summary">
          <p className="text-sm text-foreground/90">
            {STRENGTH_LABEL[evidence.strength]} evidence for {evidence.competency}.
          </p>
        </Field>

        <Field label="Supporting quote">
          <blockquote className="border-l-2 border-hairline pl-3 text-sm italic text-foreground/90">
            "{evidence.quote}"
          </blockquote>
        </Field>

        <Field label="Reasoning">
          <p className="text-sm text-muted-foreground">{evidence.reasoning}</p>
        </Field>

        <Field label="Confidence">
          <Badge variant="outline" className={cn(STRENGTH_BADGE_CLASS[evidence.strength])}>
            {STRENGTH_LABEL[evidence.strength]}
          </Badge>
        </Field>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
