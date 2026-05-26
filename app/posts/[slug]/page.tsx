import type { Metadata } from "next";
import ArticleImageLightbox from "@/components/ArticleImageLightbox";
import ArticleToc from "@/components/ArticleToc";
import BackToTop from "@/components/BackToTop";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
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
    };
  }

  return {
    title: `${post.title} | superzyk.com`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://superzyk.com/posts/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
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
    <main className="min-h-screen overflow-hidden bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,0.16),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.12),transparent_30rem)]" />
      <div className="relative z-10 mx-auto w-full max-w-[980px] px-5 py-9 sm:px-8 sm:py-12">
        <article className="w-full min-w-0">
          <header className="rounded-[1.4rem] border border-[var(--site-border)] bg-[var(--site-card)] p-5 shadow-2xl shadow-[var(--site-shadow)] backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/posts"
                className="inline-flex rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-3.5 py-2 text-sm font-medium text-[var(--site-link)] transition hover:border-[var(--site-link)]"
              >
                返回 Blog
              </Link>
              <ThemeToggle />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-2.5 text-sm text-[var(--site-faint)]">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--site-accent)]">
                Technical Guide
              </span>
              <span aria-hidden="true">/</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
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
          </header>

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
                返回 Blog
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--site-button)] px-4 py-2 text-sm font-semibold text-[var(--site-button-text)] transition hover:bg-[var(--site-button-hover)]"
              >
                返回首页
              </Link>
            </div>
            <p className="mt-5 text-sm text-[var(--site-faint)]">最后更新：{post.date}</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--site-muted)]">
              这篇教程会持续更新，我会把实操中遇到的报错、修正和优化补充到这里。
            </p>
          </footer>
        </article>
      </div>
      <ArticleToc headings={post.headings} />
    </main>
  );
}
