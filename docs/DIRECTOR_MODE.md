# ClipLoop Director Mode

Director Mode is a conversational video direction layer for turning a rough idea into a structured video plan, then revising that plan with short direction notes.

## What it does

- Accepts a video idea and optional product context.
- Produces a structured creative brief, video concept, scene plan, and motion spec draft.
- Accepts revision notes such as "make it more premium", "shorten the hook", or "turn this into a 20-second launch trailer".
- Keeps the workflow approval-first: `approvalRequired` is always `true`.
- Never claims a final render: `renderedVideo` is always `false`.

## Endpoints

### Create

- `POST /api/public/director/create`
- Alias: `POST /api/v1/director/create`

Request body:

```json
{
  "idea": "Create a 20-second launch trailer for Stacklane",
  "productName": "Stacklane",
  "productUrl": "https://stacklane.dev",
  "audience": "developers evaluating lighter backend tooling",
  "platform": "youtube-shorts",
  "durationSeconds": 20,
  "tone": "premium",
  "goal": "launch"
}
```

Supported input fields:

- `idea`: required string
- `productName`: optional string
- `productUrl`: optional HTTPS URL only
- `audience`: optional string
- `platform`: `x` | `linkedin` | `youtube-shorts` | `tiktok` | `instagram-reels`
- `durationSeconds`: `15` | `20` | `30` | `45` | `60`
- `tone`: `premium` | `bold` | `founder-led` | `educational` | `playful` | `cinematic`
- `goal`: `launch` | `feature_demo` | `education` | `conversion` | `announcement`

Validation rules:

- `idea` is required.
- `durationSeconds` must be 60 seconds or less in v0.1.
- `productUrl` must use HTTPS.
- `productUrl` must not target localhost or private networks.
- `approvalRequired` is always `true`.

Response shape:

```json
{
  "ok": true,
  "directorProject": {
    "id": "director_...",
    "idea": "...",
    "creativeBrief": {},
    "videoConcept": {},
    "scenePlan": [],
    "motionSpec": {},
    "revisionHistory": [],
    "approvalRequired": true,
    "renderedVideo": false
  },
  "warnings": [],
  "disclaimer": "Draft video direction only. Review before rendering or publishing. No performance guaranteed."
}
```

### Revise

- `POST /api/public/director/revise`
- Alias: `POST /api/v1/director/revise`

Request body:

```json
{
  "directorProject": {},
  "revisionNote": "Make it more premium and reduce the intro to 3 seconds"
}
```

Supported revision intents:

- shorten
- extend
- change tone
- change platform
- improve hook
- add stronger CTA
- make more technical
- make more emotional
- make more founder-led
- simplify visuals

Revision behavior:

- Updates the creative brief.
- Rebuilds the scene plan.
- Rebuilds the motion spec draft.
- Appends a structured revision history entry.
- Keeps `approvalRequired: true`.
- Keeps `renderedVideo: false`.

## Motion Spec Integration

Director Mode reuses ClipLoop's motion spec contract and adds draft-only planning fields for:

- scenes
- captions
- timing
- visual intent
- transition notes
- music direction
- sound effect suggestions
- CTA moment
- platform adaptation notes

The output is still a draft. It is intended for review and revision before any render-specific step.

## Approval-First Workflow

1. Submit a create request.
2. Review the creative brief, concept, scene plan, and motion spec draft.
3. Submit one or more revision notes.
4. Approve the final direction.
5. Trigger any downstream render or publish flow separately.

Director Mode does not auto-publish and does not skip approval.

## Limitations

- Draft planning only. No final video file is produced here.
- No performance guarantee.
- No virality guarantee.
- No automatic publishing.
- Duration is capped at 60 seconds in v0.1.

## Examples

- `examples/director/stacklane-launch.json`
- `examples/director/launchpix-demo.json`
- `examples/director/cliploop-brag.json`
