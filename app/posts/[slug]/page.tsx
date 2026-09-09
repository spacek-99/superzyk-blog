import type { Metadata } from "next";
import ArticleImageLightbox from "@/components/ArticleImageLightbox";
import ArticleToc from "@/components/ArticleToc";
import BackToTop from "@/components/BackToTop";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import CodeCopyButtons from "./CodeCopyButtons";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到 | superzyk.com",
      alternates: { canonical: null },
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/posts/${post.slug}`;
  const image = post.coverImage
    ? { url: post.coverImage, alt: post.title }
    : { url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT };

  return {
    title: `${post.title} | superzyk.com`,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "zh_CN",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,0.16),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.12),transparent_30rem)]" />
      <div className="relative z-10 mx-auto w-full max-w-[980px] px-5 py-9 sm:px-8 sm:py-12">
        <article className="w-full min-w-0">
          <header className="rounded-[1.4rem] border border-[var(--site-border)] bg-[var(--site-card)] p-5 shadow-2xl shadow-[var(--site-shadow)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/posts"
                className="inline-flex rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-3.5 py-2 text-sm font-medium text-[var(--site-link)] transition hover:border-[var(--site-link)]"
              >
                返回文章列表
              </Link>
              <ThemeToggle />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-2.5 text-sm text-[var(--site-faint)]">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--site-accent)]">
                {post.category === "explainer" ? "AI Explainer" : "Technical Guide"}
              </span>
              <span aria-hidden="true">/</span>
              <span>发布于 <time dateTime={post.date}>{formatDate(post.date)}</time></span>
              {post.updatedAt ? (
                <span>更新于 <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span>
              ) : null}
            </div>
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal sm:text-[2.7rem]">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--site-muted)] sm:text-lg">
              {post.description}
            </p>
            {post.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--site-border)] bg-[var(--site-card-strong)] px-3 py-1 text-xs font-medium text-[var(--site-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {post.environment || post.version || post.verifiedAt ? (
              <dl className="mt-6 grid gap-3 border-t border-[var(--site-border)] pt-5 text-sm leading-6 text-[var(--site-muted)]">
                {post.environment ? (
                  <div className="grid gap-0.5 sm:grid-cols-[5rem_1fr] sm:gap-3">
                    <dt className="font-medium text-[var(--site-ink)]">适用环境</dt>
                    <dd>{post.environment}</dd>
                  </div>
                ) : null}
                {post.version ? (
                  <div className="grid gap-0.5 sm:grid-cols-[5rem_1fr] sm:gap-3">
                    <dt className="font-medium text-[var(--site-ink)]">文中版本</dt>
                    <dd>{post.version}</dd>
                  </div>
                ) : null}
                {post.verifiedAt ? (
                  <div className="grid gap-0.5 sm:grid-cols-[5rem_1fr] sm:gap-3">
                    <dt className="font-medium text-[var(--site-ink)]">最近实测</dt>
                    <dd><time dateTime={post.verifiedAt}>{formatDate(post.verifiedAt)}</time></dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </header>

          <ArticleToc key={post.slug} headings={post.headings} />

          <div
            className="article-content mt-8"
            data-article-content
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <ArticleImageLightbox />
          <CodeCopyButtons />

          <footer className="mt-12 border-t border-[var(--site-border)] pt-8 text-center">
            <BackToTop />
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/posts"
                className="inline-flex rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-4 py-2 text-sm font-semibold text-[var(--site-link)] transition hover:border-[var(--site-link)] hover:bg-[var(--site-card-strong)]"
              >
                返回文章列表
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--site-button)] px-4 py-2 text-sm font-semibold text-[var(--site-button-text)] transition hover:bg-[var(--site-button-hover)]"
              >
                返回首页
              </Link>
            </div>
            <p className="mt-5 text-sm text-[var(--site-faint)]">
              {post.updatedAt ? "内容更新于：" : "发布于："}
              <time dateTime={post.updatedAt ?? post.date}>{formatDate(post.updatedAt ?? post.date)}</time>
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--site-muted)]">
              {post.category === "tutorial"
                ? "教程修订后会标注内容更新日期，完成实测后会注明实测时间。"
                : "这篇文章的修订会单独标注内容更新日期。"}
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
