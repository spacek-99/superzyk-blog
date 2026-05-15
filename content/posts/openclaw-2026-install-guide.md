---
title: "OpenClaw 2026.5.12 最新安装教程：Windows + WSL2 国内/国际通用版"
description: "从零搭建自己的本地 AI Agent，支持 DeepSeek V4、Qwen 千问、MiniMax、Xiaomi MiMo、火山方舟豆包、OpenAI、Claude、Gemini 和本地 Ollama。"
date: "2026-05-15"
slug: "openclaw-2026-install-guide"
tags:
  - OpenClaw
  - AI Agent
  - WSL2
  - DeepSeek
  - Qwen
  - MiniMax
  - MiMo
  - Ollama
draft: false
---

# OpenClaw 2026.5.12 最新安装教程：Windows + WSL2 国内 / 国际通用版

> 从 0 搭建自己的本地 AI Agent：支持 DeepSeek V4、Qwen 千问、MiniMax、Xiaomi MiMo、火山方舟豆包、OpenAI、Claude、Gemini 和本地 Ollama。

## 一、这篇教程适合谁？

如果你想在 Windows 电脑上搭建一个真正能长期使用的本地 AI Agent，而不是只在网页上和 AI 聊天，那么 OpenClaw 很适合你。

OpenClaw 是一个运行在自己设备上的个人 AI assistant / Agent Gateway，可以连接模型、聊天渠道、工具、技能和本地工作区。你可以把它理解成：

```text
模型只是大脑；
OpenClaw 是把模型、工具、渠道和本地环境连接起来的 Agent 中枢。
```

这篇教程同时适配两类用户：

| 用户类型 | 推荐路线 |
|---|---|
| 国内用户 | WSL2 + 国内镜像源 + DeepSeek / Qwen / MiniMax / MiMo / 火山方舟 |
| 国际用户 | WSL2 / macOS / Linux + OpenAI / Claude / Gemini / OpenRouter |
| 想省钱或离线 | Ollama 本地模型 |
| 想长期维护 | systemd user service + backup + update + security audit |

---

## 二、版本说明：为什么按 OpenClaw 2026.5.12 写？

本文基于 **OpenClaw 2026.5.12** 整理。

这版教程和一些旧教程最大的区别是：

```text
旧写法：
DeepSeek / 千问 / 豆包 / MiMo 统一当成 OpenAI-compatible API 手动配置。

新写法：
优先使用 OpenClaw 原生 provider：
deepseek
qwen
minimax
xiaomi
volcengine
openai
anthropic
google
ollama
```

也就是说，本文不会把 DeepSeek、Qwen、MiniMax、MiMo、豆包都写成“伪装成 OpenAI 接口”的方式。

正确顺序应该是：

```text
openclaw onboard --auth-choice <provider-auth-choice>
openclaw models list --provider <provider>
openclaw models set <provider/model>
openclaw doctor
openclaw gateway restart
```

只有下面这些情况才考虑手动 JSON 或 OpenAI-compatible 兜底：

```text
1. 官方 provider 暂时没有收录你的模型；
2. 你使用企业内网代理；
3. 你自己搭了 LiteLLM / vLLM / SGLang / OneAPI；
4. 你要临时接入自定义 endpoint。
```

---

## 三、推荐安装路线

本文主线使用：

```text
Windows 11
+ WSL2 Ubuntu
+ systemd
+ Node.js 24
+ OpenClaw 2026.5.12
+ 原生模型 provider
+ Dashboard 验证
+ backup / update / security audit
```

Windows 用户虽然也可以原生安装 OpenClaw，但如果你准备长期维护、后续接 Feishu / Telegram / Discord / 本地脚本 / 技能工作区，我更推荐 WSL2。

原因很简单：WSL2 更接近 Linux 服务器环境，文件权限、systemd、日志、服务管理都更稳定。

---

# 第一部分：Windows + WSL2 安装 OpenClaw

## 1. 安装 WSL2

在 Windows 开始菜单搜索 **PowerShell**，右键选择 **以管理员身份运行**。

输入：

```powershell
wsl --install
```

