import type { FullMotionSpec } from '../motion/types.js';

export interface PreviewResult {
  type: 'html';
  html: string;
  warnings: string[];
  renderedVideo: false;
  metadata: {
    sceneCount: number;
    totalDuration: number;
    platform: string;
    resolution: string;
  };
}

export interface PreviewInput {
  motionSpec: FullMotionSpec;
}

export function generateWarnings(spec: FullMotionSpec): string[] {
  const warnings: string[] = [];

  if (spec.scenes.some(s => s.broll.requiresExternalProvider)) {
    warnings.push('Some scenes require external B-roll providers — those assets will be placeholders');
  }

  if (spec.audioPlan.voiceover === null) {
    warnings.push('No voiceover plan included — preview will be silent');
  }

  if (spec.scenes.some(s => s.duration <= 0)) {
    warnings.push('Some scenes have zero or negative duration');
  }

  const totalSceneTime = spec.scenes.reduce((sum, s) => sum + s.duration, 0);
  if (Math.abs(totalSceneTime - spec.duration) > 2) {
    warnings.push(`Scene timeline (${totalSceneTime}s) differs from spec duration (${spec.duration}s)`);
  }

  return warnings;
}
