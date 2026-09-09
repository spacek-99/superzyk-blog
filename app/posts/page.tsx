import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { getAllPosts, isAiExplainerPost } from "@/lib/posts";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

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
  const explainerPosts = posts.filter(isAiExplainerPost);
  const tutorialPosts = posts.filter((post) => !isAiExplainerPost(post));
  const sections = [
    {
      id: "explainers",
      title: "科普",
      label: "Explainer",
      description: "先把关键概念讲清楚，再进入具体工具和实践。",
      posts: explainerPosts,
    },
    {
      id: "tutorials",
      title: "教程",
      label: "Tutorials",
      description: "可复现的安装、部署和本地 AI 实践记录。",
      posts: tutorialPosts,
    },
  ].filter((section) => section.posts.length > 0);

  return (
    <main className="min-h-screen overflow-x-clip bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_10%_0%,rgba(139,92,246,0.18),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(34,211,238,0.13),transparent_26rem)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <header className="border-b border-[var(--site-border)] pb-7">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-3.5 py-2 text-sm font-medium text-[var(--site-link)] transition hover:border-[var(--site-link)]"
            >
              返回首页
            </Link>
            <ThemeToggle />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.24em] text-[var(--site-accent-ink)]">
            Blog
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-[2.65rem]">
            全部文章
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--site-muted)]">
            从 AI 概念到安装部署，找到适合你的下一篇。共 {posts.length} 篇文章，分类内按首次发布日期由新到旧排列。
          </p>
          <nav aria-label="文章分类" className="mt-6 flex flex-wrap gap-3">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="category-jump">
                {section.title} <span>{section.posts.length} 篇</span><span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </header>

        <div className="mt-8 space-y-10">
          {sections.map((section) => (
            <section key={section.title} id={section.id} className="scroll-mt-8" tabIndex={-1}>
              <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[var(--site-border)] pb-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--site-accent-ink)]">
                    {section.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--site-ink)]">
                    {section.title} <span className="section-count">{section.posts.length} 篇</span>
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[var(--site-muted)]">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {section.posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
