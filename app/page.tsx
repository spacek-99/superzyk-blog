"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

const navItems = [
  { label: "首页", href: "#" },
  { label: "主题", href: "#topics" },
  { label: "作品资料", href: "/posts" },
  { label: "实验室", href: "#lab" },
  { label: "关于", href: "#about" },
];

const labMetrics = [
  { label: "Writing", value: "12", hint: "drafts" },
  { label: "Lab Notes", value: "28", hint: "logs" },
  { label: "Uptime", value: "steady", hint: "public status" },
];

const labActivity = [
  "整理 AI 开发工作流",
  "重构博客视觉系统",
  "归档网络排障笔记",
];

const topicCards = [
  {
    title: "AI 实践笔记",
    eyebrow: "AI Workflow",
    description: "记录模型辅助开发、提示词实验、Agent 工作流和代码审查中的真实收益与边界。",
    accent: "from-violet-200 to-fuchsia-100",
  },
  {
    title: "网站搭建日志",
    eyebrow: "Web Build",
    description: "从 Next.js、样式系统、部署流程到性能优化，把站点演进过程写成可复用的经验。",
    accent: "from-sky-200 to-cyan-100",
  },
  {
    title: "Homelab 实验室",
    eyebrow: "Home Infrastructure",
    description: "关注家庭实验室的服务编排、备份策略、监控告警和长期维护，不暴露内部细节。",
    accent: "from-emerald-200 to-teal-100",
  },
  {
    title: "工具与模板",
    eyebrow: "Tools & Templates",
    description: "沉淀脚本、清单、模板和小工具，让重复工作变得更轻，折腾也更容易复盘。",
    accent: "from-amber-200 to-orange-100",
  },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const { isDark } = useTheme();

  const theme = {
    page: isDark
      ? "bg-[#070910] text-[#f6f7fb]"
      : "bg-[#fbf4e8] text-[#201a24]",
    ambient: isDark
      ? "bg-[radial-gradient(circle_at_18%_10%,rgba(125,92,255,0.22),transparent_28rem),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.16),transparent_30rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34rem)]"
      : "bg-[radial-gradient(circle_at_12%_8%,rgba(216,180,254,0.48),transparent_28rem),radial-gradient(circle_at_82%_14%,rgba(251,207,232,0.52),transparent_26rem),radial-gradient(circle_at_50%_78%,rgba(254,243,199,0.86),transparent_34rem)]",
    header: isDark
      ? "border-white/10 bg-[#070910]/78"
      : "border-[#eadfce] bg-[#fbf4e8]/78",
    brand: isDark ? "text-cyan-100" : "text-[#6d4fb6]",
    navText: isDark ? "text-zinc-400" : "text-[#746779]",
    navHover: isDark ? "hover:text-white" : "hover:text-[#201a24]",
    title: isDark ? "text-white" : "text-[#201a24]",
    body: isDark ? "text-zinc-300" : "text-[#665d68]",
    muted: isDark ? "text-zinc-500" : "text-[#8a7d8f]",
    accent: isDark ? "text-cyan-200" : "text-[#8b5cf6]",
    divider: isDark ? "border-white/10" : "border-[#eadfce]",
    glass: isDark
      ? "border-white/10 bg-white/[0.05] shadow-2xl shadow-cyan-950/25"
      : "border-white/70 bg-white/[0.62] shadow-2xl shadow-[#d8b4fe]/20",
    softCard: isDark
      ? "border-white/10 bg-white/[0.045] shadow-xl shadow-black/20"
      : "border-white/75 bg-white/[0.68] shadow-xl shadow-[#d9c4ae]/[0.22]",
    pill: isDark
      ? "border-white/[0.12] bg-white/[0.06] text-zinc-200"
      : "border-white/80 bg-white/[0.62] text-[#675072]",
    primaryButton: isDark
      ? "bg-cyan-200 text-slate-950 hover:bg-cyan-100"
      : "bg-[#201a24] text-white hover:bg-[#3a2d41]",
    secondaryButton: isDark
      ? "border-white/15 bg-white/[0.04] text-zinc-100 hover:border-cyan-200/60 hover:bg-white/[0.08]"
      : "border-[#e4d4c3] bg-white/55 text-[#433746] hover:border-[#c8a5ff] hover:bg-white/82",
    github: isDark
      ? "border-cyan-300/30 text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10"
      : "border-[#ddc9ff] text-[#6d4fb6] hover:border-[#b790ff] hover:bg-white/70",
  };

  return (
    <main className={cn("relative min-h-screen overflow-hidden transition-colors duration-500", theme.page)}>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0 transition-colors duration-500",
          theme.ambient,
        )}
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
        <header
          className={cn(
            "sticky top-0 z-20 -mx-5 border-b px-5 backdrop-blur-2xl transition-colors duration-500 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10",
            theme.header,
          )}
        >
          <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between">
            <a
              href="#"
              className={cn(
                "rounded-full px-4 py-2 font-mono text-sm font-semibold tracking-[0.18em] transition",
                theme.brand,
              )}
            >
              superzyk.com
            </a>
            <div className={cn("flex items-center gap-3 text-sm sm:gap-5", theme.navText)}>
              <div className="hidden items-center gap-5 sm:flex">
                {navItems.map((item) =>
                  item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn("rounded-full px-3 py-2 transition", theme.navHover)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className={cn("rounded-full px-3 py-2 transition", theme.navHover)}
                    >
                      {item.label}
                    </a>
                  ),
                )}
              </div>
              <ThemeToggle />
              <a
                href="https://github.com/spacek-99"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "hidden rounded-full border px-4 py-2 font-medium transition sm:inline-flex",
                  theme.github,
                )}
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.04fr] lg:gap-10 lg:py-16">
          <div>
            <div className={cn("mb-5 inline-flex rounded-full border px-4 py-2 text-sm", theme.pill)}>
              AI · Web · Homelab · Personal OS
            </div>
            <h1
              className={cn(
                "max-w-3xl text-4xl font-semibold leading-[1.08] tracking-normal sm:text-5xl lg:text-[3.6rem]",
                theme.title,
              )}
            >
              把技术折腾，整理成温柔可用的个人实验室。
            </h1>
            <p className={cn("mt-5 max-w-2xl text-base leading-7 sm:text-lg", theme.body)}>
              superzyk.com 记录 AI 实践、网站搭建、Homelab 和工具模板。少一点炫技，多一点能复盘、能迁移、能长期维护的经验。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#topics"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5",
                  isDark ? "shadow-cyan-950/35" : "shadow-[#cab3a1]/28",
                  theme.primaryButton,
                )}
              >
                浏览主题
              </a>
              <a
                href="#lab"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full border px-5 text-sm font-semibold transition hover:-translate-y-0.5",
                  theme.secondaryButton,
                )}
              >
                查看 Lab Dashboard
              </a>
            </div>
            <Link
              href="/posts/openclaw-2026-install-guide"
              className={cn(
                "group mt-6 block max-w-2xl rounded-[1.35rem] border p-4 transition duration-300 hover:-translate-y-1 sm:p-5",
                theme.softCard,
              )}
            >
              <p className={cn("font-mono text-xs uppercase tracking-[0.2em]", theme.accent)}>
                作品资料 / Blog
              </p>
              <h2 className={cn("mt-2.5 text-xl font-semibold leading-snug sm:text-2xl", theme.title)}>
                第一篇作品资料：OpenClaw 安装教程
              </h2>
              <p className={cn("mt-2.5 text-sm leading-6", theme.body)}>
                Windows + WSL2 环境下搭建 OpenClaw，覆盖国内镜像源、原生模型 provider、Dashboard 验证和维护流程。
              </p>
              <span
                className={cn(
                  "mt-4 inline-flex rounded-full border px-3.5 py-2 text-sm font-semibold transition group-hover:translate-x-1",
                  theme.pill,
                )}
              >
                阅读全文
              </span>
            </Link>
          </div>

          <section
            id="lab"
            aria-label="SuperZyk Lab Dashboard"
            className={cn(
              "rounded-[1.75rem] border p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 sm:p-5",
              theme.glass,
            )}
          >
            <div className={cn("rounded-[1.25rem] border p-5", theme.softCard)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={cn("text-sm font-medium", theme.muted)}>SuperZyk Lab</p>
                  <h2 className={cn("mt-1 text-[1.65rem] font-semibold", theme.title)}>Dashboard</h2>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    isDark
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                  )}
                >
                  Public Snapshot
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {labMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className={cn(
                      "rounded-[1.25rem] border p-3.5 transition hover:-translate-y-0.5",
                      isDark ? "border-white/10 bg-black/[0.16]" : "border-[#efe3d7] bg-[#fffaf2]/80",
                    )}
                  >
                    <p className={cn("text-xs font-medium", theme.muted)}>{metric.label}</p>
                    <p className={cn("mt-2 text-xl font-semibold", theme.title)}>{metric.value}</p>
                    <p className={cn("mt-1 text-xs", theme.muted)}>{metric.hint}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.78fr]">
                <div
                  className={cn(
                    "rounded-[1.25rem] border p-4",
                    isDark ? "border-white/10 bg-black/[0.16]" : "border-[#efe3d7] bg-[#fffaf2]/80",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-semibold", theme.title)}>Focus Flow</p>
                    <p className={cn("font-mono text-xs", theme.muted)}>this week</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      ["AI Notes", "78%"],
                      ["Web Build", "62%"],
                      ["Lab Review", "46%"],
                    ].map(([label, width]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span className={theme.body}>{label}</span>
                          <span className={theme.muted}>{width}</span>
                        </div>
                        <div
                          className={cn(
                            "h-2 overflow-hidden rounded-full",
                            isDark ? "bg-white/10" : "bg-[#eadfce]",
                          )}
                        >
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isDark
                                ? "bg-gradient-to-r from-cyan-200 to-violet-300"
                                : "bg-gradient-to-r from-[#a78bfa] to-[#f0abfc]",
                            )}
                            style={{ width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={cn(
                    "rounded-[1.25rem] border p-4",
                    isDark ? "border-white/10 bg-black/[0.16]" : "border-[#efe3d7] bg-[#fffaf2]/80",
                  )}
                >
                  <p className={cn("text-sm font-semibold", theme.title)}>Activity</p>
                  <div className="mt-4 space-y-3">
                    {labActivity.map((item) => (
                      <div key={item} className="flex gap-3">
                        <span
                          className={cn(
                            "mt-1 h-2 w-2 shrink-0 rounded-full",
                            isDark ? "bg-cyan-200" : "bg-[#a78bfa]",
                          )}
                        />
                        <p className={cn("text-sm leading-6", theme.body)}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section id="topics" className={cn("border-t py-16 sm:py-20", theme.divider)}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className={cn("font-mono text-xs uppercase tracking-[0.24em]", theme.accent)}>
                Topics
              </p>
              <h2 className={cn("mt-3 text-3xl font-semibold sm:text-4xl", theme.title)}>
                四个长期主题
              </h2>
            </div>
            <p className={cn("max-w-xl text-sm leading-6", theme.body)}>
              每个入口都偏向可执行的记录：配置怎么想、问题怎么拆、工具怎么留下来。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {topicCards.map((card) => (
              <article
                key={card.title}
                className={cn(
                  "group rounded-[1.75rem] border p-5 transition duration-300 hover:-translate-y-1",
                  theme.softCard,
                )}
              >
                <div className={cn("mb-5 h-2 w-20 rounded-full bg-gradient-to-r", card.accent)} />
                <p className={cn("font-mono text-xs uppercase tracking-[0.2em]", theme.accent)}>
                  {card.eyebrow}
                </p>
                <h3 className={cn("mt-4 text-2xl font-semibold", theme.title)}>{card.title}</h3>
                <p className={cn("mt-4 leading-7", theme.body)}>{card.description}</p>
                <div
                  className={cn(
                    "mt-6 inline-flex rounded-full border px-3 py-1 text-xs font-medium transition group-hover:translate-x-1",
                    theme.pill,
                  )}
                >
                  准备展开
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className={cn("border-t py-14", theme.divider)}>
          <div
            className={cn(
              "rounded-[2rem] border p-6 transition-colors duration-500 sm:p-8",
              theme.glass,
            )}
          >
            <p className={cn("font-mono text-xs uppercase tracking-[0.24em]", theme.accent)}>
              About
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className={cn("text-3xl font-semibold sm:text-4xl", theme.title)}>
                写给未来自己的技术备忘录。
              </h2>
              <p className={cn("text-lg leading-8", theme.body)}>
                这里不会记录敏感的内部地址、端口或私有路径，只保留可公开分享的思路、抽象方案和踩坑复盘。目标是让每一次折腾，都能变成下一次更轻松的起点。
              </p>
            </div>
          </div>
        </section>

        <footer className={cn("border-t py-8 text-sm", theme.divider, theme.muted)}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>© 2026 superzyk.com. Built for long-term tinkering.</p>
            <a
              href="https://github.com/spacek-99"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "transition",
                isDark ? "text-zinc-400 hover:text-cyan-100" : "text-[#6d4fb6] hover:text-[#201a24]",
              )}
            >
              GitHub / spacek-99
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
