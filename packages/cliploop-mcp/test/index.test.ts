import test from "node:test";
import assert from "node:assert/strict";
import { cliploopCreateScript, cliploopCreateStoryboard, cliploopExportX, cliploopCreateRenderJob, cliploopGetRenderJob } from "../src/index.js";

test("create script works without api key", async () => {
  const result = await cliploopCreateScript({ update: "We shipped Codra v0.1.5", product: "Codra", audience: "builders", tone: "builder" });
  assert.equal(typeof result.fullScript, "string");
  assert.match(result.fullScript, /Codra/);
});

test("create storyboard works without api key", async () => {
  const result = await cliploopCreateStoryboard({ script: "We shipped something" });
  assert.equal(result.duration, 42);
  assert.ok(Array.isArray(result.scenes));
});

test("export x works without api key", async () => {
  const result = await cliploopExportX({ update: "We shipped ClipLoop SDK v0.1.0", product: "ClipLoop", audience: "builders" });
  assert.ok(result.post.length > 0);
});

test("create render job returns safe auth error without api key", async () => {
  await assert.rejects(() => cliploopCreateRenderJob({ update: "x" }), /ClipLoop API key required for hosted rendering/);
});

test("baseUrl override is accepted", async () => {
  await assert.rejects(
    () => cliploopCreateRenderJob({ update: "x" }, { apiKey: undefined, baseUrl: "https://example.com" }),
    /ClipLoop API key required for hosted rendering/
  );
  await assert.rejects(
    () => cliploopGetRenderJob("job_123", { apiKey: undefined, baseUrl: "https://example.com" }),
    /ClipLoop API key required for hosted rendering/
  );
});

test("errors never expose api keys", async () => {
  try {
    await cliploopCreateRenderJob({ update: "x" }, { apiKey: "secret-token", baseUrl: "https://example.com" });
  } catch (error) {
    assert.doesNotMatch(String(error), /secret-token/);
  }
});
