import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PostArchive from "@/components/PostArchive";
import { getAllPosts } from "@/lib/posts";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./archive.css";

const postsTitle = `全部文章 | ${SITE_NAME}`;
const postsDescription = "superzyk 的 AI 科普、Agent 工具安装与本地部署实践。";

export const metadata: Metadata = {
  title: postsTitle,
  description: postsDescription,
  alternates: { canonical: "/posts" },
  openGraph: {
    title: postsTitle,
    description: postsDescription,
    url: `${SITE_URL}/posts`,
    siteName: SITE_NAME,
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: DEFAULT_OG_IMAGE_WIDTH,
        height: DEFAULT_OG_IMAGE_HEIGHT,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: postsTitle,
    description: postsDescription,
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <>
      <SiteHeader active="posts" />
      <main id="main-content" tabIndex={-1} className="archive-page">
        <header className="archive-intro">
          <h1>文章</h1>
        </header>
        <PostArchive posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}
