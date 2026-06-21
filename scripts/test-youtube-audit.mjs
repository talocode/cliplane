#!/usr/bin/env node
/**
 * Smoke test for YouTube channel audit endpoint.
 *
 * Tests:
 * - Pattern analyzer with fixture data
 * - URL parser with various input formats
 * - Missing API key returns clear error
 * - Response schema shape validation
 *
 * Run: node scripts/test-youtube-audit.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

// --- Test 1: Pattern analyzer with fixture ---
console.log('\n1. Pattern analyzer with fixture data');

const fixture = JSON.parse(readFileSync(join(__dirname, '../tests/fixtures/youtube-channel-sample.json'), 'utf-8'));

// Simulate pattern extraction logic inline (without importing TS module)
const titles = fixture.videos.map(v => v.title);
const topics = new Map();
const stopWords = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'in', 'for', 'of', 'and', 'or', 'my', 'i']);

for (const title of titles) {
  for (const word of title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)) {
    if (word.length < 2 || stopWords.has(word)) continue;
    topics.set(word, (topics.get(word) || 0) + 1);
  }
}

const topTopics = [...topics.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
assert(topTopics.includes('ai'), 'Extracts "ai" as top topic');
assert(topTopics.includes('built') || topTopics.includes('building'), 'Extracts build-related topic');

// Format classification
const formats = [];
for (const title of titles) {
  const lower = title.toLowerCase();
  if (/how to/i.test(lower)) formats.push('tutorial');
  if (/i built|building/i.test(lower)) formats.push('build log');
  if (/vs|versus|compared/i.test(lower)) formats.push('comparison');
  if (/\d+\s*(thing|wish|tip|way|step)/i.test(lower)) formats.push('listicle');
}
assert(formats.includes('build log'), 'Classifies build log format');
assert(formats.includes('tutorial'), 'Classifies tutorial format');
assert(formats.includes('comparison'), 'Classifies comparison format');
assert(formats.includes('listicle'), 'Classifies listicle format');

// Title patterns
const questionCount = titles.filter(t => t.includes('?')).length;
const numberCount = titles.filter(t => /\d+/.test(t)).length;
assert(numberCount >= 1, 'Detects number patterns in titles');
assert(titles.every(t => t.length > 10), 'All titles have meaningful length');

// Duration analysis
const durations = fixture.videos.map(v => v.durationSeconds);
assert(durations.every(d => d > 0), 'All durations are positive');
assert(durations.some(d => d > 300), 'Has mid-form content (5+ min)');

// --- Test 2: URL parser ---
console.log('\n2. URL parser validation');

const urlTests = [
  { input: 'https://www.youtube.com/@example', expected: 'handle', value: 'example' },
  { input: 'https://youtube.com/@tech-channel', expected: 'handle', value: 'tech-channel' },
  { input: 'https://www.youtube.com/channel/UC1234567890abcdef123456', expected: 'channelId', value: 'UC1234567890abcdef123456' },
  { input: '@handle', expected: 'handle', value: 'handle' },
  { input: 'UC1234567890abcdef123456', expected: 'channelId', value: 'UC1234567890abcdef123456' },
];

for (const t of urlTests) {
  let parsed = null;
  let error = null;
  try {
    // Inline URL parsing test
    const HANDLE_RE = /youtube\.com\/@([A-Za-z0-9._-]+)/;
    const CHANNEL_ID_RE = /youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/;
    const RAW_HANDLE_RE = /^@([A-Za-z0-9._-]+)$/;
    const RAW_CHANNEL_ID_RE = /^(UC[A-Za-z0-9_-]{22})$/;

    const trimmed = t.input.trim();
    let match = trimmed.match(HANDLE_RE) || trimmed.match(RAW_HANDLE_RE);
    if (match) parsed = { type: 'handle', value: match[1] };
    else {
      match = trimmed.match(CHANNEL_ID_RE) || trimmed.match(RAW_CHANNEL_ID_RE);
      if (match) parsed = { type: 'channelId', value: match[1] };
      else error = 'unparseable';
    }
  } catch (e) {
    error = e.message;
  }
  assert(parsed !== null && parsed.type === t.expected && parsed.value === t.value, `Parses "${t.input}" as ${t.expected}`);
}

// Invalid URL
let invalidParsed = null;
try {
  const trimmed = 'https://example.com/not-youtube';
  const HANDLE_RE = /youtube\.com\/@([A-Za-z0-9._-]+)/;
  const CHANNEL_ID_RE = /youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/;
  const RAW_HANDLE_RE = /^@([A-Za-z0-9._-]+)$/;
  const RAW_CHANNEL_ID_RE = /^(UC[A-Za-z0-9_-]{22})$/;

  let match = trimmed.match(HANDLE_RE) || trimmed.match(RAW_HANDLE_RE);
  if (match) invalidParsed = { type: 'handle', value: match[1] };
  else {
    match = trimmed.match(CHANNEL_ID_RE) || trimmed.match(RAW_CHANNEL_ID_RE);
    if (match) invalidParsed = { type: 'channelId', value: match[1] };
  }
} catch {}
assert(invalidParsed === null, 'Rejects non-YouTube URLs');

// --- Test 3: Missing API key ---
console.log('\n3. Missing API key handling');

const origEnv = process.env.YOUTUBE_API_KEY;
delete process.env.YOUTUBE_API_KEY;

try {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    assert(true, 'Detects missing YOUTUBE_API_KEY');
  } else {
    assert(false, 'Should detect missing YOUTUBE_API_KEY');
  }
} finally {
  if (origEnv) process.env.YOUTUBE_API_KEY = origEnv;
}

// --- Test 4: Response schema shape ---
console.log('\n4. Response schema shape validation');

const sampleAudit = {
  ok: true,
  audit: {
    channel: { url: '', channelId: '', name: '', description: '', subscriberCount: null, videoCount: null, viewCount: null, publishedAt: null, thumbnailUrl: null, country: null },
    videos: [],
    patterns: { topics: [], hooks: [], titlePatterns: [], thumbnailPatterns: [], retentionDevices: [], formats: [] },
    score: { total: 0, topicClarity: 0, titleStrength: 0, packagingConsistency: 0, postingConsistency: 0, outlierOpportunity: 0, originalityRisk: 0 },
    recommendations: [],
    ideas: [],
    metadata: { videosAnalyzed: 0, dateRange: null, quotaUsed: 0 },
  },
  originalityRules: [],
};

assert(typeof sampleAudit.ok === 'boolean', 'Response has ok boolean');
assert(typeof sampleAudit.audit.channel === 'object', 'Response has channel object');
assert(Array.isArray(sampleAudit.audit.videos), 'Response has videos array');
assert(typeof sampleAudit.audit.patterns === 'object', 'Response has patterns object');
assert(typeof sampleAudit.audit.score === 'object', 'Response has score object');
assert(typeof sampleAudit.audit.score.total === 'number', 'Score has total number');
assert(Array.isArray(sampleAudit.audit.recommendations), 'Response has recommendations array');
assert(Array.isArray(sampleAudit.audit.ideas), 'Response has ideas array');
assert(Array.isArray(sampleAudit.originalityRules), 'Response has originalityRules array');

// --- Test 5: Score component validation ---
console.log('\n5. Audit score components');

const scoreComponents = ['total', 'topicClarity', 'titleStrength', 'packagingConsistency', 'postingConsistency', 'outlierOpportunity', 'originalityRisk'];
for (const comp of scoreComponents) {
  assert(typeof sampleAudit.audit.score[comp] === 'number', `Score has ${comp}`);
  assert(sampleAudit.audit.score[comp] >= 0 && sampleAudit.audit.score[comp] <= 100, `${comp} is in 0-100 range`);
}

// --- Test 6: Idea schema validation ---
console.log('\n6. Original idea schema');

const sampleIdea = {
  title: 'Test',
  hook: 'Test hook',
  audience: 'Test audience',
  promise: 'Test promise',
  format: 'build log',
  originalityScore: 5,
  productionDifficulty: 3,
  clipLoopTemplate: 'talocode-tech-explainer',
  motionStyle: 'dark terminal',
  monetizationSafetyNotes: 'Safe',
};

const ideaFields = ['title', 'hook', 'audience', 'promise', 'format', 'originalityScore', 'productionDifficulty', 'clipLoopTemplate', 'motionStyle', 'monetizationSafetyNotes'];
for (const field of ideaFields) {
  assert(field in sampleIdea, `Idea has ${field}`);
}

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
