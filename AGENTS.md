<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 当前维护范围

- 本项目维护线上 `superzyk.com` 的个人首页和博客。
- Windows 维护副本从已核实的生产提交 `7671107af6f57449e01cdd0fd6e744bf593cf670` 建立；当前维护分支为 `codex/site-maintenance`。
- 世界杯功能已经归档，不属于当前网站范围。不得将 `feat/worldcup-mvp` 合并到维护分支或重新引入世界杯页面。
- `archives/` 是本地归档，`artifacts/` 是本地验证产物；两者均不提交到 Git。
- 开发与验证使用 Windows 原生 Node.js、npm 和 Git。不要复制或复用 WSL 的 `node_modules`、`.next` 或本地密钥文件。
- 代码改动后运行 `npm.cmd run lint` 和 `npm.cmd run build`；页面交互改动还需浏览器验证。
- 推送和生产部署须有用户明确授权。保留现有个人网站定位，视觉重设计前先明确范围。
