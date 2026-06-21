export interface MotionSpec {
  version: string;
  title: string;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  brand: MotionBrand;
  audio: MotionAudio;
  scenes: MotionScene[];
  exports: MotionExport[];
}

export interface MotionBrand {
  name: string;
  colors: {
    background: string;
    primary: string;
    accent: string;
    secondary?: string;
    muted?: string;
  };
  logo?: string | null;
  fontFamily?: string;
}

export interface MotionAudio {
  voiceover: string | null;
  backgroundMusic: string | null;
  sfx: MotionSfx[];
}

export interface MotionSfx {
  type: string;
  time: number;
  volume?: number;
}

export interface MotionScene {
  id: string;
  start: number;
  duration: number;
  type: 'title' | 'content' | 'transition' | 'cta';
  attentionRole?: 'hook' | 'retention' | 'emotion' | 'distribution';
  background: MotionBackground;
  camera?: MotionCamera;
  elements: MotionElement[];
  transitions?: {
    in?: MotionTransition;
    out?: MotionTransition;
  };
  captions?: MotionCaption[];
}

export interface MotionBackground {
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  start?: string;
  end?: string;
  angle?: number;
  url?: string;
  fit?: string;
}

export interface MotionCamera {
  start: { x: number; y: number; zoom: number };
  end: { x: number; y: number; zoom: number };
  easing?: string;
}

export interface MotionTransition {
  type: 'fade' | 'slide' | 'cameraPush' | 'cut';
  duration: number;
  easing?: string;
  direction?: string;
}

export interface MotionCaption {
  text: string;
  start: number;
  duration: number;
  position: 'bottom' | 'top' | 'lower-third' | 'inline';
  style?: Record<string, unknown>;
}

export interface MotionElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  src?: string;
  style?: Record<string, unknown>;
  animations?: {
    entry?: MotionAnimation;
    loop?: MotionAnimation;
    exit?: MotionAnimation;
  };
  from?: string;
  to?: string;
}

export interface MotionAnimation {
  type: string;
  duration?: number;
  delay?: number;
  from?: unknown;
  speed?: number;
  amount?: number;
  radius?: number;
  startAngle?: number;
  degrees?: number;
  staggerDelay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface MotionExport {
  format: 'mp4' | 'webm';
  aspectRatio?: string;
  width?: number;
  height?: number;
  fps?: number;
  quality?: 'low' | 'medium' | 'high';
  codec?: 'h264' | 'h265' | 'vp9';
}
