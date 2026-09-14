import { Workspace } from "../../../components/editor/workspace";

export default async function WorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <Workspace projectId={projectId} />;
}
