# YouTube Audit Schema

JSON schema for analyzing public YouTube channel and video metadata.

## Channel Audit

```json
{
  "channel": {
    "url": "https://youtube.com/@channelname",
    "name": "Channel Name",
    "niche": "Technology / AI / Developer Tools",
    "subscriberCount": 50000,
    "videoCount": 200,
    "createdAt": "2020-01-01",
    "description": "Public channel description",
    "uploadFrequency": "2-3 per week",
    "averageVideoLength": "8 minutes"
  },
  "videos": [
    {
      "url": "https://youtube.com/watch?v=xxxxx",
      "title": "Video Title",
      "duration": "5:32",
      "views": 125000,
      "publishedAt": "2026-06-01",
      "likes": 3200,
      "commentCount": 180,
      "thumbnailNotes": "Text overlay, high contrast, face in frame",
      "hook": "Opens with question about common developer pain point",
      "structure": [
        "Hook (0-3s)",
        "Problem statement (3-15s)",
        "Solution overview (15-45s)",
        "Demo (45-180s)",
        "CTA (180-190s)"
      ],
      "cta": "Subscribe for more AI tooling content",
      "estimatedPattern": "Problem-solution explainer with live demo"
    }
  ],
  "patterns": {
    "topics": [
      "AI coding assistants",
      "Developer productivity",
      "Open source tooling",
      "Local-first software"
    ],
    "hooks": [
      "Question-based openers",
      "Pain point identification",
      "Before/after comparisons",
      "Speed demonstrations"
    ],
    "titlePatterns": [
      "How to [verb] [tool] in [timeframe]",
      "[Tool] vs [Tool]: which is better for [use case]",
      "I built [thing] with [technology]",
      "[Number] things I wish I knew about [topic]"
    ],
    "thumbnailPatterns": [
      "Large text with 3-5 words max",
      "High contrast colors",
      "Product screenshots or terminal output",
      "Minimal background clutter"
    ],
    "retentionDevices": [
      "Pattern interrupts every 30-45 seconds",
      "Visual transitions between sections",
      "On-screen text reinforcing key points",
      "Progress indicators showing structure"
    ],
    "formats": [
      "Build log",
      "Tutorial",
      "Comparison",
      "Quick tip",
      "Launch announcement"
    ]
  },
  "recommendations": [
    "Focus on build log format — matches Talocode's authentic positioning",
    "Use question hooks for Shorts — higher retention in tech niche",
    "Keep explainers under 60 seconds for Shorts, 5-8 minutes for long-form",
    "Show real terminal output and working code for credibility"
  ]
}
```

## Video Audit

```json
{
  "video": {
    "url": "https://youtube.com/watch?v=xxxxx",
    "title": "How I Built an AI Coding Agent in One Weekend",
    "duration": "7:42",
    "views": 89000,
    "publishedAt": "2026-05-15",
    "likes": 2100,
    "commentCount": 145
  },
  "analysis": {
    "hook": {
      "type": "question",
      "text": "What if you could build your own coding agent?",
      "duration": "3 seconds",
      "effectiveness": "high — immediately establishes premise"
    },
    "title": {
      "length": 48,
      "pattern": "I built [thing] in [timeframe]",
      "keywords": ["built", "AI", "coding agent", "weekend"],
      "emotionalTrigger": "curiosity + achievability"
    },
    "structure": [
      { "section": "Hook", "start": 0, "end": 3, "type": "question" },
      { "section": "Context", "start": 3, "end": 15, "type": "problem" },
      { "section": "Build", "start": 15, "end": 240, "type": "process" },
      { "section": "Result", "start": 240, "end": 420, "type": "demo" },
      { "section": "CTA", "start": 420, "end": 462, "type": "subscribe" }
    ],
    "retention": {
      "estimatedDropPoints": ["15s (context)", "120s (mid-build)"],
      "strongSections": ["opening hook", "final demo"],
      "patternInterruptions": 4
    }
  },
  "extractedPrinciples": [
    "Question hooks in first 3 seconds drive curiosity",
    "Showing final result early creates anticipation for the build process",
    "Real terminal output builds credibility",
    "Short context section (12s) before diving into content"
  ]
}
```

## Usage Notes

- This schema describes the structure of audit data, not a runtime validation contract
- All data should come from publicly available sources
- Do not extract content behind authentication
- Do not store copyrighted video content (only metadata and structural notes)
- Use extracted principles for original content generation, not replication
