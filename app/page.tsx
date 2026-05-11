"use client";

import { useState } from "react";

const posts = [
  {
    category: "AI Engineering",
    title: "把 AI 工具放进日常开发工作流",
    summary:
      "记录从 prompt、代码审查到自动化脚本的实践，把模型当成可靠的工程伙伴，而不是一次性的玩具。",
    date: "2026.05",
    readTime: "6 min",
  },
  {
    category: "Homelab",
    title: "一台小主机的长期主义",
    summary:
      "从存储、备份、监控到内网服务，把家庭实验室做成可维护、可恢复、可迁移的个人基础设施。",
    date: "2026.04",
    readTime: "8 min",
  },
  {
    category: "Network Notes",
    title: "网络折腾笔记：从能通到可观测",
    summary:
      "把代理、DNS、隧道和防火墙策略写清楚，少一点玄学，多一点可复现的排障路径。",
    date: "2026.03",
    readTime: "5 min",
  },
];

const projects = [
  {
    name: "Homelab Console",
    description: "个人服务器、容器、备份和监控的实践入口。",
    tags: ["Linux", "Docker", "Observability"],
  },
  {
    name: "AI Playground",
    description: "试验模型、Agent、RAG 和开发自动化的轻量实验场。",
    tags: ["LLM", "Agent", "TypeScript"],
  },
  {
    name: "Network Fieldnotes",
    description: "网络配置、路由策略、DNS 和远程访问方案的备忘录。",
    tags: ["DNS", "Proxy", "Zero Trust"],
  },
];

