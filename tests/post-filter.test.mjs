import assert from "node:assert/strict";
import { test } from "node:test";
import { filterPosts } from "../lib/post-filter.ts";

const posts = [
  { slug: "mcp", title: "理解 MCP", description: "工具连接的概念", tags: ["协议"], category: "explainer" },
  { slug: "local", title: "本地模型实践", description: "从下载到验证", tags: ["Qwen", "llama.cpp"], category: "tutorial", environment: "Windows + WSL2" },
  { slug: "agent", title: "Agent 安装", description: "配置 MCP 工具", tags: [], category: "tutorial", environment: "macOS" },
];

test("search matches real article fields, ignoring English case and full-width input", () => {
  for (const query of ["MCP", "mcp", "  ｍｃｐ　"]) {
    assert.deepEqual(filterPosts(posts, "all", query).map((post) => post.slug), ["mcp", "agent"]);
  }
  assert.deepEqual(filterPosts(posts, "all", "协议").map((post) => post.slug), ["mcp"]);
  assert.deepEqual(filterPosts(posts, "all", "windows").map((post) => post.slug), ["local"]);
  assert.deepEqual(filterPosts(posts, "all", "下载").map((post) => post.slug), ["local"]);
});

test("all keywords must match the same article, across fields and within the chosen category", () => {
  assert.deepEqual(filterPosts(posts, "all", "qwen windows").map((post) => post.slug), ["local"]);
  assert.deepEqual(filterPosts(posts, "tutorial", "MCP").map((post) => post.slug), ["agent"]);
  assert.deepEqual(filterPosts(posts, "explainer", "Windows"), []);
  assert.deepEqual(filterPosts(posts, "all", "mcp windows"), []);
});

test("clearing a query keeps source ordering and category filtering without changing source data", () => {
  const original = structuredClone(posts);
  assert.deepEqual(filterPosts(posts, "all", " \t　"), posts);
  assert.deepEqual(filterPosts(posts, "tutorial", "").map((post) => post.slug), ["local", "agent"]);
  assert.deepEqual(posts, original);
});
