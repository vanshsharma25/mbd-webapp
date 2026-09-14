import { NextResponse } from "next/server";
import { createDemoModel, validateModel } from "@mbd/domain";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const model = createDemoModel();
  const validation = validateModel(model);
  if (!validation.success) return NextResponse.json({ error: validation.error.flatten() }, { status: 422 });
  // Replace this boundary with a transactional DB snapshot plus QStash/Redis publish.
  return NextResponse.json({ id: crypto.randomUUID(), projectId, status: "queued", createdAt: new Date().toISOString() }, { status: 202 });
}
