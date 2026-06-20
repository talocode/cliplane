# ClipLoop Video Taste System

Design principles for high-quality agent-generated videos in ClipLoop.

## Purpose

Define ClipLoop's original video taste system to ensure AI-generated videos meet premium quality standards. This system is video-specific and distinct from frontend design skills.

## Anti-Slop Video Editing Principles

### What Makes AI Videos Look Cheap

- Generic template intros with no context
- Random stock effects and transitions
- Unreadable captions (too small, wrong color, bad placement)
- Overused transitions (star wipes, random fades)
- Cluttered lower thirds with too much text
- Robotic pacing with no natural rhythm
- One idea spread across multiple scenes
- No clear hook in the first 2 seconds
- Brand inconsistency across scenes

### What Makes Product Videos Feel Premium

- Clear hook within first 2 seconds
- One idea per scene
- Captions readable on mobile
- Motion supports the message
- Consistent brand system
- Terminal demos show real commands and outputs
- Release videos are 35-60 seconds
- Clean, minimal composition

## Pacing Rules

### Scene Duration

- Hook scene: 2-3 seconds
- Main content scenes: 4-6 seconds
- Transition scenes: 1-2 seconds
- CTA scene: 3-4 seconds

### Rhythm

- Alternate between fast and slow pacing
- Use pauses for emphasis
- Match cuts to audio beats
- Avoid constant motion

## Visual Hierarchy

### Primary Elements

- Product name/logo (largest)
- Key message (medium)
- Supporting details (smaller)

### Spacing

- Generous negative space
- Clear visual separation
- Consistent margins
- Balanced composition

## Caption Design

### Style

- Clean, modern font
- High contrast (white on dark)
- Readable on mobile (minimum 24pt equivalent)
- No decorative fonts for body text

### Placement

- Center or lower third
- Avoid edges
- Leave breathing room

### Animation

- Subtle fade-in/out
- No flashy effects
- Sync with audio

## Motion Restraint

### Allowed

- Smooth transitions
- Subtle zoom
- Gentle parallax
- Clean cuts

### Avoid

- Random shaking
- Excessive spinning
- Glitch effects (unless intentional)
- Over-the-top animations

## Audio/Voice Balance

### Voice

- Clear, professional narration
- Appropriate pace
- No robotic tone

### Music

- Subtle background
- Match mood to content
- No copyrighted tracks

### Sound Effects

- Minimal use
- Only when adds value

## Platform Composition

### X/Twitter

- 16:9 or 1:1
- Bold text
- Clear hook

### YouTube

- 16:9
- Longer scenes allowed
- More detailed content

### Instagram

- 1:1 or 9:16
- Visual-first
- Quick cuts

## Brand Consistency

### Colors

- Use Talocode brand palette
- Consistent across scenes
- No random color changes

### Typography

- Same font family
- Consistent sizing
- Clear hierarchy

### Logo Usage

- Consistent placement
- Proper sizing
- No distortion

## Export Quality

### Resolution

- 1080p minimum
- 4K preferred

### Frame Rate

- 30fps for smooth motion
- 60fps for high-quality

### Format

- MP4 (H.264)
- High bitrate for quality

## Quality Checklist

Before export, verify:

- [ ] Clear hook in first 2 seconds
- [ ] One idea per scene
- [ ] Captions readable on mobile
- [ ] Motion supports the message
- [ ] Brand system consistent
- [ ] No generic templates
- [ ] No random effects
- [ ] Audio balanced
- [ ] Export quality high
- [ ] Platform-appropriate format

## Example Workflows

### Product Launch

1. Hook: Product name + key benefit
2. Features: 2-3 key features
3. Demo: Show product in action
4. CTA: Call to action

### Tutorial

1. Hook: What you'll learn
2. Steps: Clear, numbered steps
3. Result: Show outcome
4. CTA: Try it yourself

### Announcement

1. Hook: What's new
2. Details: Key changes
3. Impact: Why it matters
4. CTA: Get started

## Attention Framework

**Hook → Retention → Emotion → Distribution**

Core principle: "Attention is engineered, not accidental."

### How This Applies to Video Editing

- **Hooks** influence first frame, first caption, first scene
- **Retention** influences pacing, cuts, scene duration, captions, motion
- **Emotion** influences story, stakes, music, voiceover, before/after
- **Distribution** influences aspect ratio, platform presets, CTA, thumbnails, cutdowns

### Hook

The first 1–3 seconds must stop the scroll.

**Good hooks:**
- Show the result first
- Show the pain immediately
- Start with a bold claim
- Start with a surprising before/after
- Show a real command/output fast
- Show the product doing something valuable immediately

**Avoid:**
- Slow intros
- Generic logo openings
- "Welcome to this demo"
- Long context before value

### Retention

Keep the viewer watching through pacing and curiosity.

**Rules:**
- One idea per scene
- Cut dead time
- Keep scenes short
- Use visible progress
- Use captions
- Show transformation
- Create open loops
- Make every 3–5 seconds visually earn attention

### Emotion

Make the viewer feel the pain, relief, ambition, speed, frustration, or possibility.

**Use:**
- Builder struggle
- Time saved
- Frustration removed
- "Finally" moments
- Real constraints
- Honest shipping energy
- Open-source mission

**Avoid:**
- Robotic neutral demos
- Feature lists without stakes
- Fake hype

### Distribution

Make the video easy to share across platforms.

**Rules:**
- Include clear takeaway
- Include product name visually
- Include install/link CTA
- Export for platform aspect ratios
- Make captions readable on mobile
- Make the first frame strong enough as a thumbnail
- Create cutdowns for X, LinkedIn, YouTube Shorts, Instagram, Threads, Facebook, WhatsApp

## Timeline Metadata

Optional metadata for attention-driven videos:

```json
{
  "attention": {
    "hook": "Show final result in first 2 seconds",
    "retention": "Fast cuts, one idea per scene, visible progress",
    "emotion": "Builder frustration → relief",
    "distribution": ["x", "linkedin", "youtube-shorts", "instagram-reels"]
  }
}
```

## Platform-Specific Distribution

### X/Twitter
- 16:9 or 1:1
- Bold text
- Clear hook
- Short copy

### LinkedIn
- Problem → Insight → Product proof
- Professional tone
- Detailed context

### YouTube Shorts
- Vertical (9:16)
- Fast hook
- Captions mandatory

### Instagram Reels
- Visual clarity
- Captions
- Motion

### Threads
- Short clip
- Conversational caption

### Facebook
- Broader context
- Captions

### WhatsApp Status
- Vertical
- Clear text
- Short duration

## Integration with Talocode

This taste system works alongside:

- `talocode-partnership-branding` - For partnership graphics
- `talocode-release` - For release workflows
- `talocode-remotion-demo` - For demo video creation

Use this system when creating videos for:

- ClipLoop product demos
- Talocode ecosystem announcements
- Feature releases
- Tutorial content
