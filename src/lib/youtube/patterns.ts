import type { YouTubeVideoMeta, PatternAnalysis } from './types.js';

const FORMAT_KEYWORDS: Record<string, string[]> = {
  tutorial: ['how to', 'tutorial', 'guide', 'learn', 'step by step'],
  comparison: ['vs', 'versus', 'compared', 'better', 'which is'],
  buildLog: ['i built', 'building', 'made', 'created', 'developing'],
  teardown: ['teardown', 'deep dive', 'inside', 'anatomy', 'breakdown'],
  listicle: ['top', 'best', 'ways to', 'things', 'tips'],
  demo: ['demo', 'showcase', 'walkthrough', 'first look', 'preview'],
  news: ['just released', 'announcement', 'new feature', 'update'],
  caseStudy: ['case study', 'real world', 'production', 'results'],
};

const HOOK_PATTERNS: string[] = [
  'question opener',
  'bold claim',
  'pain point',
  'before/after',
  'speed demo',
  'surprising fact',
  'challenge/stakes',
];

export function analyzePatterns(videos: YouTubeVideoMeta[]): PatternAnalysis {
  if (videos.length === 0) {
    return { topics: [], hooks: [], titlePatterns: [], thumbnailPatterns: [], retentionDevices: [], formats: [] };
  }

  return {
    topics: extractTopics(videos),
    hooks: estimateHooks(videos),
    titlePatterns: extractTitlePatterns(videos),
    thumbnailPatterns: estimateThumbnailPatterns(videos),
    retentionDevices: estimateRetentionDevices(videos),
    formats: classifyFormats(videos),
  };
}

function extractTopics(videos: YouTubeVideoMeta[]): string[] {
  const wordCounts = new Map<string, number>();
  const stopWords = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'in', 'for', 'of', 'and', 'or', 'my', 'your', 'how', 'why', 'what', 'this', 'that', 'with', 'from', 'on', 'at', 'by', 'i', 'you', 'we', 'they', 'do', 'did', 'does', 'can', 'will', 'just', 'about', 'all', 'more', 'most', 'new', 'one', 'your', 'here']);

  for (const v of videos) {
    const words = v.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    for (const w of words) {
      if (w.length < 2 || stopWords.has(w)) continue;
      wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
    }
    for (const tag of v.tags) {
      const t = tag.toLowerCase().trim();
      if (t.length > 2) wordCounts.set(t, (wordCounts.get(t) || 0) + 2);
    }
  }

  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function extractTitlePatterns(videos: YouTubeVideoMeta[]): string[] {
  const patterns: string[] = [];

  const questions = videos.filter(v => v.title.includes('?'));
  if (questions.length > 0) patterns.push(`Question titles: ${questions.length}/${videos.length} videos`);

  const numbers = videos.filter(v => /\d+/.test(v.title));
  if (numbers.length > 0) patterns.push(`Number in title: ${numbers.length}/${videos.length} videos`);

  const howTos = videos.filter(v => /^how/i.test(v.title));
  if (howTos.length > 0) patterns.push(`"How to" pattern: ${howTos.length} videos`);

  const lists = videos.filter(v => /\d+\s*(way|tip|thing|step|minute|second)/i.test(v.title));
  if (lists.length > 0) patterns.push(`Listicle pattern: ${lists.length} videos`);

  const avgLength = videos.reduce((s, v) => s + v.title.length, 0) / videos.length;
  patterns.push(`Average title length: ${Math.round(avgLength)} characters`);

  const avgWords = videos.reduce((s, v) => s + v.title.split(/\s+/).length, 0) / videos.length;
  patterns.push(`Average title words: ${Math.round(avgWords)}`);

  const capsWords = videos.flatMap(v => v.title.split(/\s+/).filter(w => w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w)));
  if (capsWords.length > 3) patterns.push(`Emphasis words: ${[...new Set(capsWords)].slice(0, 5).join(', ')}`);

  return patterns;
}

function classifyFormats(videos: YouTubeVideoMeta[]): string[] {
  const counts = new Map<string, number>();

  for (const v of videos) {
    const titleLower = v.title.toLowerCase();
    for (const [format, keywords] of Object.entries(FORMAT_KEYWORDS)) {
      if (keywords.some(kw => titleLower.includes(kw))) {
        counts.set(format, (counts.get(format) || 0) + 1);
      }
    }
  }

  return Array.from(counts.entries())
    .filter(([, c]) => c >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([f]) => f);
}

