import { buildDirectorMotionSpec } from './motionSpec.js';
import { buildDirectorScenePlan } from './scenePlan.js';
import { parseRevisionNote, summarizeRevision, clampDuration } from './feedback.js';
import { createDirectorResponse } from './validate.js';
import type { DirectorProject, DirectorReviseInput, DirectorCreateResult } from './types.js';

export function reviseDirectorProject(input: DirectorReviseInput): DirectorCreateResult {
  const feedback = parseRevisionNote(input.revisionNote);
  const updatedProject = applyRevision(input.directorProject, input.revisionNote, feedback);

  return createDirectorResponse({
    ok: true,
    directorProject: updatedProject,
    warnings: [],
  });
}

function applyRevision(
  project: DirectorProject,
  revisionNote: string,
  feedback: ReturnType<typeof parseRevisionNote>
): DirectorProject {
  const creativeBrief = { ...project.creativeBrief };
  const directionNotes = [...creativeBrief.directionNotes];

  if (feedback.requestedTone) creativeBrief.tone = feedback.requestedTone;
  if (feedback.requestedPlatform) {
    creativeBrief.platform = feedback.requestedPlatform;
    creativeBrief.platformAdaptationNotes = refreshPlatformNotes(feedback.requestedPlatform);
  }
  if (feedback.requestedDurationSeconds) {
    creativeBrief.durationSeconds = feedback.requestedDurationSeconds;
  } else if (feedback.intents.includes('shorten')) {
    creativeBrief.durationSeconds = clampDuration(Math.max(15, creativeBrief.durationSeconds - 10));
  } else if (feedback.intents.includes('extend')) {
    creativeBrief.durationSeconds = clampDuration(Math.min(60, creativeBrief.durationSeconds + 15));
  }

  if (feedback.intents.includes('more_founder_led')) {
    creativeBrief.tone = 'founder-led';
    directionNotes.push('Revision emphasizes founder-led credibility.');
  }
  if (feedback.intents.includes('more_technical')) {
    directionNotes.push('Revision increases technical specificity.');
  }
  if (feedback.intents.includes('more_emotional')) {
    directionNotes.push('Revision increases emotional payoff framing.');
  }
  if (feedback.intents.includes('simplify_visuals')) {
    directionNotes.push('Revision simplifies visual density.');
  }
  if (feedback.intents.includes('stronger_cta')) {
    creativeBrief.cta = strengthenCta(creativeBrief.cta, creativeBrief.productName);
  }
  if (feedback.intents.includes('improve_hook')) {
    creativeBrief.hookDirection = `Open faster. Land the value proposition inside ${feedback.requestedHookSeconds || 3} seconds.`;
  }

  feedback.notes.forEach((note) => directionNotes.push(note));
  creativeBrief.directionNotes = Array.from(new Set(directionNotes));
  creativeBrief.musicDirection = reviseMusicDirection(creativeBrief.musicDirection, feedback.intents);

  const videoConcept = {
    ...project.videoConcept,
    hook: reviseHook(project.videoConcept.hook, project.idea, creativeBrief, feedback.intents),
    ctaLine: creativeBrief.cta,
    visualSummary: reviseVisualSummary(project.videoConcept.visualSummary, feedback.intents),
  };

  const scenePlan = buildDirectorScenePlan(creativeBrief, videoConcept, {
    hookSeconds: feedback.requestedHookSeconds,
    strongerCta: feedback.intents.includes('stronger_cta'),
    moreTechnical: feedback.intents.includes('more_technical'),
    moreEmotional: feedback.intents.includes('more_emotional'),
    moreFounderLed: feedback.intents.includes('more_founder_led'),
    simplifyVisuals: feedback.intents.includes('simplify_visuals'),
  });
  const motionSpec = buildDirectorMotionSpec(project.idea, creativeBrief, videoConcept, scenePlan);

  return {
    ...project,
    creativeBrief,
    videoConcept,
    scenePlan,
    motionSpec,
    revisionHistory: [
      ...project.revisionHistory,
      {
        revisionNote,
        intents: feedback.intents,
        createdAt: new Date().toISOString(),
        summary: summarizeRevision(feedback.intents),
      },
    ],
    approvalRequired: true,
    renderedVideo: false,
  };
}

function reviseHook(
  currentHook: string,
  idea: string,
  creativeBrief: DirectorProject['creativeBrief'],
  intents: ReturnType<typeof parseRevisionNote>['intents']
): string {
  if (intents.includes('more_founder_led')) {
    return `We built ${creativeBrief.productName} because the old way of turning ideas into video direction was too slow.`;
  }
  if (intents.includes('more_technical')) {
    return `${creativeBrief.productName} turns one prompt into a brief, scene plan, and motion spec draft before any render call.`;
  }
  if (intents.includes('more_emotional')) {
    return `The fastest way to get your team aligned on a video idea is to see the direction before committing to production.`;
  }
  if (intents.includes('improve_hook')) {
    return `Make the first seconds count: ${idea}`;
  }
  return currentHook;
}

function reviseVisualSummary(current: string, intents: ReturnType<typeof parseRevisionNote>['intents']): string {
  if (intents.includes('simplify_visuals')) {
    return 'Minimal cards, fewer simultaneous elements, and stronger spacing between beats.';
  }
  if (intents.includes('more_emotional')) {
    return 'Cleaner performance framing with more payoff-driven visual pacing.';
  }
  return current;
}

function refreshPlatformNotes(platform: DirectorProject['creativeBrief']['platform']): string[] {
  switch (platform) {
    case 'youtube-shorts': return ['Vertical-safe composition', 'Keep the first beat immediate', 'Use large center-safe captions'];
    case 'instagram-reels': return ['Vertical-safe composition', 'Favor shorter caption lines', 'Bring the CTA forward slightly'];
    case 'tiktok': return ['Vertical-safe composition', 'Increase pace between scenes', 'Keep visual statements compact'];
    case 'linkedin': return ['Landscape-safe composition', 'Make the product value explicit', 'Keep proof and CTA crisp'];
    case 'x': return ['Landscape-safe composition', 'Favor short hook copy', 'Expect muted autoplay and caption-first reading'];
  }
}

function strengthenCta(current: string, productName: string): string {
  if (current.toLowerCase().includes('review')) {
    return `${current} Then approve the draft in ${productName} when the direction is right.`;
  }
  return `Review the direction in ${productName}, tighten the message, and approve the draft.`;
}

function reviseMusicDirection(current: string, intents: ReturnType<typeof parseRevisionNote>['intents']): string {
  if (intents.includes('more_emotional')) return 'Gentle emotional pulse with restrained build and warm texture.';
  if (intents.includes('more_founder_led')) return 'Minimal underscore that supports spoken clarity and trust.';
  if (intents.includes('change_tone')) return current;
  return current;
}
