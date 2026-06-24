import { generateCaptions, validateMotionSpec } from '../motion/index.js';
import type { ExportPlan, SceneSpec } from '../motion/types.js';
import type { DirectorCreativeBrief, DirectorMotionSpec, DirectorVideoConcept } from './types.js';

const PLATFORM_EXPORTS: Record<DirectorCreativeBrief['platform'], { width: number; height: number; fps: number; aspectRatio: string }> = {
  x: { width: 1920, height: 1080, fps: 30, aspectRatio: '16:9' },
  linkedin: { width: 1920, height: 1080, fps: 30, aspectRatio: '16:9' },
  'youtube-shorts': { width: 1080, height: 1920, fps: 60, aspectRatio: '9:16' },
  tiktok: { width: 1080, height: 1920, fps: 30, aspectRatio: '9:16' },
  'instagram-reels': { width: 1080, height: 1920, fps: 30, aspectRatio: '9:16' },
};

export function buildDirectorMotionSpec(
  idea: string,
  creativeBrief: DirectorCreativeBrief,
  concept: DirectorVideoConcept,
  scenePlan: SceneSpec[]
): DirectorMotionSpec {
  const output = PLATFORM_EXPORTS[creativeBrief.platform];
  const isShortForm = output.aspectRatio === '9:16';
  const captions = generateCaptions(scenePlan, isShortForm);
  const ctaScene = scenePlan.find((scene) => scene.type === 'cta') || scenePlan[scenePlan.length - 1];
  const exports: ExportPlan[] = [{
    format: 'mp4',
    aspectRatio: output.aspectRatio,
    width: output.width,
    height: output.height,
    fps: output.fps,
    quality: 'high',
    codec: 'h264',
  }];

  const motionSpec: DirectorMotionSpec = {
    version: '0.1',
    title: concept.title,
    duration: creativeBrief.durationSeconds,
    fps: output.fps,
    resolution: { width: output.width, height: output.height },
    platform: creativeBrief.platform,
    brand: {
      name: creativeBrief.productName,
      colors: {
        background: '#0b0f14',
        primary: '#ffffff',
        accent: '#f97316',
        secondary: '#06d6a0',
        muted: '#94a3b8',
      },
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    scenes: scenePlan,
    captions,
    audioPlan: {
      voiceover: {
        text: scenePlan.map((scene) => scene.narration).join(' '),
        style: creativeBrief.tone === 'founder-led' ? 'founder-led' : creativeBrief.tone,
        duration: creativeBrief.durationSeconds,
      },
      backgroundMusic: null,
      sfx: scenePlan.map((scene) => ({ sceneId: scene.id, cue: `Accent ${scene.transition.type} transition` })),
    },
    exports,
    approvalRequired: true,
    sourceMetadata: {
      ideaTitle: idea,
      ideaFormat: concept.format,
      generatedAt: new Date().toISOString(),
      generator: 'cliploop-director-mode-v0.1',
    },
    transitionNotes: scenePlan.map((scene) => `${scene.id}: ${scene.transition.type} (${scene.transition.duration}s)`),
    musicDirection: creativeBrief.musicDirection,
    soundEffectSuggestions: [
      'Subtle UI tick for key text reveals',
      'Soft whoosh for scene transitions',
      'Light impact for CTA arrival',
    ],
    ctaMoment: {
      sceneId: ctaScene.id,
      start: ctaScene.start,
      line: ctaScene.caption,
    },
    platformAdaptationNotes: creativeBrief.platformAdaptationNotes,
    renderedVideo: false,
  };

  const validation = validateMotionSpec(motionSpec);
  if (!validation.valid) {
    throw new Error(`Director motion spec validation failed: ${validation.errors.join('; ')}`);
  }

  return motionSpec;
}
