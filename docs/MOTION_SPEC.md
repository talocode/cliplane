# ClipLoop Motion Spec v0.1

Structured JSON specification for programmatic motion product videos.

## Top-Level Schema

```json
{
  "version": "0.1",
  "title": "Product launch video",
  "duration": 54,
  "fps": 60,
  "resolution": {
    "width": 1920,
    "height": 1080
  },
  "brand": {
    "name": "Product Name",
    "colors": {
      "background": "#0b0f14",
      "primary": "#ffffff",
      "accent": "#ef476f",
      "secondary": "#06d6a0",
      "muted": "#8892b0"
    },
    "logo": "https://example.com/logo.svg",
    "fontFamily": "Inter, system-ui, sans-serif"
  },
  "audio": {
    "voiceover": null,
    "backgroundMusic": null,
    "sfx": []
  },
  "scenes": [],
  "exports": []
}
```

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | yes | Spec version (`"0.1"`) |
| `title` | string | yes | Human-readable video title |
| `duration` | number | yes | Total duration in seconds |
| `fps` | number | yes | Frames per second (30 or 60) |
| `resolution` | object | yes | `{ width, height }` in pixels |
| `brand` | object | yes | Brand identity config |
| `audio` | object | yes | Audio configuration |
| `scenes` | array | yes | Ordered scene list |
| `exports` | array | yes | Target export formats |

## Brand Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Brand/product name |
| `colors` | object | yes | Color palette |
| `colors.background` | string | yes | Primary background hex color |
| `colors.primary` | string | yes | Primary text/element color |
| `colors.accent` | string | yes | Accent/highlight color |
| `colors.secondary` | string | no | Secondary accent color |
| `colors.muted` | string | no | Muted/gray text color |
| `logo` | string | no | Logo URL (SVG preferred) |
| `fontFamily` | string | no | CSS font-family string |

## Scene Object

```json
{
  "id": "scene-hook",
  "start": 0,
  "duration": 3,
  "type": "content",
  "attentionRole": "hook",
  "background": {
    "type": "gradient",
    "start": "#0b0f14",
    "end": "#1a1f2e",
    "angle": 135
  },
  "camera": {
    "start": { "x": 0, "y": 0, "zoom": 1.0 },
    "end": { "x": 0, "y": -10, "zoom": 1.05 },
    "easing": "ease-in-out"
  },
  "elements": [],
  "transitions": {
    "in": { "type": "fade", "duration": 0.3 },
    "out": { "type": "fade", "duration": 0.3 }
  },
  "captions": [
    {
      "text": "Caption text here",
      "start": 0,
      "duration": 3,
      "position": "bottom",
      "style": {}
    }
  ]
}
```

### Scene Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique scene identifier |
| `start` | number | yes | Start time in seconds (from video start) |
| `duration` | number | yes | Scene duration in seconds |
| `type` | enum | yes | `title`, `content`, `transition`, `cta` |
| `attentionRole` | enum | no | `hook`, `retention`, `emotion`, `distribution` |
| `background` | object | yes | Background definition |
| `camera` | object | no | Camera movement definition |
| `elements` | array | yes | Visual elements in this scene |
| `transitions` | object | no | In/out transitions |
| `captions` | array | no | Subtitle/caption entries |

### Background Types

**Solid:**
```json
{ "type": "solid", "color": "#0b0f14" }
```

**Gradient:**
```json
{ "type": "gradient", "start": "#0b0f14", "end": "#1a1f2e", "angle": 135 }
```

**Image:**
```json
{ "type": "image", "url": "https://...", "fit": "cover" }
```

## Element Object

```json
{
  "id": "el-1",
  "type": "text",
  "position": { "x": 960, "y": 400 },
  "size": { "width": 800, "height": 100 },
  "content": "Your headline here",
  "style": {
    "fontSize": 64,
    "fontWeight": 700,
    "color": "#ffffff",
    "textAlign": "center",
    "fontFamily": "Inter, sans-serif"
  },
  "animations": {
    "entry": { "type": "fade", "duration": 0.5, "delay": 0 },
    "exit": { "type": "fade", "duration": 0.3 }
  }
}
```

### Element Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique element identifier |
| `type` | enum | yes | Element type (see below) |
| `position` | object | yes | `{ x, y }` center position |
| `size` | object | yes | `{ width, height }` |
| `content` | string | conditional | Text content (for text types) |
| `style` | object | no | Type-specific styling |
| `animations` | object | no | Entry, loop, and exit animations |
| `src` | string | conditional | Asset URL (for image/video types) |

