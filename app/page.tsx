import HeroLiquidBackground from "@/components/HeroLiquidBackground";
import ThemeToggle from "@/components/ThemeToggle";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

const navItems = [
  { label: "首页", href: "/" },
  { label: "教程", href: "#articles" },
  { label: "博客", href: "/posts" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--site-bg)] text-[var(--site-ink)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_8%,rgba(216,180,254,0.34),transparent_28rem),radial-gradient(circle_at_82%_14%,rgba(165,243,252,0.28),transparent_26rem),radial-gradient(circle_at_50%_76%,rgba(254,243,199,0.42),transparent_34rem)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_18%_10%,rgba(125,92,255,0.2),transparent_28rem),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.14),transparent_30rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34rem)]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-20 border-b border-[var(--site-border)] bg-[var(--site-bg)]/80 backdrop-blur-2xl transition-colors duration-300">
          <nav className="mx-auto flex h-[4.5rem] w-full max-w-[1400px] items-center justify-between px-6 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="rounded-full px-4 py-2 font-mono text-sm font-semibold tracking-[0.18em] text-[var(--site-link)] transition hover:bg-[var(--site-card)]"
            >
              superzyk.com
            </Link>

            <div className="flex items-center gap-3 text-sm text-[var(--site-faint)] sm:gap-5">
              <div className="hidden items-center gap-5 sm:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-full px-3 py-2 transition hover:bg-[var(--site-card)] hover:text-[var(--site-ink)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
              <a
                href="https://github.com/spacek-99"
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full border border-[var(--site-border)] px-4 py-2 font-medium text-[var(--site-link)] transition hover:border-[var(--site-link)] hover:bg-[var(--site-card)] sm:inline-flex"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <section className="relative mx-auto grid w-full max-w-[1400px] items-center gap-7 overflow-hidden px-6 py-10 sm:px-8 sm:py-14 lg:min-h-[35rem] lg:grid-cols-[minmax(0,1fr)_minmax(26rem,32rem)] lg:gap-10 lg:px-12 lg:py-16">
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

          <aside className="relative z-10 h-[21rem] overflow-hidden rounded-[2rem] border border-black/[0.06] bg-[#100b1f] p-6 text-white shadow-[0_24px_80px_rgba(120,80,40,0.10)] backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:shadow-[#4c1d95]/25 sm:h-[23rem] lg:w-full">
            <div className="absolute inset-0 opacity-55 dark:opacity-90">
              <HeroLiquidBackground />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/35" />

            <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/55">
                SUPERZYK LAB
              </p>
              <h2 className="mt-5 max-w-sm bg-gradient-to-br from-white via-cyan-100 to-violet-200 bg-clip-text text-4xl font-black leading-[0.95] tracking-normal text-transparent drop-shadow-[0_10px_34px_rgba(103,232,249,0.18)] sm:text-5xl">
                AI 实践实验室
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/72">
                把工具、教程和可复现流程沉淀下来
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
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

        <section id="articles" className="mx-auto w-full max-w-[1400px] border-t border-[var(--site-border)] px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--site-accent)]">
                Tutorials
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--site-ink)] sm:text-4xl">
                教程库
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--site-muted)]">
              所有教程都会持续同步在这里，方便直接查找和复现。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={[
                  "group flex min-h-[21rem] rounded-[1.25rem] border border-[var(--site-border)] bg-[var(--site-card)] p-5 shadow-[0_24px_80px_var(--site-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--site-link)] hover:bg-[var(--site-card-strong)] sm:p-6",
                  index === 0 ? "lg:shadow-[0_28px_90px_var(--site-shadow)]" : "",
                ].join(" ")}
              >
                <article className="flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--site-faint)] sm:text-sm">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {index === 0 ? (
                      <span className="rounded-full border border-[var(--site-link)] bg-[var(--site-card-strong)] px-2.5 py-1 text-xs font-semibold text-[var(--site-link)]">
                        最新
                      </span>
                    ) : null}
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--site-border)] bg-[var(--site-card-strong)] px-2.5 py-1 text-xs text-[var(--site-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-[var(--site-ink)] transition group-hover:text-[var(--site-link)] sm:text-[1.45rem]">
                    {post.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-[var(--site-muted)] sm:text-base">
                    {post.description}
                  </p>
                  <span className="mt-5 inline-flex w-fit rounded-full bg-[var(--site-button)] px-4 py-2 text-sm font-semibold text-[var(--site-button-text)] transition group-hover:bg-[var(--site-button-hover)]">
                    阅读全文
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mx-auto w-full max-w-[1400px] border-t border-[var(--site-border)] px-6 py-8 text-sm text-[var(--site-faint)] sm:px-8 lg:px-12">
          <div className="max-w-2xl leading-6 text-[var(--site-muted)]">
            <p className="font-semibold text-[var(--site-faint)]">联系</p>
            <p className="mt-1">
              如果你想继续讨论，欢迎写信给我。我会认真读，也通常会回 :)
            </p>
            <p className="mt-1 break-all font-mono">spacek995@qq.com</p>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>© 2026 superzyk.com. Built for reproducible AI workflows.</p>
            <a
              href="https://github.com/spacek-99"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--site-link)] transition hover:text-[var(--site-ink)]"
            >
              GitHub / spacek-99
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
