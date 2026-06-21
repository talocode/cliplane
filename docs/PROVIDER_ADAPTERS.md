# ClipLoop Provider Adapters

Architecture for integrating external AI providers behind the single CLIPLOOP_API_KEY.

## Purpose

ClipLoop orchestrates multiple AI providers behind a single API key. Users don't need to manage separate keys for each provider when using the hosted ClipLoop API. The adapter layer abstracts provider specifics, handles authentication, tracks costs, and provides fallback behavior.

## Adapter Interface

Every provider adapter implements:

```typescript
interface ProviderAdapter {
  name: string;
  category: ProviderCategory;
  capabilities: string[];
  requiredEnvVars: string[];
  status: 'available' | 'configured' | 'missing-key' | 'planned';
  estimateCost(input: unknown): CostEstimate | null;
  validate(input: unknown): ValidationResult;
  execute(input: unknown): Promise<ProviderResult>;
}
```

## Provider Categories

### Research

Providers that gather and analyze information from public sources.

- **Status**: Implemented (YouTube Data API v3)
- **Capabilities**: Channel metadata, video metadata, public content analysis
- **Required env**: `YOUTUBE_API_KEY`
- **Safety**: Public metadata only, no private content access

### Script LLM

Providers that generate scripts, narration text, and content strategy.

- **Status**: Planned
- **Capabilities**: Script generation, narrative structure, tone matching
- **Required env**: Provider-specific API key
- **Safety**: Original content only, no copied scripts

### B-Roll Image/Video Generation

Providers that create visual assets from text prompts.

- **Status**: Planned
- **Capabilities**: Image generation, video generation, style transfer
- **Required env**: Provider-specific API key
- **Safety**: Original content, no copyrighted material, no deepfakes

### Voice Generation

Providers that convert text narration into audio.

- **Status**: Planned
- **Capabilities**: Text-to-speech, voice cloning (with consent), pacing control
- **Required env**: Provider-specific API key
- **Safety**: No impersonation, voice consent required for cloning

### Avatar Generation

Providers that create talking-head or character avatars.

- **Status**: Planned
- **Capabilities**: Avatar rendering, lip sync, gesture animation
- **Required env**: Provider-specific API key
- **Safety**: Disclosure of AI-generated avatar required, no impersonation

### Music/SFX

Providers that generate background music and sound effects.

- **Status**: Planned
- **Capabilities**: Music generation, SFX creation, mood matching
- **Required env**: Provider-specific API key
- **Safety**: Royalty-free output required, no copyrighted music

### Rendering

Providers that compose final video output from motion specs.

- **Status**: Scaffolded (ClipLoop motion renderer)
- **Capabilities**: Frame composition, encoding, multi-platform export
- **Required env**: None for local rendering
- **Safety**: Output matches motion spec, no injected content

### Captions/Transcription

Providers that generate or burn captions into video.

- **Status**: Planned
- **Capabilities**: Caption generation, subtitle burn-in, multi-language
- **Required env**: Provider-specific API key for AI captioning
- **Safety**: Accurate transcription, proper attribution

### Publishing

Providers that upload completed videos to platforms.

- **Status**: Planned
- **Capabilities**: YouTube upload, X post, LinkedIn post
- **Required env**: Platform OAuth tokens
- **Safety**: Human approval gate, metadata accuracy, policy compliance

## Provider Registry

The registry tracks all available providers and their status:

```typescript
const providers: ProviderAdapter[] = [
  { name: 'youtube-data-api', category: 'research', status: 'configured', ... },
  { name: 'script-llm', category: 'script', status: 'planned', ... },
  { name: 'image-gen', category: 'broll', status: 'planned', ... },
  { name: 'voice-gen', category: 'voiceover', status: 'planned', ... },
  { name: 'avatar-gen', category: 'avatar', status: 'planned', ... },
  { name: 'music-gen', category: 'music', status: 'planned', ... },
  { name: 'cliploop-renderer', category: 'render', status: 'available', ... },
  { name: 'caption-gen', category: 'captions', status: 'planned', ... },
  { name: 'youtube-publish', category: 'publishing', status: 'planned', ... },
];
```

## Cost Abstraction

Each adapter provides cost estimates before execution:

```typescript
interface CostEstimate {
  provider: string;
  operation: string;
  credits: number;
  estimatedLatency: number;
}
```

ClipLoop aggregates costs across providers and charges a single credit amount through CLIPLOOP_API_KEY billing.

## Missing Provider Behavior

When a provider is not configured:

1. Return a clear JSON error: `{ "ok": false, "error": "voice-gen provider requires ELEVENLABS_API_KEY" }`
2. Include which env var is needed
3. Include the provider category and status
4. Never fake provider output

## Safety Constraints

### Per-Category Rules

| Category | Key Safety Rule |
|----------|----------------|
| Research | Public content only, no authenticated access |
| Script LLM | Original content only, no copied scripts |
| B-Roll | No copyrighted footage, no competitor assets |
| Voice | No impersonation, consent for voice cloning |
| Avatar | AI disclosure required, no deepfakes |
| Music | Royalty-free output, no copyrighted music |
| Render | Output matches spec, no injected content |
| Captions | Accurate transcription, proper attribution |
| Publishing | Human approval required, policy compliance |

### Global Rules

- Never commit API keys to the repository
- Never access private or authenticated content without explicit user permission
- Never generate misleading or deceptive content
- Never bypass platform policies or terms of service
- Always credit sources where applicable
- Always require human approval before publishing