### Element Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `text` | Typography | `content`, `style.fontSize`, `style.color` |
| `logo` | Brand mark | `src` or `brand.logo` |
| `icon` | Symbol | `content` (icon name or SVG) |
| `card` | Floating panel | `content`, `style.background` |
| `workflowCard` | Workflow step | `content`, `style.stepNumber` |
| `connector` | Line between cards | `from`, `to` (element IDs) |
| `shape` | Geometric shape | `style.shape` (rect, circle, line) |
| `image` | Raster image | `src` |
| `video` | Video element | `src` |
| `browserFrame` | Browser mockup | `content` (URL or screenshot) |
| `terminalFrame` | Terminal mockup | `content` (terminal text) |
| `codeFrame` | Code block | `content`, `style.language` |
| `productShot` | Product screenshot | `src` |
| `particleField` | Ambient particles | `style.particleConfig` |
| `gradientBlob` | Animated gradient | `style.gradient` |

### Animation Types

| Type | Description | Properties |
|------|-------------|------------|
| `fade` | Opacity transition | `duration`, `delay` |
| `slide` | Directional slide | `duration`, `delay`, `from` (top/bottom/left/right) |
| `scale` | Size transition | `duration`, `delay`, `from` (0-1) |
| `blur` | Gaussian blur dissolve | `duration`, `delay` |
| `rotate` | Rotation | `duration`, `delay`, `degrees` |
| `drawLine` | SVG stroke reveal | `duration`, `delay` |
| `countUp` | Number counter | `duration`, `delay`, `from`, `to` |
| `typewriter` | Character reveal | `duration`, `delay`, `speed` |
| `revealMask` | Clip-path reveal | `duration`, `delay`, `direction` |
| `cameraPush` | Virtual camera move | `duration`, `delay`, `direction` |
| `parallax` | Depth offset | `speed` |
| `morph` | Shape interpolation | `duration`, `delay` |
| `stagger` | Sequential entrance | `duration`, `delay`, `staggerDelay` |
| `spring` | Spring physics | `stiffness`, `damping`, `mass` |
| `pulse` | Scale oscillation | `speed`, `amount` |
| `orbit` | Circular motion | `radius`, `speed`, `startAngle` |

## Transition Object

```json
{
  "type": "fade",
  "duration": 0.5,
  "easing": "ease-in-out"
}
```

| Type | Description |
|------|-------------|
| `fade` | Cross-fade between scenes |
| `slide` | Scene slides in from direction |
| `cameraPush` | Virtual camera movement |
| `cut` | Hard cut (duration: 0) |

## Caption Object

```json
{
  "text": "Your caption text",
  "start": 0.5,
  "duration": 2.5,
  "position": "bottom",
  "style": {
    "fontSize": 28,
    "color": "#ffffff",
    "background": "rgba(0,0,0,0.6)",
    "padding": 8,
    "borderRadius": 4
  }
}
```

| Position | Description |
|----------|-------------|
| `bottom` | Center-bottom of frame |
| `top` | Center-top of frame |
| `lower-third` | Lower-left third |
| `inline` | Positioned near element |

## Export Object

```json
{
  "format": "mp4",
  "aspectRatio": "16:9",
  "width": 1920,
  "height": 1080,
  "fps": 60,
  "quality": "high",
  "codec": "h264"
}
```

| Field | Values | Default |
|-------|--------|---------|
| `format` | `mp4`, `webm` | `mp4` |
| `aspectRatio` | `16:9`, `9:16`, `1:1`, `4:5` | `16:9` |
| `quality` | `low`, `medium`, `high` | `high` |
| `codec` | `h264`, `h265`, `vp9` | `h264` |

## Validation Rules

1. `duration` must be > 0 and ≤ 120
2. `fps` must be 30 or 60
3. `resolution.width` must be ≥ 640 and ≤ 3840
4. `resolution.height` must be ≥ 480 and ≤ 2160
5. At least 1 scene required
6. Scene `start` + `duration` must not exceed video `duration`
7. Scenes must not overlap in time
8. Every element `id` must be unique within its scene
9. Connector `from`/`to` must reference existing element IDs
10. Animation durations must be ≥ 0
11. Export dimensions must match aspect ratio (±10%)
12. Max 20 scenes per spec
