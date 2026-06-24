import type { AnimationSpec, BrollPlan, ElementSpec, SceneSpec } from '../motion/types.js';
import type { DirectorCreativeBrief, DirectorVideoConcept } from './types.js';

interface ScenePlanOptions {
  hookSeconds?: number;
  strongerCta?: boolean;
  moreTechnical?: boolean;
  moreEmotional?: boolean;
  moreFounderLed?: boolean;
  simplifyVisuals?: boolean;
}

export function buildDirectorScenePlan(
  creativeBrief: DirectorCreativeBrief,
  concept: DirectorVideoConcept,
  options: ScenePlanOptions = {}
): SceneSpec[] {
  const totalDuration = creativeBrief.durationSeconds;
  const sceneDurations = allocateSceneDurations(totalDuration, options.hookSeconds);
  const scenes: SceneSpec[] = [];
  let start = 0;

  const addScene = (
    id: string,
    duration: number,
    type: SceneSpec['type'],
    attentionRole: SceneSpec['attentionRole'],
    narration: string,
    caption: string,
    visualIntent: string,
    broll: BrollPlan
  ) => {
    scenes.push({
      id,
      start,
      duration,
      type,
      attentionRole,
      narration,
      caption,
      visualIntent,
      elements: buildElements(id, type, caption, creativeBrief, options.simplifyVisuals),
      animations: buildAnimations(id, type, creativeBrief.tone, options.simplifyVisuals),
      broll,
      transition: {
        type: type === 'cta' ? 'fade' : creativeBrief.tone === 'cinematic' ? 'cameraPush' : 'cut',
        duration: type === 'cta' ? 0.35 : 0.25,
      },
    });
    start += duration;
  };

  addScene(
    'director_hook',
    sceneDurations[0],
    'title',
    'hook',
    concept.hook,
    trimCaption(concept.hook),
    buildHookVisual(creativeBrief, options),
    buildBroll('motion-graphic', concept.hook, creativeBrief, options, 'slow-push', sceneDurations[0])
  );

  addScene(
    'director_problem',
    sceneDurations[1],
    'content',
    'retention',
    buildProblemNarration(creativeBrief, options),
    trimCaption(`For ${creativeBrief.audience}`),
    options.simplifyVisuals ? 'One clear framing card that names the audience problem.' : 'Fast framing cards that establish the audience problem and stakes.',
    buildBroll('motion-graphic', `Audience problem for ${creativeBrief.audience}`, creativeBrief, options, 'parallax', sceneDurations[1])
  );

  addScene(
    'director_solution',
    sceneDurations[2],
    'content',
    'retention',
    buildSolutionNarration(creativeBrief, concept, options),
    trimCaption(creativeBrief.coreMessage),
    options.simplifyVisuals ? 'Single product walkthrough card with one proof point at a time.' : concept.visualSummary,
    buildBroll('screen-recording', concept.promise, creativeBrief, options, 'slow-zoom-in', sceneDurations[2])
  );

  addScene(
    'director_proof',
    sceneDurations[3],
    'content',
    options.moreEmotional ? 'emotion' : 'retention',
    buildProofNarration(creativeBrief, options),
    trimCaption(options.moreEmotional ? 'Show the payoff clearly' : 'Show the proof clearly'),
    options.simplifyVisuals ? 'Minimal proof card with one metric or result at a time.' : 'Proof sequence with concise metrics, UI highlights, and trust-building pacing.',
    buildBroll('motion-graphic', 'Product proof and payoff', creativeBrief, options, 'static', sceneDurations[3])
  );

  addScene(
    'director_cta',
    sceneDurations[4],
    'cta',
    'distribution',
    buildCtaNarration(creativeBrief, concept, options),
    trimCaption(concept.ctaLine),
    options.strongerCta ? 'Bold CTA frame with product name, direct action, and last-screen clarity.' : 'Closing CTA frame with clear next step and restrained branding.',
    buildBroll('product-shot', concept.ctaLine, creativeBrief, options, 'slow-zoom-out', sceneDurations[4])
  );

  return scenes;
}

function allocateSceneDurations(duration: number, requestedHookSeconds?: number): number[] {
  const hook = Math.max(2, Math.min(requestedHookSeconds || Math.round(duration * 0.2), duration - 9));
  const remaining = duration - hook;
  const problem = Math.max(2, Math.round(remaining * 0.22));
  const solution = Math.max(3, Math.round(remaining * 0.34));
  const proof = Math.max(2, Math.round(remaining * 0.2));
  const cta = duration - hook - problem - solution - proof;
  return [hook, problem, solution, proof, cta];
}

function buildHookVisual(creativeBrief: DirectorCreativeBrief, options: ScenePlanOptions): string {
  if (options.simplifyVisuals) {
    return 'Large headline with one supporting visual cue and clean negative space.';
  }
  if (creativeBrief.tone === 'premium' || creativeBrief.tone === 'cinematic') {
    return 'High-contrast opening with restrained premium typography, subtle camera movement, and focused product framing.';
  }
  return 'Strong opening headline with immediate product framing and crisp motion pacing.';
}

