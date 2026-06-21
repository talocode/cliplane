import type { FullMotionSpec } from '../../motion/types.js';
import type { KeyframeMode, KeyframeFormat, KeyframeResult, KeyframeResponse } from './types.js';
import { extractSceneInputs, getHeroInput } from './layout.js';
import { renderToPng, renderToSvg } from './png.js';

export async function generateKeyframes(
  spec: FullMotionSpec,
  format: KeyframeFormat,
  mode: KeyframeMode,
  sceneIds?: string[]
): Promise<KeyframeResponse> {
  const renderFn = format === 'png' ? renderToPng : renderToSvg;
  let keyframes: KeyframeResult[] = [];

  switch (mode) {
    case 'hero': {
      const heroInput = getHeroInput(spec);
      keyframes = [await renderFn(heroInput)];
      break;
    }

    case 'scenes': {
      const inputs = extractSceneInputs(spec, sceneIds);
      keyframes = await Promise.all(inputs.map(input => renderFn(input)));
      break;
    }

    case 'contact-sheet': {
      // For contact sheet, generate individual frames — the API consumer composites them
      const inputs = extractSceneInputs(spec);
      keyframes = await Promise.all(inputs.map(input => renderFn(input)));
      break;
    }
  }

  return {
    ok: true,
    keyframes,
    renderedVideo: false,
    mode,
    format: keyframes[0]?.format || format,
    disclaimer: 'Keyframes are static visual previews only. No video has been rendered. Human review required before any video production.',
  };
}