function estimateHooks(videos: YouTubeVideoMeta[]): string[] {
  const hooks: string[] = [];

  const questions = videos.filter(v => v.title.includes('?'));
  if (questions.length > 0) hooks.push(`Question openers (${questions.length} videos)`);

  const strong = videos.filter(v => v.viewCount !== null && v.viewCount > 10000);
  if (strong.length > 0) hooks.push(`High-view videos (${strong.length} above 10k views)`);

  const short = videos.filter(v => v.durationSeconds > 0 && v.durationSeconds < 120);
  if (short.length > 0) hooks.push(`Short-form content (${short.length} under 2 min)`);

  return hooks.length > 0 ? hooks : ['Requires creator analytics to confirm hook patterns'];
}

function estimateThumbnailPatterns(videos: YouTubeVideoMeta[]): string[] {
  const patterns: string[] = [];

  const titled = videos.filter(v => v.title.length <= 50);
  if (titled.length > videos.length * 0.5) patterns.push('Shorter titles may indicate text-heavy thumbnails');

  const longTitled = videos.filter(v => v.title.length > 70);
  if (longTitled.length > videos.length * 0.5) patterns.push('Longer titles may indicate minimal thumbnail text');

  if (patterns.length === 0) patterns.push('Thumbnail analysis requires visual inspection — metadata-based signal only');

  return patterns;
}

function estimateRetentionDevices(videos: YouTubeVideoMeta[]): string[] {
  const devices: string[] = [];

  const durationBuckets = { short: 0, medium: 0, long: 0 };
  for (const v of videos) {
    if (v.durationSeconds < 120) durationBuckets.short++;
    else if (v.durationSeconds < 600) durationBuckets.medium++;
    else durationBuckets.long++;
  }

  if (durationBuckets.short > 0) devices.push(`Short-form content (${durationBuckets.short} videos under 2 min)`);
  if (durationBuckets.medium > 0) devices.push(`Mid-form content (${durationBuckets.medium} videos 2-10 min)`);
  if (durationBuckets.long > 0) devices.push(`Long-form content (${durationBuckets.long} videos over 10 min)`);

  devices.push('Estimated pattern — requires creator analytics to confirm retention');

  return devices;
}

export function findOutliers(videos: YouTubeVideoMeta[]): YouTubeVideoMeta[] {
  const withViews = videos.filter(v => v.viewCount !== null) as (YouTubeVideoMeta & { viewCount: number })[];
  if (withViews.length < 3) return [];

  const avg = withViews.reduce((s, v) => s + v.viewCount, 0) / withViews.length;
  return withViews.filter(v => v.viewCount > avg * 2).slice(0, 3);
}

export function computePublishCadence(videos: YouTubeVideoMeta[]): string {
  if (videos.length < 2) return 'Insufficient data';

  const dates = videos.map(v => new Date(v.publishedAt).getTime()).sort((a, b) => b - a);
  const gaps: number[] = [];
  for (let i = 0; i < dates.length - 1; i++) {
    gaps.push(dates[i] - dates[i + 1]);
  }
  const avgGapDays = gaps.reduce((s, g) => s + g, 0) / gaps.length / 86400000;

  if (avgGapDays < 1.5) return 'Daily';
  if (avgGapDays < 4) return 'Multiple times per week';
  if (avgGapDays < 8) return 'Weekly';
  if (avgGapDays < 16) return 'Bi-weekly';
  return 'Monthly or less frequent';
}

export function computeDurationDistribution(videos: YouTubeVideoMeta[]): Record<string, number> {
  const dist = { 'under 1 min': 0, '1-5 min': 0, '5-15 min': 0, '15-30 min': 0, 'over 30 min': 0 };
  for (const v of videos) {
    const s = v.durationSeconds;
    if (s < 60) dist['under 1 min']++;
    else if (s < 300) dist['1-5 min']++;
    else if (s < 900) dist['5-15 min']++;
    else if (s < 1800) dist['15-30 min']++;
    else dist['over 30 min']++;
  }
  return dist;
}
