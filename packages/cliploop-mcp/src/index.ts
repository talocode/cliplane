#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ClipLoop, ClipLoopLocal } from "@talocode/cliploop-sdk";
import { fileURLToPath } from "node:url";
import { realpathSync } from "node:fs";

export const HOSTED_RENDER_KEY_ERROR =
  "ClipLoop API key required for hosted rendering. Get one at https://cliploop.site";

export type ClipLoopMcpOptions = {
  apiKey?: string;
  baseUrl?: string;
};

export type ClipLoopToolInput = {
  update?: string;
  script?: string;
  storyboard?: unknown;
  product?: string;
  audience?: string;
  tone?: "builder" | "technical" | "launch" | "simple";
  format?: string;
  id?: string;
};

export type ToolPayload = Record<string, unknown>;

function env(name: string) {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function cleanError(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]");
  }
  return String(error);
}

function getApiKey(explicit?: string) {
  return explicit ?? env("CLIPLOOP_API_KEY");
}

function getBaseUrl(explicit?: string) {
  return explicit ?? env("CLIPLOOP_API_BASE_URL") ?? "https://api.cliploop.site";
}

function makeClient(options: ClipLoopMcpOptions = {}) {
  const apiKey = getApiKey(options.apiKey);
  const baseUrl = getBaseUrl(options.baseUrl);
  return {
    apiKey,
    baseUrl,
    local: new ClipLoopLocal(),
    hosted: new ClipLoop({ apiKey, baseUrl }),
  };
}

function toJsonText(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function toolResult<T>(fn: () => Promise<T>) {
  try {
    const payload = await fn();
    return { content: [{ type: "text" as const, text: toJsonText(payload) }] };
  } catch (error) {
    return { isError: true, content: [{ type: "text" as const, text: cleanError(error) }] };
  }
}

export async function cliploopCreateScript(input: ClipLoopToolInput) {
  const client = makeClient();
  return client.local.createScript({
    update: input.update ?? "We shipped something new.",
    product: input.product,
    audience: input.audience,
    tone: input.tone,
    format: input.format,
  });
}

export async function cliploopCreateStoryboard(input: ClipLoopToolInput) {
  const client = makeClient();
  const script = input.script?.trim() || (await client.local.createScript({
    update: input.update ?? "We shipped something new.",
    product: input.product,
    audience: input.audience,
    tone: input.tone,
    format: input.format,
  })).fullScript;
  return client.local.createStoryboard({
    update: input.update ?? script,
    product: input.product,
    audience: input.audience,
    tone: input.tone,
    format: input.format,
  });
}

export async function cliploopExportX(input: ClipLoopToolInput) {
  const client = makeClient();
  return client.local.exportForX({
    update: input.update ?? "We shipped something new.",
    product: input.product,
    audience: input.audience,
    tone: input.tone,
    format: input.format,
  });
}

export async function cliploopCreateRenderJob(input: ClipLoopToolInput, options: ClipLoopMcpOptions = {}) {
  const apiKey = getApiKey(options.apiKey);
  const baseUrl = getBaseUrl(options.baseUrl);
  if (!apiKey) {
    throw new Error(HOSTED_RENDER_KEY_ERROR);
  }
  const client = new ClipLoop({ apiKey, baseUrl });
  return client.createRenderJob({
    update: input.update ?? "",
    product: input.product,
    audience: input.audience,
    tone: input.tone,
    format: input.format,
  });
}

export async function cliploopGetRenderJob(id: string, options: ClipLoopMcpOptions = {}) {
  const apiKey = getApiKey(options.apiKey);
  const baseUrl = getBaseUrl(options.baseUrl);
  if (!apiKey) {
    throw new Error(HOSTED_RENDER_KEY_ERROR);
  }
  const client = new ClipLoop({ apiKey, baseUrl });
  return client.getRenderJob(id);
}

export function createServer(options: ClipLoopMcpOptions = {}) {
  const server = new McpServer({ name: "cliploop-mcp", version: "0.1.0" });

  server.tool(
    "cliploop_create_script",
    {
      update: z.string(),
      product: z.string().optional(),
      audience: z.string().optional(),
      tone: z.enum(["builder", "technical", "launch", "simple"]).optional(),
      format: z.string().optional(),
    },
    async (input) => toolResult(() => cliploopCreateScript(input)),
  );

  server.tool(
    "cliploop_create_storyboard",
    {
      script: z.string().optional(),
      update: z.string().optional(),
      product: z.string().optional(),
      audience: z.string().optional(),
      tone: z.enum(["builder", "technical", "launch", "simple"]).optional(),
      format: z.string().optional(),
    },
    async (input) => toolResult(() => cliploopCreateStoryboard(input)),
  );

  server.tool(
    "cliploop_export_x",
    {
      update: z.string().optional(),
      product: z.string().optional(),
      audience: z.string().optional(),
      tone: z.enum(["builder", "technical", "launch", "simple"]).optional(),
      format: z.string().optional(),
    },
    async (input) => toolResult(() => cliploopExportX(input)),
  );

  server.tool(
    "cliploop_create_render_job",
    {
      update: z.string().optional(),
      script: z.string().optional(),
      storyboard: z.record(z.any()).optional(),
      product: z.string().optional(),
      audience: z.string().optional(),
      tone: z.enum(["builder", "technical", "launch", "simple"]).optional(),
      format: z.string().optional(),
    },
    async (input) => toolResult(() => cliploopCreateRenderJob(input, options)),
  );

  server.tool(
    "cliploop_get_render_job",
    {
      id: z.string(),
    },
    async (input) => toolResult(() => cliploopGetRenderJob(input.id, options)),
  );

  return server;
}

export async function main() {
  if (process.argv.includes("--version") || process.argv.includes("-V")) {
    console.log("0.1.0");
    return;
  }
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const isMain = process.argv[1] ? realpathSync(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (isMain) {
  main().catch((error) => {
    console.error(cleanError(error));
    process.exit(1);
  });
}
