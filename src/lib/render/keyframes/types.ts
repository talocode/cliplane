export type KeyframeMode = 'hero' | 'scenes' | 'contact-sheet';
export type KeyframeFormat = 'svg' | 'png';

export interface KeyframeRequest {
  motionSpec: unknown;
  format?: KeyframeFormat;
  mode?: KeyframeMode;
  sceneIds?: string[];
}

export interface KeyframeResult {
  sceneId: string;
  format: 'svg' | 'png';
  data: string;
  width: number;
  height: number;
}

export interface KeyframeResponse {
  ok: true;
  keyframes: KeyframeResult[];
  renderedVideo: false;
  mode: KeyframeMode;
  format: KeyframeFormat;
  disclaimer: string;
}

export interface SceneFrameInput {
  sceneId: string;
  sceneIndex: number;
  totalScenes: number;
  caption: string;
  narration: string;
  visualIntent: string;
  brollPrompt: string;
  brollAssetType: string;
  cameraMotion: string;
  attentionRole: string;
  start: number;
  duration: number;
  type: string;
  brand: {
    name: string;
    colors: { background: string; primary: string; accent: string; secondary: string; muted: string };
  };
  width: number;
  height: number;
  totalDuration: number;
}
