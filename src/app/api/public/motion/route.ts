import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Motion spec required", code: "MOTION_SPEC_INVALID" },
        { status: 400 }
      );
    }

    const sceneCount = Array.isArray(body.scenes) ? body.scenes.length : 0;
    const duration = typeof body.duration === "number" ? body.duration : 0;

    const warnings: string[] = [];
    if (sceneCount > 20) warnings.push("Spec exceeds 20 scene limit");
    if (duration > 120) warnings.push("Spec exceeds 120s duration limit");
    if (sceneCount === 0) warnings.push("No scenes defined");

    return NextResponse.json({
      previewFrames: [],
      sceneCount,
      estimatedDuration: duration,
      warnings,
      _note: "Preview rendering is scaffolded. Full implementation requires renderer.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }
}
