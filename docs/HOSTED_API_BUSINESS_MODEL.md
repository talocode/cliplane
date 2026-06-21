# ClipLoop Hosted API Business Model

Business model for ClipLoop's hosted API platform.

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
