import type {
  YouTubeChannelInput,
  YouTubeChannelMeta,
  YouTubeVideoMeta,
  ChannelAuditResult,
  ChannelAuditScore,
  OriginalIdea,
} from './types.js';
import { parseChannelUrl } from './normalize.js';
import { resolveChannelId, fetchChannelMeta, fetchRecentVideos } from './client.js';
import {
  analyzePatterns,
  findOutliers,
  computePublishCadence,
  computeDurationDistribution,
} from './patterns.js';

export async function auditChannel(input: YouTubeChannelInput): Promise<ChannelAuditResult> {
  const parsed = parseChannelUrl(input.channelUrl);
  const maxVideos = Math.min(input.maxVideos || 20, 50);

  let channelId: string;
  if (parsed.type === 'channelId') {
    channelId = parsed.value;
  } else {
    channelId = await resolveChannelId(parsed.value);
  }

  let quotaUsed = 2;
  const channel = await fetchChannelMeta(channelId);
  quotaUsed += 1;

  const videos = await fetchRecentVideos(channelId, maxVideos);
  quotaUsed += 1;

  const patterns = analyzePatterns(videos);
  const score = computeAuditScore(channel, videos, patterns);
  const recommendations = generateRecommendations(channel, videos, patterns, score, input);
  const ideas = generateOriginalIdeas(patterns, input, channel.name);

  const dates = videos.map(v => v.publishedAt).sort();

  return {
    ok: true,
    audit: {
      channel,
      videos,
      patterns,
      score,
      recommendations,
      ideas,
      metadata: {
        videosAnalyzed: videos.length,
        dateRange: dates.length > 0
          ? { earliest: dates[0], latest: dates[dates.length - 1] }
          : null,
        quotaUsed,
      },
    },
    originalityRules: [
      'Do not copy scripts.',
      'Do not reupload videos.',
      'Do not clone thumbnails.',
      'Extract patterns only.',
      'Generate original ideas grounded in your own products.',
      'Human approval required before publishing.',
    ],
  };
}

function computeAuditScore(
  channel: YouTubeChannelMeta,
  videos: YouTubeVideoMeta[],
  patterns: ReturnType<typeof analyzePatterns>
): ChannelAuditScore {
  const topicClarity = Math.min(100, patterns.topics.length * 12);
  const titleStrength = Math.min(100, patterns.titlePatterns.length * 15);
  const packagingConsistency = videos.length >= 5 ? 70 : videos.length * 14;
  const cadence = computePublishCadence(videos);
  const postingConsistency = cadence.includes('Daily') || cadence.includes('Multiple') ? 85
    : cadence.includes('Weekly') ? 65
    : cadence.includes('Bi-weekly') ? 45
    : 25;
  const outliers = findOutliers(videos);
  const outlierOpportunity = Math.min(100, 30 + outliers.length * 25);
  const originalityRisk = Math.max(0, 100 - patterns.formats.length * 10);

  const total = Math.round(
    topicClarity * 0.15 +
    titleStrength * 0.2 +
    packagingConsistency * 0.15 +
    postingConsistency * 0.15 +
    outlierOpportunity * 0.15 +
    originalityRisk * 0.2
  );

  return {
    total: Math.min(100, Math.max(0, total)),
    topicClarity,
    titleStrength,
    packagingConsistency,
    postingConsistency,
    outlierOpportunity,
    originalityRisk,
  };
}

