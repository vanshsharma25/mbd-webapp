# Low-cost backend plan

This is the proof-of-concept plan. Keep infrastructure free while we validate the engineering workflow. The solver runs on the developer's own laptop until other users need reliable hosted simulations.

## Phase 0 — Free setup

Set up only free services:

- Vercel: website hosting for private development and testing.
- Supabase: database and small-result storage.
- Developer laptop: solver worker.
- GitHub: source-code backup and version history.

**Goal:** the web app, database, and laptop can communicate.

**Cost:** ₹0.

## Phase 1 — Save engineering models

Build the backend so it can save and reopen a mechanism.

Start with:

- Rigid bodies.
- Mass, centre of gravity, and simple inertia values.
- Fixed, revolute, and prismatic joints.
- Gravity.
- Simulation duration and time step.

**Goal:** create a pendulum or simple linkage, close the browser, reopen it, and see the same model.

**Cost:** ₹0.

## Phase 2 — Create simulation jobs

Add a Run request system.

1. Save a fixed version of the model.
2. Mark a job as `waiting`.
3. The local solver on the laptop sees the job.
4. Show `waiting`, `running`, `complete`, or `failed` in the website.

**Goal:** simulations are repeatable and the browser never freezes while calculating.

**Cost:** ₹0.

## Phase 3 — Local solver: simple pendulum

Connect the local worker to Project Chrono.

First test case:

- One rigid arm.
- One pivot joint.
- Gravity.
- Known length and mass.
- Compare the period and motion with hand calculations.

**Goal:** validate the basic solver pipeline.

**Cost:** ₹0.

## Phase 4 — Results and plots

Return results to the database and website.

First outputs:

- Angular displacement, velocity, and acceleration.
- Joint reaction force.
- Solver warnings and errors.
- CSV download.

**Goal:** see the pendulum move and inspect real numerical results.

**Cost:** ₹0.

## Phase 5 — Four-bar linkage

Add the first useful mechanism case.

Support:

- Multiple rigid bodies.
- Revolute joints.
- Motor speed or torque input.
- Position, velocity, acceleration, and joint loads.

**Goal:** build and run a four-bar linkage in the browser.

**Cost:** ₹0.

## Phase 6 — Suspension MVP

Move toward motorsport use cases.

Support:

- Double-wishbone geometry.
- Springs and dampers.
- Pushrods, rockers, and anti-roll bar later.
- Wheel-travel input.
- Camber, toe, track change, and motion-ratio outputs.

**Goal:** simulate suspension kinematics and basic dynamic response.

**Cost:** ₹0 while the solver stays on the laptop.

## Phase 7 — Basic sharing and protection

Before inviting testers, add:

- User sign-in.
- Private projects.
- Project ownership.
- Read-only simulation sharing.
- Simulation history.

**Goal:** testers can use the tool without seeing each other's work.

**Cost:** likely ₹0 for small testing.

## Phase 8 — Upgrade when needed

Move the solver from the laptop to a paid cloud worker only when:

- Simulations must run while the laptop is off.
- Other users need reliable access.
- Jobs begin to queue for too long.
- Public or commercial testing begins.

At that point, upgrade Vercel for commercial use and rent a small solver machine. The first paid service should be the solver worker, not the website host.

## Immediate next step

Complete Phase 0: connect the backend structure to a free Supabase project, then build Phase 1.
