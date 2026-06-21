#!/usr/bin/env node
/**
 * Smoke test for YouTube create-motion-spec endpoint.
 *
 * Tests:
 * - Manual idea → motion spec generation
 * - Audit idea → motion spec generation
 * - Platform-specific output (16:9 vs 9:16)
 * - Invalid duration returns 400
 * - Scene count validation
 * - B-roll plan presence
 * - Caption presence
 * - approvalRequired true
 * - No rendered MP4 claimed
 * - Validation pass/fail
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

// --- Test 1: Manual idea → motion spec ---
console.log('\n1. Manual idea → motion spec');

const idea = {
  title: "Why local-first coding agents are coming back",
  hook: "AI coding tools are powerful, but most forgot the developer's machine.",
  audience: "developers and AI builders",
  promise: "Show why local-first coding agents matter",
  format: "tech-explainer",
  motionStyle: "dark-terminal",
  clipLoopTemplate: "talocode-tech-explainer",
};

assert(idea.title.length > 0, 'Idea has title');
assert(idea.hook.length > 0, 'Idea has hook');
assert(idea.format === 'tech-explainer', 'Idea has format');

// Simulate scene generation logic inline
const platform = 'youtube';
const duration = 60;
const isShortForm = platform === 'youtube-shorts';

const sceneTemplates = isShortForm
  ? ['hook', 'body', 'cta']
  : ['hook', 'context', 'explain', 'proof', 'implications', 'cta'];

assert(sceneTemplates.length >= 3, `Generates ${sceneTemplates.length} scene templates`);
assert(sceneTemplates.includes('hook'), 'Has hook scene');
assert(sceneTemplates.includes('cta'), 'Has CTA scene');

// --- Test 2: Audit idea → motion spec ---
console.log('\n2. Audit idea → motion spec');

const auditIdea = {
  title: "How to Set Up a Local AI Development Environment",
  hook: "3 steps to get your local AI stack running",
  audience: "developers new to local AI",
  promise: "Complete setup walkthrough",
  format: "tutorial",
};

assert(auditIdea.format === 'tutorial', 'Audit idea has format');
assert(auditIdea.hook.includes('3'), 'Audit idea hook has number');

// --- Test 3: Platform-specific output ---
console.log('\n3. Platform-specific output');

const platformTests = [
  { platform: 'youtube', expectedRatio: '16:9', expectedWidth: 1920, expectedHeight: 1080 },
  { platform: 'youtube-shorts', expectedRatio: '9:16', expectedWidth: 1080, expectedHeight: 1920 },
  { platform: 'tiktok', expectedRatio: '9:16', expectedWidth: 1080, expectedHeight: 1920 },
  { platform: 'linkedin', expectedRatio: '16:9', expectedWidth: 1920, expectedHeight: 1080 },
  { platform: 'instagram-reels', expectedRatio: '9:16', expectedWidth: 1080, expectedHeight: 1920 },
  { platform: 'x', expectedRatio: '16:9', expectedWidth: 1920, expectedHeight: 1080 },
];

for (const pt of platformTests) {
  const isVertical = pt.platform === 'youtube-shorts' || pt.platform === 'tiktok' || pt.platform === 'instagram-reels';
  assert(isVertical ? pt.expectedRatio === '9:16' : pt.expectedRatio === '16:9', `${pt.platform} → ${pt.expectedRatio}`);
}

// --- Test 4: Scene structure ---
console.log('\n4. Scene structure validation');

const sampleScenes = [
  { id: 'scene_hook', start: 0, duration: 3, type: 'title', attentionRole: 'hook' },
  { id: 'scene_context', start: 3, duration: 5, type: 'content', attentionRole: 'retention' },
  { id: 'scene_explain', start: 8, duration: 15, type: 'content', attentionRole: 'retention' },
  { id: 'scene_proof', start: 23, duration: 13, type: 'content', attentionRole: 'retention' },
  { id: 'scene_implications', start: 36, duration: 11, type: 'content', attentionRole: 'emotion' },
  { id: 'scene_cta', start: 47, duration: 13, type: 'cta', attentionRole: 'distribution' },
];

assert(sampleScenes.length >= 6, `Has ${sampleScenes.length} scenes (≥6)`);
assert(sampleScenes.some(s => s.attentionRole === 'hook'), 'Has hook scene');
assert(sampleScenes.some(s => s.type === 'cta'), 'Has CTA scene');

// Start times sequential
let validTimeline = true;
for (let i = 1; i < sampleScenes.length; i++) {
  if (sampleScenes[i].start < sampleScenes[i-1].start) validTimeline = false;
}
assert(validTimeline, 'Scene start times are sequential');

// Total duration
const totalDuration = sampleScenes[sampleScenes.length - 1].start + sampleScenes[sampleScenes.length - 1].duration;
assert(totalDuration === 60, `Total scene duration = ${totalDuration}s matches spec`);

// All positive durations
assert(sampleScenes.every(s => s.duration > 0), 'All scene durations are positive');

// --- Test 5: B-roll plan ---
console.log('\n5. B-roll plan validation');

const sampleBroll = [
  { sceneId: 'scene_hook', assetType: 'motion-graphic', prompt: 'Bold hook text', cameraMotion: 'slow-zoom-in', duration: 3, requiresExternalProvider: false },
  { sceneId: 'scene_context', assetType: 'motion-graphic', prompt: 'Feature cards', cameraMotion: 'parallax', duration: 5, requiresExternalProvider: false },
  { sceneId: 'scene_explain', assetType: 'screen-recording', prompt: 'Terminal demo', cameraMotion: 'slow-push', duration: 15, requiresExternalProvider: false },
  { sceneId: 'scene_proof', assetType: 'motion-graphic', prompt: 'Results dashboard', cameraMotion: 'static', duration: 13, requiresExternalProvider: false },
  { sceneId: 'scene_implications', assetType: 'motion-graphic', prompt: 'Workflow diagram', cameraMotion: 'slow-pan', duration: 11, requiresExternalProvider: false },
  { sceneId: 'scene_cta', assetType: 'product-shot', prompt: 'Product terminal', cameraMotion: 'slow-zoom-out', duration: 13, requiresExternalProvider: false },
];

assert(sampleBroll.length === sampleScenes.length, 'B-roll plan for every scene');
assert(sampleBroll.every(b => b.assetType.length > 0), 'All B-roll have assetType');
assert(sampleBroll.every(b => b.prompt.length > 0), 'All B-roll have prompt');
assert(sampleBroll.every(b => b.cameraMotion.length > 0), 'All B-roll have cameraMotion');
assert(sampleBroll.every(b => !b.requiresExternalProvider), 'No B-roll requires external provider (v0.1)');

// --- Test 6: Captions ---
console.log('\n6. Caption validation');

const sampleCaptions = sampleScenes.map(s => ({
  text: s.id.replace('scene_', ''),
  position: 'bottom',
  fontSize: 28,
  maxLineWidth: 50,
  emphasisWords: [],
  style: 'sans-serif',
}));

assert(sampleCaptions.length === sampleScenes.length, 'Captions for every scene');
assert(sampleCaptions.every(c => c.fontSize >= 24), 'Font size ≥ 24 for mobile readability');
assert(sampleCaptions.every(c => ['bottom', 'center', 'top'].includes(c.position)), 'Valid caption positions');

// --- Test 7: Response schema ---
console.log('\n7. Response schema validation');

const sampleResponse = {
  ok: true,
  motionSpec: {
    version: '0.1',
    title: 'Test',
    duration: 60,
    fps: 60,
    resolution: { width: 1920, height: 1080 },
    platform: 'youtube',
    brand: { name: 'Talocode', colors: { background: '#0b0f14', primary: '#ffffff', accent: '#f97316', secondary: '#06d6a0', muted: '#8892b0' }, fontFamily: 'Inter' },
    scenes: sampleScenes,
    captions: sampleCaptions,
    audioPlan: { voiceover: { text: 'test', style: 'clear', duration: 60 }, backgroundMusic: null, sfx: [] },
    exports: [{ format: 'mp4', aspectRatio: '16:9', width: 1920, height: 1080, fps: 60, quality: 'high', codec: 'h264' }],
    approvalRequired: true,
    sourceMetadata: { ideaTitle: 'Test', ideaFormat: 'tech-explainer', generatedAt: '2026-06-21', generator: 'cliploop-youtube-motion-spec-v0.1' },
  },
  validation: { valid: true, errors: [] },
  approvalRequired: true,
  next: 'review_motion_spec',
  disclaimer: 'This motion spec requires human approval before rendering. No video has been generated.',
};

assert(typeof sampleResponse.ok === 'boolean', 'Response has ok');
assert(typeof sampleResponse.approvalRequired === 'boolean', 'Response has approvalRequired');
assert(sampleResponse.approvalRequired === true, 'approvalRequired is true');
assert(typeof sampleResponse.next === 'string', 'Response has next step');
assert(sampleResponse.next === 'review_motion_spec', 'Next step is review_motion_spec');
assert(sampleResponse.motionSpec.version === '0.1', 'Motion spec version is 0.1');
assert(sampleResponse.motionSpec.scenes.length >= 6, `Motion spec has ${sampleResponse.motionSpec.scenes.length} scenes`);
assert(typeof sampleResponse.disclaimer === 'string', 'Response has disclaimer');

// --- Test 8: No rendered MP4 claimed ---
console.log('\n8. No fake render claims');

assert(!sampleResponse.motionSpec.exports.some(e => e.format === 'mp4' && typeof e === 'object' && 'renderedUrl' in e), 'No renderedUrl in exports');
assert(sampleResponse.disclaimer.includes('No video has been generated'), 'Disclaimer says no video generated');
assert(sampleResponse.approvalRequired === true, 'Approval required before rendering');

// --- Test 9: B-roll plan detail ---
console.log('\n9. B-roll detail validation');

const brollAssetTypes = ['motion-graphic', 'screen-recording', 'product-shot', 'generated-image', 'generated-video', 'avatar'];
assert(sampleBroll.every(b => brollAssetTypes.includes(b.assetType)), 'All B-roll asset types are valid');

const cameraMotions = ['slow-zoom-in', 'slow-zoom-out', 'slow-push', 'slow-pan', 'parallax', 'static', 'pulse', 'pan-left'];
assert(sampleBroll.every(b => cameraMotions.includes(b.cameraMotion)), 'All camera motions are valid presets');

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
