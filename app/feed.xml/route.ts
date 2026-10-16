import { getAllPosts } from "@/lib/posts";
import { createRss } from "@/lib/feed";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(createRss(getAllPosts(), { url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION }), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
