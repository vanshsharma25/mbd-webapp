"use client";

import { useState } from "react";

export function Workspace({ projectId }: { projectId: string }) {
  const [running, setRunning] = useState(false);
  const run = async () => {
    setRunning(true);
    await fetch(`/api/projects/${projectId}/runs`, { method: "POST" });
    setRunning(false);
  };
  return <main className="shell">
    <header className="topbar"><span className="brand">MBD PLATFORM / {projectId}</span><button className="button" onClick={run}>{running ? "Queueing…" : "Run simulation"}</button></header>
    <section className="workspace">
      <aside className="panel"><h2>Model</h2><div className="tree-item">▣ Ground</div><div className="tree-item">▣ Crank</div><div className="tree-item">◉ Revolute joint</div><div className="tree-item">↗ Motor input</div></aside>
      <section className="viewport"><div><strong>3D viewport boundary</strong><br />React Three Fiber renderer lands here in the next milestone.</div></section>
      <aside className="panel inspector"><h2>Inspector</h2><label>Mass (kg)</label><input className="input" defaultValue="1.00" /><label>Input speed (rpm)</label><input className="input" defaultValue="60" /></aside>
      <section className="panel timeline"><h2>Results & timeline</h2><p>No simulation selected. Run a model to inspect trajectories, forces, and solver logs.</p></section>
    </section>
  </main>;
}
