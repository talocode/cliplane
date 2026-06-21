# Video Job Schema

JSON schema for ClipLoop video production jobs.

## Schema

```json
{
  "id": "video_job_xxx",
  "status": "draft",
  "createdAt": "2026-06-21T10:00:00Z",
  "updatedAt": "2026-06-21T10:00:00Z",
  "input": {
    "topic": "How local-first coding agents work",
    "brief": "Show developers why local-first AI tools matter",
    "sourceUrls": ["https://docs.example.com"],
    "targetPlatform": "youtube",
    "duration": 60,
    "style": "tech-explainer",
    "includeAvatar": false,
    "includeVoiceover": true,
    "includeBroll": true
  },
  "research": {
    "sources": [],
    "keyFindings": [],
    "audienceProfile": ""
  },
  "script": {
    "hook": "",
    "sections": [],
    "cta": "",
    "totalWords": 0,
    "estimatedDuration": 0
  },
  "scenes": [],
  "assets": [],
  "voiceover": {
    "text": "",
    "style": "",
    "duration": 0,
    "provider": null,
    "status": "pending"
  },
  "avatar": {
    "included": false,
    "scenes": [],
    "provider": null,
    "status": "not-requested"
  },
  "motionSpec": {},
  "exports": [],
  "approval": {
    "required": true,
    "approved": false,
    "approvedBy": null,
    "approvedAt": null,
    "notes": ""
  },
  "publishing": {
    "platforms": [],
    "scheduledFor": null,
    "publishedAt": null
  }
}
```

## Status Flow

```
draft → queued → researching → scripting → planning_scenes
→ generating_assets → generating_voiceover → generating_avatar
→ rendering → completed → failed
```

| Status | Description |
|--------|-------------|
| `draft` | Job created, not yet started |
| `queued` | Waiting for processing |
| `researching` | Gathering context from sources |
| `scripting` | Generating script from research |
| `planning_scenes` | Breaking script into scenes |
| `generating_assets` | Creating B-roll and visual assets |
| `generating_voiceover` | Generating narration audio |
| `generating_avatar` | Generating avatar segments |
| `rendering` | Composing final video |
| `completed` | Video ready for review |
| `failed` | Job failed (check error field) |

## Input Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `topic` | string | yes | Video topic or title |
| `brief` | string | no | Detailed brief for generation |
| `sourceUrls` | string[] | no | Public URLs for context gathering |
| `targetPlatform` | enum | yes | youtube, youtube-shorts, x, linkedin, instagram-reels, tiktok |
| `duration` | number | yes | Target duration in seconds |
| `style` | enum | yes | tech-explainer, product-demo, tutorial, launch, documentary-short |
| `includeAvatar` | boolean | no | Whether to include AI avatar segments |
| `includeVoiceover` | boolean | no | Whether to include voiceover |
| `includeBroll` | boolean | no | Whether to include B-roll planning |

## Output Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique job identifier |
| `status` | enum | Current pipeline status |
| `research` | object | Research context gathered |
| `script` | object | Generated script |
| `scenes` | array | Scene-by-scene plan |
| `assets` | array | Generated or sourced assets |
| `voiceover` | object | Voiceover plan and status |
| `avatar` | object | Avatar plan and status |
| `motionSpec` | object | ClipLoop motion spec |
| `exports` | array | Platform-specific exports |
| `approval` | object | Human approval state |
| `publishing` | object | Publishing state |
