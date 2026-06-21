import type { SceneSpec, CaptionPlan } from './types.js';

export function generateCaptions(scenes: SceneSpec[], isShortForm: boolean): CaptionPlan[] {
  return scenes.map(scene => ({
    text: scene.caption,
    position: isShortForm ? 'center' : 'bottom',
    fontSize: isShortForm ? 36 : 28,
    maxLineWidth: isShortForm ? 30 : 50,
    emphasisWords: extractEmphasisWords(scene.narration),
    style: 'sans-serif',
  }));
}

function extractEmphasisWords(text: string): string[] {
  const words = text.split(/\s+/);
  const emphasis: string[] = [];
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z]/g, '');
    if (clean.length > 6 && clean === clean.toUpperCase() && /[A-Z]/.test(clean)) {
      emphasis.push(clean);
    }
  }
  if (emphasis.length === 0) {
    const significant = words.filter(w => w.length > 5).slice(0, 2);
    return significant.map(w => w.replace(/[^a-zA-Z]/g, ''));
  }
  return emphasis.slice(0, 3);
}
