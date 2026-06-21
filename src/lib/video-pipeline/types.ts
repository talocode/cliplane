export interface VideoJob {
  id: string;
  status: VideoJobStatus;
  createdAt: string;
  updatedAt: string;
  input: VideoJobInput;
  research: ResearchResult | null;
  script: ScriptResult | null;
  scenes: ScenePlan[];
  assets: AssetPlan[];
  voiceover: VoiceoverPlan | null;
  avatar: AvatarPlan | null;
  motionSpec: unknown | null;
  exports: ExportPlan[];
  approval: ApprovalState;
  error: string | null;
}

export type VideoJobStatus =
  | 'draft' | 'queued' | 'researching' | 'scripting'
  | 'planning_scenes' | 'generating_assets' | 'generating_voiceover'
  | 'generating_avatar' | 'rendering' | 'completed' | 'failed';

export interface VideoJobInput {
  topic: string;
  brief?: string;
  sourceUrls?: string[];
  targetPlatform: string;
  duration: number;
  style: string;
  includeAvatar: boolean;
  includeVoiceover: boolean;
  includeBroll: boolean;
}

export interface ResearchResult {
  sources: { url: string; title: string; excerpt: string }[];
  keyFindings: string[];
  audienceProfile: string;
}

export interface ScriptResult {
  hook: string;
  sections: { title: string; narration: string; duration: number }[];
  cta: string;
  totalWords: number;
  estimatedDuration: number;
}

export interface ScenePlan {
  id: string;
  start: number;
  duration: number;
  type: string;
  attentionRole: string;
  narration: string;
  caption: string;
  visualIntent: string;
  broll: {
    assetType: string;
    prompt: string;
    cameraMotion: string;
    style: string;
    duration: number;
    requiresExternalProvider: boolean;
  };
  transition: { type: string; duration: number };
}

export interface AssetPlan {
  sceneId: string;
  type: string;
  prompt: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  provider: string | null;
  outputPath: string | null;
}

export interface VoiceoverPlan {
  text: string;
  style: string;
  duration: number;
  provider: string | null;
  status: 'pending' | 'generating' | 'ready' | 'failed';
}

export interface AvatarPlan {
  included: boolean;
  scenes: string[];
  provider: string | null;
  status: 'not-requested' | 'pending' | 'generating' | 'ready' | 'failed';
}

export interface ExportPlan {
  platform: string;
  aspectRatio: string;
  width: number;
  height: number;
  fps: number;
  format: string;
  status: 'pending' | 'rendering' | 'ready' | 'failed';
  outputPath: string | null;
}

export interface ApprovalState {
  required: boolean;
  approved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string;
}
