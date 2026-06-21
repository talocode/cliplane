import { renderSceneFrameSvg } from './svg.js';
import type { SceneFrameInput, KeyframeResult } from './types.js';

let sharpAvailable = false;
let sharpModule: typeof import('sharp') | null = null;

async function ensureSharp(): Promise<boolean> {
  if (sharpModule) return true;
  try {
    sharpModule = await import('sharp');
    sharpAvailable = true;
    return true;
  } catch {
    sharpAvailable = false;
    return false;
  }
}

export async function renderToPng(input: SceneFrameInput): Promise<KeyframeResult> {
  const svgString = renderSceneFrameSvg(input);
  const hasSharp = await ensureSharp();

  if (hasSharp && sharpModule) {
    try {
      const buffer = await sharpModule(Buffer.from(svgString))
        .png({ quality: 95 })
        .toBuffer();
      const base64 = buffer.toString('base64');
      return {
        sceneId: input.sceneId,
        format: 'png',
        data: `data:image/png;base64,${base64}`,
        width: input.width,
        height: input.height,
      };
    } catch {
      // Fall through to SVG
    }
  }

  return {
    sceneId: input.sceneId,
    format: 'svg',
    data: `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`,
    width: input.width,
    height: input.height,
  };
}

export async function renderToSvg(input: SceneFrameInput): Promise<KeyframeResult> {
  const svgString = renderSceneFrameSvg(input);
  return {
    sceneId: input.sceneId,
    format: 'svg',
    data: `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`,
    width: input.width,
    height: input.height,
  };
}