安装完成后重启电脑。

重启后，打开 Ubuntu，设置 Linux 用户名和密码。

检查 WSL 版本：

```powershell
wsl -l -v
```

看到 Ubuntu 那一行显示 `VERSION 2` 即可。

进入 WSL：

```powershell
wsl
```

后续 Linux 命令都在 WSL Ubuntu 里执行。

---

## 2. 开启 systemd

OpenClaw 长期运行建议使用 systemd user service。

在 WSL 里执行：

```bash
ps -p 1 -o comm=
```

如果输出是：

```text
systemd
```

说明已经开启。

如果不是，执行：

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

回到 Windows PowerShell：

```powershell
wsl --shutdown
```

重新进入 WSL：

```powershell
wsl
```

再次检查：

```bash
ps -p 1 -o comm=
systemctl --user status
```

---

## 3. 国内用户：配置 apt 镜像源

海外用户可以跳过这一步。

国内用户建议使用清华 TUNA Ubuntu 镜像源。

先备份：

```bash
sudo mkdir -p /etc/apt/backup

sudo cp -a /etc/apt/sources.list \
  /etc/apt/backup/sources.list.bak.$(date +%Y%m%d-%H%M) 2>/dev/null || true

sudo cp -a /etc/apt/sources.list.d/ubuntu.sources \
  /etc/apt/backup/ubuntu.sources.bak.$(date +%Y%m%d-%H%M) 2>/dev/null || true
```

如果你是 Ubuntu 24.04 / 26.04 这种新版 DEB822 格式，执行：

```bash
if [ -f /etc/apt/sources.list.d/ubuntu.sources ]; then
  sudo sed -i \
    -e 's|http://archive.ubuntu.com/ubuntu|https://mirrors.tuna.tsinghua.edu.cn/ubuntu|g' \
    -e 's|http://security.ubuntu.com/ubuntu|https://mirrors.tuna.tsinghua.edu.cn/ubuntu|g' \
    -e 's|http://cn.archive.ubuntu.com/ubuntu|https://mirrors.tuna.tsinghua.edu.cn/ubuntu|g' \
    /etc/apt/sources.list.d/ubuntu.sources
fi
```

如果你的系统使用传统 `sources.list`，执行：

```bash
if [ ! -f /etc/apt/sources.list.d/ubuntu.sources ]; then
  . /etc/os-release
  CODENAME="${VERSION_CODENAME:-jammy}"

  sudo tee /etc/apt/sources.list >/dev/null <<EOF
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${CODENAME} main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${CODENAME}-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${CODENAME}-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ ${CODENAME}-security main restricted universe multiverse
EOF
fi
```

更新系统：

```bash
sudo apt clean
sudo apt update && sudo apt upgrade -y
```

---

## 4. 安装基础工具

```bash
sudo apt install -y curl git wget ca-certificates gnupg build-essential jq nano
```

验证：

```bash
curl --version
git --version
jq --version
```

---

## 5. 安装 Node.js 24

OpenClaw 推荐 Node.js 24，Node 22.16+ 也支持。如果使用官方安装脚本，脚本也会自动处理 Node，但提前装好 Node 更便于排错。

