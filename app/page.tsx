import type { Metadata } from "next";
import HeroLiquidBackground from "@/components/HeroLiquidBackground";
import ThemeToggle from "@/components/ThemeToggle";
import PostCard from "@/components/PostCard";
import { getAllPosts, isAiExplainerPost } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const navItems = [
  { label: "科普", href: "#explainers" },
  { label: "教程", href: "#articles" },
  { label: "全部文章", href: "/posts" },
];

export default function Home() {
  const posts = getAllPosts();
  const explainerPosts = posts.filter(isAiExplainerPost);
  const tutorialPosts = posts.filter((post) => !isAiExplainerPost(post));

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_8%,rgba(216,180,254,0.34),transparent_28rem),radial-gradient(circle_at_82%_14%,rgba(165,243,252,0.28),transparent_26rem),radial-gradient(circle_at_50%_76%,rgba(254,243,199,0.42),transparent_34rem)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_18%_10%,rgba(125,92,255,0.2),transparent_28rem),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.14),transparent_30rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34rem)]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--site-border)] bg-[var(--site-bg)]/80 backdrop-blur-2xl transition-colors duration-300">
          <a href="#main-content" className="skip-link">跳到主要内容</a>
          <div className="site-header-inner">
            <Link href="/" aria-label="superzyk.com 首页" className="site-brand">superzyk.com</Link>
            <nav aria-label="主导航" className="site-primary-nav">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href}>{item.label}</Link>
              ))}
            </nav>
            <div className="site-header-actions">
              <ThemeToggle />
              <a href="https://github.com/spacek-99" target="_blank" rel="noreferrer" className="hidden min-h-11 items-center rounded-full border border-[var(--site-border)] px-4 py-2 text-sm text-[var(--site-link)] transition hover:border-[var(--site-link)] md:inline-flex">GitHub</a>
            </div>
          </div>
        </header>

        <section id="main-content" tabIndex={-1} className="relative mx-auto grid w-full max-w-[1400px] items-center gap-7 overflow-hidden px-6 py-10 sm:px-8 sm:py-14 lg:min-h-[35rem] lg:grid-cols-[minmax(0,1fr)_minmax(26rem,32rem)] lg:gap-10 lg:px-12 lg:py-16">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-4 py-2 text-sm text-[var(--site-muted)] shadow-sm shadow-[var(--site-shadow)]">
              AI Tools · Video · Design · Code · App
            </div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-normal text-[var(--site-ink)] sm:text-5xl lg:text-[3.5rem]">
              AI 实践与创作笔记
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--site-muted)] sm:text-lg">
              记录 AI 工具、视频图片生成、设计、编程、App 开发和网站搭建过程。步骤清楚，方便复现。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#articles"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--site-button)] px-5 text-sm font-semibold text-[var(--site-button-text)] shadow-lg shadow-[var(--site-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--site-button-hover)]"
              >
                进入教程库
              </a>
              <Link
                href="/posts"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-card)] px-5 text-sm font-semibold text-[var(--site-link)] transition hover:-translate-y-0.5 hover:border-[var(--site-link)] hover:bg-[var(--site-card-strong)]"
              >
                查看全部文章
              </Link>
            </div>
          </div>

          <aside className="relative z-10 min-h-[14rem] overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#100b1f] p-6 text-white shadow-[0_24px_80px_rgba(120,80,40,0.10)] backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:shadow-[#4c1d95]/25 sm:h-[23rem] lg:w-full">
            <div className="absolute inset-0 opacity-55 dark:opacity-90">
              <HeroLiquidBackground />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/35" />

            <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
                SUPERZYK LAB
              </p>
              <h2 className="mt-3 max-w-sm bg-gradient-to-br from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-black leading-[1.15] tracking-normal text-transparent drop-shadow-[0_10px_34px_rgba(103,232,249,0.18)] sm:text-5xl sm:leading-[0.95]">
                AI 实践实验室
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
                把工具、教程和可复现流程沉淀下来
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["AI Tools", "Agent", "Local AI"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/72 backdrop-blur"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section id="explainers" className="home-article-section mx-auto w-full max-w-[1400px] border-t border-[var(--site-border)] px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--site-accent-ink)]">
                AI EXPLAINER
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--site-ink)] sm:text-4xl">
                AI 科普 <span className="section-count">{explainerPosts.length} 篇</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--site-muted)]">
              把 AI Agent 背后的关键概念讲明白
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {explainerPosts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>

        <section id="articles" className="home-article-section mx-auto w-full max-w-[1400px] border-t border-[var(--site-border)] px-6 py-10 sm:px-8 sm:py-14 lg:px-12">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--site-accent-ink)]">
                Tutorials
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--site-ink)] sm:text-4xl">
                教程库 <span className="section-count">{tutorialPosts.length} 篇</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--site-muted)]">
              安装、部署与本地 AI 实践，按文中环境和版本参考。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tutorialPosts.map((post, index) => <PostCard key={post.slug} post={post} latest={index === 0} />)}
          </div>
        </section>

        <footer className="mx-auto w-full max-w-[1400px] border-t border-[var(--site-border)] px-6 py-8 text-sm text-[var(--site-faint)] sm:px-8 lg:px-12">
          <div className="max-w-2xl leading-6 text-[var(--site-muted)]">
            <p className="font-semibold text-[var(--site-faint)]">联系</p>
            <p className="mt-1">
              如果你想继续讨论，欢迎写信给我。我会认真读，也通常会回 :)
            </p>
            <a href="mailto:spacek995@qq.com" className="mt-2 inline-flex min-h-11 items-center break-all font-mono text-[var(--site-link)] underline decoration-[var(--site-border)] hover:decoration-current">spacek995@qq.com</a>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>© 2026 superzyk.com. Built for reproducible AI workflows.</p>
            <a
              href="https://github.com/spacek-99"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center self-start text-[var(--site-link)] transition hover:text-[var(--site-ink)]"
            >
              GitHub / spacek-99
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
