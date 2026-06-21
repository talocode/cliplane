import type { FullMotionSpec, SceneSpec } from '../motion/types.js';

export interface TimelineBar {
  id: string;
  label: string;
  startPercent: number;
  widthPercent: number;
  cssClass: string;
}

export function computeTimeline(spec: FullMotionSpec): TimelineBar[] {
  const totalDuration = spec.duration;
  if (totalDuration <= 0) return [];

  return spec.scenes.map(scene => ({
    id: scene.id,
    label: scene.id.replace('scene_', '').replace('sf_', ''),
    startPercent: (scene.start / totalDuration) * 100,
    widthPercent: (scene.duration / totalDuration) * 100,
    cssClass: getRoleClass(scene.attentionRole),
  }));
}

function getRoleClass(role: string): string {
  switch (role) {
    case 'hook': return 'hook';
    case 'retention': return 'retention';
    case 'emotion': return 'emotion';
    case 'distribution': return 'distribution';
    default: return 'retention';
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  return `${seconds}s`;
}
