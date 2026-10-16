import assert from "node:assert/strict";
import { test } from "node:test";
import { createRss } from "../lib/feed.ts";

test("RSS preserves original publication dates and escapes XML text", () => {
  const feed = createRss([{ slug: "guide", title: 'AI <tools> & "notes"', description: "Read <one> & two", date: "2026-05-01", updatedAt: "2026-06-02", category: "tutorial", tags: ["AI & tools"] }], { url: "https://superzyk.com", name: "superzyk", description: "实践" });
  assert.ok(feed.includes("AI &lt;tools&gt; &amp; &quot;notes&quot;"));
  assert.ok(feed.includes("Read &lt;one&gt; &amp; two"));
  assert.ok(feed.includes("Thu, 30 Apr 2026 16:00:00 GMT"));
  assert.ok(feed.includes('<guid isPermaLink="true">https://superzyk.com/posts/guide</guid>'));
  assert.ok(feed.includes('<category>AI &amp; tools</category>'));
  assert.ok(!feed.includes("02 Jun"));
});
