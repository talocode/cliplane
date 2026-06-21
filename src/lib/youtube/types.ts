export interface YouTubeChannelInput {
  channelUrl: string;
  maxVideos?: number;
  niche?: string;
  goal?: string;
}

export interface YouTubeChannelMeta {
  url: string;
  channelId: string;
  name: string;
  description: string;
  subscriberCount: number | null;
  videoCount: number | null;
  viewCount: number | null;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  country: string | null;
}

export interface YouTubeVideoMeta {
  videoId: string;
  url: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  publishedAt: string;
  thumbnailUrl: string | null;
  tags: string[];
  categoryId: string | null;
}

export interface ParsedChannel {
  type: 'handle' | 'channelId' | 'vanityUrl';
  value: string;
}

export interface PatternAnalysis {
  topics: string[];
  hooks: string[];
  titlePatterns: string[];
  thumbnailPatterns: string[];
  retentionDevices: string[];
  formats: string[];
}

export interface ChannelAuditScore {
  total: number;
  topicClarity: number;
  titleStrength: number;
  packagingConsistency: number;
  postingConsistency: number;
  outlierOpportunity: number;
  originalityRisk: number;
}

export interface OriginalIdea {
  title: string;
  hook: string;
  audience: string;
  promise: string;
  format: string;
  originalityScore: number;
  productionDifficulty: number;
  clipLoopTemplate: string;
  motionStyle: string;
  monetizationSafetyNotes: string;
}

export interface ChannelAuditResult {
  ok: true;
  audit: {
    channel: YouTubeChannelMeta;
    videos: YouTubeVideoMeta[];
    patterns: PatternAnalysis;
    score: ChannelAuditScore;
    recommendations: string[];
    ideas: OriginalIdea[];
    metadata: {
      videosAnalyzed: number;
      dateRange: { earliest: string; latest: string } | null;
      quotaUsed: number;
    };
  };
  originalityRules: string[];
}
