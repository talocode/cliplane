# ClipLoop Renderers

Renderer strategy for ClipLoop video engine.

## Overview

ClipLoop supports multiple rendering backends to provide flexibility for different video creation workflows.

## Supported Renderers

### 1. Remotion (Primary)

**Status:** Fully supported

**Use for:**
- React-based programmatic videos
- Component-driven demos
- Release animations
- Reusable visual systems

**Install:**
```bash
npm install remotion @remotion/cli @remotion/renderer
```

**Example:**
```bash
npx remotion render src/Video.tsx output.mp4
```

### 2. ffmpeg (Fallback)

**Status:** Fully supported

**Use for:**
- Stitching clips
- Adding audio
- Transcoding
- Trimming
- Caption burn-in
- Format conversion

**Install:**
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg
```

### 3. HTML Video (Experimental)

**Status:** Experimental

**Use for:**
- Agent-authored HTML compositions
- Browser-renderable motion graphics
- Quick prototyping

**Implementation:**
- Write HTML/CSS/JS compositions
- Use CSS animations or WAAPI
- Render via browser capture or HyperFrames

### 4. HyperFrames-Compatible (Planned)

**Status:** Planned / Experimental

**Use for:**
- Advanced HTML-to-video workflows
- Agent-authored compositions
- Complex animations

**External reference:**
- https://github.com/heygen-com/hyperframes

### 5. Cloud Renderer (Future)

**Status:** Planned

**Use for:**
- Hosted rendering
- API-driven video creation
- Scalable video production

## Renderer Selection

| Use Case | Renderer |
|----------|----------|
| React component video | Remotion |
| Quick HTML composition | HTML Video |
| Clip stitching | ffmpeg |
| Timeline editing | ClipLoop |
| Agent-authored video | HTML Video or Remotion |
| Release demo | Remotion or ffmpeg |
| Social content | Remotion or ffmpeg |
| Advanced HTML | HyperFrames-compatible |

## Architecture

```
ClipLoop Timeline
       ↓
  Renderer Layer
       ↓
  ┌────┴────┐
  │         │
Remotion  ffmpeg
  │         │
  └────┬────┘
       ↓
  MP4 Output
```

## Future Renderers

- Cloud-based rendering API
- GPU-accelerated rendering
- Real-time collaboration
- AI-assisted composition

## Motion Video Renderers

The motion video API (`docs/MOTION_VIDEO_API.md`) uses a renderer-agnostic architecture. The motion spec describes what to render; the renderer decides how.

### Motion Renderer Selection

| Renderer | Best For | Latency | Quality |
|----------|----------|---------|---------|
| Remotion | Structured React components | Medium | High |
| HTML Video | Agent-authored compositions | Fast | Medium |
| Cloud Renderer (future) | Complex scenes, high volume | Variable | High |

### Remotion Motion Renderer

**Status:** Available (requires Remotion installed)

Renders motion spec scenes as React components. Best for:
- Structured compositions with consistent brand systems
- Workflow diagrams and card sequences
- Text-heavy product videos

**Pipeline:**
1. Parse motion spec
2. Convert scenes → Remotion composition tree
3. Render frames with `@remotion/renderer`
4. Encode to MP4 with ffmpeg

### HTML Video Motion Renderer

**Status:** Scaffolded

Renders motion spec scenes as HTML/CSS/JS compositions. Best for:
- Quick prototyping
- Agent-authored compositions
- Browser-renderable motion graphics

**Pipeline:**
1. Parse motion spec
2. Generate HTML per scene with CSS animations
3. Capture via Puppeteer or HyperFrames
4. Stitch frames to video

### Cloud Renderer (Future)

**Status:** Planned

Hosted GPU rendering for:
- Complex scenes with many elements
- High-resolution output (4K)
- Parallel render jobs
- API-driven batch rendering

### Preview Renderer

**Status:** Scaffolded

Generates low-resolution preview frames without full rendering:
- Parse motion spec
- Render key frames as static images
- Return preview URLs for quick review

### Renderer-Agnostic Design

The motion API accepts any valid spec and routes to the best available renderer. If no renderer is available, the API returns the spec validation and scene plan without claiming video output.

```
Motion Spec
  ↓
Schema Validation
  ↓
Renderer Availability Check
  ↓
┌──────────┬──────────┐
│ Remotion │ HTML     │ ← Available renderers
│ (ready)  │ (ready)  │
└──────────┴─────┬────┘
                 ↓
           Video Output
           or "renderer_unavailable"
```

## Notes

- Remotion is the recommended default
- ffmpeg is always available as fallback
- HTML Video is experimental
- HyperFrames integration is planned
- Cloud rendering is future work
- Motion API is renderer-agnostic by design
- No renderer should claim success without actual output
