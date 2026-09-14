# MBD Platform

An open-source, web-first multibody dynamics workspace for early-stage hardware teams.

## Architecture

- `apps/web`: Next.js application deployed to Vercel. It owns the editor, authentication-facing APIs, project data, and simulation orchestration.
- `apps/worker`: containerized simulation worker boundary. It will execute queued Project Chrono/PyChrono jobs outside Vercel request limits.
- `packages/domain`: shared, solver-agnostic MBD model types and validation.
- `infra/supabase`: database schema and row-level security policies.

Vercel must never run a long physics solve. `POST /api/projects/:projectId/runs` validates and snapshots a model, then creates a queued job for the worker.

## Quick start

1. Install Node.js 20+ and pnpm 10+.
2. Copy `apps/web/.env.example` to `apps/web/.env.local` and add Supabase credentials when available.
3. Run `pnpm install` then `pnpm dev`.

The starter ships with an in-memory fallback so the editor shell can be explored before Supabase is configured.