执行：

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt-get install -y nodejs
```

验证：

```bash
node --version
npm --version
```

正常应该看到：

```text
v24.x.x
```

---

## 6. 国内用户：配置 npm 镜像源

国内用户建议使用 npmmirror：

```bash
npm config set registry https://registry.npmmirror.com
npm config get registry
```

如果后面安装不到最新版 OpenClaw，切回官方源：

```bash
npm config set registry https://registry.npmjs.org
npm view openclaw version
```

---

## 7. 安装 OpenClaw

推荐使用官方安装脚本：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果官方脚本下载慢，可以用 npm 备用方案：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

检查版本：

```bash
openclaw --version
```

如果提示：

```text
openclaw: command not found
```

执行：

```bash
npm prefix -g
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
openclaw --version
```

---

## 8. 初始化 OpenClaw

执行：

```bash
openclaw onboard --install-daemon
```

建议新手选择：

| 配置项 | 建议 |
|---|---|
| Setup mode | QuickStart |
| Gateway | Local |
| Install daemon | Yes |
| Bind | loopback / 127.0.0.1 |
| Workspace | 默认 `~/.openclaw/workspace` |
| Message channels | 第一次先 Skip |
| Skills | 第一次先 Skip |
| Model provider | 先选你最想用的模型 provider |

初始化完成后，执行：

```bash
openclaw doctor
openclaw gateway status
openclaw dashboard
```

---

# 第二部分：模型接入总原则

## 1. 国内 / 国际模型怎么选？

| 场景 | 推荐 |
|---|---|
| 国内新手 | DeepSeek V4 Flash |
| 国内质量优先 | DeepSeek V4 Pro |
| 国内通用中文 | Qwen 千问 / 阿里云百炼 |
| 国内套餐 / Coding Plan | MiniMax / 火山方舟 / Qwen Coding Plan |
| 国内长上下文 Agent | Xiaomi MiMo Pro |
| 海外用户 | OpenAI / Claude / Gemini |
| 聚合模型 | OpenRouter / Vercel AI Gateway |
| 本地离线 | Ollama |
| 个人高频编程 | MiniMax M2.7 / Qwen Coder / Volcengine Plan / OpenAI Codex |

---

# 第三部分：国内模型接入

## 1. DeepSeek V4：国内新手首选

DeepSeek 现在应作为 OpenClaw 原生 provider 接入。

### 方案 A：交互式配置

```bash
openclaw onboard --install-daemon
```

按提示选择：

```text
Setup mode: QuickStart
Model/auth provider: DeepSeek
Enter DeepSeek API key: 粘贴你的 DeepSeek API Key
Default model: deepseek-v4-flash
```

质量优先可以填：

```text
deepseek-v4-pro
```

### 方案 B：命令行配置

```bash
openclaw onboard --auth-choice deepseek-api-key
```

验证模型：

```bash
openclaw models list --provider deepseek
```

设置模型时，以你本机 `models list` 输出为准。常见写法：

```bash
openclaw models set deepseek/deepseek-v4-flash
```

如果提示 unknown model，立即执行：

```bash
openclaw models list --provider deepseek
```

然后选择实际显示的模型引用。

### 验证

```bash
openclaw doctor
openclaw gateway restart
openclaw gateway status
openclaw dashboard
```

注意：如果官方文档页面与本机 `models list` 输出不完全一致，以你本机实机输出为准。

---

## 2. Qwen / 千问 / 阿里云百炼

Qwen 现在是 OpenClaw 的原生 provider，provider id 是 `qwen`。一般优先使用 Standard 按量路线；如果你买了 Coding Plan，再走 Coding Plan。

### Standard 按量路线：推荐大多数用户使用

中国区：

```bash
openclaw onboard --auth-choice qwen-standard-api-key-cn
```

国际区：

```bash
openclaw onboard --auth-choice qwen-standard-api-key
```

验证：

```bash
openclaw models list --provider qwen
```

设置模型：

```bash
openclaw models set qwen/qwen3.5-plus
```

如果你的列表里有 `qwen/qwen3.6-plus`：

```bash
openclaw models set qwen/qwen3.6-plus
```

### Coding Plan 路线

中国区：

```bash
openclaw onboard --auth-choice qwen-api-key-cn
```

国际区：

```bash
openclaw onboard --auth-choice qwen-api-key
```

验证：

```bash
openclaw models list --provider qwen
openclaw models set qwen/qwen3.5-plus
```

---

## 3. MiniMax：Token Plan / Coding Plan 推荐

MiniMax 适合想用 Token Plan / Coding Plan 的用户。OpenClaw 中主要有两个 provider：

```text
minimax：API Key 路线
minimax-portal：OAuth / Coding Plan 路线
```

### 中国用户：OAuth / Coding Plan

```bash
openclaw onboard --auth-choice minimax-cn-oauth
```

国际用户：

```bash
openclaw onboard --auth-choice minimax-global-oauth
```

查看模型：

```bash
openclaw models list --provider minimax
openclaw models list --provider minimax-portal
```

设置模型：

```bash
openclaw models set minimax-portal/MiniMax-M2.7
```

### API Key 路线

中国区：

```bash
openclaw onboard --auth-choice minimax-cn-api
```

国际区：

```bash
openclaw onboard --auth-choice minimax-global-api
```

设置模型：

```bash
openclaw models set minimax/MiniMax-M2.7
```

高速版：

```bash
openclaw models set minimax/MiniMax-M2.7-highspeed
```

---

## 4. Xiaomi MiMo：长上下文 Agent 推荐

Xiaomi MiMo 也已经是 OpenClaw 原生 provider，provider id 是 `xiaomi`。

配置：

```bash
openclaw onboard --auth-choice xiaomi-api-key
```

或者直接传入 key：

```bash
openclaw onboard --auth-choice xiaomi-api-key --xiaomi-api-key "$XIAOMI_API_KEY"
```

查看模型：

```bash
openclaw models list --provider xiaomi
```

常见模型引用：

```text
xiaomi/mimo-v2-flash
xiaomi/mimo-v2-pro
xiaomi/mimo-v2-omni
```

设置默认模型：

```bash
openclaw models set xiaomi/mimo-v2-flash
```

长上下文 Agent：

```bash
openclaw models set xiaomi/mimo-v2-pro
```

多模态：

```bash
openclaw models set xiaomi/mimo-v2-omni
```

---

## 5. 火山方舟 / 豆包 / Coding Plan

火山方舟在 OpenClaw 里主要有两个 provider：

```text
volcengine：通用模型
volcengine-plan：coding workloads
```

配置：

```bash
openclaw onboard --auth-choice volcengine-api-key
```

查看模型：

```bash
openclaw models list --provider volcengine
openclaw models list --provider volcengine-plan
```

设置 Coding Plan：

```bash
openclaw models set volcengine-plan/ark-code-latest
```

设置豆包通用模型：

```bash
openclaw models set volcengine/doubao-seed-1-8-251228
```

如果模型名变化，以你本机 `models list` 输出为准。

---

# 第四部分：国际模型接入

## 1. OpenAI API

API Key 路线：

```bash
openclaw onboard --auth-choice openai-api-key
```

查看模型：

```bash
openclaw models list --provider openai
```

设置模型：

```bash
openclaw models set openai/gpt-5.5
```

如果你的列表里没有 `gpt-5.5`，以实际列表为准。

---

## 2. OpenAI Codex / ChatGPT OAuth

如果你有 ChatGPT / Codex 订阅，可以走 Codex OAuth：

```bash
openclaw onboard --auth-choice openai-codex
```

或者：

```bash
openclaw models auth login --provider openai-codex
```

查看模型：

```bash
openclaw models list --provider openai-codex
```

设置模型：

```bash
openclaw models set openai-codex/gpt-5.5
```

---

## 3. Claude / Anthropic

```bash
openclaw onboard --auth-choice apiKey
```

查看模型：

```bash
openclaw models list --provider anthropic
```

设置模型：

```bash
openclaw models set anthropic/claude-opus-4-6
```

如果模型名变化，以你本机列表为准。

---

## 4. Gemini / Google

```bash
openclaw models list --provider google
```

如果你在 onboarding 里选择 Google / Gemini，按提示输入 API Key 即可。最终模型名以本机列表为准。

---

# 第五部分：本地模型 Ollama

Ollama 不建议再用 `/v1` OpenAI-compatible URL 作为主线接入 OpenClaw。

OpenClaw 集成的是 Ollama 原生 API `/api/chat`，支持 streaming 和 tool calling。远程 Ollama 不要使用：

```text
http://host:11434/v1
```

应该使用：

```text
http://host:11434
```

不要带 `/v1`。

## 1. 安装 Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

验证：

```bash
ollama --version
```

拉取模型：

```bash
ollama pull llama3.3
```

查看本地模型：

```bash
ollama list
```

## 2. 通过 OpenClaw onboarding 接入

```bash
openclaw onboard
```

选择：

```text
Provider: Ollama
Base URL: http://127.0.0.1:11434
Mode: Local
```

## 3. 非交互配置

```bash
openclaw onboard --non-interactive \
  --auth-choice ollama \
  --custom-base-url "http://127.0.0.1:11434" \
  --custom-model-id "llama3.3" \
  --accept-risk
