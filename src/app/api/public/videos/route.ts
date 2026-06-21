import { NextResponse } from "next/server";
import { z } from "zod";

const motionVideoRequestSchema = z.object({
  template: z.string().optional(),
  brand: z.object({
    name: z.string(),
    colors: z.object({
      background: z.string(),
      primary: z.string(),
      accent: z.string(),
      secondary: z.string().optional(),
      muted: z.string().optional(),
    }),
    logo: z.string().url().optional(),
  }),
  script: z.object({
    hook: z.string(),
    sections: z.array(z.string()).min(1).max(4),
    cta: z.string(),
  }),
  output: z.object({
    aspectRatio: z.enum(["16:9", "9:16", "1:1", "4:5"]).optional().default("16:9"),
    fps: z.number().int().refine((v) => v === 30 || v === 60).optional().default(60),
    quality: z.enum(["low", "medium", "high"]).optional().default("high"),
  }).optional(),
  spec: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = motionVideoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Motion spec validation failed",
          code: "MOTION_SPEC_INVALID",
          errors: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const videoId = `video_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    return NextResponse.json({
      id: videoId,
      status: "queued",
      previewUrl: null,
      downloadUrl: null,
    }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body",
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "Use POST to create a motion video",
      docs: "See docs/PUBLIC_API.md for motion video endpoints",
    },
    { status: 405 }
  );
}
