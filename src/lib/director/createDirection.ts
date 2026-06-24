import { randomUUID } from 'crypto';
import { buildDirectorMotionSpec } from './motionSpec.js';
import { buildDirectorScenePlan } from './scenePlan.js';
import { createDirectorResponse } from './validate.js';
import type {
  DirectorCreateInput,
  DirectorCreateResult,
  DirectorCreativeBrief,
  DirectorGoal,
  DirectorTone,
  DirectorVideoConcept,
} from './types.js';

export function createDirectorProject(input: DirectorCreateInput): DirectorCreateResult {
  const creativeBrief = buildCreativeBrief(input);
  const videoConcept = buildVideoConcept(input.idea, creativeBrief);
  const scenePlan = buildDirectorScenePlan(creativeBrief, videoConcept);
  const motionSpec = buildDirectorMotionSpec(input.idea, creativeBrief, videoConcept, scenePlan);
  const warnings = buildWarnings(input, creativeBrief);

  return createDirectorResponse({
    ok: true,
    directorProject: {
      id: `director_${randomUUID()}`,
      idea: input.idea,
      creativeBrief,
      videoConcept,
      scenePlan,
      motionSpec,
      revisionHistory: [],
      approvalRequired: true,
      renderedVideo: false,
    },
    warnings,
  });
}

function buildCreativeBrief(input: DirectorCreateInput): DirectorCreativeBrief {
  const tone = input.tone || inferTone(input.idea);
  const goal = input.goal || inferGoal(input.idea);
  const productName = input.productName || inferProductName(input.idea) || 'Talocode product';
  const platform = input.platform || 'youtube-shorts';
  const durationSeconds = input.durationSeconds || 30;

  return {
    productName,
    productUrl: input.productUrl || null,
    audience: input.audience || defaultAudience(goal),
    platform,
    durationSeconds,
    tone,
    goal,
    coreMessage: buildCoreMessage(input.idea, productName, goal),
    visualStyle: visualStyleForTone(tone),
    hookDirection: hookDirectionForTone(tone, goal),
    cta: ctaForGoal(goal, productName),
    musicDirection: musicDirectionForTone(tone),
    platformAdaptationNotes: platformNotes(platform),
    directionNotes: ['Draft-only direction layer', 'Human approval required before any rendering or publishing'],
  };
}

function buildVideoConcept(idea: string, brief: DirectorCreativeBrief): DirectorVideoConcept {
  return {
    title: createTitle(brief.productName, brief.goal),
    format: formatForGoal(brief.goal),
    hook: createHook(idea, brief),
    promise: brief.coreMessage,
    narrativeArc: [
      'Open with the key shift or launch moment.',
      'Frame the audience problem quickly.',
      'Show how the product resolves it.',
      'Land on one proof point and a clear CTA.',
    ],
    ctaLine: brief.cta,
    visualSummary: `${brief.visualStyle} product framing with concise captions, clear timing, and platform-aware pacing.`,
  };
}

function buildWarnings(input: DirectorCreateInput, brief: DirectorCreativeBrief): string[] {
  const warnings: string[] = [];
  if (!input.productUrl) warnings.push('No productUrl provided. Product context is based on the written idea only.');
  if (brief.durationSeconds >= 45) warnings.push('Longer drafts may need tighter scene review before rendering.');
  return warnings;
}

function inferProductName(idea: string): string | null {
  const properNoun = idea.match(/\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\b/);
  return properNoun ? properNoun[1] : null;
}

function inferTone(idea: string): DirectorTone {
  const lowered = idea.toLowerCase();
  if (lowered.includes('premium')) return 'premium';
  if (lowered.includes('cinematic')) return 'cinematic';
  if (lowered.includes('founder')) return 'founder-led';
  if (lowered.includes('playful')) return 'playful';
  if (lowered.includes('educat')) return 'educational';
  return 'bold';
}

function inferGoal(idea: string): DirectorGoal {
  const lowered = idea.toLowerCase();
  if (lowered.includes('launch') || lowered.includes('announce')) return 'launch';
  if (lowered.includes('feature') || lowered.includes('demo')) return 'feature_demo';
  if (lowered.includes('learn') || lowered.includes('explain')) return 'education';
  if (lowered.includes('convert') || lowered.includes('signup')) return 'conversion';
  return 'announcement';
}

function defaultAudience(goal: DirectorGoal): string {
  switch (goal) {
    case 'launch': return 'early adopters evaluating a new product';
    case 'feature_demo': return 'builders who want to understand the product quickly';
    case 'education': return 'teams learning a new workflow';
    case 'conversion': return 'buyers close to action but needing clarity';
    case 'announcement': return 'existing followers and prospective users';
  }
}

