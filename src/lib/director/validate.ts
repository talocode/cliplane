import { z } from 'zod';
import type {
  DirectorCreateInput,
  DirectorCreateResult,
  DirectorProject,
  DirectorReviseInput,
} from './types';

const platformSchema = z.enum(['x', 'linkedin', 'youtube-shorts', 'tiktok', 'instagram-reels']);
const durationSchema = z.union([
  z.literal(15),
  z.literal(20),
  z.literal(30),
  z.literal(45),
  z.literal(60),
]);
const toneSchema = z.enum(['premium', 'bold', 'founder-led', 'educational', 'playful', 'cinematic']);
const goalSchema = z.enum(['launch', 'feature_demo', 'education', 'conversion', 'announcement']);

export const directorCreateInputSchema = z.object({
  idea: z.string().trim().min(1, 'idea is required').max(600, 'idea must be 600 characters or fewer'),
  productName: z.string().trim().min(1).max(120).optional(),
  productUrl: z.string().trim().max(500).optional(),
  audience: z.string().trim().min(1).max(200).optional(),
  platform: platformSchema.optional(),
  durationSeconds: durationSchema.optional(),
  tone: toneSchema.optional(),
  goal: goalSchema.optional(),
}).superRefine((input, ctx) => {
  if (input.durationSeconds && input.durationSeconds > 60) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['durationSeconds'], message: 'durationSeconds must be 60 seconds or less in v0.1' });
  }

  if (input.productUrl) {
    const urlError = validatePublicHttpsUrl(input.productUrl);
    if (urlError) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['productUrl'], message: urlError });
    }
  }
});

export const directorReviseInputSchema = z.object({
  directorProject: z.custom<DirectorProject>((value) => isDirectorProject(value), {
    message: 'directorProject is required',
  }),
  revisionNote: z.string().trim().min(1, 'revisionNote is required').max(500),
});

export function validateDirectorCreateInput(input: unknown) {
  return directorCreateInputSchema.safeParse(input);
}

export function validateDirectorReviseInput(input: unknown) {
  return directorReviseInputSchema.safeParse(input);
}

export function createValidationErrorPayload(error: z.ZodError) {
  return {
    ok: false as const,
    error: 'Validation failed',
    details: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

export function validatePublicHttpsUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return 'productUrl must be a valid URL';
  }

  if (url.protocol !== 'https:') {
    return 'productUrl must use HTTPS';
  }

  if (isPrivateOrLocalHostname(url.hostname)) {
    return 'productUrl must not point to localhost or a private network';
  }

  return null;
}

export function normalizeRequestedDuration(value: number | undefined): DirectorDuration | undefined {
  if (!value) return undefined;
  const allowed: DirectorDuration[] = [15, 20, 30, 45, 60];
  return allowed.find((duration) => duration === value);
}

export function createDirectorResponse(result: Omit<DirectorCreateResult, 'disclaimer'>): DirectorCreateResult {
  return {
    ...result,
    disclaimer: 'Draft video direction only. Review before rendering or publishing. No performance guaranteed.',
  };
}

function isDirectorProject(value: unknown): value is DirectorProject {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DirectorProject>;
  return Boolean(
    candidate.id &&
    typeof candidate.id === 'string' &&
    candidate.idea &&
    typeof candidate.idea === 'string' &&
    candidate.creativeBrief &&
    candidate.videoConcept &&
    Array.isArray(candidate.scenePlan) &&
    candidate.motionSpec &&
    Array.isArray(candidate.revisionHistory)
  );
}

function isPrivateOrLocalHostname(hostname: string): boolean {
  const lowered = hostname.toLowerCase();
  if (
    lowered === 'localhost' ||
    lowered.endsWith('.localhost') ||
    lowered.endsWith('.local') ||
    lowered.endsWith('.internal')
  ) {
    return true;
  }

  if (lowered === '0.0.0.0' || lowered === '::1' || lowered === '[::1]') {
    return true;
  }

  if (!/^\d+\.\d+\.\d+\.\d+$/.test(lowered)) {
    return false;
  }

  const octets = lowered.split('.').map((part) => Number(part));
  if (octets.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true;
  }

  const [first, second] = octets;
  if (first === 10 || first === 127) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 169 && second === 254) return true;
  return false;
}
