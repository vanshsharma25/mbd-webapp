# Architecture decision record

The web app is a Vercel-deployed Next.js application. Its API endpoints validate requests, persist project data, create immutable model snapshots, and enqueue simulation work. They never execute MBD calculations.

Simulation is asynchronous: browser → API → database snapshot + queue → worker → object storage + run status → browser. This supports Vercel's execution model and preserves reproducibility.
