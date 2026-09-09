# superzyk.com

个人技术网站，记录 AI Agent、本地 AI、开发工具和 Homelab 实践。网站由首页、文章列表及 Markdown 文章页组成。

## 维护基线

- 生产域名：https://superzyk.com
- GitHub 仓库：https://github.com/spacek-99/superzyk-blog
- 2026-09-08 核实的生产提交：`7671107af6f57449e01cdd0fd6e744bf593cf670`（`main`）
- 对应 Vercel 生产部署：`dpl_N8zRMGvpeG5k3UxPTZFrrbAqepXf`
- Windows 工作目录：`C:\Users\Henrikyy\Documents\ChatGPT\superzyk`
- 当前维护分支：`codex/site-maintenance`

世界杯功能单独归档，不包含在当前网站代码中。归档位置为 `archives/my-web-worldcup-2026-09-08/`；该目录只保存在本机，不提交到 Git。恢复方式见归档内的 `README.md`。WSL 原项目仍保留。

## Windows 本地开发

使用 Windows 原生 Node.js 和 Git。迁移时检测到 Node.js `22.22.1`、npm `10.9.4`；依赖版本由 `package-lock.json` 固定。

在项目目录的 PowerShell 中运行：

```powershell
npm.cmd ci
npm.cmd run dev -- --hostname 127.0.0.1
```

打开 http://127.0.0.1:3000 。使用 `npm.cmd` 可以避免 PowerShell 将命令解析为 `npm.ps1`。

当前首页与博客本地运行无需 API Key。不要复制 WSL 的 `node_modules`、`.next` 或 `.env.local`。

## 验证与生产预览

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1
```

页面交互改动还应检查桌面与移动端、文章导航和深浅色主题。浏览器截图和检查记录可放在被 Git 忽略的 `artifacts/`。

推送和生产部署应在用户明确授权后执行。日常改动在维护分支完成，保持 `main` 为已确认的发布基线。

## Impeccable 设计辅助

已按项目范围安装 [Impeccable](https://github.com/pbakaus/impeccable)，技能位于 `.agents/skills/impeccable/`。安装时技能版本为 `4.3.1`，Windows 引擎版本为 `0.1.5`。它供 Codex 维护界面时使用，不是网站运行依赖。

在本项目的 Codex 对话中使用 `$impeccable audit 首页和文章列表` 做质量审查，或 `$impeccable polish 文章阅读页` 做局部细节优化。保持当前网站定位和视觉风格；整体重设计需要先确定范围。自动 Hooks 未启用。

Windows 启动验证：

```powershell
& '.\.agents\skills\impeccable\scripts\impeccable.cmd' engine-probe
```

正常返回 `impeccable-engine 0.1.5`。引擎首次使用时从官方 GitHub Release 下载并验证 SHA-256，缓存在用户目录 `.impeccable/bin/<版本>/`。第三方技能脚本已从网站 ESLint 检查范围中排除。

## 内容与代码位置

| 路径 | 用途 |
| --- | --- |
| `app/page.tsx` | 个人首页 |
| `app/posts/page.tsx` | 文章列表 |
| `app/posts/[slug]/page.tsx` | 文章详情与分享元数据 |
| `content/posts/*.md` | Markdown 正文与 front matter |
| `lib/posts.ts` | 文章读取、排序、分类和 HTML 转换 |
| `components/` | 主题切换、目录、图片预览和回到顶部 |
| `public/images/posts/` | 文章图片 |

## 文章元信息

每篇文章在开头的 YAML front matter 中声明元信息。`date` 保留首次发布日期，分类由文章自身声明，新增科普文章无需修改 TypeScript。

```yaml
---
title: "文章标题"
description: "文章摘要"
date: "2026-05-20"
category: tutorial
tags: [AI, 本地部署]
draft: true
---
```

| 字段 | 约定 |
| --- | --- |
| `category` | `explainer` 为科普，`tutorial` 为教程；省略时兼容为教程，拼写错误会阻止发布构建 |
| `date` | 必填，首次发布日期，格式 `YYYY-MM-DD` |
| `updatedAt` | 可选，仅在正文实际修订后填写，不得早于发布日期 |
| `environment` | 可选，文中适用环境，例如 `Windows + WSL2` |
| `version` | 可选，文章所述软件或模型版本；版本说明不代表已经实测 |
| `verifiedAt` | 可选，确实完成复现测试后填写的实测日期 |
| `coverImage` | 可选，`public/` 下图片的站内路径，例如 `/images/posts/example/cover.webp` |
| `draft` | `true` 时不出现在列表、文章页和站点地图中；未完成草稿可以暂缺日期 |

现有文章的原发布日期保留。此次仅从已有正文提取环境与版本说明，未添加新的实测日期或虚构内容更新时间。

## 阅读与搜索支持

- 首页在手机上直接显示科普、教程和全部文章导航，并支持文字放大后的换行；文章列表提供按实际篇数生成的分类跳转。
- 首页与列表共用 `components/PostCard.tsx`，完整显示标题和摘要、最多三个主要标签，每卡只有一个键盘链接。
- 首页动效使用原生 WebGL2，不再依赖 Three.js；离开视口或页面隐藏时暂停，返回后恢复。创建失败或上下文丢失时显示静态渐变，手机和减少动画模式保持静态背景。
- 手动主题同时控制 CSS 变量与 Tailwind 深色样式；存储读写被拒绝时仍可切换当前页面主题。文字强调色和选择高亮分别提供深浅主题配色，独立点击区域至少 44px 高。
- 文章目录在宽屏侧边显示，在较窄屏幕以内联折叠入口显示并跟随阅读；可用键盘操作。
- 图片预览支持 Enter、空格、Esc 和焦点恢复；目录与返回顶部遵循系统减少动画设置。
- 首页、列表和文章分别提供 canonical 标准地址。
- `/sitemap.xml` 随公开文章自动生成；文章修改时间使用 `updatedAt`，缺省时使用原 `date`。
- `/robots.txt` 声明站点地图位置。
- 默认分享图为 `public/images/og-default.png`；文章可用 `coverImage` 覆盖。
- `npm.cmd test` 验证文章元信息、主题存储容错和 WebGL 生命周期。页面交互仍需浏览器验证；固定画面像素对比、资源体积和本机浏览器验收记录保存在 `artifacts/impeccable-fixes/`。
