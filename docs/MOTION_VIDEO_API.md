# ClipLoop Motion Video API

Programmatic motion video generation from structured specs.

## Purpose

ClipLoop evolves beyond slideshow-based social videos into a motion product video engine. Agents, creators, and apps submit structured motion specs describing scenes, elements, animations, cameras, and transitions — and ClipLoop renders polished motion product videos through a renderer-agnostic pipeline.

The API is renderer-agnostic. A motion spec describes _what_ to render. A renderer decides _how_.

## Architecture

```
Motion Spec (JSON)
  ↓
Motion Validator
  ↓
Render Scheduler
  ↓
┌─────────────┬──────────────┬──────────────┐
│ Remotion    │ HTML Video   │ Cloud Render │
│ Renderer    │ Renderer     │ (Future)     │
└──────┬──────┴──────┬───────┴──────┬───────┘
       │             │              │
       └─────────────┴──────────────┘
                     ↓
               MP4 / WebM Output
```

## Structured Motion Spec

A motion spec is a JSON document that fully describes a motion product video. It includes:

- **Metadata**: title, duration, fps, resolution
- **Brand**: name, colors, logo URL, font family
- **Audio**: voiceover script, background music track, SFX cues
- **Scenes**: ordered list of timed scenes
- **Exports**: target formats and aspect ratios

See `docs/MOTION_SPEC.md` for the full schema.

## Scene Graph

Each scene contains:

- **Background**: solid color, gradient, image, or video
- **Camera**: position, zoom, pan, orbit over scene duration
- **Elements**: visual objects with position, size, and animation
- **Transitions**: incoming/outgoing transitions to adjacent scenes
- **Captions**: optional subtitle text for accessibility

## Element Types

### Text

Typography elements with font, size, color, weight, alignment, and animation.

### Logo

Brand marks with optional entrance animation (scale-in, fade, morph).

### Card / UI Card

Floating panels with background, border, shadow, and content. Used for feature highlights, stats, and callouts.

### Workflow Card

Specialized cards showing workflow steps, connected by dashed connectors.

### Connector

Dashed or solid lines connecting workflow cards. Animated draw-on.

### Shape

Rectangles, circles, lines, and custom SVG paths.

### Icon

Symbolic elements (checkmarks, arrows, arrows, stars).

### Image / Product Shot

Raster images with position, scale, and animation.

### Code / Terminal / Browser Frame

Framed containers for showing code, terminal output, or browser screenshots.

### Particle Field

Ambient decorative particles (dots, lines, geometric shapes).

### Gradient Blob

Animated soft gradient shapes for background depth.

## Animation System

Every element supports entry, loop, and exit animations.

### Entry Animations

- **fade**: opacity 0 → 1
- **slide**: translate from direction
- **scale**: size 0 → 1
- **blur**: Gaussian blur dissolve
- **revealMask**: clip-path reveal
- **typewriter**: character-by-character text reveal
- **drawLine**: SVG path stroke animation
- **stagger**: sequential element entrance with delay

### Loop Animations

- **pulse**: gentle scale oscillation
- **orbit**: circular path motion
- **parallax**: depth-based scroll offset
- **morph**: shape interpolation

### Transition Animations

- **cameraPush**: virtual camera movement between scenes
- **fade**: cross-fade
- **slide**: scene slides in from direction

### Physics

- **spring**: spring-based easing for natural motion

### Motion Types

- **countUp**: numeric counter animation
- **rotate**: rotation animation

## Camera System

Each scene defines a camera:

```json
{
  "camera": {
    "start": { "x": 0, "y": 0, "zoom": 1 },
    "end": { "x": 50, "y": -20, "zoom": 1.1 },
    "easing": "ease-in-out"
  }
}
```

Camera movement creates dynamic compositions without manual keyframing.

## Typography System

Text elements support:

- Font family (from brand config or override)
- Size, weight, line height, letter spacing
- Color and opacity
- Text shadows and strokes
- Word wrap and max width
- Alignment (left, center, right)

## Brand Animation

Logo animations are restrained and purposeful:

- Scale-in with spring easing
- Fade with slight upward drift
- Positioned consistently across scenes
- Never overshadows content

## Render Pipeline

1. **Parse** motion spec JSON
2. **Validate** against schema
3. **Schedule** render job
4. **Choose renderer** based on complexity and availability
5. **Compose** scenes with elements, animations, and camera
6. **Render** frames
7. **Encode** to target format
8. **Upload** output artifact
9. **Return** download URL

## Export Targets

| Target | Resolution | FPS | Use Case |
|--------|-----------|-----|----------|
| 16:9 landscape | 1920×1080 | 60 | Product demos, presentations |
| 9:16 vertical | 1080×1920 | 60 | Social media, shorts |
| 1:1 square | 1080×1080 | 30 | Instagram, LinkedIn |
| 4:5 portrait | 1080×1350 | 30 | Instagram feed |

## Renderer Strategy

The API is renderer-agnostic. Available renderers:

- **Remotion**: React/component-driven. Best for structured compositions.
- **HTML Video**: Browser-rendered scenes. Best for agent-authored compositions.
- **Cloud Renderer** (future): Hosted GPU rendering for complex scenes.

See `docs/RENDERERS.md` for details.

## Current Limitations

- No real-time audio waveform sync
- No 3D camera or perspective transforms
- No generative video models (everything is programmatic)
- Cloud renderer not yet available
- Remote asset rendering (images from URLs) may be delayed
- Scene count limited to 20 per spec
- Total duration limited to 120 seconds
