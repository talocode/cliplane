import { NextResponse } from "next/server";
import { z } from "zod";
import { generateKeyframes } from "@/lib/render/keyframes/generate";
import { validateMotionSpec } from "@/lib/motion/spec";
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
      background: z.string(), primary: z.string(), accent: z.string(),
      secondary: z.string(), muted: z.string(),
    }),
    fontFamily: z.string(),
  }),
  scenes: z.array(z.object({
    id: z.string(), start: z.number(), duration: z.number(), type: z.string(),
    attentionRole: z.string(), narration: z.string(), caption: z.string(),
    visualIntent: z.string(), elements: z.array(z.any()), animations: z.array(z.any()),
    broll: z.object({ assetType: z.string(), prompt: z.string(), cameraMotion: z.string(),
      style: z.string(), duration: z.number(), requiresExternalProvider: z.boolean() }),
    transition: z.object({ type: z.string(), duration: z.number() }),
  })),
  captions: z.array(z.any()),
  audioPlan: z.any(),
  exports: z.array(z.any()),
  approvalRequired: z.boolean(),
  sourceMetadata: z.any(),
}).passthrough();

const inputSchema = z.object({
  motionSpec: motionSpecSchema,
  format: z.enum(['svg', 'png']).optional().default('svg'),
  mode: z.enum(['hero', 'scenes', 'contact-sheet']).optional().default('scenes'),
  sceneIds: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      ok: false,
      error: "Validation failed",
      details: parsed.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
    }, { status: 400 });
  }

  const spec = parsed.data.motionSpec as FullMotionSpec;
  const validation = validateMotionSpec(spec as any);

  if (!validation.valid) {
    return NextResponse.json({
      ok: false,
      error: "Motion spec validation failed",
      details: validation.errors.map(e => ({ path: e.path, message: e.message })),
    }, { status: 400 });
  }

  if (parsed.data.sceneIds && parsed.data.sceneIds.length > 0) {
    const validIds = new Set(spec.scenes.map(s => s.id));
    const invalid = parsed.data.sceneIds.filter(id => !validIds.has(id));
    if (invalid.length > 0) {
      return NextResponse.json({
        ok: false,
        error: `Invalid scene IDs: ${invalid.join(', ')}`,
      }, { status: 400 });
    }
  }

  try {
    const result = await generateKeyframes(
      spec,
      parsed.data.format,
      parsed.data.mode,
      parsed.data.sceneIds
    );
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "POST /v1/motion/keyframes",
    description: "Generate static keyframe preview images from a motion spec",
    input: {
      motionSpec: "Full motion spec (required)",
      format: "svg or png (default: svg)",
      mode: "hero | scenes | contact-sheet (default: scenes)",
      sceneIds: "Array of specific scene IDs to preview (optional)",
    },
    output: "Base64-encoded SVG or PNG images per scene",
    note: "Keyframes are static previews only. No video is rendered. Human review required.",
  });
}