function generateRecommendations(
  channel: YouTubeChannelMeta,
  videos: YouTubeVideoMeta[],
  patterns: ReturnType<typeof analyzePatterns>,
  score: ChannelAuditScore,
  input: YouTubeChannelInput
): string[] {
  const recs: string[] = [];

  if (patterns.topics.length < 3) {
    recs.push('Niche topic focus could be tighter — consider concentrating on 2-3 core topics');
  }

  const cadence = computePublishCadence(videos);
  if (cadence.includes('Monthly') || cadence.includes('Insufficient')) {
    recs.push('Upload cadence is low — consistent publishing improves channel growth');
  }

  if (score.titleStrength < 50) {
    recs.push('Title optimization opportunity — test question-based and number-based titles');
  }

  const outliers = findOutliers(videos);
  if (outliers.length > 0) {
    recs.push(`High-performing outliers found: "${outliers[0].title.slice(0, 50)}..." — analyze what made it work`);
  }

  const durationDist = computeDurationDistribution(videos);
  if (durationDist['under 1 min'] > 0 && durationDist['5-15 min'] > 0) {
    recs.push('Channel uses both short and long-form — consider dedicated Shorts strategy');
  }

  if (patterns.formats.length > 0) {
    recs.push(`Dominant format: ${patterns.formats[0]} — consider format diversification for new audience segments`);
  }

  recs.push('This channel can serve as a pattern reference — generate original content grounded in your own products');

  return recs;
}

function generateOriginalIdeas(
  patterns: ReturnType<typeof analyzePatterns>,
  input: YouTubeChannelInput,
  channelName: string
): OriginalIdea[] {
  const niche = input.niche || 'technology';
  const ideas: OriginalIdea[] = [];

  ideas.push({
    title: `How I Built an Open-Source ${niche} Tool from Scratch`,
    hook: 'Show the finished product in the first 3 seconds, then rewind to the beginning',
    audience: `Developers and builders interested in ${niche}`,
    promise: 'See the full process of building and shipping a real tool',
    format: 'build log',
    originalityScore: 5,
    productionDifficulty: 3,
    clipLoopTemplate: 'talocode-tech-explainer',
    motionStyle: 'dark terminal aesthetic, code-focused, minimal typography',
    monetizationSafetyNotes: 'Original build log content. No copied material. Policy-safe.',
  });

  ideas.push({
    title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} Explained in 60 Seconds`,
    hook: 'Single focused concept with visual diagram',
    audience: `Beginner to intermediate ${niche} enthusiasts`,
    promise: 'Understand a core concept quickly with clear visuals',
    format: 'short explainer',
    originalityScore: 5,
    productionDifficulty: 2,
    clipLoopTemplate: 'talocode-tech-explainer',
    motionStyle: 'clean motion graphics, diagram-driven, caption-heavy',
    monetizationSafetyNotes: 'Educational content. Original explanation. Policy-safe.',
  });

  ideas.push({
    title: `3 Mistakes I Made Building ${niche} Tools (And How to Avoid Them)`,
    hook: 'Show the mistake outcome, then reveal the fix',
    audience: `${niche} developers who have experienced similar pain points`,
    promise: 'Learn from real mistakes to avoid common pitfalls',
    format: 'listicle / lessons',
    originalityScore: 5,
    productionDifficulty: 2,
    clipLoopTemplate: 'talocode-tech-explainer',
    motionStyle: 'card-based, numbered sections, mistake/solution contrast',
    monetizationSafetyNotes: 'Original lessons from real experience. Policy-safe.',
  });

  ideas.push({
    title: `${channelName} vs Open-Source: What ${niche} Builders Actually Need`,
    hook: 'Pose the core tension in the first sentence',
    audience: `${niche} builders evaluating tools and platforms`,
    promise: 'Honest analysis of what matters when choosing tools',
    format: 'comparison / analysis',
    originalityScore: 4,
    productionDifficulty: 3,
    clipLoopTemplate: 'saas-motion-launch',
    motionStyle: 'split-screen cards, data-driven, neutral tone',
    monetizationSafetyNotes: 'Original analysis. No competitor bashing. Policy-safe.',
  });

  ideas.push({
    title: `The ${niche} Stack That Actually Works in Production`,
    hook: 'Show a real production dashboard or terminal output',
    audience: `${niche} professionals looking for proven tool stacks`,
    promise: 'See what a working production setup looks like',
    format: 'demo / showcase',
    originalityScore: 5,
    productionDifficulty: 4,
    clipLoopTemplate: 'talocode-tech-explainer',
    motionStyle: 'screen recordings with overlay annotations, dark theme',
    monetizationSafetyNotes: 'Original production setup. Real data (sanitized). Policy-safe.',
  });

  return ideas;
}
