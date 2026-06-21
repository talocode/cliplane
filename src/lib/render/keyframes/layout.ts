import type { FullMotionSpec, SceneSpec } from '../../motion/types.js';
import type { SceneFrameInput } from './types.js';

export function extractSceneInputs(spec: FullMotionSpec, sceneIds?: string[]): SceneFrameInput[] {
  const scenes = sceneIds
    ? spec.scenes.filter(s => sceneIds.includes(s.id))
    : spec.scenes;

  return scenes.map((scene, index) => ({
    sceneId: scene.id,
    sceneIndex: spec.scenes.indexOf(scene),
    totalScenes: spec.scenes.length,
    caption: scene.caption,
    narration: scene.narration,
    visualIntent: scene.visualIntent,
    brollPrompt: scene.broll.prompt,
    brollAssetType: scene.broll.assetType,
    cameraMotion: scene.broll.cameraMotion,
    attentionRole: scene.attentionRole,
    start: scene.start,
    duration: scene.duration,
    type: scene.type,
    brand: spec.brand,
    width: spec.resolution.width,
    height: spec.resolution.height,
    totalDuration: spec.duration,
  }));
}

export function getHeroInput(spec: FullMotionSpec): SceneFrameInput {
  const hookScene = spec.scenes.find(s => s.attentionRole === 'hook') || spec.scenes[0];
  return {
    sceneId: hookScene.id,
    sceneIndex: spec.scenes.indexOf(hookScene),
    totalScenes: spec.scenes.length,
    caption: hookScene.caption,
    narration: hookScene.narration,
    visualIntent: hookScene.visualIntent,
    brollPrompt: hookScene.broll.prompt,
    brollAssetType: hookScene.broll.assetType,
    cameraMotion: hookScene.broll.cameraMotion,
    attentionRole: hookScene.attentionRole,
    start: hookScene.start,
    duration: hookScene.duration,
    type: hookScene.type,
    brand: spec.brand,
    width: spec.resolution.width,
    height: spec.resolution.height,
    totalDuration: spec.duration,
  };
}

export function getContactSheetLayout(spec: FullMotionSpec): { cols: number; rows: number; thumbWidth: number; thumbHeight: number } {
  const count = spec.scenes.length;
  const cols = count <= 3 ? count : count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const thumbWidth = Math.floor(spec.resolution.width / cols);
  const thumbHeight = Math.floor(spec.resolution.height / rows);
  return { cols, rows, thumbWidth, thumbHeight };
}
