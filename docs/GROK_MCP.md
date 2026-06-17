# Use ClipLoop with Grok via MCP

ClipLoop is not yet an official Grok marketplace integration unless explicitly approved. This guide is for MCP-compatible local setup where supported.

## Install

```bash
npm install -g @talocode/cliploop-mcp
```

Or run it directly:

```bash
npx @talocode/cliploop-mcp
```

## Example MCP config

```json
{
  "mcpServers": {
    "cliploop": {
      "command": "npx",
      "args": ["@talocode/cliploop-mcp"],
      "env": {
        "CLIPLOOP_API_KEY": "your_cliploop_api_key_optional"
      }
    }
  }
}
```

## Permission model

- Script, storyboard, and X export tools work locally without an API key.
- Hosted rendering requires an API key.
- Get an API key at https://cliploop.site.
- The user must explicitly approve the MCP tool call inside their client.

## Sample prompts

- Turn this product update into a short-form promo video script with ClipLoop: "We shipped Codra v0.1.5 with project harness generation."
- Use ClipLoop to create a storyboard for this release announcement.
- Use ClipLoop to create a hosted render job for this storyboard.

## Notes

- ClipLoop is an open-source video workflow layer.
- The CLI is open.
- The SDK is open.
- The hosted API is optional.
