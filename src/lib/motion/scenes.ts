import type { SceneSpec, ElementSpec, AnimationSpec, BrollPlan } from './types.js';

interface SceneGenInput {
  title: string;
  hook: string;
  promise: string;
  format: string;
  duration: number;
  isShortForm: boolean;
  brand: { name: string; colors: { background: string; primary: string; accent: string } };
  patterns?: { titlePatterns?: string[]; hooks?: string[]; formats?: string[] };
}

export function generateScenes(input: SceneGenInput): SceneSpec[] {
  const { title, hook, promise, duration, isShortForm, brand } = input;

  if (isShortForm) return generateShortFormScenes(input);
  return generateLongFormScenes(input);
}

function generateLongFormScenes(input: SceneGenInput): SceneSpec[] {
  const { title, hook, promise, duration, brand } = input;
  const scenes: SceneSpec[] = [];
  let t = 0;

  const addScene = (
    id: string,
    dur: number,
    type: SceneSpec['type'],
    role: SceneSpec['attentionRole'],
    narration: string,
    caption: string,
    visualIntent: string,
    broll: BrollPlan
  ) => {
    scenes.push({
      id,
      start: t,
      duration: dur,
      type,
      attentionRole: role,
      narration,
      caption,
      visualIntent,
      elements: generateElements(id, type, caption, brand),
      animations: generateAnimations(id, type),
      broll,
      transition: { type: type === 'cta' ? 'fade' : 'cameraPush', duration: 0.4 },
    });
    t += dur;
  };

  const hookDur = 3;
  addScene('scene_hook', hookDur, 'title', 'hook',
    hook,
    hook,
    `Bold opening statement with large typography over dark background`,
    { assetType: 'motion-graphic', prompt: `Bold text on dark background: "${hook.slice(0, 50)}"`, cameraMotion: 'slow-zoom-in', style: 'cinematic', duration: hookDur, requiresExternalProvider: false }
  );

  const contextDur = Math.round(duration * 0.08);
  addScene('scene_context', contextDur, 'content', 'retention',
    `Here's why this matters for ${input.title.includes('agent') ? 'developers building with AI' : 'modern software teams'}.`,
    'Why this matters',
    `Product name and key feature cards with subtle animation`,
    { assetType: 'motion-graphic', prompt: `Feature cards sliding in on dark background, ${brand.name} theme`, cameraMotion: 'parallax', style: 'clean', duration: contextDur, requiresExternalProvider: false }
  );

  const explainDur = Math.round(duration * 0.25);
  addScene('scene_explain', explainDur, 'content', 'retention',
    promise,
    promise.slice(0, 40),
    `Terminal or code editor showing the core concept in action`,
    { assetType: 'screen-recording', prompt: `Dark terminal showing working code, ${brand.name} product demo style`, cameraMotion: 'slow-push', style: 'terminal-aesthetic', duration: explainDur, requiresExternalProvider: false }
  );

  const proofDur = Math.round(duration * 0.22);
  addScene('scene_proof', proofDur, 'content', 'retention',
    `Real results from real usage. No staging, no faking.`,
    'Real results',
    `Results dashboard, metrics, or before/after comparison`,
    { assetType: 'motion-graphic', prompt: `Results metrics dashboard, dark theme, animated numbers counting up`, cameraMotion: 'static', style: 'data-visualization', duration: proofDur, requiresExternalProvider: false }
  );

  const implDur = Math.round(duration * 0.18);
  addScene('scene_implications', implDur, 'content', 'emotion',
    `This changes how you think about ${input.format === 'comparison' ? 'tool choices' : 'building software'}.`,
    'The bigger picture',
    `Abstract motion graphics showing connected concepts or workflow diagram`,
    { assetType: 'motion-graphic', prompt: `Workflow diagram with connecting lines animating on dark background`, cameraMotion: 'slow-pan', style: 'diagram', duration: implDur, requiresExternalProvider: false }
  );

  const ctaDur = duration - t;
  addScene('scene_cta', ctaDur, 'cta', 'distribution',
    `Try it yourself. Link in the description.`,
    `${brand.name} — link in description`,
    `Install command or URL in terminal frame with product logo`,
    { assetType: 'product-shot', prompt: `${brand.name} product terminal with install command, dark theme`, cameraMotion: 'slow-zoom-out', style: 'product-ct', duration: ctaDur, requiresExternalProvider: false }
  );

  return scenes;
}

