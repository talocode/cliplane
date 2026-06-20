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

## Notes

- Remotion is the recommended default
- ffmpeg is always available as fallback
- HTML Video is experimental
- HyperFrames integration is planned
- Cloud rendering is future work
