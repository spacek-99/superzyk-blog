import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/posts` },
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.updatedAt ?? post.date,
    })),
  ];
}
