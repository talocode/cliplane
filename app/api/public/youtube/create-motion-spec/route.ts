import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMotionSpec, validateMotionSpec } from "@/lib/motion/spec";

const ideaSchema = z.object({
  title: z.string().min(1).max(200),
  hook: z.string().min(1).max(500),
  audience: z.string().min(1).max(200),
  promise: z.string().min(1).max(500),
  format: z.string().min(1).max(50),
  motionStyle: z.string().optional(),
  clipLoopTemplate: z.string().optional(),
});

const inputSchema = z.object({
  idea: ideaSchema,
  patterns: z.object({
    titlePatterns: z.array(z.string()).optional(),
    hooks: z.array(z.string()).optional(),
    formats: z.array(z.string()).optional(),
  }).optional(),
  brand: z.object({
    name: z.string().optional(),
    colors: z.object({
      background: z.string().optional(),
      primary: z.string().optional(),
      accent: z.string().optional(),
    }).optional(),
  }).optional(),
  output: z.object({
    platform: z.enum(['youtube', 'youtube-shorts', 'x', 'linkedin', 'instagram-reels', 'tiktok']).optional(),
    duration: z.number().int().min(10).max(300).optional(),
    fps: z.number().int().min(24).max(60).optional(),
  }).optional(),
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

  const { idea, patterns, brand, output } = parsed.data;

  try {
    const motionSpec = generateMotionSpec({
      title: idea.title,
      hook: idea.hook,
      audience: idea.audience,
      promise: idea.promise,
      format: idea.format,
      motionStyle: idea.motionStyle,
      platform: output?.platform,
      duration: output?.duration,
      fps: output?.fps,
      brand: brand ? { name: brand.name, colors: brand.colors } : undefined,
      patterns,
    });

    const validation = validateMotionSpec(motionSpec);

    return NextResponse.json({
      ok: true,
      motionSpec,
      validation,
      approvalRequired: true,
      next: "review_motion_spec",
      disclaimer: "This motion spec requires human approval before rendering. No video has been generated.",
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
    endpoint: "POST /v1/youtube/create-motion-spec",
    description: "Generate a ClipLoop motion spec from a video idea",
    input: {
      idea: "{ title, hook, audience, promise, format } (required)",
      patterns: "{ titlePatterns, hooks, formats } (optional)",
      brand: "{ name, colors } (optional)",
      output: "{ platform, duration, fps } (optional)",
    },
    platforms: ["youtube", "youtube-shorts", "x", "linkedin", "instagram-reels", "tiktok"],
    note: "This generates a motion spec plan only. No video is rendered until the render endpoint is called with approval.",
  });
}
