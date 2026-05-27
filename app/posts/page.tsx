import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { getAllPosts, isAiExplainerPost, type PostSummary } from "@/lib/posts";

export const metadata: Metadata = {
  title: "作品资料 / Blog | superzyk.com",
  description: "superzyk.com 的 AI 工程、本地部署、Agent 工具和技术教程归档。",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group flex min-h-[15rem] flex-col rounded-[1.1rem] border border-[var(--site-border)] bg-[var(--site-card)] p-5 shadow-lg shadow-[var(--site-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[var(--site-link)] hover:bg-[var(--site-card-strong)]">
      <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--site-faint)]">
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

      <h3 className="mt-3 text-xl font-semibold leading-snug text-[var(--site-ink)]">
        <Link href={`/posts/${post.slug}`} className="transition group-hover:text-[var(--site-link)]">
          {post.title}
        </Link>
      </h3>

      <p className="mt-2.5 flex-1 text-sm leading-6 text-[var(--site-muted)]">
        {post.description}
      </p>

      <Link
        href={`/posts/${post.slug}`}
        className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-full bg-[var(--site-button)] px-4 text-sm font-semibold text-[var(--site-button-text)] transition hover:bg-[var(--site-button-hover)]"
      >
        阅读全文
      </Link>
    </article>
  );
}

export default function PostsPage() {
  const posts = getAllPosts();
  const explainerPosts = posts.filter(isAiExplainerPost);
  const tutorialPosts = posts.filter((post) => !isAiExplainerPost(post));
  const sections = [
    {
      title: "科普",
      label: "Explainer",
      description: "先把关键概念讲清楚，再进入具体工具和实践。",
      posts: explainerPosts,
    },
    {
      title: "教程",
      label: "Tutorials",
      description: "可复现的安装、部署和本地 AI 实践记录。",
      posts: tutorialPosts,
    },
  ].filter((section) => section.posts.length > 0);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_10%_0%,rgba(139,92,246,0.18),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(34,211,238,0.13),transparent_26rem)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
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
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--site-muted)]">
            收集可长期维护的 AI 工程、本地部署、Agent 工具和开发教程。当前文章来自本地 Markdown 文件。
          </p>
        </header>

        <div className="mt-8 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[var(--site-border)] pb-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--site-accent)]">
                    {section.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--site-ink)]">
                    {section.title}
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[var(--site-muted)]">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
