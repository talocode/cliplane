# Scene B-Roll Schema

JSON schema for per-scene B-roll planning in ClipLoop video production.

## Schema

```json
{
  "sceneId": "scene_01",
  "purpose": "Establish the problem the product solves",
  "narration": "Most coding agents require cloud access and vendor accounts.",
  "visualIntent": "Show a developer frustrated at a terminal with a cloud login prompt",
  "brollPrompt": "Dark terminal showing cloud authentication error, developer perspective, minimal motion",
  "assetType": "motion-graphic",
  "cameraMotion": "slow-push",
  "duration": 4,
  "style": "dark-terminal, cinematic but minimal",
  "safetyNotes": "No competitor logos or UI elements",
  "status": "planned"
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `sceneId` | string | Reference to parent scene |
| `purpose` | string | Why this B-roll exists in the scene |
| `narration` | string | What is being said during this B-roll |
| `visualIntent` | string | High-level description of what should be shown |
| `brollPrompt` | string | Detailed prompt for asset generation |
| `assetType` | enum | Type of visual asset to use |
| `cameraMotion` | enum | Camera movement style |
| `duration` | number | Duration in seconds |
| `style` | string | Visual style notes |
| `safetyNotes` | string | Copyright and policy constraints for this B-roll |
| `status` | enum | Current generation status |

## Asset Types

| Type | Description | External Provider Required |
|------|-------------|--------------------------|
| `motion-graphic` | Procedural animation from motion spec | No |
| `screen-recording` | Product demo or terminal session | Yes (user-provided) |
| `product-shot` | Static or animated product screenshot | No (user-provided) |
| `generated-image` | AI-generated image from prompt | Yes |
| `generated-video` | AI-generated video clip from prompt | Yes |
| `avatar` | AI avatar talking head | Yes |

## Camera Motion Presets

| Motion | Description | Best For |
|--------|-------------|----------|
| `slow-push` | Gradual zoom into subject | Emphasis, focus |
| `slow-zoom-out` | Gradual reveal of full frame | Context, CTA |
| `slow-pan` | Horizontal movement | Scanning, breadth |
| `parallax` | Depth-based layered movement | Motion graphics |
| `static` | No camera movement | Data, metrics |
| `pulse` | Subtle scale oscillation | Energy, attention |
| `pan-left` | Leftward horizontal sweep | Transitions |

## Safety Rules for B-Roll

- No competitor logos, UI, or branded content
- No copyrighted footage or images
- No stock footage without proper licensing
- No personal or private content
- Generated content must be original
- Product shots must be from user-provided screenshots
- Screen recordings must be from user-provided demos
- Avatar content requires disclosure as AI-generated
