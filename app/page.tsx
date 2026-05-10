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

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32rem),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_28rem),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18rem)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 sm:px-8 lg:px-10">
        <header className="sticky top-0 z-20 -mx-5 border-b border-white/10 bg-background/80 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between">
            <a href="#" className="font-mono text-sm font-semibold tracking-[0.22em] text-cyan-200">
              superzyk.com
            </a>
            <div className="hidden items-center gap-7 text-sm text-zinc-400 sm:flex">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-zinc-50">
                  {item.label}
                </a>
              ))}
              <a
                href="https://github.com/spacek-99"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-cyan-300/30 px-4 py-2 font-medium text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              AI · Dev · Homelab · Network
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-zinc-50 sm:text-6xl lg:text-7xl">
              在个人基础设施里，长期折腾一点有用的东西。
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              这里是 superzyk 的技术博客，记录 AI 工程、开发工具、家庭实验室、网络方案和一些从踩坑里长出来的判断。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#writing"
                className="inline-flex h-12 items-center justify-center rounded-md bg-cyan-200 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-100"
              >
                阅读最新文章
              </a>
              <a
                href="#projects"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-zinc-100 transition hover:border-cyan-200/70 hover:bg-white/5"
              >
                查看项目入口
              </a>
            </div>
          </div>

          <aside className="border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                Status
              </span>
              <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
                online
              </span>
            </div>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm text-zinc-500">当前关注</dt>
                <dd className="mt-1 text-xl font-semibold text-zinc-50">
                  AI coding workflow
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">基础设施</dt>
                <dd className="mt-1 text-xl font-semibold text-zinc-50">
                  Homelab / NAS / Observability
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">写作目标</dt>
                <dd className="mt-1 text-xl font-semibold text-zinc-50">
                  把经验写成可复现的路径
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section id="about" className="border-t border-white/10 py-16">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-200">
                About
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-50">个人介绍</h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-zinc-300">
              我关注能真正落地的技术：让 AI 进入开发流程，让服务运行得更稳，让网络路径更清楚，也让个人知识库持续积累。这个站点会少一点口号，多一点配置、代码、复盘和长期维护经验。
            </p>
          </div>
        </section>

        <section id="writing" className="border-t border-white/10 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-200">
                Writing
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-50">文章预览</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-500">
              先放一些主题方向，后续可以接入真实文章、MDX 或 CMS。
            </p>
          </div>
          <div className="grid gap-4">
            {posts.map((post) => (
              <article
                key={post.title}
                className="group border border-white/10 bg-white/[0.025] p-6 transition hover:border-cyan-200/40 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
                    {post.category}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {post.date} · {post.readTime}
                  </p>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-zinc-50 transition group-hover:text-cyan-100">
                  {post.title}
                </h3>
                <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{post.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="border-t border-white/10 py-16">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-200">
              Projects
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-50">项目入口</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.name} className="border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-xl font-semibold text-zinc-50">{project.name}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-zinc-500">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p>© 2026 superzyk.com. Built for long-term tinkering.</p>
            <a
              href="https://github.com/spacek-99"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 transition hover:text-cyan-100"
            >
              GitHub / spacek-99
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
