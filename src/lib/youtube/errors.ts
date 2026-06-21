export class YouTubeApiKeyMissingError extends Error {
  constructor() {
    super('YOUTUBE_API_KEY is not configured');
    this.name = 'YouTubeApiKeyMissingError';
  }
}

export class YouTubeApiError extends Error {
  constructor(message: string, public status: number, public youtubeError?: unknown) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

export class ChannelUrlParseError extends Error {
  constructor(url: string) {
    super(`Cannot parse YouTube channel URL: ${url}`);
    this.name = 'ChannelUrlParseError';
  }
}
