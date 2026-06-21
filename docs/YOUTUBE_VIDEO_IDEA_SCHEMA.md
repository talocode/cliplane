# YouTube Video Idea Schema

JSON schema for original video concepts generated from pattern analysis.

## Schema

```json
{
  "title": "I Built an Open-Source Coding Agent — Here's What Happened",
  "hook": "Show the agent completing a real task in the first 3 seconds",
  "audience": "Software developers interested in AI coding tools",
  "promise": "See a working demo of a local-first coding agent built from scratch",
  "scriptOutline": [
    {
      "section": "hook",
      "duration": "0-3s",
      "visual": "Terminal showing agent completing a real code edit",
      "caption": "I built a coding agent that runs on your machine.",
      "motion": "fade in with subtle zoom"
    },
    {
      "section": "context",
      "duration": "3-10s",
      "visual": "Product name and key feature cards",
      "caption": "No cloud. No vendor lock-in. Open source.",
      "motion": "slide in from left"
    },
    {
      "section": "demo",
      "duration": "10-45s",
      "visual": "Terminal session showing agent working through a task",
      "caption": "Watch it read the codebase, plan changes, and apply them safely.",
      "motion": "camera push with staggered element reveals"
    },
    {
      "section": "cta",
      "duration": "45-55s",
      "visual": "Install command and GitHub link",
      "caption": "npm install -g @talocode/codra-code",
      "motion": "scale in with spring easing"
    }
  ],
  "motionStyle": "dark terminal aesthetic, code-focused, minimal typography",
  "assetsNeeded": [
    "Product logo",
    "Terminal screen recording or mockup",
    "Feature card graphics",
    "Install command text"
  ],
  "clipLoopTemplate": "talocode-tech-explainer",
  "clipLoopSpec": {
    "duration": 55,
    "fps": 60,
    "resolution": { "width": 1920, "height": 1080 },
    "brand": {
      "colors": {
        "background": "#0b0f14",
        "primary": "#ffffff",
        "accent": "#ef476f"
      }
    }
  },
  "riskLevel": "low",
  "originalityScore": 5,
  "monetizationSafetyNotes": "Original demo content. No copied material. Policy-safe format.",
  "distributionPlan": {
    "primary": "YouTube (16:9)",
    "shorts": "YouTube Shorts (9:16) — extract 15-30s hook clip",
    "social": "X/Twitter — 30s teaser clip",
    "linkedin": "Text post with video link"
  }
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Proposed video title (original, not copied) |
| `hook` | string | What happens in the first 3 seconds |
| `audience` | string | Target viewer description |
| `promise` | string | What the viewer will get from watching |
| `scriptOutline` | array | Section-by-section breakdown with timing, visuals, captions, and motion |
| `motionStyle` | string | Visual aesthetic description for ClipLoop |
| `assetsNeeded` | array | Required visual assets for production |
| `clipLoopTemplate` | string | Which ClipLoop template to use |
| `clipLoopSpec` | object | ClipLoop motion spec parameters |
| `riskLevel` | enum | low / medium / high — production complexity |
| `originalityScore` | number | 1-5 scale (5 = fully original) |
| `monetizationSafetyNotes` | string | Notes on YouTube policy compliance |
| `distributionPlan` | object | Where and how to publish |

## Scoring Guidelines

### Originality Score

- **5**: Entirely original concept, unique angle, no structural overlap with existing content
- **4**: Original concept with some common format elements (tutorial, explainer)
- **3**: Common format but unique specific content and angle
- **2**: Somewhat generic format with limited differentiation
- **1**: Structural clone of existing content (do not proceed)

Minimum threshold: 3 to proceed to production.

### Risk Level

- **Low**: Short-form, single concept, minimal production
- **Medium**: Multi-section, requires assets, moderate production
- **High**: Complex multi-scene, requires significant assets, heavy production

## Usage

This schema is used by the Talocode YouTube intelligence workflow to structure video ideas before they enter the ClipLoop production pipeline. Each idea must pass originality scoring and human review before proceeding.
