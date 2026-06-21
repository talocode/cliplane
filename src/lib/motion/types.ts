export interface MotionSpecInput {
  idea: {
    title: string;
    hook: string;
    audience: string;
    promise: string;
    format: string;
    motionStyle?: string;
    clipLoopTemplate?: string;
  };
  patterns?: {
    titlePatterns?: string[];
    hooks?: string[];
    formats?: string[];
  };
  brand?: {
    name?: string;
    colors?: {
      background?: string;
      primary?: string;
      accent?: string;
    };
  };
  output?: {
    platform?: string;
    duration?: number;
    fps?: number;
  };
}

export interface SceneSpec {
  id: string;
  start: number;
  duration: number;
  type: 'title' | 'content' | 'transition' | 'cta';
  attentionRole: 'hook' | 'retention' | 'emotion' | 'distribution';
  narration: string;
  caption: string;
  visualIntent: string;
  elements: ElementSpec[];
  animations: AnimationSpec[];
  broll: BrollPlan;
  transition: { type: string; duration: number };
}

export interface ElementSpec {
  id: string;
  type: 'text' | 'logo' | 'card' | 'connector' | 'terminalFrame' | 'browserFrame' | 'shape' | 'gradientBlob';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  style?: Record<string, unknown>;
}

export interface AnimationSpec {
  elementId: string;
  type: 'fade' | 'slide' | 'scale' | 'revealMask' | 'typewriter' | 'cameraPush' | 'parallax' | 'drawLine' | 'pulse';
  duration: number;
  delay: number;
  from?: string;
}

export interface BrollPlan {
  assetType: 'motion-graphic' | 'screen-recording' | 'product-shot' | 'generated-image' | 'generated-video' | 'avatar';
  prompt: string;
  cameraMotion: string;
  style: string;
  duration: number;
  requiresExternalProvider: boolean;
}

export interface CaptionPlan {
  text: string;
  position: 'bottom' | 'center' | 'top';
  fontSize: number;
  maxLineWidth: number;
  emphasisWords: string[];
  style: string;
}

export interface ExportPlan {
  format: string;
  aspectRatio: string;
  width: number;
  height: number;
  fps: number;
  quality: string;
  codec: string;
}

export interface FullMotionSpec {
  version: string;
  title: string;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  platform: string;
  brand: {
    name: string;
    colors: {
      background: string;
      primary: string;
      accent: string;
      secondary: string;
      muted: string;
    };
    fontFamily: string;
  };
  scenes: SceneSpec[];
  captions: CaptionPlan[];
  audioPlan: {
    voiceover: { text: string; style: string; duration: number } | null;
    backgroundMusic: null;
    sfx: unknown[];
  };
  exports: ExportPlan[];
  approvalRequired: boolean;
  sourceMetadata: {
    ideaTitle: string;
    ideaFormat: string;
    generatedAt: string;
    generator: string;
  };
}
