import { NextResponse } from "next/server";
import { z } from "zod";
import { auditChannel } from "@/lib/youtube/audit";
import { YouTubeApiKeyMissingError, YouTubeApiError, ChannelUrlParseError } from "@/lib/youtube/errors";

const inputSchema = z.object({
  channelUrl: z.string().min(1, "channelUrl is required"),
  maxVideos: z.number().int().min(1).max(50).optional().default(20),
  niche: z.string().optional(),
  goal: z.string().optional(),
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
        details: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  try {
    const result = await auditChannel(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof YouTubeApiKeyMissingError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: "YOUTUBE_API_KEY_MISSING" },
        { status: 503 }
      );
    }
    if (e instanceof ChannelUrlParseError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: "INVALID_CHANNEL_URL" },
        { status: 400 }
      );
    }
    if (e instanceof YouTubeApiError) {
      return NextResponse.json(
        { ok: false, error: e.message, code: "YOUTUBE_API_ERROR", details: e.youtubeError },
        { status: e.status >= 400 && e.status < 600 ? e.status : 502 }
      );
    }
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      endpoint: "POST /v1/youtube/audit-channel",
      description: "Audit a public YouTube channel and extract content patterns",
      requiresEnv: "YOUTUBE_API_KEY",
      input: {
        channelUrl: "https://www.youtube.com/@handle (required)",
        maxVideos: "number 1-50, default 20",
        niche: "string, optional — content niche description",
        goal: "string, optional — what you want to achieve",
      },
    }
  );
}
