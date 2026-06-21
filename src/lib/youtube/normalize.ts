import type { ParsedChannel } from './types.js';
import { ChannelUrlParseError } from './errors.js';

const HANDLE_RE = /youtube\.com\/@([A-Za-z0-9._-]+)/;
const CHANNEL_ID_RE = /youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/;
const RAW_HANDLE_RE = /^@([A-Za-z0-9._-]+)$/;
const RAW_CHANNEL_ID_RE = /^(UC[A-Za-z0-9_-]{22})$/;

export function parseChannelUrl(input: string): ParsedChannel {
  const trimmed = input.trim();

  const handleMatch = trimmed.match(HANDLE_RE);
  if (handleMatch) return { type: 'handle', value: handleMatch[1] };

  const channelIdMatch = trimmed.match(CHANNEL_ID_RE);
  if (channelIdMatch) return { type: 'channelId', value: channelIdMatch[1] };

  const rawHandleMatch = trimmed.match(RAW_HANDLE_RE);
  if (rawHandleMatch) return { type: 'handle', value: rawHandleMatch[1] };

  const rawChannelIdMatch = trimmed.match(RAW_CHANNEL_ID_RE);
  if (rawChannelIdMatch) return { type: 'channelId', value: rawChannelIdMatch[1] };

  throw new ChannelUrlParseError(trimmed);
}

export function buildChannelUrl(parsed: ParsedChannel): string {
  if (parsed.type === 'handle') return `https://www.youtube.com/@${parsed.value}`;
  return `https://www.youtube.com/channel/${parsed.value}`;
}
