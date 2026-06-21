# SaaS Motion Launch Template

Template for SaaS product launch videos with polished motion design.

## Scenes

1. **Hook** (3s) — Bold opening statement with fade-in typography
2. **Logo Reveal** (3s) — Brand logo scale-in with gentle pulse
3. **Problem/Pain** (5s) — Pain point card with camera drift
4. **Workflow Diagram** (8s) — Three-step workflow cards connected by dashed connectors
5. **Feature Sequence** (12s) — Three feature cards sliding in from different directions
6. **Proof/Result** (5s) — Key stat with count-up animation
7. **CTA** (4s) — Call to action with scale-in text

## Placeholders

| Placeholder | Type | Required | Description |
|-------------|------|----------|-------------|
| `script.hook` | string | yes | Opening hook line |
| `script.sections` | array | yes | Feature/section text (2-4 items) |
| `script.cta` | string | yes | Call to action text |
| `brand.name` | string | yes | Brand/product name |
| `brand.colors` | object | yes | Color palette |
| `brand.logo` | string | no | Logo URL |

## Usage

### Via API

```bash
curl -X POST https://app.cliploop.site/api/public/templates/saas-motion-launch/render \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": {
      "name": "MyApp",
      "colors": { "background": "#0b0f14", "primary": "#ffffff", "accent": "#6366f1" }
    },
    "script": {
      "hook": "Ship faster with AI.",
      "sections": ["Automated code review", "Smart refactoring", "One-click deploy"],
      "cta": "Try MyApp free"
    }
  }'
```

### Via CLI (future)

```bash
cliploop render --template saas-motion-launch --input request.json --output launch.mp4
```

## Design Notes

- Dark background by default (override via `brand.colors.background`)
- Workflow connectors animate with draw-on effect
- Feature cards stagger entrance for pacing
- CTA uses scale-in for emphasis
- All transitions use camera push or fade for smooth flow

## Constraints

- Requires 2-4 sections for feature sequence
- Logo is optional but recommended for CTA scene
- Duration is fixed at 54 seconds (template-controlled)
- Resolution is 1920x1080 at 60fps
