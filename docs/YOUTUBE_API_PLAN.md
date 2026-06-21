# ClipLoop YouTube API Plan

Planned API endpoints for the YouTube content intelligence and production pipeline.

## Overview

ClipLoop's YouTube API provides programmatic access to channel analysis, pattern extraction, idea generation, script creation, and motion spec production. All endpoints require a ClipLoop API key.

## Authentication

```
Authorization: Bearer $CLIPLOOP_API_KEY
```

## Endpoints

### POST /v1/youtube/audit-channel

Analyze a public YouTube channel's metadata and content patterns.

**Request:**
```json
{
  "channelUrl": "https://youtube.com/@channelname",
  "includeVideos": 20,
  "focus": ["titles", "hooks", "topics", "formats"]
}
```

**Response:**
```json
{
  "ok": true,
  "channel": {
    "name": "Channel Name",
    "niche": "Technology",
    "subscriberCount": 50000,
    "videoCount": 200,
    "uploadFrequency": "2-3 per week"
  },
  "patterns": {
    "topics": [],
    "hooks": [],
    "titlePatterns": [],
    "formats": []
  },
  "recommendations": []
}
```

### POST /v1/youtube/audit-video

Analyze a single public YouTube video's structure and patterns.

**Request:**
```json
{
  "videoUrl": "https://youtube.com/watch?v=xxxxx",
  "analyze": ["hook", "title", "structure", "retention"]
}
```

**Response:**
```json
{
  "ok": true,
  "video": {
    "title": "Video Title",
    "duration": "7:42",
    "views": 89000
  },
  "analysis": {
    "hook": { "type": "question", "effectiveness": "high" },
    "title": { "pattern": "I built [thing] in [timeframe]" },
    "structure": [],
    "retention": { "strongSections": [], "dropPoints": [] }
  },
  "extractedPrinciples": []
}
```

### POST /v1/youtube/extract-patterns

Extract reusable pattern principles from multiple channel/video audits.

**Request:**
```json
{
  "audits": [
    { "type": "channel", "data": { "..." } },
    { "type": "video", "data": { "..." } }
  ],
  "focus": ["hooks", "retention", "formats"]
}
```

**Response:**
```json
{
  "ok": true,
  "patterns": {
    "hookPrinciples": [],
    "retentionPrinciples": [],
    "formatPrinciples": [],
    "titlePrinciples": []
  },
  "confidence": 0.75
}
```

### POST /v1/youtube/generate-ideas

Generate original video ideas grounded in Talocode products.

**Request:**
```json
{
  "niche": "open-source AI tooling",
  "products": ["codra-code", "tera", "cliploop", "tradia"],
  "patterns": { "..." },
  "count": 5
}
```

**Response:**
```json
{
  "ok": true,
  "ideas": [
    {
      "title": "Original Video Title",
      "hook": "Opening concept",
      "audience": "Target viewers",
      "promise": "What viewers get",
      "originalityScore": 4,
      "demandScore": 3,
      "talocodeFit": 5,
      "averageScore": 4.1
    }
  ]
}
```

### POST /v1/youtube/create-script

Create a full script and storyboard for an approved video idea.

**Request:**
```json
{
  "idea": {
    "title": "Original Video Title",
    "hook": "Opening concept",
    "promise": "What viewers get"
  },
  "template": "talocode-tech-explainer",
  "duration": 55
}
```

**Response:**
```json
{
  "ok": true,
  "script": {
    "sections": [
      {
        "name": "hook",
        "duration": "0-3s",
        "caption": "Caption text",
        "visual": "Visual direction",
        "motion": "Animation style"
      }
    ],
    "totalDuration": 55,
    "wordCount": 120
  }
}
```

### POST /v1/youtube/create-motion-spec

Convert a script into a ClipLoop motion spec.

**Request:**
```json
{
  "script": { "..." },
  "brand": {
    "name": "Talocode",
    "colors": { "background": "#0b0f14", "primary": "#ffffff", "accent": "#ef476f" }
  },
  "output": { "aspectRatio": "16:9", "fps": 60 }
}
```

**Response:**
```json
{
  "ok": true,
  "motionSpec": {
    "version": "0.1",
    "duration": 55,
    "fps": 60,
    "scenes": [],
    "exports": []
  }
}
```

### POST /v1/youtube/render

Render a motion spec into a video through ClipLoop.

**Request:**
```json
{
  "motionSpec": { "..." },
  "template": "talocode-tech-explainer"
}
```

**Response:**
```json
{
  "ok": true,
  "renderId": "render_abc123",
  "status": "queued",
  "estimatedSeconds": 45
}
```

### POST /v1/youtube/performance-feedback

Feed published video performance back into the system.

**Request:**
```json
{
  "videoUrl": "https://youtube.com/watch?v=xxxxx",
  "metrics": {
    "views": 12000,
    "averageViewDuration": 45,
    "clickThroughRate": 0.062,
    "subscriberGain": 45
  },
  "originalIdea": { "..." }
}
```

**Response:**
```json
{
  "ok": true,
  "feedback": {
    "patternValidation": [
      { "pattern": "question hooks drive retention", "validated": true }
    ],
    "lessons": [
      "Short-form content outperformed long-form this batch"
    ],
    "adjustments": [
      "Increase Shorts frequency next cycle"
    ]
  }
}
```

## Rate Limits

- 100 requests per hour per API key
- 10 channel audits per day
- 50 video audits per day
- 20 idea generations per day
- 10 renders per day

## Pricing (Future)

| Operation | Credits |
|-----------|---------|
| Channel audit | 2 |
| Video audit | 1 |
| Pattern extraction | 3 |
| Idea generation | 2 |
| Script creation | 2 |
| Motion spec creation | 2 |
| Render | 10 |
| Performance feedback | 1 |

## Disclaimer

ClipLoop YouTube API provides research, analysis, and content production tools only. It does not guarantee channel growth, monetization, or YouTube Partner Program approval. All content produced through this API must comply with YouTube Terms of Service and Community Guidelines. Human review is required before publishing any generated content.
