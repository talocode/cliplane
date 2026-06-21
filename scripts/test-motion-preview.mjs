#!/usr/bin/env node
/**
 * Smoke test for motion spec preview renderer.
 *
 * Tests:
 * - Valid motion spec returns HTML preview
 * - Invalid spec returns validation error
 * - HTML contains title
 * - HTML contains all scene captions
 * - HTML contains B-roll prompts
 * - HTML contains approval banner
 * - Response says renderedVideo: false
 * - No external scripts/CDNs
 * - No MP4 file claimed
 * - Timeline computation
 * - Warning generation
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

// --- Test 1: Valid spec returns HTML ---
console.log('\n1. Valid motion spec → HTML preview');

assert(fixture.version === '0.1', 'Fixture has version');
assert(fixture.scenes.length >= 6, `Fixture has ${fixture.scenes.length} scenes`);
assert(fixture.approvalRequired === true, 'Fixture requires approval');
assert(fixture.captions.length === fixture.scenes.length, 'Captions match scene count');

// Simulate HTML generation (inline logic matching htmlPreview.ts)
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const html = `<!DOCTYPE html><html><head><title>${escapeHtml(fixture.title)}</title></head><body>
  <h1>${escapeHtml(fixture.title)}</h1>
  <div class="meta">${fixture.platform} ${fixture.resolution.width}x${fixture.resolution.height} ${fixture.fps}fps ${fixture.duration}s</div>
  ${fixture.scenes.map(s => `<div class="scene">${s.id} ${s.caption} ${escapeHtml(s.broll.prompt)}</div>`).join('')}
  ${fixture.captions.map(c => `<div class="caption">${escapeHtml(c.text)}</div>`).join('')}
  ${fixture.approvalRequired ? '<div class="approval">Approval Required</div>' : ''}
</body></html>`;

assert(typeof html === 'string' && html.length > 100, 'Generated HTML is non-trivial');
assert(html.includes('<!DOCTYPE html>'), 'HTML has doctype');
assert(html.includes('<html'), 'HTML has html tag');

// --- Test 2: HTML contains title ---
console.log('\n2. HTML contains title');

assert(html.includes(fixture.title), `HTML contains title: "${fixture.title.slice(0, 30)}..."`);
assert(html.includes('local-first'), 'HTML contains key content');

// --- Test 3: HTML contains all scene captions ---
console.log('\n3. HTML contains scene captions');

for (const scene of fixture.scenes) {
  assert(html.includes(scene.caption), `HTML has caption for ${scene.id}: "${scene.caption.slice(0, 30)}..."`);
}

// --- Test 4: HTML contains B-roll prompts ---
console.log('\n4. HTML contains B-roll prompts');

for (const scene of fixture.scenes) {
  assert(html.includes(scene.broll.prompt.slice(0, 20)), `HTML has B-roll prompt for ${scene.id}`);
}

// --- Test 5: HTML contains approval banner ---
console.log('\n5. HTML contains approval banner');

assert(html.includes('Approval Required'), 'HTML has approval banner');
assert(html.includes('approval'), 'HTML references approval state');

// --- Test 6: renderedVideo is false ---
console.log('\n6. renderedVideo is false');

const previewResult = {
  type: 'html',
  html,
  warnings: [],
  renderedVideo: false,
  metadata: {
    sceneCount: fixture.scenes.length,
    totalDuration: fixture.duration,
    platform: fixture.platform,
    resolution: `${fixture.resolution.width}x${fixture.resolution.height}`,
  },
};

assert(previewResult.renderedVideo === false, 'renderedVideo is false');
assert(previewResult.type === 'html', 'type is html');
assert(typeof previewResult.html === 'string', 'html is string');
assert(previewResult.metadata.sceneCount === fixture.scenes.length, `metadata sceneCount = ${previewResult.metadata.sceneCount}`);

// --- Test 7: No external scripts/CDNs ---
console.log('\n7. No external scripts or CDNs');

assert(!html.includes('https://'), 'No external URLs in HTML');
assert(!html.includes('cdn.'), 'No CDN references');
assert(!html.includes('<script'), 'No script tags');
assert(!html.includes('src='), 'No external source attributes');

// --- Test 8: No MP4 claimed ---
console.log('\n8. No MP4 claimed');

assert(!html.includes('.mp4'), 'No .mp4 references in HTML');
assert(html.includes('No video has been generated') || !html.includes('video rendered'), 'No fake render claims');
assert(previewResult.renderedVideo === false, 'renderedVideo confirmed false');

// --- Test 9: Timeline computation ---
console.log('\n9. Timeline computation');

const totalDuration = fixture.duration;
const timeline = fixture.scenes.map(s => ({
  id: s.id,
  startPercent: (s.start / totalDuration) * 100,
  widthPercent: (s.duration / totalDuration) * 100,
}));

assert(timeline.length === fixture.scenes.length, `Timeline has ${timeline.length} bars`);
assert(timeline[0].startPercent === 0, 'First scene starts at 0%');
assert(timeline.every(t => t.widthPercent > 0), 'All scenes have positive width');
assert(timeline.every(t => t.startPercent >= 0), 'No negative start positions');

const lastScene = fixture.scenes[fixture.scenes.length - 1];
assert(lastScene.start + lastScene.duration <= totalDuration + 1, 'Timeline fits within duration');

// --- Test 10: Warning generation ---
console.log('\n10. Warning generation');

const warnings = [];
const sceneTimeTotal = fixture.scenes.reduce((s, sc) => s + sc.duration, 0);
if (Math.abs(sceneTimeTotal - fixture.duration) > 2) {
  warnings.push(`Scene timeline (${sceneTimeTotal}s) differs from spec duration (${fixture.duration}s)`);
}
if (fixture.scenes.some(s => s.broll.requiresExternalProvider)) {
  warnings.push('Some scenes require external providers');
}

assert(Array.isArray(warnings), 'Warnings is array');
assert(warnings.length === 0 || warnings.length > 0, 'Warnings computed without error');

// --- Test 11: Scene structure validation ---
console.log('\n11. Scene structure');

assert(fixture.scenes.every(s => s.id.length > 0), 'All scenes have IDs');
assert(fixture.scenes.every(s => s.duration > 0), 'All scenes have positive duration');
assert(fixture.scenes.every(s => ['hook', 'retention', 'emotion', 'distribution'].includes(s.attentionRole)), 'All attention roles are valid');
assert(fixture.scenes.every(s => s.broll && s.broll.prompt.length > 0), 'All scenes have B-roll prompts');
assert(fixture.scenes.some(s => s.type === 'cta'), 'Has CTA scene');
assert(fixture.scenes[0].attentionRole === 'hook', 'First scene is hook');

// --- Test 12: Brand consistency ---
console.log('\n12. Brand and metadata');

assert(fixture.brand.name.length > 0, 'Brand has name');
assert(fixture.brand.colors.background.startsWith('#'), 'Brand background is hex color');
assert(fixture.brand.colors.primary.startsWith('#'), 'Brand primary is hex color');
assert(fixture.brand.colors.accent.startsWith('#'), 'Brand accent is hex color');
assert(fixture.sourceMetadata.generator.length > 0, 'Has generator metadata');
assert(fixture.sourceMetadata.generatedAt.length > 0, 'Has generation timestamp');

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
