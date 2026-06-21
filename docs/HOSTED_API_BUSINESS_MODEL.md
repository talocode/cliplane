# ClipLoop Hosted API Business Model

Business model for ClipLoop's hosted API platform.

## One-Key Access Model

Everything runs through a single key:

```
CLIPLOOP_API_KEY
```

Users should not need separate keys for every provider when using the hosted ClipLoop API. ClipLoop handles provider orchestration behind `CLIPLOOP_API_KEY`. Research, script generation, B-roll, voiceover, rendering, captions, and publishing — all accessible through one authentication header.

```bash
curl -H "Authorization: Bearer $CLIPLOOP_API_KEY" \
  -X POST https://api.cliploop.site/v1/videos \
  -d '{"topic": "How Codra Code works", "duration": 60}'
```

The hosted API manages:
- Provider key storage and rotation
- Cost abstraction across providers
- Rate limiting per key
- Credit deduction per operation
- Webhook callbacks for async operations
- Asset storage and cleanup

## Core Model

- **Pay-per-use credits** for API operations
- **No subscriptions** required (current model)
- **Credit packs** for top-ups
- **Scoped API keys** per project or integration

## API Products

### Current

- Weekly promo video generation (5 credits)
- Copy generation via chat (1 credit)
- Video generation via chat (1 credit)
- Video render via chat (1 credit)
- Strategy cycle generation (5 credits)

### Motion Video API (New)

| Operation | Credits | Description |
|-----------|---------|-------------|
| Create motion video | 10 | Parse spec, validate, queue render |
| Render motion video | 15 | Full render with selected renderer |
| Preview motion spec | 2 | Key frame preview (low-res) |
| Template render | 12 | Template + brand overrides |

### AI Video Production API

| Operation | Credits | Description |
|-----------|---------|-------------|
| Research context | 2 | Gather public context from URLs |
| Script generation | 3 | Generate structured script |
| Scene planning | 2 | Break script into scenes |
| B-roll planning | 1 | Plan visual assets per scene |
| Asset generation | 5-20 | Generate images/video (varies by provider) |
| Voiceover | 3 | Text-to-speech narration |
| Avatar | 10 | AI avatar segment generation |
| Motion spec | 2 | Full motion spec generation |
| Render | 10-50 | Video rendering (varies by duration/quality) |
| Export | 2 | Platform-specific export |
| YouTube audit | 3 | Channel/video pattern analysis |
| Motion spec from idea | 2 | Idea → motion spec conversion |

### Future

- Template marketplace
- Brand kit storage
- Batch rendering
- Custom scene composition

## Hosted Motion Rendering

When ClipLoop offers hosted rendering through the API:

- **Render queue**: Jobs queued and processed by render workers
- **Brand kits**: Store brand colors, fonts, logos for reuse
- **Template rendering**: Pre-built templates with custom brand/script
- **Webhook callbacks**: Notify callers when render completes
- **Cloud asset storage**: Rendered videos stored temporarily (7-day expiry)
- **Usage-based credits**: Pay per render, per second of output

## Credit Costs

### Generation

| Action | Bucket | Cost |
|--------|--------|------|
| Weekly Promo | Generation | 5 credits |
| Motion Video Create | Generation | 10 credits |
| Motion Preview | Generation | 2 credits |
| Copy generation | Generation | 1 credit |
| Strategy cycle | Generation | 5 credits |

### Rendering

| Action | Bucket | Cost |
|--------|--------|------|
| Standard render | Render | 5 credits |
| Motion video render | Render | 15 credits |
| Template render | Render | 12 credits |
| Preview render | Render | 1 credit |

## Creator / Team Plans

Future plan tiers (when launched):

### Free

- 50 credits/month
- Weekly promo API
- Standard render quality
- 7-day asset retention

### Pro

- 500 credits/month
- All API products
- High render quality
- 30-day asset retention
- Brand kit storage (3)
- Priority render queue

### Team

- 2000 credits/month
- All Pro features
- Custom templates
- Webhook callbacks
- 90-day asset retention
- Brand kit storage (10)
- Dedicated render capacity

## Pricing Principles

1. Predictable per-operation costs
2. No surprise bills
3. Free tier足够 for testing
4. Credits scale linearly with usage
5. No seat-based billing for v1
