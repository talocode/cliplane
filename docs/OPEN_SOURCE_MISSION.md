# ClipLoop Open Source Mission

ClipLoop is an open-source video workflow layer for builders and developers.

## Principles

- Keep the core workflow open-source.
- Support local-first generation where possible.
- Treat hosted rendering as optional, not required.
- Never hardcode secrets.
- Never auto-post.
- Never scrape.
- Keep the provider architecture open.

## Product shape

- CLI: `@talocode/cliploop`
- SDK: `@talocode/cliploop-sdk`
- MCP: `@talocode/cliploop-mcp`

The SDK and MCP server are meant to help teams integrate ClipLoop into their own apps, dashboards, agents, chat clients, and automation workflows. Hosted rendering remains optional.

