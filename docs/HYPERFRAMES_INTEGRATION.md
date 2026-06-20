# HyperFrames Integration

HyperFrames-style HTML-to-video integration for ClipLoop.

## Overview

HyperFrames is an open-source HTML-to-video rendering framework where agents can write HTML, CSS, and JavaScript compositions and render them to MP4.

**External reference:** https://github.com/heygen-com/hyperframes

## What HyperFrames Teaches ClipLoop

- HTML/CSS/JS as a video composition format
- Agents can write browser-renderable scenes
- Browser-native animations (CSS, GSAP, WAAPI)
- Deterministic rendering
- Fast iteration cycles

## Integration Strategy

### Phase 1: Documentation (Current)

- Document HyperFrames as an external renderer
- Explain when to use HTML-to-video workflows
- Provide example HTML compositions

### Phase 2: ClipLoop Timeline Export (Planned)

- ClipLoop timeline can export HTML compositions
- Timeline events map to HTML elements
- Animation keyframes become CSS/GSAP animations

### Phase 3: Renderer Integration (Future)

- ClipLoop can call HyperFrames or compatible renderer
- Browser-based rendering pipeline
- Hosted rendering option

## HTML/CSS/JS as Video Format

HyperFrames demonstrates that HTML can be a video composition format:

- Write plain HTML/CSS/JS
- Use browser-native animations
- Render to MP4 via browser capture
- Agents can author compositions quickly

### Example HTML Composition

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      background: #1C1C1C; 
      color: white; 
      font-family: monospace; 
      margin: 0;
      padding: 0;
    }
    .container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
    }
    .title { 
      font-size: 72px; 
      animation: fadeIn 1s ease-in;
    }
    @keyframes fadeIn { 
      from { opacity: 0; } 
      to { opacity: 1; } 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Product Name</div>
  </div>
</body>
</html>
```

## ClipLoop Timeline to HTML

Future: ClipLoop timeline can export HTML compositions

```json
{
  "timeline": {
    "duration": 10,
    "fps": 30,
    "scenes": [
      {
        "start": 0,
        "end": 3,
        "html": "<div class='hook'>Result first</div>",
        "animations": ["fadeIn"]
      }
    ]
  }
}
```

## Rendering Pipeline

```
HTML Composition
       ↓
  Browser Render
       ↓
  Frame Capture
       ↓
  MP4 Encode
       ↓
  Video Output
```

## External Dependencies

- **HyperFrames**: https://github.com/heygen-com/hyperframes
- **Browser**: Chrome/Chromium for rendering
- **ffmpeg**: For frame capture and encoding

## Status

- **Phase 1 (Documentation):** Complete
- **Phase 2 (Timeline Export):** Planned
- **Phase 3 (Renderer Integration):** Planned

## Notes

- HyperFrames is external and not maintained by Talocode
- This integration is experimental
- ClipLoop timeline export is future work
- Browser-based rendering requires Chromium
