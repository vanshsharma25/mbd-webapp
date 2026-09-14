# MBD model format

`@mbd/domain` owns the portable model schema. UI, API, and solver adapters must depend on it. Solver-specific data must stay inside `apps/worker/src/adapters` so a solver can later be changed without breaking saved projects.
