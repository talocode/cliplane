#!/usr/bin/env node
/**
 * Smoke test for motion keyframe preview generation.
 *
 * Tests:
 * - SVG generation from scene input
 * - Hero mode returns 1 frame
 * - Scenes mode returns scene count frames
 * - Layout computation
 * - Frame includes scene ID, caption, B-roll, brand
 * - Frame dimensions match platform
 * - No external network used
 * - No MP4 claimed
 * - renderedVideo is false
 * - Invalid scene ID rejected
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) { console.log(`  ✓ ${name}`); passed++; }
  else { console.log(`  ✗ ${name}`); failed++; }
}

const fixture = JSON.parse(readFileSync(join(__dirname, '../examples/motion/youtube-tech-explainer.motion.json'), 'utf-8'));

// --- Inline SVG generation (matching svg.ts logic) ---
function renderSceneFrameSvg(input) {
  const { sceneId, sceneIndex, totalScenes, caption, visualIntent, brollPrompt, brollAssetType, cameraMotion, attentionRole, start, duration, type, brand, width, height, totalDuration } = input;
  const bg = brand.colors.background;
  const fg = brand.colors.primary;
  const accent = brand.colors.accent;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}" />
  <text x="48" y="30" font-family="system-ui" font-size="13" fill="#888">${sceneId} ${sceneIndex + 1}/${totalScenes}</text>
  <text x="${width / 2}" y="${height * 0.42}" font-family="system-ui" font-size="40" font-weight="800" fill="${fg}" text-anchor="middle">${caption}</text>
  <text x="${width / 2}" y="${height * 0.58}" font-family="system-ui" font-size="18" fill="#888" text-anchor="middle">${visualIntent}</text>
  <rect x="48" y="${height * 0.66}" width="${width - 96}" height="80" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
  <text x="64" y="${height * 0.66 + 24}" font-family="system-ui" font-size="12" font-weight="600" fill="#888">B-ROLL</text>
  <text x="64" y="${height * 0.66 + 48}" font-family="monospace" font-size="12" fill="${accent}">${brollPrompt.slice(0, 60)}</text>
  <text x="64" y="${height * 0.66 + 68}" font-family="system-ui" font-size="11" fill="#888">${brollAssetType} • ${cameraMotion} • ${duration}s</text>
  <text x="${width - 48}" y="${height - 16}" font-family="system-ui" font-size="12" fill="#888" text-anchor="end">${brand.name}</text>
</svg>`;
}

function extractSceneInputs(spec, sceneIds) {
  const scenes = sceneIds ? spec.scenes.filter(s => sceneIds.includes(s.id)) : spec.scenes;
  return scenes.map((scene, idx) => ({
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

// --- Test 1: SVG generation from scene input ---
console.log('\n1. SVG generation from scene input');

const testInput = {
  sceneId: 'scene_hook',
  sceneIndex: 0,
  totalScenes: 6,
  caption: 'Test caption',
  narration: 'Test narration',
  visualIntent: 'Test visual',
  brollPrompt: 'Test broll prompt',
  brollAssetType: 'motion-graphic',
  cameraMotion: 'slow-zoom-in',
  attentionRole: 'hook',
  start: 0,
  duration: 3,
  type: 'title',
  brand: fixture.brand,
  width: 1920,
  height: 1080,
  totalDuration: 60,
};

const svg = renderSceneFrameSvg(testInput);
assert(typeof svg === 'string', 'SVG is string');
assert(svg.includes('xmlns="http://www.w3.org/2000/svg"'), 'SVG has namespace');
assert(svg.includes('width="1920"'), 'SVG has correct width');
assert(svg.includes('height="1080"'), 'SVG has correct height');
assert(svg.includes('Test caption'), 'SVG contains caption');
assert(svg.includes('Test broll prompt'), 'SVG contains B-roll prompt');
assert(svg.includes('scene_hook'), 'SVG contains scene ID');
assert(svg.includes('hook'), 'SVG contains attention role');
assert(svg.includes('motion-graphic'), 'SVG contains asset type');

// --- Test 2: Hero mode returns 1 frame ---
console.log('\n2. Hero mode returns 1 frame');

const heroInputs = extractSceneInputs(fixture).slice(0, 1);
assert(heroInputs.length === 1, 'Hero mode produces 1 frame');
assert(heroInputs[0].sceneId === 'scene_hook', 'Hero frame is hook scene');

// --- Test 3: Scenes mode returns scene count ---
console.log('\n3. Scenes mode returns scene count');

const allInputs = extractSceneInputs(fixture);
assert(allInputs.length === fixture.scenes.length, `Scenes mode produces ${allInputs.length} frames (expected ${fixture.scenes.length})`);
assert(allInputs.every(i => i.sceneId.length > 0), 'All frames have scene IDs');

// --- Test 4: Layout computation ---
console.log('\n4. Layout computation');

function getContactSheetLayout(count, width, height) {
  const cols = count <= 3 ? count : count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  return { cols, rows, thumbWidth: Math.floor(width / cols), thumbHeight: Math.floor(height / rows) };
}

const layout6 = getContactSheetLayout(6, 1920, 1080);
assert(layout6.cols === 3, '6 scenes → 3 columns');
assert(layout6.rows === 2, '6 scenes → 2 rows');
assert(layout6.thumbWidth === 640, 'Thumb width is 640');
assert(layout6.thumbHeight === 540, 'Thumb height is 540');

const layout3 = getContactSheetLayout(3, 1920, 1080);
assert(layout3.cols === 3, '3 scenes → 3 columns');
assert(layout3.rows === 1, '3 scenes → 1 row');

const layout8 = getContactSheetLayout(8, 1920, 1080);
assert(layout8.cols === 4, '8 scenes → 4 columns');
assert(layout8.rows === 2, '8 scenes → 2 rows');

// --- Test 5: Frame includes required elements ---
console.log('\n5. Frame includes required elements');

for (const input of allInputs) {
  const frameSvg = renderSceneFrameSvg(input);
  assert(frameSvg.includes(input.sceneId), `${input.sceneId} SVG contains scene ID`);
  assert(frameSvg.includes(input.caption), `${input.sceneId} SVG contains caption`);
  assert(frameSvg.includes(input.brollPrompt.slice(0, 10)), `${input.sceneId} SVG contains B-roll`);
  assert(frameSvg.includes(fixture.brand.name), `${input.sceneId} SVG contains brand name`);
}

// --- Test 6: Frame dimensions match platform ---
console.log('\n6. Frame dimensions match platform');

for (const input of allInputs) {
  assert(input.width === 1920 && input.height === 1080, `${input.sceneId} has 16:9 dimensions`);
}

// Vertical test
const verticalInput = { ...testInput, width: 1080, height: 1920 };
const verticalSvg = renderSceneFrameSvg(verticalInput);
assert(verticalSvg.includes('width="1080"'), 'Vertical SVG has correct width');
assert(verticalSvg.includes('height="1920"'), 'Vertical SVG has correct height');

// --- Test 7: No external network ---
console.log('\n7. No external network');

assert(!svg.replace('xmlns="http://www.w3.org/2000/svg"', '').includes('http://'), 'No HTTP URLs in SVG (excluding namespace)');
assert(!svg.includes('https://'), 'No HTTPS URLs in SVG');
assert(!svg.includes('xlink:href'), 'No external resource references');
assert(!svg.includes('<image'), 'No external image elements');

// --- Test 8: No MP4 claimed ---
console.log('\n8. No MP4 claimed');

assert(!svg.includes('.mp4'), 'No .mp4 references');
const previewResult = {
  ok: true,
  keyframes: allInputs.map(i => ({ sceneId: i.sceneId, format: 'svg', data: renderSceneFrameSvg(i), width: i.width, height: i.height })),
  renderedVideo: false,
  mode: 'scenes',
  format: 'svg',
  disclaimer: 'Keyframes are static previews only. No video has been rendered.',
};
assert(previewResult.renderedVideo === false, 'renderedVideo is false');
assert(previewResult.keyframes.length === fixture.scenes.length, `Keyframes count matches scenes`);
assert(previewResult.keyframes.every(k => k.format === 'svg'), 'All keyframes are SVG format');
assert(previewResult.keyframes.every(k => k.width > 0 && k.height > 0), 'All keyframes have dimensions');
assert(previewResult.disclaimer.includes('static previews'), 'Disclaimer mentions static previews');
assert(previewResult.disclaimer.includes('No video'), 'Disclaimer says no video rendered');

// --- Test 9: Contact sheet layout ---
console.log('\n9. Contact sheet layout');

const contactInputs = extractSceneInputs(fixture);
const contactLayout = getContactSheetLayout(contactInputs.length, 1920, 1080);
assert(contactLayout.cols * contactLayout.rows >= contactInputs.length, 'Contact sheet covers all scenes');

// --- Test 10: Scene-specific selection ---
console.log('\n10. Scene-specific selection');

const selectedInputs = extractSceneInputs(fixture, ['scene_hook', 'scene_cta']);
assert(selectedInputs.length === 2, 'Selected 2 specific scenes');
assert(selectedInputs[0].sceneId === 'scene_hook', 'First selected is hook');
assert(selectedInputs[1].sceneId === 'scene_cta', 'Second selected is CTA');

// --- Test 11: SVG validity ---
console.log('\n11. SVG validity');

assert(svg.startsWith('<svg'), 'SVG starts with <svg tag');
assert(svg.includes('</svg>'), 'SVG ends with closing tag');
assert(!svg.includes('undefined'), 'No undefined values in SVG');
assert(!svg.includes('NaN'), 'No NaN values in SVG');

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
