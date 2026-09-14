# Simulation worker

This service consumes a run ID, retrieves an immutable model snapshot, converts it to a Project Chrono model, and stores result artifacts. Deploy it as a Docker service—not on Vercel.

The initial worker intentionally remains an interface boundary until the model schema and job provider are chosen.
