# Changelog

All notable changes to this project are documented here. Format loosely
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Prisma 7 + Neon PostgreSQL persistence layer, replacing the in-memory
  prototype (Sprint 4, in progress).
- `Workspace` model — the first table in the production schema.
- `src/db/client.ts` — singleton `PrismaClient` using the `@prisma/adapter-pg`
  driver adapter, HMR-safe in development.
- CI (GitHub Actions): lint, typecheck, unit tests, build on every push/PR to `main`.
- Issue templates, PR template, `CONTRIBUTING.md`.

## Earlier

Evidence Extraction, Evidence Gap Analysis, Adaptive Follow-up, and Role
Planner engines, plus the Live Interview workspace, Evidence Report, and
Candidate Journey UI, were built prior to this changelog's introduction — see
the README's [Current status](README.md#current-status) section for what's
complete.
