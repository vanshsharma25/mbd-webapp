import { createDemoModel, type MbdModel, validateModel } from "@mbd/domain";
import type { SupabaseClient } from "@supabase/supabase-js";

const demoProjectName = "Demo pendulum";

export type SavedProject = {
  id: string;
  name: string;
  model: MbdModel;
};

async function ensureSession(supabase: SupabaseClient) {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (session) return session;

  const { data, error: signInError } = await supabase.auth.signInAnonymously();
  if (signInError || !data.session) {
    throw new Error("Could not start a local project session. In Supabase, enable Anonymous Sign-Ins under Authentication > Providers.");
  }

  return data.session;
}

export async function loadOrCreateDemoProject(supabase: SupabaseClient): Promise<SavedProject> {
  await ensureSession(supabase);

  const { data: existingProject, error: projectQueryError } = await supabase
    .from("projects")
    .select("id, name")
    .eq("name", demoProjectName)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (projectQueryError) throw projectQueryError;

  const project = existingProject ?? await createDemoProject(supabase);
  const { data: latestVersion, error: versionError } = await supabase
    .from("model_versions")
    .select("model")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (versionError) throw versionError;

  if (!latestVersion) {
    const model = createDemoModel();
    await saveModelVersion(supabase, project.id, model);
    return { ...project, model };
  }

  const validation = validateModel(latestVersion.model);
  if (!validation.success) throw new Error("The saved model is not valid and cannot be opened.");
  return { ...project, model: validation.data };
}

async function createDemoProject(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name: demoProjectName })
    .select("id, name")
    .single();
  if (error) throw error;
  return data;
}

export async function saveModelVersion(supabase: SupabaseClient, projectId: string, model: MbdModel) {
  const validation = validateModel(model);
  if (!validation.success) throw new Error("The model has invalid values and was not saved.");

  const { error } = await supabase
    .from("model_versions")
    .insert({ project_id: projectId, model: validation.data });
  if (error) throw error;
}
