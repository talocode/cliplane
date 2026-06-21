import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    id,
    status: "queued",
    title: null,
    duration: null,
    resolution: null,
    fps: null,
    scenes: null,
    createdAt: new Date().toISOString(),
    renderedAt: null,
    previewUrl: null,
    downloadUrl: null,
    creditsCharged: null,
    _note: "This is a scaffold endpoint. Full implementation requires render worker integration.",
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = (body as Record<string, unknown>).action;

  if (action === "render") {
    return NextResponse.json({
      id,
      status: "rendering",
      estimatedSeconds: 45,
      _note: "Scaffold response. Rendering not yet implemented.",
    });
  }

  return NextResponse.json(
    { error: "Unknown action", code: "VALIDATION_ERROR" },
    { status: 400 }
  );
}
