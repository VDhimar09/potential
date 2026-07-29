# Contributing to Potential

Thanks for helping build Potential. This is a short, practical guide — for the
product philosophy behind _why_ the codebase looks the way it does, see the
[Learn more](README.md#learn-more) section of the README first, especially
[`docs/ai-charter.md`](docs/ai-charter.md) if you're touching anything AI-related.

## Setup

Requires Node.js 22+ and npm.

```bash
npm install
npm run dev
```

The AI engines require an `OPENAI_API_KEY` — see [Getting started](README.md#getting-started)
in the README for the full `.env` shape, including Prisma's `DATABASE_URL`.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm test
```

If you touched `prisma/schema.prisma`, also run:

```bash
npx prisma generate
npx prisma migrate dev --name <describe_the_change>
```

## The one rule that matters most

Potential never scores, ranks, or recommends. Before adding anything to the AI
layer or domain model, check it against
[`docs/ai-charter.md`](docs/ai-charter.md): does it help an interviewer collect
better evidence, or does it start making the hiring decision for them? If it's
the second, it doesn't ship — no exceptions for how capable the model is.

## Code style

- Follow the existing patterns in the module you're editing over introducing a
  new one — see [`docs/engineering-principles.md`](docs/engineering-principles.md).
- Routes and UI never call Prisma or the AI SDK directly — go through
  `src/services/` (and, once persistence lands, `src/db/repositories/`).
- No comments explaining _what_ code does; only _why_, when it's non-obvious.

## Commit messages

This repo uses `type(scope): summary` (e.g. `feat(database): add Workspace model`).
Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
