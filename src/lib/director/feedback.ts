import type {
  DirectorDuration,
  DirectorPlatform,
  DirectorTone,
  ParsedDirectorFeedback,
} from './types.js';
import { normalizeRequestedDuration } from './validate.js';

const PLATFORM_MATCHERS: Array<{ pattern: RegExp; value: DirectorPlatform }> = [
  { pattern: /youtube\s*shorts|youtube-shorts/, value: 'youtube-shorts' },
  { pattern: /instagram\s*reels|instagram-reels/, value: 'instagram-reels' },
  { pattern: /linkedin/, value: 'linkedin' },
  { pattern: /tiktok/, value: 'tiktok' },
  { pattern: /\bx\b|twitter/, value: 'x' },
];

const TONE_MATCHERS: Array<{ pattern: RegExp; value: DirectorTone }> = [
  { pattern: /premium/, value: 'premium' },
  { pattern: /bold/, value: 'bold' },
  { pattern: /founder[- ]led/, value: 'founder-led' },
  { pattern: /educational|technical|more technical/, value: 'educational' },
  { pattern: /playful/, value: 'playful' },
  { pattern: /cinematic/, value: 'cinematic' },
];

export function parseRevisionNote(note: string): ParsedDirectorFeedback {
  const normalized = note.toLowerCase();
  const intents = new Set<ParsedDirectorFeedback['intents'][number]>();
  const notes: string[] = [];

  if (/shorten|reduce|tighter|trim|cut/.test(normalized)) intents.add('shorten');
  if (/extend|longer|expand/.test(normalized)) intents.add('extend');
  if (/hook|intro|first 3 seconds|first three seconds/.test(normalized)) intents.add('improve_hook');
  if (/cta|call to action/.test(normalized)) intents.add('stronger_cta');
  if (/technical|more technical/.test(normalized)) intents.add('more_technical');
  if (/emotional|more emotional/.test(normalized)) intents.add('more_emotional');
  if (/founder[- ]led|more founder[- ]led/.test(normalized)) intents.add('more_founder_led');
  if (/simplify visuals|simpler visuals|minimal visuals|cleaner visuals/.test(normalized)) intents.add('simplify_visuals');

  let requestedPlatform: DirectorPlatform | undefined;
  for (const matcher of PLATFORM_MATCHERS) {
    if (matcher.pattern.test(normalized)) {
      requestedPlatform = matcher.value;
      intents.add('change_platform');
      notes.push(`Adapt for ${matcher.value}`);
      break;
    }
  }

  let requestedTone: DirectorTone | undefined;
  for (const matcher of TONE_MATCHERS) {
    if (matcher.pattern.test(normalized)) {
      requestedTone = matcher.value;
      intents.add('change_tone');
      notes.push(`Shift tone toward ${matcher.value}`);
      break;
    }
  }

  const durationMatch = normalized.match(/(?:into|to|make|turn this into|turn it into|for)?\s*(15|20|30|45|60)[- ]?second/);
  const requestedDurationSeconds = normalizeRequestedDuration(durationMatch ? Number(durationMatch[1]) : undefined);
  if (requestedDurationSeconds) {
    if (requestedDurationSeconds <= 30) intents.add('shorten');
    if (requestedDurationSeconds > 30) intents.add('extend');
    notes.push(`Set duration to ${requestedDurationSeconds} seconds`);
  }

  const hookSecondsMatch = normalized.match(/(?:intro|hook|first)\D{0,12}(\d+)\s*seconds?/);
  const requestedHookSeconds = hookSecondsMatch ? Number(hookSecondsMatch[1]) : undefined;
  if (requestedHookSeconds) {
    intents.add('improve_hook');
    notes.push(`Target a ${requestedHookSeconds}-second hook`);
  }

  return {
    intents: Array.from(intents),
    requestedDurationSeconds,
    requestedPlatform,
    requestedTone,
    requestedHookSeconds,
    notes,
  };
}

export function summarizeRevision(intents: ParsedDirectorFeedback['intents']): string {
  if (intents.length === 0) return 'Applied general directional refinements.';
  return `Applied direction updates: ${intents.join(', ')}.`;
}

export function clampDuration(duration: number): DirectorDuration {
  if (duration <= 15) return 15;
  if (duration <= 20) return 20;
  if (duration <= 30) return 30;
  if (duration <= 45) return 45;
  return 60;
}
