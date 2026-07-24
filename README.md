# Potential

**Evidence, not scores.**

Potential is an AI-assisted interview intelligence platform that helps interviewers collect trustworthy evidence about candidate capability — so hiring decisions can be made by humans, with a clearer picture of what actually happened in the room.

---

## Why Potential?

Most interview tooling optimizes for the wrong question. It asks *"did the candidate answer well?"* — a question that quietly invites bias, pattern-matching, and gut feel dressed up as rigor. Some tools go further and let an algorithm score or rank people, which just moves the bias somewhere less visible.

Potential asks a different question:

> **Have we collected enough trustworthy evidence to fairly understand this candidate's capability?**

That reframing matters. Evidence is inspectable — a hiring panel can read the actual quote, the actual reasoning, and decide for themselves whether it's convincing. A score is not; it's an opinion laundered through a number. Potential is built on the belief that interviewers make better decisions when they're handed *what was said and why it matters*, not a verdict.

The AI's job is narrow and disciplined: notice when evidence is missing, surface it clearly, and stay out of the decision itself.

---

## Core Principles

**Potential never:**
- Makes hiring decisions
- Scores candidates
- Ranks candidates
- Recommends a hire or reject outcome
- Replaces the recruiter or interviewer

**Potential always:**
- Helps interviewers collect better evidence
- Adapts follow-up questions when evidence is missing
- Generates explainable evidence reports
- Encourages candidates to explain their own experience, in their own words
- Keeps humans in control of the outcome

---

## Features

**Available today**

- **AI-assisted interview workspace** — a calm, focused workspace for running an interview and reviewing a candidate's context alongside it.
- **Live interview console** — submit a candidate's response as it's given and watch evidence extraction happen in real time.
- **Evidence extraction** — an AI engine that reads a candidate's response against the competencies being assessed and identifies what it actually supports, backed by the exact quote.
- **Structured evidence model** — every piece of evidence is a typed, validated object: competency, quote, reasoning, and strength — never a free-form summary.
- **Shared domain model** — one set of TypeScript types for candidates, evidence, interviews, and reports, used by the UI, the AI layer, and the service layer alike.
- **Explainable AI architecture** — the AI layer is isolated behind a service boundary, runs OpenAI's Responses API with Structured Outputs, and re-validates every response with Zod before it's trusted.
- **Candidate journey & evidence reports (UI)** — timeline and report views that render Potential's evidence-first format; currently shown with representative interview data while the underlying features below are completed.

**Planned**

- Evidence gap analysis — surfacing which competencies still lack support, from data the engine already computes internally
- Adaptive follow-up suggestions grounded in live evidence
- Wiring the evidence report and candidate journey views to real, accumulated interview evidence

---

## Product Workflow

```
Job Description
      ↓
Interview Objectives
      ↓
Candidate Response
      ↓
Evidence Extraction
      ↓
Evidence Gap Analysis (planned)
      ↓
Adaptive Follow-up (planned)
      ↓
Evidence Report
      ↓
Candidate Journey
```

Everything above **Evidence Extraction** is implemented end-to-end today. Everything below it exists as UI, ready to be connected to the stages that come next.

---

## Architecture

Potential is built domain-first: the shape of a `Candidate`, an `Evidence` item, or a `CompetencyReport` is defined once, in one place, and every layer — UI, AI, service — imports that same definition. Nothing is redefined or duplicated at the boundaries.

The AI layer is deliberately isolated. It's the only part of the codebase that knows OpenAI exists, it never runs in the browser, and it never talks to a React component directly:

```
Component → Zustand store → Service layer (server-only) → Evidence Engine → OpenAI Responses API
```

A few decisions worth calling out:

- **Domain-first design** — types live in `src/domain`, independent of any framework, and are the single source of truth for what an "evidence" or "candidate" object looks like.
- **Strong typing, everywhere** — Zod schemas are written to be structurally checked against the domain types at compile time, so the AI's output can never silently drift from what the rest of the app expects.
- **Shared contracts** — the same `Evidence` type produced by the AI engine is the type rendered by the UI. No parallel "API response shape" to keep in sync.
- **AI service layer** — a TanStack Start server function is the only bridge between the browser and OpenAI. The API key and the OpenAI SDK never ship to the client bundle.
- **OpenAI Responses API + Structured Outputs** — evidence extraction uses Structured Outputs, constrained per-call to the competencies actually being assessed, so the model can't invent one that wasn't part of the interview.
- **Zustand** — minimal, explicit interview state (transcript, evidence, loading, error) with no more machinery than that.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | TanStack Start · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Zustand |
| **AI** | OpenAI Responses API · Structured Outputs · Zod · Vitest |
| **Backend** *(planned)* | FastAPI · Python · Pydantic |
| **Database** *(planned)* | PostgreSQL · Neon |
| **Deployment** *(planned)* | Vercel · GitHub Actions |

---

## Project Structure

```
src/
  ai/          AI engines, isolated from the UI. Currently: evidence extraction
               (OpenAI Responses API, Structured Outputs, Zod validation, tests).
  components/  Reusable UI: shadcn primitives and Potential's own components.
  domain/      The shared type model — candidates, evidence, interviews, reports.
               Framework-agnostic; every other layer imports from here.
  lib/         Utilities and mock fixtures used ahead of a real backend.
  routes/      Application pages and layouts (file-based routing).
  services/    The boundary between the UI and the AI layer. Wraps AI engines
               in server-only functions; nothing above this layer touches OpenAI.
  stores/      Client-side state (Zustand) — e.g. interview transcript and
               extracted evidence.
```

---

## Current Development Status

**Completed**
- Shared domain model across UI, AI, and service layers
- Evidence extraction engine (OpenAI Responses API, Structured Outputs, Zod-validated, unit tested)
- Service layer isolating the AI from the UI, verified to never expose OpenAI or API keys to the browser
- Zustand interview store (transcript, evidence, loading, error)
- Live interview console connected end-to-end to real evidence extraction
- Loading and error handling for the AI workflow

**Current**
- Extending evidence extraction across a full interview, rather than a single response

**Next**
- Evidence gap analysis
- Adaptive, evidence-grounded follow-up questions
- Connecting evidence reports and candidate journey views to real extracted evidence

**Future**
- FastAPI + PostgreSQL persistence backend
- Authentication and multi-interviewer workspaces
- Deployment pipeline

---

## Responsible AI

Potential does not automate hiring decisions, and it isn't designed to. The system has no concept of a score, a rank, or a recommendation — those aren't features that are missing yet, they're outcomes the architecture is built to avoid.

Every AI output is evidence with a reason attached: a quote, the competency it supports, and why it counts. There is no step where a number or a verdict replaces that reasoning. The human interviewer always reads the same evidence the system did and decides for themselves.

This is human-in-the-loop by construction, not by policy: the AI layer is a service that returns typed evidence, not a decision-maker that returns a conclusion.

---

## Getting Started

```bash
bun install
bun dev
```

Evidence extraction requires an OpenAI API key. Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-...
OPENAI_EVIDENCE_MODEL=gpt-4o-mini   # optional — defaults to gpt-4o-mini
```

To run the test suite:

```bash
bun test
```

---

## Contributing

Potential is under active development, and contributions are welcome — whether that's a bug fix, a UI refinement, or a discussion about where the evidence-gap and follow-up features should go next. Open an issue or a pull request to start the conversation.

---

## License

MIT
