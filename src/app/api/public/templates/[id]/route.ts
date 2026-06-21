import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const videoId = `video_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  return NextResponse.json({
    id: videoId,
    status: "queued",
    template: id,
    previewUrl: null,
    downloadUrl: null,
    _note: "Template render is scaffolded. Full implementation requires template loading and renderer integration.",
  });
}
