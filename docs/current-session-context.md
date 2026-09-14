# Current session context

## Product idea

Build an open-source, web-based multibody dynamics (MBD) tool for startups and small engineering teams that cannot afford tools such as MSC Adams.

The product should focus first on simple mechanisms and motorsport suspension work, rather than trying to reproduce every feature of commercial MBD software.

## Communication preference

The project owner is a motorsport engineer, not a software developer. Keep explanations simple, practical, and engineering-focused. Avoid unnecessary software jargon.

## Current repository state

The repository has been scaffolded as a pnpm/Turborepo monorepo.

- `apps/web`: Next.js web application for Vercel.
- `packages/domain`: shared MBD model types and validation.
- `apps/worker`: placeholder Docker worker for the future physics solver.
- `infra/supabase`: starter database schema and security policies.
- `docs`: architecture, model format, solver validation, and phase plan.

The web application has:

- A landing page.
- A demo workspace at `/workspace/demo`.
- A basic editor-style layout: model tree, viewport area, inspector, and results area.
- A `Run simulation` button that currently creates a validated placeholder job response.

The production build passed with `pnpm build`.

## Architecture decision

Vercel is used only for the website and short API requests. It must not run long physics calculations.

The intended simulation path is:

```text
Browser → web API → saved model and run request → solver worker → results → browser
```

The solver worker will run separately from Vercel.

## Low-cost proof-of-concept decision

Keep the first build free wherever possible:

- Vercel free tier: private development and testing only.
- Supabase free tier: projects, model data, job state, and small result files.
- Developer laptop: runs the actual solver worker locally.
- No queue provider initially: the local worker will poll the database for waiting jobs.

Vercel's Hobby plan is restricted to personal/non-commercial use. Upgrade before commercial or public product use.

The worker will move to paid cloud hosting only when simulations need to run while the laptop is off, external users need reliable access, or job volume grows.

## Solver decision

Use Project Chrono as the initial open-source MBD solver. Do not build a solver from scratch.

Initial supported capabilities:

- Rigid bodies.
- Fixed, revolute, and prismatic joints.
- Gravity.
- Springs and dampers.
- Speed or torque-controlled motors.
- Position, velocity, acceleration, force, and torque outputs.

The initial validation cases are a pendulum, mass-spring-damper, four-bar linkage, slider-crank, and double-wishbone suspension.

## Current phase

The detailed roadmap is in `docs/backend-phases.md`.

The immediate next task is Phase 0 followed by Phase 1:

1. Create and connect a free Supabase project.
2. Add configuration values locally.
3. Save and load engineering models from the database.
4. Confirm a pendulum model persists correctly.

After that, build the job system and connect the local Project Chrono worker.
