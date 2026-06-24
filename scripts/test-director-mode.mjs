#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import * as createDirectionModule from '../src/lib/director/createDirection.ts';
import * as reviseDirectionModule from '../src/lib/director/reviseDirection.ts';
import * as validateModule from '../src/lib/director/validate.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const createDirectorProject = createDirectionModule.createDirectorProject || createDirectionModule.default?.createDirectorProject;
const reviseDirectorProject = reviseDirectionModule.reviseDirectorProject || reviseDirectionModule.default?.reviseDirectorProject;
const validateDirectorCreateInput = validateModule.validateDirectorCreateInput || validateModule.default?.validateDirectorCreateInput;
const validateDirectorReviseInput = validateModule.validateDirectorReviseInput || validateModule.default?.validateDirectorReviseInput;

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed += 1;
  } else {
    console.log(`  ✗ ${name}`);
    failed += 1;
  }
}

function loadJson(relativePath) {
  return JSON.parse(readFileSync(join(repoRoot, relativePath), 'utf-8'));
}

console.log('\n1. Endpoint existence');
const createRoutePath = join(repoRoot, 'app/api/public/director/create/route.ts');
const reviseRoutePath = join(repoRoot, 'app/api/public/director/revise/route.ts');
const createRouteBody = readFileSync(createRoutePath, 'utf-8');
const reviseRouteBody = readFileSync(reviseRoutePath, 'utf-8');
assert(existsSync(createRoutePath), 'Create endpoint file exists');
assert(existsSync(reviseRoutePath), 'Revise endpoint file exists');
assert(typeof createDirectorProject === 'function', 'Create director module export exists');
assert(typeof reviseDirectorProject === 'function', 'Revise director module export exists');
assert(typeof validateDirectorCreateInput === 'function', 'Create validation export exists');
assert(typeof validateDirectorReviseInput === 'function', 'Revise validation export exists');
assert(createRouteBody.includes('POST /api/public/director/create'), 'Create endpoint path matches');
assert(reviseRouteBody.includes('POST /api/public/director/revise'), 'Revise endpoint path matches');
assert(createRouteBody.includes('NextResponse.json'), 'Create endpoint returns JSON responses');
assert(reviseRouteBody.includes('NextResponse.json'), 'Revise endpoint returns JSON responses');

console.log('\n2. Create validation');
const emptyIdeaValidation = validateDirectorCreateInput({ idea: '' });
assert(emptyIdeaValidation.success === false, 'Missing idea rejected');
assert(emptyIdeaValidation.error.issues.some((item) => item.path.join('.') === 'idea'), 'Idea validation error returned');

const httpUrlValidation = validateDirectorCreateInput({ idea: 'Launch ClipLoop Director Mode', productUrl: 'http://cliploop.dev' });
assert(httpUrlValidation.success === false, 'Non-HTTPS productUrl rejected');
assert(httpUrlValidation.error.issues.some((item) => item.path.join('.') === 'productUrl'), 'HTTPS validation error returned');

const privateUrlValidation = validateDirectorCreateInput({ idea: 'Launch ClipLoop Director Mode', productUrl: 'https://127.0.0.1/demo' });
assert(privateUrlValidation.success === false, 'Private/local URL rejected');
assert(privateUrlValidation.error.issues.some((item) => item.path.join('.') === 'productUrl'), 'Private/local URL error returned');

const longDurationValidation = validateDirectorCreateInput({ idea: 'Launch ClipLoop Director Mode', durationSeconds: 90 });
assert(longDurationValidation.success === false, 'Duration over 60 seconds rejected');
assert(longDurationValidation.error.issues.some((item) => item.path.join('.') === 'durationSeconds'), 'Duration validation error returned');

