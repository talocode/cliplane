import { NextResponse } from "next/server";
import { z } from "zod";
import { generateHtmlPreview } from "@/lib/render/htmlPreview";
import { generateWarnings } from "@/lib/render/types";
import type { FullMotionSpec } from "@/lib/motion/types";

const motionSpecSchema: z.ZodType<FullMotionSpec> = z.object({
  version: z.string(),
  title: z.string(),
  duration: z.number().positive(),
  fps: z.number().int().positive(),
  resolution: z.object({ width: z.number(), height: z.number() }),
  platform: z.string(),
  brand: z.object({
    name: z.string(),
    colors: z.object({
      background: z.string(),
      primary: z.string(),
      accent: z.string(),
      secondary: z.string(),
      muted: z.string(),
    }),
    fontFamily: z.string(),
  }),
  scenes: z.array(z.object({
    id: z.string(),
    start: z.number(),
    duration: z.number(),
    type: z.string(),
    attentionRole: z.string(),
    narration: z.string(),
    caption: z.string(),
    visualIntent: z.string(),
    elements: z.array(z.any()),
    animations: z.array(z.any()),
    broll: z.object({
      assetType: z.string(),
      prompt: z.string(),
      cameraMotion: z.string(),
      style: z.string(),
      duration: z.number(),
      requiresExternalProvider: z.boolean(),
    }),
    transition: z.object({ type: z.string(), duration: z.number() }),
  })),
  captions: z.array(z.object({
    text: z.string(),
    position: z.string(),
    fontSize: z.number(),
    maxLineWidth: z.number(),
    emphasisWords: z.array(z.string()),
    style: z.string(),
  })),
  audioPlan: z.object({
    voiceover: z.object({ text: z.string(), style: z.string(), duration: z.number() }).nullable(),
    backgroundMusic: z.null(),
    sfx: z.array(z.any()),
  }),
  exports: z.array(z.object({
    format: z.string(),
    aspectRatio: z.string(),
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    quality: z.string(),
    codec: z.string(),
  })),
  approvalRequired: z.boolean(),
  sourceMetadata: z.object({
    ideaTitle: z.string(),
    ideaFormat: z.string(),
    generatedAt: z.string(),
    generator: z.string(),
  }),
}).passthrough();

const inputSchema = z.object({
  motionSpec: motionSpecSchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        details: parsed.error.issues.map(i => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const spec = parsed.data.motionSpec as FullMotionSpec;

  if (spec.scenes.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Motion spec must have at least one scene" },
      { status: 400 }
    );
  }

  if (!spec.approvalRequired) {
    return NextResponse.json(
      { ok: false, error: "Motion spec must have approvalRequired: true" },
      { status: 400 }
    );
  }

  try {
    const preview = generateHtmlPreview(spec);

    return NextResponse.json({
      ok: true,
      preview,
      next: "review_preview",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "POST /v1/motion/preview",
    description: "Generate an HTML preview from a motion spec",
    input: {
      motionSpec: "Full motion spec object (required)",
    },
    output: {
      type: "html",
      html: "Self-contained HTML preview",
      renderedVideo: false,
    },
    note: "This generates an HTML preview only. No video is rendered. Human review required before any rendering.",
  });
}
