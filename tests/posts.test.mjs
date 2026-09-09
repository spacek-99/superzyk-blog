import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const fixtureRoot = mkdtempSync(path.join(tmpdir(), "superzyk-posts-"));
const fixturePosts = path.join(fixtureRoot, "content", "posts");
mkdirSync(fixturePosts, { recursive: true });
const originalDirectory = process.cwd();
let posts;
try {
  process.chdir(fixtureRoot);
  posts = await import("../lib/posts.ts");
} finally {
  process.chdir(originalDirectory);
}
after(() => rmSync(fixtureRoot, { recursive: true, force: true }));

function article(slug, metadata) {
  writeFileSync(path.join(fixturePosts, `${slug}.md`), `---\n${metadata}\n---\n\n## 正文标题\n\n测试正文。\n`);
}

test("published content metadata and drafts remain independent", async (t) => {
  article("new-concept", 'title: 新概念\ndate: "2026-05-01"\ncategory: explainer');
  article("guide", 'title: 教程\ndate: "2026-05-02"\ncategory: tutorial\nupdatedAt: "2026-05-04"\nverifiedAt: "2026-05-03"\nenvironment: Windows + WSL2\nversion: Example 1.0\ncoverImage: /images/example.png');
  article("unfinished", "title: 未完成草稿\ndraft: true");

  await t.test("a new explainer is classified by metadata, without a hardcoded slug", () => {
    const published = posts.getAllPosts();
    assert.deepEqual(published.map((post) => post.slug), ["guide", "new-concept"]);
    assert.deepEqual(published.filter(posts.isAiExplainerPost).map((post) => post.slug), ["new-concept"]);
  });

  await t.test("publication, revision and verification dates retain distinct meanings", async () => {
    const guide = await posts.getPostBySlug("guide");
    assert.equal(guide.date, "2026-05-02");
    assert.equal(guide.updatedAt, "2026-05-04");
    assert.equal(guide.verifiedAt, "2026-05-03");
    assert.equal(guide.environment, "Windows + WSL2");
    assert.equal(guide.version, "Example 1.0");
    assert.equal(guide.coverImage, "/images/example.png");
    assert.equal(guide.headings[0].text, "正文标题");
    const concept = await posts.getPostBySlug("new-concept");
    assert.equal(concept.updatedAt, undefined);
    assert.equal(concept.verifiedAt, undefined);
    assert.equal(concept.coverImage, undefined);
  });

  await t.test("an unfinished draft cannot appear in listings or direct article lookup", async () => {
    assert.equal(await posts.getPostBySlug("unfinished"), null);
    assert.equal(await posts.getPostBySlug("missing"), null);
  });

  await t.test("unquoted YAML dates retain their exact values and draft flags stay boolean", async () => {
    article("unquoted", "date: 2024-02-29\nupdatedAt: 2026-05-04\nverifiedAt: 2026-05-03\ncategory: tutorial\ndraft: false");
    article("unquoted-draft", "date: 2026-02-31\ndraft: true");
    try {
      const post = await posts.getPostBySlug("unquoted");
      assert.equal(post.date, "2024-02-29");
      assert.equal(post.updatedAt, "2026-05-04");
      assert.equal(post.verifiedAt, "2026-05-03");
      assert.ok(posts.getAllPosts().some((item) => item.slug === "unquoted"));
      assert.ok(posts.getAllPosts().every((item) => item.slug !== "unquoted-draft"));
      assert.equal(await posts.getPostBySlug("unquoted-draft"), null);
    } finally {
      rmSync(path.join(fixturePosts, "unquoted.md"));
      rmSync(path.join(fixturePosts, "unquoted-draft.md"));
    }
  });

  await t.test("invalid unquoted publication, revision and verification dates are rejected", () => {
    const invalidPath = path.join(fixturePosts, "invalid.md");
    try {
      for (const field of ["date", "updatedAt", "verifiedAt"]) {
        for (const invalidDate of ["2026-02-31", "2026-02-29", "2026-13-01"]) {
          const metadata = field === "date"
            ? `date: ${invalidDate}`
            : `date: 2026-01-01\n${field}: ${invalidDate}`;
          article("invalid", metadata);
          assert.throws(
            () => posts.getAllPosts(),
            new RegExp(`${field} must be a valid YYYY-MM-DD date`),
            `${field}: ${invalidDate} must not normalize to another date`,
          );
        }
      }
    } finally {
      rmSync(invalidPath);
    }
  });

  await t.test("invalid dates and category typos fail before publishing misleading metadata", () => {
    const invalidPath = path.join(fixturePosts, "invalid.md");
    try {
      article("invalid", 'title: 日期错误\ndate: "2026-02-31"\ncategory: tutorial');
      assert.throws(() => posts.getAllPosts(), /valid YYYY-MM-DD/);
      article("invalid", 'date: "2026-05-02"\nupdatedAt: "2026-05-01"');
      assert.throws(() => posts.getAllPosts(), /must not precede/);
      article("invalid", 'date: "2026-05-02"\ncategory: exlpainer');
      assert.throws(() => posts.getAllPosts(), /category must be/);
    } finally {
      rmSync(invalidPath);
    }
  });
});
