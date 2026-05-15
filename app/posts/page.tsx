import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "作品资料 / Blog | superzyk.com",
  description: "superzyk.com 的作品资料与技术文章归档。",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="mx-auto w-full max-w-5xl px-5 py-9 sm:px-8 sm:py-12">
        <header className="border-b border-[var(--site-border)] pb-7">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-3.5 py-2 text-sm font-medium text-[var(--site-link)] transition hover:border-[var(--site-link)]"
            >
              返回首页
            </Link>
            <ThemeToggle />
          </div>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.24em] text-[var(--site-accent)]">
            Blog
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-[2.65rem]">
            作品资料 / Blog
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--site-muted)]">
            收集可长期维护的教程、复盘和技术资料。当前文章来自本地 Markdown 文件。
          </p>
        </header>

        <section className="mt-7 grid gap-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-[1.35rem] border border-[var(--site-border)] bg-[var(--site-card)] p-5 shadow-xl shadow-[var(--site-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--site-link)] sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--site-faint)] sm:text-sm">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--site-border)] bg-[var(--site-card-strong)] px-2.5 py-1 text-xs text-[var(--site-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-[1.8rem]">
                <Link href={`/posts/${post.slug}`} className="transition hover:text-[var(--site-link)]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2.5 max-w-3xl text-sm leading-6 text-[var(--site-muted)] sm:text-base">
                {post.description}
              </p>
              <Link
                href={`/posts/${post.slug}`}
                className="mt-4 inline-flex rounded-full bg-[var(--site-button)] px-4 py-2 text-sm font-semibold text-[var(--site-button-text)] transition hover:bg-[var(--site-button-hover)]"
              >
                阅读全文
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
