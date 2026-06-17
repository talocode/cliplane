# HeyGen Grok MCP Notes

## Source check

I could not reliably fetch the public Grok MCP page directly from this environment in a way that gave stable line-by-line access, so this note infers the integration pattern from HeyGen's public MCP documentation and the standard Model Context Protocol workflow.

## What Grok MCP integration likely enables

- A user can add a remote MCP server or custom connector from inside a supported Grok client.
- Grok can discover tools, call them on behalf of the user, and return video workflow results in chat.
- For HeyGen, the public docs suggest Grok can connect either to a custom MCP endpoint or to an official connector entry when available.
- The practical result is chat-to-video workflow automation without the user jumping between apps.

## Permission model

- The host client should require explicit user approval before connecting to a server.
- The user should see what connector they are adding, what domain it points to, and what permissions it requests.
- For remote connector flows, OAuth is the expected pattern in HeyGen's documentation.
- For ClipLoop, local tools should work without an API key, while hosted rendering should require explicit user auth or an API key.

## Tool-calling flow

1. The user asks Grok to create a promo script or storyboard.
2. The host discovers the ClipLoop MCP server and its tool list.
3. Grok calls `cliploop_create_script` or `cliploop_create_storyboard`.
4. If the user wants hosted rendering, the host asks for permission before calling `cliploop_create_render_job`.
5. The server returns a queued render job or an auth error if no API key is available.
6. The host polls `cliploop_get_render_job` until the render completes.

## How ClipLoop can offer an equivalent open workflow

- Expose the same core workflow as tools instead of a closed GUI-only product.
- Keep script, storyboard, and X export local-first and deterministic.
- Reserve hosted rendering for API-key-authenticated operations only.
- Make the MCP server usable from Grok-compatible clients, desktop agents, and other MCP-aware chat tools.
- Keep the product identity open-source first: CLI open, SDK open, MCP open, hosted API optional.

## Risks and limitations

- MCP hosts vary in how they render tool schemas and permission prompts.
- Tool names need to stay stable once clients start relying on them.
- Hosted rendering can still fail if the API service is unavailable.
- The client must not auto-run paid or billed operations without user approval.
- Public docs should avoid claiming official marketplace approval until that is true.

## What should be public now vs later

Public now:
- MCP server command and package name.
- Local script, storyboard, and X export tools.
- Hosted rendering auth requirement.
- Basic Grok-compatible setup instructions.

Later:
- Any marketplace listing or official connector approval.
- Expanded resources/prompts if they add clarity without exposing secrets.
- Additional hosted features once the API surface is stable.
