# ClipLoop AI Video Production API

One-key API for turning topics, briefs, URLs, and scripts into finished video workflows.

## Access Model

Everything runs through one key:

```
export CLIPLOOP_API_KEY=clp_xxx
```

Users provide a topic, product update, script, URL, or brief. ClipLoop handles the full production pipeline — from research through rendering — behind a single API key.

## Production Pipeline

```
Topic / Brief / URL
  ↓
1. Research Context
  ↓
2. Content Strategy
  ↓
3. Script Generation
  ↓
4. Scene Planning
  ↓
5. B-Roll Planning
  ↓
6. Asset Generation
  ↓
7. Voiceover
  ↓
8. Avatar (optional)
  ↓
9. Motion Spec
  ↓
10. Render
  ↓
11. Captions
  ↓
12. Platform Exports
  ↓
13. Human Approval
  ↓
14. Publish (future)
```

## Pipeline Stages

### 1. Research Context

Gather publicly available information about the topic:

- Public documentation pages
- Product changelogs and release notes
- GitHub issues and discussions
- Public API references
- User-provided URLs and context

ClipLoop extracts and normalizes this context into a structured brief. No scraping of private or authenticated content.

### 2. Content Strategy

Analyze the research context and determine:

- Target audience
- Core message
- Video format (explainer, tutorial, demo, launch)
- Estimated duration
- Platform targets
- Hook strategy
- Retention approach

### 3. Script Generation

Generate a structured script with:

- Hook (0-3 seconds)
- Context / proof (3-10 seconds)
- Core content (10-45 seconds)
- Proof / results (45-55 seconds)
- CTA (55-60 seconds)

Each section includes narration text, visual direction, and timing.

### 4. Scene Planning

Break the script into individual scenes with:

- Scene ID and timing
- Attention role (hook, retention, emotion, distribution)
- Visual intent
- Narration text
- Caption text
- Element specifications
- Animation specifications
- Transition type

### 5. B-Roll Planning

For each scene, plan the visual asset:

- Asset type (motion graphic, screen recording, product shot, generated image, generated video, avatar)
- Visual prompt for generation
- Camera motion (slow push, pan, parallax, static, zoom)
- Style notes
- Duration
- Whether external generation is required

### 6. Asset Generation

Generate or source visual assets:

- **Motion graphics**: Procedural animations from motion spec
- **Screen recordings**: From product demos (user-provided)
- **Product shots**: From product screenshots
- **Generated images**: From AI image providers (when configured)
- **Generated video**: From AI video providers (planned)
- **Avatars**: From AI avatar providers (planned)

### 7. Voiceover

Generate narration audio:

- Text-to-speech from script narration
- Voice style matching the content tone
- Pacing aligned with scene timing
- Multiple voice options (planned)

### 8. Avatar (Optional)

If enabled, plan avatar segments:

- Which scenes include avatar
- Avatar appearance and framing
- Script lines delivered by avatar
- Transitions between avatar and other visuals

### 9. Motion Spec

Combine all planning into a ClipLoop motion spec:

- Full scene graph with elements and animations
- B-roll integration
- Caption specifications
- Audio plan
- Export configurations

### 10. Render

Execute the motion spec through ClipLoop's render pipeline:

- Frame composition from motion spec
- B-roll integration
- Audio mixing
- Caption overlay
- Encoding to target format

### 11. Captions

Generate and overlay captions:

- Scene-by-scene caption text
- Mobile-readable font sizes
- Positioning optimized for platform
- Emphasis word highlighting

### 12. Platform Exports

Export for each target platform:

- YouTube (16:9, 1080p, 60fps)
- YouTube Shorts (9:16, 1080x1920, 60fps)
- X/Twitter (16:9, 1080p, 30fps)
- LinkedIn (16:9, 1080p, 30fps)
- Instagram Reels (9:16, 1080x1920, 30fps)
- TikTok (9:16, 1080x1920, 30fps)

### 13. Human Approval

Before any video is published:

- Review the script for accuracy and tone
- Review the motion spec for visual quality
- Preview rendered output
- Verify no copyrighted material is included
- Confirm YouTube / platform policy compliance
- Approve title, description, tags

### 14. Publish (Future)

After approval, publish to configured platforms:

- YouTube upload with metadata
- X/Twitter post with video
- LinkedIn post with video
- Schedule for optimal timing

## Implementation Status

| Stage | Status |
|-------|--------|
| Research context | ✅ Implemented (YouTube audit endpoint) |
| Content strategy | ✅ Implemented (pattern analysis + idea generation) |
| Script generation | ✅ Implemented (motion spec scenes include narration) |
| Scene planning | ✅ Implemented (6-8 scenes per video) |
| B-roll planning | ✅ Implemented (asset type + prompt per scene) |
| Asset generation | 🔲 Requires external providers |
| Voiceover | 🔲 Requires voice provider |
| Avatar | 🔲 Requires avatar provider |
| Motion spec | ✅ Implemented (create-motion-spec endpoint) |
| Render | 🔲 Requires render provider |
| Captions | ✅ Implemented (caption planning in motion spec) |
| Platform exports | 🔲 Requires render pipeline |
| Human approval | ✅ Enforced (approvalRequired: true) |
| Publish | 🔲 Planned |

## Error Handling

| Error | Status | Description |
|-------|--------|-------------|
| Missing API key | 403 | Authorization header required |
| Invalid input | 400 | Request body failed validation |
| Provider not configured | 503 | Required provider env var missing |
| Quota exceeded | 429 | Rate limit or credit limit hit |
| Internal error | 500 | Unexpected server error |

## Rate Limits

- 60 requests per minute per API key (default)
- 500 requests per day per API key (default)
- Render operations: 10 per day (default)

## Credit Costs

| Operation | Credits |
|-----------|---------|
| Research | 2 |
| Script generation | 3 |
| Scene planning | 2 |
| B-roll planning | 1 |
| Asset generation | 5-20 (varies by provider) |
| Voiceover | 3 |
| Avatar | 10 |
| Motion spec | 2 |
| Render | 10-50 (varies by duration/quality) |
| Export | 2 |

## Safety Rules

- No copyrighted material without permission
- No misleading content or fake claims
- No guaranteed virality or revenue promises
- Human approval required before publishing
- Public or user-approved content only for research
- Original content generation only
- YouTube / platform policy compliance required
