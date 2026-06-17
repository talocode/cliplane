# ClipLoop x Tera Integration Plan

ClipLoop is designed to connect into Tera so chat answers, lessons, and product updates can become video scripts and storyboards.

## Goal

Prepare `teraai.chat` to call ClipLoop as a tool when a user asks:

- turn this answer into a video
- make a promo video for this product update
- create a storyboard from this explanation
- create an X video script from this lesson

## Recommended tool flow

1. The user asks in Tera chat.
2. Tera creates a concise product, lesson, or update summary.
3. Tera calls ClipLoop SDK or API.
4. ClipLoop returns a script or storyboard.
5. Tera asks the user for permission before hosted render.
6. ClipLoop render job starts only after the user approves.
7. Tera shows render status and the video URL when complete.

## Suggested tool names

- `cliploop.createScript`
- `cliploop.createStoryboard`
- `cliploop.createRenderJob`
- `cliploop.getRenderJob`
- `cliploop.exportForX`

## Security

- Tera must not auto-render paid jobs without confirmation.
- Tera must not expose API keys.
- The user should know when hosted rendering is being used.
- Local deterministic script and storyboard generation should remain free where possible.

## Integration note

ClipLoop should expose the same workflow in MCP and in direct SDK/API form so Tera can choose the right path for the user's permission level and deployment mode.