function buildProblemNarration(creativeBrief: DirectorCreativeBrief, options: ScenePlanOptions): string {
  if (options.moreFounderLed) {
    return `The reason we built ${creativeBrief.productName} was simple: ${creativeBrief.audience} needed a faster way to go from concept to usable video direction.`;
  }
  return `${creativeBrief.audience} need a clear way to turn rough ideas into focused video direction without guesswork or filler.`;
}

function buildSolutionNarration(
  creativeBrief: DirectorCreativeBrief,
  concept: DirectorVideoConcept,
  options: ScenePlanOptions
): string {
  const base = `${creativeBrief.productName} turns one idea into a structured creative brief, scene plan, and motion spec draft.`;
  if (options.moreTechnical) {
    return `${base} Each draft keeps timing, captions, transitions, and platform adaptation notes aligned so builders can revise before any render step.`;
  }
  if (options.moreFounderLed) {
    return `We designed ${creativeBrief.productName} so a builder can start from one idea and quickly shape ${concept.format.replace(/_/g, ' ')} direction before any rendering work starts.`;
  }
  return `${base} It keeps the concept focused, reviewable, and ready for revision.`;
}

function buildProofNarration(creativeBrief: DirectorCreativeBrief, options: ScenePlanOptions): string {
  if (options.moreEmotional) {
    return `The payoff is confidence: the team sees the narrative, pacing, and CTA before anyone commits to a render or publish decision.`;
  }
  if (options.moreTechnical) {
    return `The draft includes scene timing, captions, transition notes, music direction, sound cues, and platform adaptation notes for review-first production.`;
  }
  return `You get a review-first draft with the exact motion planning details needed to refine the idea before rendering.`;
}

function buildCtaNarration(
  creativeBrief: DirectorCreativeBrief,
  concept: DirectorVideoConcept,
  options: ScenePlanOptions
): string {
  if (options.strongerCta) {
    return `${concept.ctaLine} Review the direction, tighten the message, and approve the draft before any render or publish step.`;
  }
  return `${concept.ctaLine} Review the draft before rendering or publishing.`;
}

function buildBroll(
  assetType: BrollPlan['assetType'],
  promptSeed: string,
  creativeBrief: DirectorCreativeBrief,
  options: ScenePlanOptions,
  cameraMotion: string,
  duration: number
): BrollPlan {
  const style = options.simplifyVisuals
    ? 'minimal'
    : creativeBrief.tone === 'premium'
      ? 'premium-clean'
      : creativeBrief.tone === 'cinematic'
        ? 'cinematic'
        : creativeBrief.tone;

  return {
    assetType,
    prompt: `${promptSeed}. ${creativeBrief.productName} style. ${creativeBrief.visualStyle}`,
    cameraMotion,
    style,
    duration,
    requiresExternalProvider: false,
  };
}

function buildElements(
  sceneId: string,
  type: SceneSpec['type'],
  caption: string,
  creativeBrief: DirectorCreativeBrief,
  simplifyVisuals?: boolean
): ElementSpec[] {
  if (type === 'cta') {
    return [{
      id: `${sceneId}_cta`,
      type: 'text',
      position: { x: 540, y: 940 },
      size: { width: 880, height: 180 },
      content: caption,
      style: { fontSize: 40, fontWeight: 800, color: '#ffffff', textAlign: 'center' },
    }];
  }

  if (type === 'title') {
    return [{
      id: `${sceneId}_title`,
      type: 'text',
      position: { x: 540, y: 860 },
      size: { width: 920, height: 240 },
      content: caption,
      style: { fontSize: 46, fontWeight: 800, color: '#ffffff', textAlign: 'center' },
    }];
  }

  const elements: ElementSpec[] = [{
    id: `${sceneId}_card`,
    type: 'card',
    position: { x: 540, y: 860 },
    size: { width: 860, height: 280 },
    content: caption,
    style: {
      background: simplifyVisuals ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.88)',
      borderRadius: 18,
      border: '1px solid rgba(249,115,22,0.25)',
    },
  }];

  if (!simplifyVisuals) {
    elements.push({
      id: `${sceneId}_accent`,
      type: 'gradientBlob',
      position: { x: 720, y: 300 },
      size: { width: 280, height: 280 },
      style: { accent: creativeBrief.tone, opacity: 0.55 },
    });
  }

  return elements;
}

function buildAnimations(
  sceneId: string,
  type: SceneSpec['type'],
  tone: DirectorCreativeBrief['tone'],
  simplifyVisuals?: boolean
): AnimationSpec[] {
  const targetId = type === 'cta' ? `${sceneId}_cta` : type === 'title' ? `${sceneId}_title` : `${sceneId}_card`;
  const animations: AnimationSpec[] = [
    { elementId: targetId, type: 'fade', duration: 0.35, delay: 0 },
  ];

  if (type === 'title') {
    animations.push({ elementId: targetId, type: tone === 'cinematic' ? 'scale' : 'slide', duration: 0.45, delay: 0.05, from: 'bottom' });
  } else if (type === 'cta') {
    animations.push({ elementId: targetId, type: 'pulse', duration: 0.6, delay: 0.1 });
  } else {
    animations.push({ elementId: targetId, type: simplifyVisuals ? 'slide' : 'revealMask', duration: 0.5, delay: 0.1, from: 'bottom' });
  }

  return animations;
}

function trimCaption(value: string): string {
  return value.length > 72 ? `${value.slice(0, 69)}...` : value;
}