function generateShortFormScenes(input: SceneGenInput): SceneSpec[] {
  const { title, hook, duration, brand } = input;
  const scenes: SceneSpec[] = [];
  let t = 0;

  const addScene = (
    id: string, dur: number, type: SceneSpec['type'], role: SceneSpec['attentionRole'],
    narration: string, caption: string, visualIntent: string, broll: BrollPlan
  ) => {
    scenes.push({
      id, start: t, duration: dur, type, attentionRole: role,
      narration, caption, visualIntent,
      elements: generateShortElements(id, caption, brand),
      animations: generateAnimations(id, type),
      broll,
      transition: { type: 'cut', duration: 0 },
    });
    t += dur;
  };

  addScene('sf_hook', 2, 'title', 'hook',
    hook, hook,
    `Large bold text filling the frame, high contrast`,
    { assetType: 'motion-graphic', prompt: `Bold hook text: "${hook.slice(0, 40)}"`, cameraMotion: 'pulse', style: 'bold-minimal', duration: 2, requiresExternalProvider: false }
  );

  const bodyDur = Math.round(duration * 0.6);
  addScene('sf_body', bodyDur, 'content', 'retention',
    `One focused concept. No filler. ${input.promise}.`,
    input.promise.slice(0, 30),
    `Screen recording or motion graphic showing the core idea`,
    { assetType: 'screen-recording', prompt: `Core concept demo, ${brand.name} theme`, cameraMotion: 'slow-push', style: 'focused', duration: bodyDur, requiresExternalProvider: false }
  );

  const ctaDur = duration - t;
  addScene('sf_cta', ctaDur, 'cta', 'distribution',
    `Follow for more. Link in bio.`,
    `Follow @${brand.name.toLowerCase()}`,
    `Brand logo with follow CTA`,
    { assetType: 'motion-graphic', prompt: `${brand.name} logo with follow CTA, dark background`, cameraMotion: 'static', style: 'minimal-cta', duration: ctaDur, requiresExternalProvider: false }
  );

  return scenes;
}

function generateElements(sceneId: string, type: SceneSpec['type'], caption: string, brand: { name: string; colors: { background: string; primary: string; accent: string } }): ElementSpec[] {
  const elements: ElementSpec[] = [];

  if (type === 'title' || type === 'cta') {
    elements.push({
      id: `${sceneId}_text`, type: 'text',
      position: { x: 960, y: 400 }, size: { width: 1200, height: 120 },
      content: caption,
      style: { fontSize: type === 'cta' ? 48 : 56, fontWeight: 700, color: brand.colors.primary, textAlign: 'center' },
    });
  }

  if (type === 'content') {
    elements.push({
      id: `${sceneId}_card`, type: 'card',
      position: { x: 960, y: 400 }, size: { width: 800, height: 300 },
      content: caption,
      style: { background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: `1px solid ${brand.colors.accent}33` },
    });
  }

  return elements;
}

function generateShortElements(sceneId: string, caption: string, brand: { name: string; colors: { background: string; primary: string } }): ElementSpec[] {
  return [{
    id: `${sceneId}_text`, type: 'text',
    position: { x: 540, y: 960 }, size: { width: 900, height: 200 },
    content: caption,
    style: { fontSize: 42, fontWeight: 800, color: brand.colors.primary, textAlign: 'center' },
  }];
}

function generateAnimations(sceneId: string, type: SceneSpec['type']): AnimationSpec[] {
  const anims: AnimationSpec[] = [];
  const elementId = `${sceneId}_text`;

  if (type === 'title' || type === 'cta') {
    anims.push({ elementId, type: 'fade', duration: 0.5, delay: 0 });
    anims.push({ elementId, type: 'scale', duration: 0.6, delay: 0.1 });
  } else {
    anims.push({ elementId, type: 'fade', duration: 0.4, delay: 0 });
    anims.push({ elementId, type: 'slide', duration: 0.5, delay: 0.2, from: 'bottom' });
  }

  return anims;
}
