# AI Charter

This document defines what Potential's AI is for, what it is never allowed to do, and how we've built it to keep those commitments — not just state them.

## What the AI is for

Potential's AI exists to help an interviewer keep up with a conversation they're also busy having. It does three specific things, each isolated from the others:

**It extracts evidence.** Given what a candidate just said and the competencies being assessed, it identifies which competencies that response actually supports, quotes the exact part that supports them, and explains why. If a response doesn't support a competency, it says so — it does not stretch a thin answer into a strong one to seem more useful.

**It analyses gaps.** Given the evidence collected so far, it judges how complete that evidence is against the competencies and objectives for the interview — which are covered, which are missing, and specifically why. It never scores what's already there; it only reports what's still absent.

**It suggests one follow-up.** Given the latest response, the evidence collected, and the current gap analysis, it recommends a single next question — grounded in something the candidate actually said, aimed at a gap that's actually been identified. Not a list of options. Not a generic behavioral question that could apply to any interview. One question, or none, if nothing grounded can be proposed.

That's the entire mandate. Each engine is deliberately narrow, and none of them reaches into the others' territory.

## What the AI never does

- It never assigns a score.
- It never ranks candidates against one another.
- It never recommends a hire or reject outcome.
- It never generates more than one follow-up suggestion at a time.
- It never infers a capability the candidate didn't actually demonstrate.
- It never mentions a confidence level, probability, or numeric rating of any kind.
- It never sees or reasons over a raw transcript — only the structured evidence and analysis that has already been validated.

These aren't feature requests we haven't gotten to. They're boundaries the system is built not to cross, described in more detail in [Responsible AI](./responsible-ai.md).

## How we keep it honest

A charter is only as good as the architecture behind it, so here is how each commitment above is actually enforced:

**The AI is isolated behind a service boundary.** Nothing in the interface talks to a model directly. Every request passes through a server-only layer, which is also the only place an API key or an AI client library exists. The browser never has the means to call the model itself, even if it wanted to.

**Every output is validated against a schema, not just requested in one.** We use structured outputs so the model's response is shaped correctly from the start, and then we re-validate that response against the same schema before anything downstream is allowed to trust it. If the model's output doesn't match — wrong shape, a competency it invented, a missing explanation — it's treated as a failure, not silently accepted.

**Every schema is grounded to the actual interview, per call.** The competencies and objectives a model can reference are constrained to the ones genuinely being assessed in that interview, built fresh for each request. A model cannot invent a competency, credit an objective that was never part of the interview, or reference a gap from a different candidate's assessment.

**A refusal is treated as an honest answer, not an error to route around.** If the model declines to produce a usable result, Potential surfaces that as "we don't have this yet" rather than manufacturing a fallback that looks confident and isn't.

**Structured input, not free text, at every stage past the first.** Gap analysis reasons over typed `Evidence`, never a transcript. Follow-up generation reasons over that evidence plus the gap analysis, never a transcript either. Each stage only sees the validated output of the one before it, which keeps errors from compounding and keeps every stage auditable on its own terms.

## The standard for changing this charter

Any new AI capability has to answer the same question the rest of the product does: does this help an interviewer collect better evidence, or does it start making the decision for them? If it's the second, it doesn't belong in Potential, regardless of how capable the underlying model becomes.