function buildCoreMessage(idea: string, productName: string, goal: DirectorGoal): string {
  if (goal === 'feature_demo') return `${productName} makes the feature understandable in one concise video flow.`;
  if (goal === 'education') return `${productName} teaches the workflow with clear steps and review-first motion planning.`;
  if (goal === 'conversion') return `${productName} gives the audience a direct reason to act with clearer proof and timing.`;
  if (goal === 'launch') return `${productName} turns the launch moment into a focused story with a stronger hook and CTA.`;
  return `${productName} turns a rough product idea into a clear motion-ready direction draft.`;
}

function visualStyleForTone(tone: DirectorTone): string {
  switch (tone) {
    case 'premium': return 'restrained, high-contrast, elegant motion with premium spacing';
    case 'cinematic': return 'dramatic lighting, slower camera moves, and confident pacing';
    case 'founder-led': return 'direct, credible framing with authentic product focus';
    case 'educational': return 'clear instructional sequencing with minimal ambiguity';
    case 'playful': return 'lightweight, upbeat motion with bright accent beats';
    case 'bold': return 'decisive typography, quick pacing, and sharp contrast';
  }
}

function hookDirectionForTone(tone: DirectorTone, goal: DirectorGoal): string {
  const goalLead = goal === 'launch' ? 'Lead with the shift this launch creates.' : 'Lead with the audience problem immediately.';
  return `${goalLead} Keep the first line ${tone === 'premium' ? 'understated but confident' : 'tight and unmistakable'}.`;
}

function ctaForGoal(goal: DirectorGoal, productName: string): string {
  switch (goal) {
    case 'conversion': return `Try ${productName} and review the draft before shipping.`;
    case 'education': return `Use ${productName} to turn the idea into a reviewable video plan.`;
    case 'feature_demo': return `See how ${productName} makes the feature easier to explain.`;
    case 'launch': return `Review the launch direction in ${productName} before rendering.`;
    case 'announcement': return `Open ${productName} and refine the announcement direction.`;
  }
}

function musicDirectionForTone(tone: DirectorTone): string {
  switch (tone) {
    case 'premium': return 'Restrained electronic bed with soft pulse and no aggressive drops.';
    case 'bold': return 'Tight rhythmic bed with clean impact accents.';
    case 'founder-led': return 'Minimal underscoring that stays behind the narration.';
    case 'educational': return 'Light, steady underscore that supports clarity over hype.';
    case 'playful': return 'Upbeat, light groove with soft percussive motion.';
    case 'cinematic': return 'Atmospheric pulse with wide, restrained transitions.';
  }
}

function platformNotes(platform: DirectorCreativeBrief['platform']): string[] {
  switch (platform) {
    case 'youtube-shorts':
      return ['Vertical-safe composition', 'Front-load the hook in the first 2-3 seconds', 'Use larger caption sizing for handheld viewing'];
    case 'instagram-reels':
      return ['Vertical-safe composition', 'Keep the CTA visible before the last second', 'Prefer concise on-screen copy'];
    case 'tiktok':
      return ['Vertical-safe composition', 'Use punchier cuts and immediate payoff', 'Keep scene count lean'];
    case 'linkedin':
      return ['Landscape composition', 'Make the proof and product value explicit', 'Prefer crisp, low-hype messaging'];
    case 'x':
      return ['Landscape composition', 'Keep the hook compact', 'Optimize copy for muted autoplay with captions'];
  }
}

function formatForGoal(goal: DirectorGoal): DirectorVideoConcept['format'] {
  switch (goal) {
    case 'launch': return 'launch_trailer';
    case 'feature_demo': return 'feature_spotlight';
    case 'education': return 'educational_cut';
    case 'conversion': return 'feature_spotlight';
    case 'announcement': return 'announcement_cut';
  }
}

function createTitle(productName: string, goal: DirectorGoal): string {
  const suffix = goal === 'launch' ? 'Launch Direction' : goal === 'feature_demo' ? 'Feature Direction' : goal === 'education' ? 'Explainer Direction' : 'Promo Direction';
  return `${productName} ${suffix}`;
}

function createHook(idea: string, brief: DirectorCreativeBrief): string {
  const trimmed = idea.trim().replace(/\.$/, '');
  if (brief.goal === 'launch') return `What if your next launch video started with the clearest reason to care? ${trimmed}`;
  if (brief.goal === 'education') return `Here is the fastest way to understand ${brief.productName}.`;
  if (brief.tone === 'premium') return `${brief.productName}, directed with clarity instead of clutter.`;
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}