```

验证：

```bash
openclaw models list
openclaw models set ollama/llama3.3
```

---

# 第六部分：启动与验证

安装和模型配置完成后，统一执行：

```bash
openclaw --version
openclaw doctor
openclaw gateway status
openclaw health
```

检查端口：

```bash
ss -ltnp | grep 18789 || true
```

打开 Dashboard：

```bash
openclaw dashboard
```

如果 Dashboard 能打开，并且 Chat 页面可以正常回复，基础安装完成。

也可以使用终端聊天：

```bash
openclaw terminal
```

或者打开 TUI：

```bash
openclaw tui
```

---

# 第七部分：更新、备份和安全

## 1. 备份

建议第一次安装成功后立刻执行：

```bash
mkdir -p ~/backups/openclaw

openclaw backup create --output ~/backups/openclaw --verify
```

只备份配置：

```bash
openclaw backup create --output ~/backups/openclaw --only-config --verify
```

查看备份：

```bash
ls -lh ~/backups/openclaw
```

---

## 2. 更新

推荐使用：

```bash
openclaw update
```

稳妥更新流程：

```bash
openclaw backup create --output ~/backups/openclaw --verify

openclaw update

openclaw doctor
openclaw gateway restart
openclaw health
openclaw gateway status
```

查看当前 npm 最新版本：

```bash
npm view openclaw version
```

如果需要固定版本：

```bash
npm i -g openclaw@2026.5.12
openclaw doctor
openclaw gateway restart
```

---

## 3. 安全检查

OpenClaw 是 Agent，不是普通聊天机器人。它可能连接你的文件、浏览器、命令行、消息渠道和 API Key，所以不要把 Dashboard 暴露到公网，不要把 API Key 写进 GitHub，不要给陌生人共享一个有工具权限的 agent。

建议执行：

```bash
openclaw security audit
openclaw security audit --deep
```

如果你确定要让它自动修一些常见问题：

```bash
openclaw security audit --fix
```

权限收紧：

```bash
chmod 700 ~/.openclaw
chmod 700 ~/.openclaw/workspace 2>/dev/null || true
```

检查敏感文件：

```bash
find ~/.openclaw -type f \( -name "*.env" -o -name "*key*" -o -name "*token*" -o -name "*credential*" \) -print
```

---

# 第八部分：常见问题

## 1. openclaw: command not found

```bash
npm prefix -g
echo "$PATH"
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
openclaw --version
```

## 2. apt update 很慢

```bash
grep -R "mirrors.tuna.tsinghua.edu.cn" \
  /etc/apt/sources.list \
  /etc/apt/sources.list.d/*.sources 2>/dev/null

sudo apt clean
sudo apt update
```

## 3. npm install 很慢

```bash
npm config get registry
npm config set registry https://registry.npmmirror.com
npm config get registry
```

如果安装不到最新版：

```bash
npm config set registry https://registry.npmjs.org
npm view openclaw version
```

## 4. Gateway 没启动

```bash
openclaw doctor
openclaw gateway status
openclaw gateway restart
```

查看 systemd 日志：

```bash
systemctl --user status openclaw-gateway.service
journalctl --user -u openclaw-gateway.service -n 100 --no-pager
```

## 5. Dashboard 打不开

```bash
openclaw gateway status
ss -ltnp | grep 18789 || true
openclaw dashboard
```

## 6. 模型 unknown model

先查列表：

```bash
openclaw models list --provider deepseek
openclaw models list --provider qwen
openclaw models list --provider minimax
openclaw models list --provider xiaomi
openclaw models list --provider volcengine
```

然后按实际输出设置：

```bash
openclaw models set <provider/model>
```

## 7. API Key 明明填了但 daemon 读不到

如果 Gateway 是 systemd daemon，需要确保 key 对 daemon 可见。

推荐写入：

```bash
nano ~/.openclaw/.env
```

示例：

```bash
DEEPSEEK_API_KEY=你的key
QWEN_API_KEY=你的key
MINIMAX_API_KEY=你的key
XIAOMI_API_KEY=你的key
VOLCANO_ENGINE_API_KEY=你的key
OPENAI_API_KEY=你的key
ANTHROPIC_API_KEY=你的key
```

保存后：

```bash
chmod 600 ~/.openclaw/.env
openclaw gateway restart
openclaw doctor
```

---

# 第九部分：实操验收清单

按教程做完后，逐条检查：

```bash
openclaw --version
```

期望看到：

```text
2026.5.12 或更新版本
```

继续：

```bash
openclaw doctor
openclaw gateway status
openclaw health
```

检查模型：

```bash
openclaw models list
```

检查你选择的 provider：

```bash
openclaw models list --provider deepseek
```

设置默认模型：

```bash
openclaw models set deepseek/deepseek-v4-flash
```

如果 unknown model：

```bash
openclaw models list --provider deepseek
```

按实际列表重新设置。

重启：

```bash
openclaw gateway restart
openclaw dashboard
```

能打开 Dashboard，能正常回复，就算安装成功。

---

# 最终推荐组合

## 国内新手最稳组合

```text
Windows 11
+ WSL2 Ubuntu
+ 清华 apt 镜像
+ npmmirror npm 镜像
+ Node.js 24
+ OpenClaw 2026.5.12
+ DeepSeek V4 Flash
+ Dashboard
+ backup
+ security audit
```

## 国内长期使用组合

```text
DeepSeek V4 Flash：默认快速模型
DeepSeek V4 Pro：复杂任务备用
Qwen Standard：中文、多模态、长上下文
MiniMax Coding Plan：编程和搜索
Xiaomi MiMo Pro：长上下文 Agent
Volcengine Plan：豆包 / Coding Plan
```

## 国际用户组合

```text
OpenAI API 或 OpenAI Codex OAuth
Claude / Anthropic
Gemini
OpenRouter
Ollama 本地模型备用
```

---

# 结语

到这里，你已经完成了 OpenClaw 的基础安装、模型接入、Dashboard 验证、备份和安全检查。

这篇教程最重要的原则是：

```text
先跑通，再扩展。
先用原生 provider，再考虑自定义 OpenAI-compatible。
先保证 Dashboard 能回复，再接 Feishu / Telegram / Discord / WeChat。
先备份，再更新。
```

对新手来说，第一天不要追求全自动，也不要一次性接太多渠道。只要完成下面四件事，就已经是一个合格的 OpenClaw 环境：

```text
能启动
能打开 Dashboard
能调用模型
能备份和更新
```

---

## 参考资料

- OpenClaw GitHub Releases: https://github.com/openclaw/openclaw/releases
- OpenClaw 安装文档: https://docs.openclaw.ai/install
- OpenClaw Model Providers: https://docs.openclaw.ai/concepts/model-providers
- OpenClaw Provider Directory: https://docs.openclaw.ai/providers
- OpenClaw DeepSeek Provider: https://docs.openclaw.ai/providers/deepseek
- DeepSeek OpenClaw 集成文档: https://api-docs.deepseek.com/quick_start/agent_integrations/openclaw
- OpenClaw Qwen Provider: https://docs.openclaw.ai/providers/qwen
- OpenClaw MiniMax Provider: https://docs.openclaw.ai/providers/minimax
- OpenClaw Xiaomi Provider: https://docs.openclaw.ai/providers/xiaomi
- OpenClaw Volcengine Provider: https://docs.openclaw.ai/providers/volcengine
- OpenClaw Ollama Provider: https://docs.openclaw.ai/providers/ollama
- Microsoft WSL 安装文档: https://learn.microsoft.com/windows/wsl/install
- Microsoft WSL systemd 文档: https://learn.microsoft.com/windows/wsl/systemd
- 清华 TUNA Ubuntu 镜像帮助: https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/
- npmmirror: https://npmmirror.com/
