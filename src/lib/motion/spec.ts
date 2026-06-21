import type { FullMotionSpec, SceneSpec, BrollPlan, CaptionPlan, ExportPlan } from './types.js';
import { generateScenes } from './scenes.js';
import { generateCaptions } from './captions.js';

const PLATFORM_CONFIGS: Record<string, { aspectRatio: string; width: number; height: number; fps: number; durationRange: [number, number] }> = {
  youtube: { aspectRatio: '16:9', width: 1920, height: 1080, fps: 60, durationRange: [30, 300] },
  'youtube-shorts': { aspectRatio: '9:16', width: 1080, height: 1920, fps: 60, durationRange: [15, 60] },
  x: { aspectRatio: '16:9', width: 1920, height: 1080, fps: 30, durationRange: [15, 140] },
  linkedin: { aspectRatio: '16:9', width: 1920, height: 1080, fps: 30, durationRange: [30, 180] },
  'instagram-reels': { aspectRatio: '9:16', width: 1080, height: 1920, fps: 30, durationRange: [15, 90] },
  tiktok: { aspectRatio: '9:16', width: 1080, height: 1920, fps: 30, durationRange: [15, 60] },
};

const DEFAULT_BRAND = {
  name: 'Talocode',
  colors: {
    background: '#0b0f14',
    primary: '#ffffff',
    accent: '#f97316',
    secondary: '#06d6a0',
    muted: '#8892b0',
  },
  fontFamily: 'Inter, system-ui, sans-serif',
};

export function generateMotionSpec(input: {
  title: string;
  hook: string;
  audience: string;
  promise: string;
  format: string;
  motionStyle?: string;
  platform?: string;
  duration?: number;
  fps?: number;
  brand?: { name?: string; colors?: { background?: string; primary?: string; accent?: string } };
  patterns?: { titlePatterns?: string[]; hooks?: string[]; formats?: string[] };
}): FullMotionSpec {
  const platform = input.platform || 'youtube';
  const platformConfig = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.youtube;
  const duration = Math.max(
    platformConfig.durationRange[0],
    Math.min(platformConfig.durationRange[1], input.duration || 60)
  );
  const fps = input.fps || platformConfig.fps;
  const isShortForm = platform === 'youtube-shorts' || platform === 'instagram-reels' || platform === 'tiktok';

  const brand = {
    name: input.brand?.name || DEFAULT_BRAND.name,
    colors: {
      background: input.brand?.colors?.background || DEFAULT_BRAND.colors.background,
      primary: input.brand?.colors?.primary || DEFAULT_BRAND.colors.primary,
      accent: input.brand?.colors?.accent || DEFAULT_BRAND.colors.accent,
      secondary: DEFAULT_BRAND.colors.secondary,
      muted: DEFAULT_BRAND.colors.muted,
    },
    fontFamily: DEFAULT_BRAND.fontFamily,
  };

  const scenes = generateScenes({
    title: input.title,
    hook: input.hook,
    promise: input.promise,
    format: input.format,
    duration,
    isShortForm,
    brand,
    patterns: input.patterns,
  });

  const captions = generateCaptions(scenes, isShortForm);

  const voiceoverText = scenes.map(s => s.narration).join(' ');

  const exports: ExportPlan[] = [{
    format: 'mp4',
    aspectRatio: platformConfig.aspectRatio,
    width: platformConfig.width,
    height: platformConfig.height,
    fps,
    quality: 'high',
    codec: 'h264',
  }];

  return {
    version: '0.1',
    title: input.title,
    duration,
    fps,
    resolution: { width: platformConfig.width, height: platformConfig.height },
    platform,
    brand,
    scenes,
    captions,
    audioPlan: {
      voiceover: {
        text: voiceoverText,
        style: isShortForm ? 'energetic' : 'clear',
        duration,
      },
      backgroundMusic: null,
      sfx: [],
    },
    exports,
    approvalRequired: true,
    sourceMetadata: {
      ideaTitle: input.title,
      ideaFormat: input.format,
      generatedAt: new Date().toISOString(),
      generator: 'cliploop-youtube-motion-spec-v0.1',
    },
  };
}

export function validateMotionSpec(spec: FullMotionSpec): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (spec.duration <= 0 || spec.duration > 600) errors.push('Duration must be between 1 and 600 seconds');
  if (spec.scenes.length < 2) errors.push('At least 2 scenes required');
  if (!spec.approvalRequired) errors.push('approvalRequired must be true');
  if (spec.scenes.some(s => s.duration <= 0)) errors.push('All scene durations must be positive');
  if (!spec.captions || spec.captions.length === 0) errors.push('Captions are required');

  let cumulativeTime = 0;
  for (const scene of spec.scenes) {
    if (scene.start < cumulativeTime) {
      errors.push(`Scene ${scene.id} starts before previous scene ends`);
    }
    cumulativeTime = scene.start + scene.duration;
  }

  if (cumulativeTime > spec.duration + 1) {
    errors.push(`Scene timeline (${cumulativeTime}s) exceeds spec duration (${spec.duration}s)`);
  }

  const hasCta = spec.scenes.some(s => s.type === 'cta');
  if (!hasCta) errors.push('CTA scene is required');

  for (const scene of spec.scenes) {
    if (!scene.broll) errors.push(`Scene ${scene.id} missing B-roll plan`);
    if (!scene.caption) errors.push(`Scene ${scene.id} missing caption`);
  }

  return { valid: errors.length === 0, errors };
}
