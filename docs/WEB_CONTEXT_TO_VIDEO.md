# ClipLoop Web Context to Video

Turning public product URLs, changelogs, releases, and documentation into motion videos through structured context extraction.

## Purpose

ClipLoop can use public or user-approved web content as the source material for generating product videos. A product's own documentation, release notes, and feature pages become the grounded source for authentic, accurate video scripts — without inventing features or making false claims.

## Pipeline

```
Product URL / Changelog / Docs
  ↓
Web Context Extraction
  ↓
Clean structured content
  ↓
Script Generation
  ↓
Motion Spec Generation
  ↓
Video Render
  ↓
Output with source attribution
```

## Source Types

### Product Homepage

Public product pages provide:
- Product name, tagline, and positioning
- Feature descriptions
- Visual identity (colors, logo references)
- Target audience signals
- Call-to-action language

### Changelog / Release Notes

Changelogs provide:
- What's new in each version
- Breaking changes
- Bug fixes
- Performance improvements
- Migration notes

### Documentation Pages

Docs provide:
- API signatures and capabilities
- Installation instructions
- Usage examples
- Architecture descriptions
- Integration patterns

### GitHub Releases

GitHub releases provide:
- Version numbers and dates
- Release notes with categories
- Binary/asset download links
- Discussion threads about the release

## Context Extraction Flow

### 1. Source Identification

User provides one or more URLs:

```
Product: https://myproduct.com
Changelog: https://myproduct.com/changelog
Docs: https://docs.myproduct.com
GitHub: https://github.com/org/product/releases
```

### 2. Content Extraction

For each source, extract clean structured content:

**From product page:**
```json
{
  "type": "product-page",
  "name": "MyProduct",
  "tagline": "Ship faster with AI",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "audience": "developers",
  "cta": "Try free"
}
```

**From changelog:**
```json
{
  "type": "changelog",
  "versions": [
    {
      "version": "2.0",
      "date": "2026-06-21",
      "highlights": ["New feature X", "Improved performance Y"],
      "breaking": ["Removed deprecated API Z"]
    }
  ]
}
```

**From docs:**
```json
{
  "type": "documentation",
  "sections": [
    {
      "title": "Quick Start",
      "content": "Install with npm install..."
    }
  ]
}
```

### 3. Context Synthesis

Combine extracted content into a coherent product brief:

```json
{
  "productName": "MyProduct",
  "version": "2.0",
  "tagline": "Ship faster with AI",
  "keyFeatures": [
    "Feature X: description",
    "Feature Y: description"
  ],
  "installCommand": "npm install myproduct",
  "audience": "developers",
  "sourceUrls": ["https://myproduct.com", "https://myproduct.com/changelog"]
}
```

### 4. Script Generation

Use the product brief to generate a video script:

- Hook: Bold claim about the product
- Problem: Pain point the product solves
- Solution: How the product addresses it
- Features: Key capabilities with evidence
- Proof: Social proof or metrics from docs
- CTA: Clear call to action

Script is grounded in extracted context — no invented features.

### 5. Motion Spec Generation

Convert the script into a motion spec using ClipLoop templates:

- Map script sections to scenes
- Apply brand colors from product page
- Use product name in typography elements
- Include install command in terminal frame
- Feature cards for key capabilities
- CTA scene with product link

### 6. Video Render

Render the motion spec using ClipLoop's motion renderer.

## Source Metadata

Every video generated from web context includes source attribution:

```json
{
  "videoId": "video_abc123",
  "sources": [
    {
      "url": "https://myproduct.com",
      "title": "MyProduct Home",
      "fetchedAt": "2026-06-21T10:00:00Z"
    },
    {
      "url": "https://myproduct.com/changelog",
      "title": "Changelog",
      "fetchedAt": "2026-06-21T10:00:05Z"
    }
  ],
  "generatedAt": "2026-06-21T10:01:00Z",
  "contextVersion": 1
}
```

## Approval Before Publishing

### Content Accuracy Gate

Before publishing any video generated from web context:

1. Show the user the extracted product brief
2. Show the generated script with source citations
3. Show the motion spec preview
4. Require explicit approval at each stage
5. Allow user to edit any part before rendering

### Claim Verification

- Every feature mentioned in the video must trace to an extracted source
- No metrics or statistics unless found in the source content
- No competitive claims unless sourced from the product's own messaging
- Version numbers must match the source changelog
- Install commands must match the source documentation

## Use Cases

### Launch Videos

When a new version is released:

1. Fetch the product page and changelog
2. Extract new features and improvements
3. Generate a launch video script highlighting what's new
4. Render with brand-consistent motion design

### Tutorial Videos

From documentation pages:

1. Fetch getting-started or quick-start docs
2. Extract installation and usage steps
3. Generate a tutorial video script
4. Render with terminal/code frame scenes

### Feature Explainers

From feature documentation:

1. Fetch specific feature docs page
2. Extract the problem it solves and how it works
3. Generate an explainer video script
4. Render with workflow diagram and card scenes

### Release Recap Videos

From multiple changelog versions:

1. Fetch changelog for the last 3-5 versions
2. Extract highlights and improvements
3. Generate a recap video showing the journey
4. Render with timeline and stat scenes

## Safety Rules

- Never fabricate features not found in the source content
- Never claim performance improvements without source evidence
- Never use competitor names in generated content
- Always preserve source metadata for verification
- Allow users to review and edit every generated asset
- Mark videos as "AI-generated from public documentation" when appropriate
