import type { YouTubeChannelMeta, YouTubeVideoMeta } from './types.js';
import { YouTubeApiKeyMissingError, YouTubeApiError } from './errors.js';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new YouTubeApiKeyMissingError();
  return key;
}

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<unknown> {
  const apiKey = getApiKey();
  const qs = new URLSearchParams({ key: apiKey, ...params });
  const url = `${YT_BASE}${endpoint}?${qs}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new YouTubeApiError(
      `YouTube API error: ${res.status}`,
      res.status,
      json
    );
  }
  return json;
}

export async function resolveChannelId(handle: string): Promise<string> {
  const data = await ytFetch('/channels', {
    forHandle: handle,
    part: 'id',
  }) as { items?: Array<{ id: string }> };
  if (!data.items || data.items.length === 0) {
    throw new YouTubeApiError(`Channel not found for handle: @${handle}`, 404);
  }
  return data.items[0].id;
}

export async function fetchChannelMeta(channelId: string): Promise<YouTubeChannelMeta> {
  const data = await ytFetch('/channels', {
    id: channelId,
    part: 'snippet,statistics,brandingSettings',
  }) as {
    items?: Array<{
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails?: { default?: { url: string } };
        country?: string;
      };
      statistics: {
        subscriberCount: string;
        videoCount: string;
        viewCount: string;
      };
    }>;
  };

  if (!data.items || data.items.length === 0) {
    throw new YouTubeApiError('Channel not found', 404);
  }

  const ch = data.items[0];
  return {
    url: `https://www.youtube.com/channel/${channelId}`,
    channelId,
    name: ch.snippet.title,
    description: ch.snippet.description,
    subscriberCount: parseInt(ch.statistics.subscriberCount) || null,
    videoCount: parseInt(ch.statistics.videoCount) || null,
    viewCount: parseInt(ch.statistics.viewCount) || null,
    publishedAt: ch.snippet.publishedAt || null,
    thumbnailUrl: ch.snippet.thumbnails?.default?.url || null,
    country: ch.snippet.country || null,
  };
}

export async function fetchRecentVideos(channelId: string, maxResults: number = 20): Promise<YouTubeVideoMeta[]> {
  const searchRes = await ytFetch('/search', {
    channelId,
    part: 'snippet',
    order: 'date',
    maxResults: String(Math.min(maxResults, 50)),
    type: 'video',
  }) as {
    items?: Array<{
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails?: { default?: { url: string } };
        tags?: string[];
        categoryId?: string;
      };
    }>;
  };

  if (!searchRes.items || searchRes.items.length === 0) return [];

  const videoIds = searchRes.items.map(i => i.id.videoId);
  const statsRes = await ytFetch('/videos', {
    id: videoIds.join(','),
    part: 'statistics,contentDetails',
  }) as {
    items?: Array<{
      id: string;
      statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
      };
      contentDetails: {
        duration: string;
      };
    }>;
  };

  const statsMap = new Map<string, (typeof statsRes.items)[0]>();
  (statsRes.items || []).forEach(s => statsMap.set(s.id, s));

  return searchRes.items.map(item => {
    const stats = statsMap.get(item.id.videoId);
    const duration = stats?.contentDetails?.duration || 'PT0S';
    return {
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      duration,
      durationSeconds: parseISODuration(duration),
      viewCount: stats ? parseInt(stats.statistics.viewCount) || null : null,
      likeCount: stats ? parseInt(stats.statistics.likeCount) || null : null,
      commentCount: stats ? parseInt(stats.statistics.commentCount) || null : null,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl: item.snippet.thumbnails?.default?.url || null,
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId || null,
    };
  });
}

function parseISODuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}