const navItems = [
  { label: "首页", href: "#" },
  { label: "文章", href: "#writing" },
  { label: "项目", href: "#projects" },
  { label: "关于", href: "#about" },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  const theme = {
    page: isDark ? "bg-[#05070a] text-[#f4f7fb]" : "bg-[#f6f8fb] text-[#101827]",
    ambient: isDark
      ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32rem),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_28rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18rem)]"
      : "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32rem),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.14),transparent_28rem),linear-gradient(180deg,rgba(255,255,255,0.95),transparent_18rem)]",
    header: isDark
      ? "border-white/10 bg-[#05070a]/80"
      : "border-slate-900/10 bg-[#f6f8fb]/85",
    brand: isDark ? "text-cyan-200" : "text-sky-700",
    navText: isDark ? "text-zinc-400" : "text-slate-600",
    navHover: isDark ? "hover:text-zinc-50" : "hover:text-slate-950",
    title: isDark ? "text-zinc-50" : "text-slate-950",
    body: isDark ? "text-zinc-300" : "text-slate-700",
    soft: isDark ? "text-zinc-400" : "text-slate-600",
    muted: isDark ? "text-zinc-500" : "text-slate-500",
    accent: isDark ? "text-cyan-200" : "text-sky-700",
    divider: isDark ? "border-white/10" : "border-slate-900/10",
    panel: isDark
      ? "border-white/10 bg-white/[0.03] shadow-cyan-950/30"
      : "border-slate-900/10 bg-white/75 shadow-slate-300/50",
    panelHover: isDark
      ? "border-white/10 bg-white/[0.025] hover:border-cyan-200/40 hover:bg-white/[0.05]"
      : "border-slate-900/10 bg-white/80 hover:border-sky-400/50 hover:bg-white",
    primaryButton: isDark
      ? "bg-cyan-200 text-zinc-950 hover:bg-cyan-100"
      : "bg-slate-950 text-white hover:bg-slate-800",
    outlineButton: isDark
      ? "border-white/15 text-zinc-100 hover:border-cyan-200/70 hover:bg-white/5"
      : "border-slate-900/15 text-slate-800 hover:border-sky-500/60 hover:bg-sky-100/60",
    tag: isDark ? "border-white/10 text-zinc-400" : "border-slate-900/10 text-slate-600",
  };

  return (
    <main className={cn("relative min-h-screen overflow-hidden transition-colors duration-500", theme.page)}>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-0 transition-colors duration-500",
          theme.ambient,
        )}
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 sm:px-8 lg:px-10">
        <header
          className={cn(
            "sticky top-0 z-20 -mx-5 border-b px-5 backdrop-blur-xl transition-colors duration-500 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10",
            theme.header,
          )}
        >
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between">
            <a
              href="#"
              className={cn("font-mono text-sm font-semibold tracking-[0.22em]", theme.brand)}
            >
              superzyk.com
            </a>
            <div className={cn("flex items-center gap-4 text-sm sm:gap-7", theme.navText)}>
              <div className="hidden items-center gap-7 sm:flex">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} className={cn("transition", theme.navHover)}>
                    {item.label}
                  </a>
                ))}
              </div>
              <button
                type="button"
                aria-label={isDark ? "切换到白天模式" : "切换到黑夜模式"}
                aria-pressed={!isDark}
                onClick={() => setIsDark((current) => !current)}
                className={cn(
                  "relative h-8 w-16 rounded-full border p-1 transition-colors",
                  isDark ? "border-cyan-300/30 bg-slate-950" : "border-sky-300/70 bg-sky-100",
                )}
              >
                <span
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 text-xs transition-opacity",
                    isDark ? "opacity-100" : "opacity-35",
                  )}
                >
                  夜
                </span>
                <span
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 text-xs transition-opacity",
                    isDark ? "opacity-35" : "opacity-100",
                  )}
                >
                  日
                </span>
                <span
                  className={cn(
                    "relative block h-6 w-6 rounded-full shadow-lg transition-transform duration-300",
                    isDark ? "translate-x-0 bg-cyan-200" : "translate-x-8 bg-white",
                  )}
                />
              </button>
              <a
                href="https://github.com/spacek-99"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "hidden rounded-full border px-4 py-2 font-medium transition sm:inline-flex",
                  isDark
                    ? "border-cyan-300/30 text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10"
                    : "border-sky-300/70 text-sky-800 hover:border-sky-500 hover:bg-sky-100",
                )}
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p
              className={cn(
                "mb-5 font-mono text-xs font-semibold uppercase tracking-[0.3em]",
                theme.accent,
              )}
            >
              AI · Dev · Homelab · Network
            </p>
            <h1
              className={cn(
                "max-w-4xl text-5xl font-semibold leading-tight tracking-normal sm:text-6xl lg:text-7xl",
                theme.title,
              )}
            >
              在个人基础设施里，长期折腾一点有用的东西。
            </h1>
            <p className={cn("mt-7 max-w-2xl text-lg leading-8", theme.body)}>
              这里是 superzyk 的技术博客，记录 AI 工程、开发工具、家庭实验室、网络方案和一些从踩坑里长出来的判断。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#writing"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-semibold transition",
                  theme.primaryButton,
                )}
              >
                阅读最新文章
              </a>
              <a
                href="#projects"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-md border px-5 text-sm font-semibold transition",
                  theme.outlineButton,
                )}
              >
                查看项目入口
              </a>
            </div>
          </div>

          <aside
            className={cn(
              "border p-6 shadow-2xl backdrop-blur transition-colors duration-500",
              theme.panel,
            )}
          >
            <div className={cn("flex items-center justify-between border-b pb-5", theme.divider)}>
              <span className={cn("font-mono text-xs uppercase tracking-[0.25em]", theme.muted)}>
                Status
              </span>
              <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-500">
                online
              </span>
            </div>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className={cn("text-sm", theme.muted)}>当前关注</dt>
                <dd className={cn("mt-1 text-xl font-semibold", theme.title)}>
                  AI coding workflow
                </dd>
              </div>
              <div>
                <dt className={cn("text-sm", theme.muted)}>基础设施</dt>
                <dd className={cn("mt-1 text-xl font-semibold", theme.title)}>
                  Homelab / NAS / Observability
                </dd>
              </div>
              <div>
                <dt className={cn("text-sm", theme.muted)}>写作目标</dt>
                <dd className={cn("mt-1 text-xl font-semibold", theme.title)}>
                  把经验写成可复现的路径
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section id="about" className={cn("border-t py-16", theme.divider)}>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className={cn("font-mono text-xs uppercase tracking-[0.25em]", theme.accent)}>
                About
              </p>
              <h2 className={cn("mt-3 text-3xl font-semibold", theme.title)}>个人介绍</h2>
            </div>
            <p className={cn("max-w-3xl text-lg leading-8", theme.body)}>
              我关注能真正落地的技术：让 AI 进入开发流程，让服务运行得更稳，让网络路径更清楚，也让个人知识库持续积累。这个站点会少一点口号，多一点配置、代码、复盘和长期维护经验。
            </p>
          </div>
        </section>

        <section id="writing" className={cn("border-t py-16", theme.divider)}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className={cn("font-mono text-xs uppercase tracking-[0.25em]", theme.accent)}>
                Writing
              </p>
              <h2 className={cn("mt-3 text-3xl font-semibold", theme.title)}>文章预览</h2>
            </div>
            <p className={cn("max-w-md text-sm leading-6", theme.muted)}>
              先放一些主题方向，后续可以接入真实文章、MDX 或 CMS。
            </p>
          </div>
          <div className="grid gap-4">
            {posts.map((post) => (
              <article
                key={post.title}
                className={cn("group border p-6 transition", theme.panelHover)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={cn(
                      "font-mono text-xs uppercase tracking-[0.2em]",
                      theme.accent,
                    )}
                  >
                    {post.category}
                  </p>
                  <p className={cn("text-sm", theme.muted)}>
                    {post.date} · {post.readTime}
                  </p>
                </div>
                <h3
                  className={cn(
                    "mt-4 text-2xl font-semibold transition",
                    theme.title,
                    isDark ? "group-hover:text-cyan-100" : "group-hover:text-sky-700",
                  )}
                >
                  {post.title}
                </h3>
                <p className={cn("mt-3 max-w-3xl leading-7", theme.soft)}>{post.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className={cn("border-t py-16", theme.divider)}>
          <div className="mb-8">
            <p className={cn("font-mono text-xs uppercase tracking-[0.25em]", theme.accent)}>
              Projects
            </p>
            <h2 className={cn("mt-3 text-3xl font-semibold", theme.title)}>项目入口</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.name}
                className={cn("border p-6 transition-colors duration-500", theme.panel)}
              >
                <h3 className={cn("text-xl font-semibold", theme.title)}>{project.name}</h3>
                <p className={cn("mt-3 leading-7", theme.soft)}>{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn("rounded-full border px-3 py-1 font-mono text-xs", theme.tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
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
                isDark ? "text-zinc-400 hover:text-cyan-100" : "text-slate-600 hover:text-sky-700",
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
