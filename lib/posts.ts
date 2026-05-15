import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type PostFrontMatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
};

export type PostSummary = PostFrontMatter;

export type PostHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type Post = PostFrontMatter & {
  contentHtml: string;
  headings: PostHeading[];
};

type RawFrontMatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  slug?: unknown;
  tags?: unknown;
  draft?: unknown;
};

function toPostSummary(frontMatter: PostFrontMatter & { draft: boolean }): PostSummary {
  return {
    title: frontMatter.title,
    description: frontMatter.description,
    date: frontMatter.date,
    slug: frontMatter.slug,
    tags: frontMatter.tags,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function parseFrontMatter(data: RawFrontMatter, fallbackSlug: string): PostFrontMatter & { draft: boolean } {
  return {
    title: typeof data.title === "string" ? data.title : fallbackSlug,
    description: typeof data.description === "string" ? data.description : "",
    date: normalizeDate(data.date),
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
    tags: isStringArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
  };
}

function getPostFileNames() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));
}

function readPostFile(fileName: string) {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fallbackSlug = fileName.replace(/\.md$/, "");
  const frontMatter = parseFrontMatter(data, fallbackSlug);

  return {
    frontMatter,
    content,
  };
}

export function getAllPosts(): PostSummary[] {
  return getPostFileNames()
    .map((fileName) => readPostFile(fileName).frontMatter)
    .filter((post) => !post.draft)
    .map(toPostSummary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const processedContent = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return addHeadingIds(classifyCodeBlocks(processedContent.toString())).html;
}

function decodeBasicEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function classifyCodeBlock(language: string | undefined, encodedContent: string) {
  const normalizedLanguage = language?.toLowerCase() ?? "";
  const content = decodeBasicEntities(encodedContent).trim();
  const copyableLanguages = new Set([
    "bash",
    "sh",
    "shell",
    "zsh",
    "powershell",
    "ps1",
    "json",
    "ts",
    "tsx",
    "js",
    "jsx",
    "css",
    "md",
    "markdown",
    "yaml",
    "yml",
  ]);

  if (copyableLanguages.has(normalizedLanguage)) {
    return { className: "command-block", copyable: true };
  }

  const nonEmptyLines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const commandPattern = /^(sudo|npm|npx|pnpm|yarn|node|curl|wget|git|wsl|openclaw|ollama|systemctl|journalctl|ss|cp|mkdir|cat|nano|source|chmod|grep|find|ps|echo)\b/;
  const looksLikeOutput = /\b(command not found|VERSION|systemd|v\d+\.\d+|openclaw:|unknown model|localhost|127\.0\.0\.1)\b/i.test(
    content,
  );
  const looksExplanatory = /旧写法|新写法|provider|推荐|原则|组合|只是|优先|应该|理解成|路线|说明|场景|用户类型|建议|模型只是|先跑通|先用|先备份/.test(
    content,
  );
  const commandLineCount = nonEmptyLines.filter((line) => commandPattern.test(line)).length;
  const mostlyCommands =
    nonEmptyLines.length > 0 && commandLineCount > 0 && commandLineCount / nonEmptyLines.length >= 0.7;

  if (looksLikeOutput) {
    return { className: "output-block", copyable: false };
  }

  if (mostlyCommands && !looksExplanatory) {
    return { className: "command-block", copyable: true };
  }

  return { className: "text-block", copyable: false };
}

function classifyCodeBlocks(html: string) {
  return html.replace(
    /<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_match, language: string | undefined, content: string) => {
      const { className, copyable } = classifyCodeBlock(language, content);
      const codeClass = language ? ` class="language-${language}"` : "";
      const copyableAttribute = copyable ? ' data-copyable="true"' : "";
      const trimmedContent = content.replace(/^(?:[ \t]*\r?\n)+|(?:\r?\n[ \t]*)+$/g, "");

      return `<pre class="${className}"${copyableAttribute}><code${codeClass}>${trimmedContent}</code></pre>`;
    },
  );
}

function stripHtml(value: string) {
  return decodeBasicEntities(value.replace(/<[^>]+>/g, "")).trim();
}

function slugifyHeading(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function addHeadingIds(html: string) {
  const usedIds = new Map<string, number>();
  const headings: PostHeading[] = [];

  const contentHtml = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level: string, content: string) => {
    const text = stripHtml(content);
    const baseId = slugifyHeading(text);
    const count = usedIds.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    usedIds.set(baseId, count + 1);
    headings.push({
      level: Number(level) as 2 | 3,
      text,
      id,
    });

    return `<h${level} id="${id}">${content}</h${level}>`;
  });

  return {
    html: contentHtml,
    headings,
  };
}

function stripDuplicateOpeningH1(markdown: string, title: string) {
  const openingH1Pattern = /^(\uFEFF?\s*)#\s+(.+?)\s*#?\s*(?:\r?\n|$)/;
  const match = markdown.match(openingH1Pattern);

  if (!match) {
    return markdown;
  }

  const normalizeHeading = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\s*\/\s*/g, "/");
  const headingText = normalizeHeading(match[2]);

  if (headingText !== normalizeHeading(title)) {
    return markdown;
  }

  return markdown.slice(match[0].length).replace(/^\s*\r?\n/, "");
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fileName = getPostFileNames().find((name) => {
    const { frontMatter } = readPostFile(name);
    return frontMatter.slug === slug && !frontMatter.draft;
  });

  if (!fileName) {
    return null;
  }

  const { frontMatter, content } = readPostFile(fileName);
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(stripDuplicateOpeningH1(content, frontMatter.title));
  const { html: contentHtml, headings } = addHeadingIds(classifyCodeBlocks(processedContent.toString()));

  return {
    ...toPostSummary(frontMatter),
    contentHtml,
    headings,
  };
}
