import type { FullMotionSpec, SceneSpec } from '../motion/types.js';

export type DirectorPlatform = 'x' | 'linkedin' | 'youtube-shorts' | 'tiktok' | 'instagram-reels';
export type DirectorDuration = 15 | 20 | 30 | 45 | 60;
export type DirectorTone = 'premium' | 'bold' | 'founder-led' | 'educational' | 'playful' | 'cinematic';
export type DirectorGoal = 'launch' | 'feature_demo' | 'education' | 'conversion' | 'announcement';

export interface DirectorCreateInput {
  idea: string;
  productName?: string;
  productUrl?: string;
  audience?: string;
  platform?: DirectorPlatform;
  durationSeconds?: DirectorDuration;
  tone?: DirectorTone;
  goal?: DirectorGoal;
}

export interface DirectorCreativeBrief {
  productName: string;
  productUrl: string | null;
  audience: string;
  platform: DirectorPlatform;
  durationSeconds: DirectorDuration;
  tone: DirectorTone;
  goal: DirectorGoal;
  coreMessage: string;
  visualStyle: string;
  hookDirection: string;
  cta: string;
  musicDirection: string;
  platformAdaptationNotes: string[];
  directionNotes: string[];
}

export interface DirectorVideoConcept {
  title: string;
  format: 'launch_trailer' | 'feature_spotlight' | 'educational_cut' | 'announcement_cut';
  hook: string;
  promise: string;
  narrativeArc: string[];
  ctaLine: string;
  visualSummary: string;
}

export interface DirectorCtaMoment {
  sceneId: string;
  start: number;
  line: string;
}

export interface DirectorMotionSpec extends FullMotionSpec {
  transitionNotes: string[];
  musicDirection: string;
  soundEffectSuggestions: string[];
  ctaMoment: DirectorCtaMoment;
  platformAdaptationNotes: string[];
  renderedVideo: false;
}

export type DirectorRevisionIntent =
  | 'shorten'
  | 'extend'
  | 'change_tone'
  | 'change_platform'
  | 'improve_hook'
  | 'stronger_cta'
  | 'more_technical'
  | 'more_emotional'
  | 'more_founder_led'
  | 'simplify_visuals';

export interface DirectorRevisionEntry {
  revisionNote: string;
  intents: DirectorRevisionIntent[];
  createdAt: string;
  summary: string;
}

export interface DirectorProject {
  id: string;
  idea: string;
  creativeBrief: DirectorCreativeBrief;
  videoConcept: DirectorVideoConcept;
  scenePlan: SceneSpec[];
  motionSpec: DirectorMotionSpec;
  revisionHistory: DirectorRevisionEntry[];
  approvalRequired: true;
  renderedVideo: false;
}

export interface DirectorCreateResult {
  ok: true;
  directorProject: DirectorProject;
  warnings: string[];
  disclaimer: string;
}

export interface DirectorReviseInput {
  directorProject: DirectorProject;
  revisionNote: string;
}

export interface ParsedDirectorFeedback {
  intents: DirectorRevisionIntent[];
  requestedDurationSeconds?: DirectorDuration;
  requestedPlatform?: DirectorPlatform;
  requestedTone?: DirectorTone;
  requestedHookSeconds?: number;
  notes: string[];
}
