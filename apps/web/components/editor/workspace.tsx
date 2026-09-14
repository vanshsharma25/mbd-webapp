"use client";

import { useEffect, useState } from "react";
import type { MbdModel } from "@mbd/domain";
import { loadOrCreateDemoProject, saveModelVersion, type SavedProject } from "../../lib/models";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export function Workspace({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<SavedProject | null>(null);
  const [model, setModel] = useState<MbdModel | null>(null);
  const [status, setStatus] = useState("Opening saved model…");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const openProject = async () => {
      try {
        const savedProject = await loadOrCreateDemoProject(createSupabaseBrowserClient());
        if (!active) return;
        setProject(savedProject);
        setModel(savedProject.model);
        setStatus("Saved model loaded.");
      } catch (error) {
        if (!active) return;
        setStatus(error instanceof Error ? error.message : "Could not open the saved model.");
      }
    };
    void openProject();
    return () => { active = false; };
  }, []);

  const updatePendulumMass = (value: string) => {
    const mass = Number(value);
    if (!model || !Number.isFinite(mass) || mass <= 0) return;
    setModel({ ...model, bodies: model.bodies.map((body) => body.id === "pendulum" ? { ...body, mass } : body) });
    setStatus("Unsaved changes.");
  };

  const updateSetting = (setting: "duration" | "stepSize", value: string) => {
    const numericValue = Number(value);
    if (!model || !Number.isFinite(numericValue) || numericValue <= 0) return;
    setModel({ ...model, settings: { ...model.settings, [setting]: numericValue } });
    setStatus("Unsaved changes.");
  };

  const save = async () => {
    if (!project || !model) return;
    setSaving(true);
    setStatus("Saving model…");
    try {
      await saveModelVersion(createSupabaseBrowserClient(), project.id, model);
      setStatus("Model saved. Reopen this workspace to verify persistence.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save the model.");
    } finally {
      setSaving(false);
    }
  };

  const pendulum = model?.bodies.find((body) => body.id === "pendulum");
  return <main className="shell">
    <header className="topbar">
      <span className="brand">MBD PLATFORM / {project?.name ?? projectId}</span>
      <button className="button" onClick={save} disabled={!project || !model || saving}>{saving ? "Saving…" : "Save model"}</button>
    </header>
    <section className="workspace">
      <aside className="panel">
        <h2>Model</h2>
        {(model?.bodies ?? []).map((body) => <div className="tree-item" key={body.id}>▣ {body.name}</div>)}
        {(model?.joints ?? []).map((joint) => <div className="tree-item" key={joint.id}>◉ {joint.type} joint</div>)}
        {(model?.forces ?? []).map((force) => <div className="tree-item" key={force.id}>↧ {force.type}</div>)}
      </aside>
      <section className="viewport"><div><strong>Simple pendulum model</strong><br />The persistence boundary is live. 3D rendering arrives in a later milestone.</div></section>
      <aside className="panel inspector">
        <h2>Inspector</h2>
        <label>Pendulum mass (kg)</label>
        <input aria-label="Pendulum mass" className="input" type="number" min="0.001" step="0.1" value={pendulum?.mass ?? ""} onChange={(event) => updatePendulumMass(event.target.value)} disabled={!model} />
        <label>Simulation duration (s)</label>
        <input aria-label="Simulation duration" className="input" type="number" min="0.001" step="0.1" value={model?.settings.duration ?? ""} onChange={(event) => updateSetting("duration", event.target.value)} disabled={!model} />
        <label>Time step (s)</label>
        <input aria-label="Time step" className="input" type="number" min="0.000001" step="0.0001" value={model?.settings.stepSize ?? ""} onChange={(event) => updateSetting("stepSize", event.target.value)} disabled={!model} />
      </aside>
      <section className="panel timeline"><h2>Model status</h2><p>{status}</p><p>Simulation jobs and results follow in Phase 2.</p></section>
    </section>
  </main>;
}