console.log('\n3. Create success shape');
const createJson = createDirectorProject(loadJson('examples/director/stacklane-launch.json'));
assert(createJson.ok === true, 'Create request succeeded');
assert(Array.isArray(createJson.directorProject.scenePlan) && createJson.directorProject.scenePlan.length >= 4, 'Scene plan generated');
assert(Array.isArray(createJson.directorProject.motionSpec.scenes) && createJson.directorProject.motionSpec.scenes.length >= 4, 'Motion spec generated');
assert(createJson.directorProject.motionSpec.captions.length === createJson.directorProject.scenePlan.length, 'Captions generated');
assert(createJson.directorProject.approvalRequired === true, 'approvalRequired true on create');
assert(createJson.directorProject.renderedVideo === false, 'renderedVideo false on create');
assert(createJson.disclaimer.includes('No performance guaranteed'), 'No performance guarantee language present');
assert(!JSON.stringify(createJson).includes('viral'), 'No virality promise in create response');
assert(!JSON.stringify(createJson).includes('.mp4'), 'No fake rendered MP4 claim in create response');

console.log('\n4. Revise behavior');
const reviseInput = {
  directorProject: createJson.directorProject,
  revisionNote: 'Make it more premium and reduce the intro to 3 seconds with a stronger CTA',
};
const reviseValidation = validateDirectorReviseInput(reviseInput);
assert(reviseValidation.success === true, 'Revise input validates');
const reviseJson = reviseDirectorProject(reviseInput);
assert(reviseJson.ok === true, 'Revise request succeeded');
assert(reviseJson.directorProject.scenePlan[0].duration !== createJson.directorProject.scenePlan[0].duration || reviseJson.directorProject.videoConcept.ctaLine !== createJson.directorProject.videoConcept.ctaLine, 'Revision modifies the scene plan or CTA');
assert(reviseJson.directorProject.motionSpec.transitionNotes.length === reviseJson.directorProject.scenePlan.length, 'Transition notes generated');
assert(reviseJson.directorProject.revisionHistory.length === 1, 'Revision history recorded');
assert(reviseJson.directorProject.revisionHistory[0].intents.length >= 1, 'Revision intents recorded');
assert(reviseJson.directorProject.approvalRequired === true, 'approvalRequired true after revision');
assert(reviseJson.directorProject.renderedVideo === false, 'renderedVideo false after revision');
assert(reviseJson.directorProject.motionSpec.ctaMoment.sceneId === 'director_cta', 'CTA moment generated');

console.log('\n5. Examples and docs');
const examplePaths = [
  'examples/director/stacklane-launch.json',
  'examples/director/launchpix-demo.json',
  'examples/director/cliploop-brag.json',
];
for (const examplePath of examplePaths) {
  assert(existsSync(join(repoRoot, examplePath)), `${examplePath} exists`);
}

const directorDoc = readFileSync(join(repoRoot, 'docs/DIRECTOR_MODE.md'), 'utf-8');
assert(directorDoc.includes('/api/public/director/create'), 'Director doc includes create endpoint');
assert(directorDoc.includes('/api/public/director/revise'), 'Director doc includes revise endpoint');
assert(directorDoc.includes('No virality guarantee'), 'Director doc includes no virality guarantee');
assert(!directorDoc.includes('.mp4'), 'Director doc makes no fake MP4 claim');

console.log('\n6. Public file wording guardrails');
const publicFiles = [
  'docs/DIRECTOR_MODE.md',
  'examples/director/stacklane-launch.json',
  'examples/director/launchpix-demo.json',
  'examples/director/cliploop-brag.json',
];
const bannedExternalProductNames = ['Runway', 'Sora', 'Pika', 'Veo', 'Midjourney', 'CapCut', 'Descript', 'HeyGen'];
for (const file of publicFiles) {
  const body = readFileSync(join(repoRoot, file), 'utf-8');
  assert(!/guaranteed viral/i.test(body), `${file} has no virality guarantee wording`);
  assert(!/professional quality guaranteed/i.test(body), `${file} has no professional guarantee wording`);
  assert(!/automatic publishing is enabled|auto-publish enabled|auto publish enabled/i.test(body), `${file} has no auto-publish claim`);
  assert(!bannedExternalProductNames.some((name) => body.includes(name)), `${file} has no banned external product names`);
}

console.log('\n7. Worktree safety');
const gitStatus = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf-8' });
const changedFiles = gitStatus.split('\n').map((line) => line.trim().slice(3)).filter(Boolean);
assert(changedFiles.every((file) => !file.startsWith('/') && !file.includes('..')), 'Current diff stays inside the cliploop worktree');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
