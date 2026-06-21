# Talocode Tech Explainer Template

ClipLoop motion template for short-form technical explainer videos.

## Template Overview

| Property | Value |
|----------|-------|
| Name | talocode-tech-explainer |
| Duration | 45-60 seconds |
| Aspect Ratios | 16:9 (YouTube), 9:16 (Shorts) |
| FPS | 60 |
| Resolution | 1920x1080 (16:9), 1080x1920 (9:16) |
| Style | Dark terminal aesthetic, code-focused, minimal |

## Scene Breakdown

### Scene 1: Hook (0-3s)

**Purpose:** Earn the viewer's attention immediately.

- **Visual:** Terminal output or product demo completing a real task
- **Typography:** Bold statement text, centered
- **Motion:** Fade in with subtle zoom
- **Caption:** Single sentence establishing the premise
- **Background:** Dark gradient (#0b0f14 to #1a1f2e)

### Scene 2: Context/Proof (3-10s)

**Purpose:** Establish why this matters.

- **Visual:** Product name, key feature cards, or before/after comparison
- **Typography:** Product name in large text, feature list below
- **Motion:** Slide in from left with stagger
- **Caption:** What the product does in one sentence
- **Background:** Solid dark (#0b0f14)

### Scene 3: Explanation/Demo (10-45s)

**Purpose:** Show the core value through demonstration.

- **Visual:** Terminal session, code editor, workflow diagram, or product UI
- **Typography:** Section headers and key callouts
- **Motion:** Camera push with progressive element reveals
- **Caption:** Narration of the process or explanation
- **Background:** Terminal-style dark with subtle grid

**Sub-sections (adaptable):**
- Step 1: Show the starting state
- Step 2: Show the action being taken
- Step 3: Show the result

### Scene 4: CTA (45-55s)

**Purpose:** Direct the viewer to take action.

- **Visual:** Install command, GitHub link, or product URL
- **Typography:** Large CTA text, command in terminal frame
- **Motion:** Scale in with spring easing
- **Caption:** Clear next step
- **Background:** Gradient with accent color highlight

## Brand Configuration

```json
{
  "brand": {
    "colors": {
      "background": "#0b0f14",
      "primary": "#ffffff",
      "accent": "#ef476f",
      "secondary": "#06d6a0",
      "muted": "#8892b0"
    },
    "fontFamily": "Inter, system-ui, sans-serif",
    "codeFont": "JetBrains Mono, monospace"
  }
}
```

## 16:9 vs 9:16 Adaptation

### 16:9 (YouTube Long-form / Standard)

- Full scene layout with side-by-side elements
- Terminal and UI mockups at comfortable size
- Text positioned with breathing room

### 9:16 (YouTube Shorts)

- Vertically stacked elements
- Larger text for mobile readability
- Terminal mockups cropped to essential content
- CTA text centered and prominent

## Captions

- All scenes include caption text
- Font: Inter or system sans-serif
- Size: 28px minimum at 1080p
- Color: White with subtle shadow for readability
- Position: Lower third or centered depending on scene

## Thumbnail Frame

The template generates a thumbnail frame from Scene 2 (Context/Proof):

- Product name or key text
- High contrast against dark background
- Minimal elements (text + one visual)
- Works at small thumbnail sizes

## Customization Points

- Replace brand colors with product-specific palette
- Swap terminal mockup for product-specific UI
- Adjust scene timing for content complexity
- Add or remove sub-sections in the demo scene
- Change CTA destination (URL, command, link)

## Usage with ClipLoop API

```json
{
  "template": "talocode-tech-explainer",
  "brand": {
    "name": "Codra Code",
    "colors": {
      "background": "#0b0f14",
      "primary": "#ffffff",
      "accent": "#ef476f"
    }
  },
  "script": {
    "hook": "A coding agent that runs on your machine.",
    "sections": [
      "Reads your codebase",
      "Plans before it acts",
      "Applies changes safely"
    ],
    "cta": "npm install -g @talocode/codra-code"
  }
}
```
