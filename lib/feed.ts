import type { PostSummary } from "./posts";

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
}

export function createRss(posts: PostSummary[], site: { url: string; name: string; description: string }): string {
  const items = posts.map((post) => {
    const url = `${site.url}/posts/${encodeURIComponent(post.slug)}`;
    return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(post.description)}</description><pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate>${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}</item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(site.name)}</title><link>${escapeXml(site.url)}</link><description>${escapeXml(site.description)}</description><language>zh-CN</language><atom:link href="${escapeXml(site.url)}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
