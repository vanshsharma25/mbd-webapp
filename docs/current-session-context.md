# Current session context

## Product idea

Build an open-source, web-based multibody dynamics (MBD) tool for startups and small engineering teams that cannot afford tools such as MSC Adams.

The product should focus first on simple mechanisms and motorsport suspension work, rather than trying to reproduce every feature of commercial MBD software.

## Communication preference

The project owner is a motorsport engineer, not a software developer. Keep explanations simple, practical, and engineering-focused. Avoid unnecessary software jargon.

## Current repository state

The repository is a pnpm/Turborepo monorepo and is connected to GitHub.

- GitHub repository: `https://github.com/vanshsharma25/mbd-webapp` (public, `main` branch).
- Local Git ignores environment files, credentials, certificates, private keys, and `.secrets/`.
- Real Supabase credentials are local-only, permission mode `600`, and must never be committed.

- `apps/web`: Next.js web application for Vercel.
- `packages/domain`: shared MBD model types and validation.
- `apps/worker`: placeholder Docker worker for the future physics solver.
- `infra/supabase`: starter database schema and security policies.
- `docs`: architecture, model format, solver validation, and phase plan.

The web application has:

- A landing page.
- A demo workspace at `/workspace/demo`.
- A basic editor-style layout: model tree, viewport area, inspector, and model-status area.
- A simple pendulum demo with editable mass, simulation duration, and time step.
- Supabase browser-client code that creates or reopens a private demo project and saves each edit as an immutable model version.
- Anonymous Supabase sessions for the proof-of-concept. Full user sign-in belongs to Phase 7.

The latest implementation passed type checking and a production build using `pnpm`.

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

Phase 0 is complete locally. Phase 1 is implemented in the codebase but awaits two Supabase dashboard actions before live verification:

1. Run `infra/supabase/schema.sql` in the Supabase SQL Editor.
2. Enable **Anonymous Sign-Ins** under Authentication → Providers.
3. Open `/workspace/demo`, edit the pendulum, save it, then reopen the page to confirm persistence.

The schema deliberately uses explicit grants plus Row Level Security because the Supabase project was created with automatic table exposure disabled. It also sets `projects.owner_id` from `auth.uid()` so client code never supplies an owner ID.

The most recent implementation commit is `1f9848b` (`Persist demo pendulum models with Supabase`).

After the pendulum persistence test passes, begin Phase 2: create simulation-job records with `waiting`, `running`, `complete`, and `failed` states, then connect the local Project Chrono worker.
