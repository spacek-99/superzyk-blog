---
title: "Hermes Agent 最新安装教程：Windows + WSL2 国内/国际通用版"
description: "面向小白的 Hermes Agent 最新安装与配置教程，覆盖 Windows + WSL2、国际/国内大模型 API、本地 Ollama/llama.cpp/LM Studio/vLLM 部署、消息网关、Dashboard 与常见问题。"
date: "2026-05-20"
tags:
  - Hermes Agent
  - AI Agent
  - WSL2
  - 本地大模型
  - OpenAI-compatible
---

# Hermes Agent 最新安装教程：Windows + WSL2 国内/国际通用版

> 本文基于 2026 年 5 月官方仓库 `NousResearch/hermes-agent`、官方文档、Release 说明以及大型社区部署经验整理。  
> 目标是让第一次接触 Hermes Agent 的新手，也能按照步骤完成安装、接入大模型、配置消息网关，并理解国内/国际用户应该怎么选路线。

---

## 一、Hermes Agent 是什么？

Hermes Agent 可以理解成一个“长期运行的个人 AI 助手”。

它和普通 ChatGPT 网页聊天最大的区别是：

- 它可以运行在你的电脑、服务器或 WSL2 里；
- 它可以调用终端、读写文件、运行脚本；
- 它支持长期记忆、技能沉淀和自动化任务；
- 它可以通过 Telegram、Discord、飞书、企业微信、微信等消息工具远程交互；
- 它可以接入云端大模型 API，也可以接入本地大模型；
- 它可以配合 Dashboard / Open WebUI 做图形化管理。

简单说，普通 AI 更像“网页里的聊天窗口”，Hermes Agent 更像“住在你电脑或服务器里的智能助理”。

---

## 二、这篇教程适合谁？

如果你是以下任意一种用户，都可以看这篇：

1. 你是 Windows 用户，想用 WSL2 安装 Hermes Agent；
2. 你在国内，担心 GitHub、Pip、API 接入不稳定；
3. 你在国外，想直接接 OpenAI、Claude、Gemini、OpenRouter；
4. 你想省 Token，尝试用 Ollama、llama.cpp、LM Studio 跑本地模型；
5. 你之前用过 OpenClaw，想看看 Hermes Agent 是否值得迁移；
6. 你想把 Hermes 接入 Telegram、Discord、飞书、企业微信或微信；
7. 你希望有一套小白也能看懂的完整安装路径。

---

## 三、先说结论：Windows 用户优先选 WSL2

Hermes Agent 现在已经支持原生 Windows，但官方仍把 Windows 原生版标为 Early Beta。也就是说：能装，能跑，但没有 Linux / macOS / WSL2 路线稳定。

所以我建议：

| 用户类型 | 推荐安装方式 |
|---|---|
| 普通 Windows 用户 | Windows + WSL2 + Ubuntu |
| 国内 Windows 用户 | Windows + WSL2 + Ubuntu + 国内 API / 自有代理 |
| macOS 用户 | 直接用官方一键脚本 |
| Linux 服务器用户 | 直接用官方一键脚本 |
| 想尝鲜的人 | 可以试 Windows 原生安装，但不建议作为主力生产环境 |

这篇文章主线采用 **Windows + WSL2 + Ubuntu**，因为它最稳、资料最多，也最适合后续接本地模型、脚本、网关和自动化任务。

---

## 四、安装前你需要准备什么？

### 1. 一台 Windows 电脑

建议配置：

- Windows 10 / Windows 11；
- 至少 16GB 内存；
- 硬盘空余 20GB 以上；
- 如果要跑本地模型，最好有 NVIDIA 显卡。

如果只是接云端 API，不需要高配电脑。

### 2. 一个大模型 API Key

国际用户可以准备：

- OpenAI；
- Anthropic Claude；
- Google Gemini；
- OpenRouter；
- xAI Grok；
- GitHub Copilot / Codex 相关授权。

国内用户可以准备：

- DeepSeek；
- Kimi / Moonshot；
- Qwen / DashScope；
- MiniMax；
- 智谱 GLM；
- 小米 MiMo；
- 其他 OpenAI-compatible 兼容接口。

### 3. 一个消息工具账号，可选

如果你只在电脑终端里用 Hermes，不需要消息工具。

如果想手机远程使用，可以准备：

- 国际用户：Telegram / Discord；
- 国内用户：飞书 / 企业微信 / 微信；
- 进阶用户：Slack / Matrix / Mattermost / Email 等。

---

## 五、第一步：安装 WSL2 和 Ubuntu

在 Windows 里，右键开始菜单，打开 **Windows PowerShell（管理员）**，执行：

```powershell
wsl --install
```

如果系统提示重启，就重启电脑。

重启后继续打开 PowerShell，执行：

```powershell
wsl --update
wsl --set-default-version 2
```

然后打开 Ubuntu，第一次进入时会让你设置 Linux 用户名和密码。

注意：这里的密码输入时不会显示星号，这是 Linux 正常行为，直接输入后回车即可。

---

## 六、第二步：更新 Ubuntu 基础环境

打开 Ubuntu 终端，执行：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ca-certificates
```

这一步的作用是：

- 更新 Ubuntu 软件源；
- 安装 Git，用来拉取代码；
- 安装 curl，用来运行官方安装脚本；
- 安装证书包，避免 HTTPS 证书错误。

装完后检查一下：

```bash
git --version
curl --version
```

如果能看到版本号，说明基础环境没问题。

---

## 七、国内用户建议先做网络检查

国内用户先在 Ubuntu 里执行：

```bash
curl -I https://raw.githubusercontent.com
```

如果能返回 `HTTP/2 200` 或 `HTTP/2 301` 之类的结果，说明 GitHub raw 基本可访问。

如果长时间卡住、超时或失败，后面的官方安装脚本可能也会失败。此时可以考虑：

1. 让 WSL2 走 Windows 宿主机代理；
2. 使用自己的稳定代理；
3. 使用企业网络或云服务器；
4. 先手动下载脚本再执行。

不建议在公开教程里固定推荐来路不明的 GitHub 镜像，因为这类镜像稳定性和安全性都不可控。

如果你后续需要用 pip 安装 Python 包，可以顺手换成国内镜像：

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn
```

注意：Hermes 官方一键脚本会自动处理很多依赖，Pip 换源不是必须步骤，但国内用户做了会更稳。

---

## 八、第三步：安装 Hermes Agent

### 推荐方式：官方一键安装脚本

在 Ubuntu 里执行：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装完成后，重新加载终端环境：

```bash
source ~/.bashrc
```

然后检查版本：

```bash
hermes --version
hermes doctor
```

如果 `hermes --version` 能显示版本，说明安装成功。

如果 `hermes doctor` 有黄色警告，不一定代表失败；它会提醒你哪些工具、模型、网关还没配置。第一次安装后看到部分未配置是正常的。

---

## 九、备用安装方式：PyPI 稳定版

如果你不想追最新代码，只想装稳定版，可以用 PyPI：

```bash
pip install hermes-agent
hermes postinstall
source ~/.bashrc
hermes --version
```

两种方式怎么选？

| 安装方式 | 优点 | 缺点 |
|---|---|---|
| 官方一键脚本 | 最新功能最快，适合折腾 | 可能跟随 main 分支变化 |
| PyPI | 更稳定，更适合普通用户 | 新功能可能稍晚 |

新手推荐先用官方一键脚本；如果你非常重视稳定，再用 PyPI。

---

## 十、第四步：首次启动 Hermes

执行：

```bash
hermes setup
```

它会进入交互式配置向导。

你可以按提示配置：

- 大模型 Provider；
- API Key；
- 默认模型；
- 工具权限；
- 消息网关；
- Workspace；
- 记忆和技能相关设置。

如果你不确定怎么选，可以先只配置模型，其他保持默认。

配置完成后启动：

```bash
hermes
```

然后输入一句测试：

```text
你好，检查一下当前目录，并用 5 条总结你能做什么。
```

如果 Hermes 能正常回答，并能识别当前环境，说明主流程已经跑通。

---

## 十一、国际用户：云端大模型 API 接入

国际用户最简单，直接运行：

```bash
hermes model
```

然后在菜单里选择对应 Provider。

### 1. OpenAI

适合想用 GPT 系列模型的用户。

一般流程：

1. 选择 OpenAI；
2. 输入 API Key；
3. 选择默认模型；
4. 保存配置。

也可以使用 ChatGPT / Codex 相关 OAuth 授权，具体按 Hermes 当前菜单提示操作。

### 2. Anthropic Claude

适合复杂写作、代码理解、长上下文任务。

流程：

```bash
hermes model
```

选择 Anthropic，然后根据提示输入 API Key 或走 OAuth。

### 3. Google Gemini

适合多模态、长上下文和性价比场景。

流程：

```bash
hermes model
```

选择 Gemini API Key 或 Gemini OAuth。

如果你是稳定生产使用，建议优先使用自己的 Gemini API Key。

### 4. OpenRouter

OpenRouter 适合想“一把钥匙接很多模型”的用户。

流程：

```bash
hermes config set OPENROUTER_API_KEY sk-or-xxxx
hermes model
```

选择 OpenRouter 后，可以在不同模型之间切换，例如 Claude、Gemini、DeepSeek、Qwen、Llama 等。

---

## 十二、国内用户：国内大模型 API 接入

国内用户重点是两类方式：

1. Hermes 官方已支持的国内 Provider；
2. OpenAI-compatible 兼容接口。

如果你不知道选哪个，建议优先试：

- DeepSeek；
- Kimi / Moonshot；
- Qwen / DashScope；
- MiniMax；
- 小米 MiMo；
- 智谱 GLM。

### 1. DeepSeek

设置 API Key：

```bash
hermes config set DEEPSEEK_API_KEY sk-xxxx
hermes model
```

然后在模型菜单里选择 DeepSeek。

如果菜单里暂时没有合适选项，也可以用 Custom endpoint：

```text
Provider: custom
Base URL: https://api.deepseek.com/v1
API Key: sk-xxxx
Model: deepseek-chat
```

### 2. Kimi / Moonshot

```bash
hermes config set KIMI_CN_API_KEY sk-xxxx
hermes model
```

然后选择 Kimi / Moonshot 国内线路。

Kimi 适合长文本、资料总结、研究型任务。

### 3. Qwen / DashScope

```bash
hermes config set DASHSCOPE_API_KEY sk-xxxx
hermes model
```

然后选择 Alibaba / Qwen / DashScope 相关选项。

Qwen 系列适合中文、代码、工具调用和国内生态。

### 4. MiniMax 国内版

```bash
hermes config set MINIMAX_CN_API_KEY xxxx
hermes model
```

然后选择 MiniMax 国内线路。

### 5. 智谱 GLM / z.ai

```bash
hermes config set GLM_API_KEY xxxx
hermes model
```

然后选择 GLM / z.ai。

### 6. 小米 MiMo

如果你有小米 MiMo Token Plan 或对应 API Key，可以设置：

```bash
hermes config set XIAOMI_API_KEY xxxx
hermes model
```

然后选择 Xiaomi / MiMo。

例如模型可以选择：

```text
mimo-v2-pro
```

具体模型名以你账号后台和 Hermes 当前 Provider 菜单为准。

---

## 十三、万能方法：Custom endpoint

如果你用的是第三方中转平台、公司内部模型服务、火山方舟、硅基流动、One API、LiteLLM、New API 或其他 OpenAI-compatible 服务，一般都可以走 Custom endpoint。

执行：

```bash
hermes model
```

选择：

```text
Custom endpoint
```

然后填写：

```text
Base URL: https://你的服务地址/v1
API Key: 你的 API Key
Model: 你的模型名
```

举例：

```text
Base URL: https://api.example.com/v1
API Key: sk-xxxx
Model: qwen-plus
```

注意：

- Base URL 通常要以 `/v1` 结尾；
- Model 名必须和服务商后台显示的一致；
- 如果能聊天但不能调用工具，通常是模型或服务端不支持 tool calling；
- 如果报 401，通常是 API Key 错；
- 如果报 404，通常是 Base URL 或模型名错。

---

## 十四、本地大模型部署：什么时候适合？

本地大模型适合这些情况：

- 你想节省 API 成本；
- 你不想把部分数据发到云端；
- 你有 NVIDIA 显卡；
- 你愿意接受速度和能力不如顶级云端模型；
- 你愿意折腾参数。

但要提前说清楚：Hermes Agent 不是普通聊天应用，它需要长上下文、工具调用、文件理解、终端调用、记忆和技能系统。

所以本地模型至少要注意三点：

1. 上下文尽量设置到 32K 或 64K；
2. 模型要支持工具调用或能稳定输出函数调用格式；
3. 服务端要正确开启 OpenAI-compatible API。

如果模型太小，可能会出现：

- 会聊天，但不会调用工具；
- 工具调用 JSON 格式错误；
- 上下文稍长就忘记前面内容；
- 终端任务执行不稳定；
- Cron 或 Gateway 场景下容易失败。

---

## 十五、本地部署方案 A：Ollama，最适合新手

Ollama 是最简单的本地模型运行方式。

### 1. 安装 Ollama

在 WSL2 Ubuntu 里执行：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

检查：

```bash
ollama --version
```

### 2. 下载模型

示例：

```bash
ollama pull qwen2.5-coder:7b
```

如果你显存更大，可以尝试更大的模型，例如 14B、32B 等。

普通电脑建议先从 7B 或 14B 试起，不要一上来就跑 70B。

### 3. 启动 Ollama，并设置长上下文

```bash
OLLAMA_CONTEXT_LENGTH=65536 ollama serve
```

另开一个 Ubuntu 终端，检查接口：

```bash
curl http://127.0.0.1:11434/v1/models
```

如果能看到模型列表，说明 Ollama 的 OpenAI-compatible 接口可用。

### 4. 让 Hermes 接入 Ollama

执行：

```bash
hermes model
```

选择：

```text
Custom endpoint
```

填写：

```text
Base URL: http://127.0.0.1:11434/v1
API Key: ollama
Model: qwen2.5-coder:7b
```

然后启动 Hermes 测试：

```bash
hermes
```

测试输入：

```text
请读取当前目录文件列表，并告诉我你是否能调用工具。
```

---

## 十六、Windows 宿主机跑 Ollama，WSL2 连接

有些人喜欢在 Windows 上安装 Ollama 客户端，然后让 WSL2 里的 Hermes 去连接它。

这种方式可行，但要注意网络。

### 推荐方式：WSL mirrored networking

Windows 11 用户可以编辑：

```powershell
notepad $env:USERPROFILE\.wslconfig
```

写入：

```ini
[wsl2]
networkingMode=mirrored
```

保存后执行：

```powershell
wsl --shutdown
```

重新进入 Ubuntu，测试：

```bash
curl http://localhost:11434/v1/models
```

如果能通，就可以在 Hermes 里填：

```text
Base URL: http://localhost:11434/v1
```

### 备用方式：让 Windows Ollama 监听局域网

在 Windows 系统环境变量里设置：

```text
OLLAMA_HOST=0.0.0.0
```

然后重启 Ollama，并确保 Windows 防火墙允许 11434 端口。

在 WSL2 里用 Windows 局域网 IP 访问：

```bash
curl http://192.168.x.x:11434/v1/models
```

Hermes 里填：

```text
Base URL: http://192.168.x.x:11434/v1
```

注意：局域网暴露模型服务有风险，不要暴露到公网。

---

## 十七、本地部署方案 B：llama.cpp / llama-server

如果你下载的是 GGUF 模型，可以用 llama.cpp。

### 1. 编译 llama.cpp

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release
```

如果你要用 NVIDIA GPU，需要根据自己的 CUDA 环境开启对应编译参数。新手可以先用 Ollama，不建议第一天就硬啃 llama.cpp。

### 2. 启动 llama-server

示例：

```bash
./build/bin/llama-server \
  --jinja \
  -c 65536 \
  -ngl 99 \
  -m /path/to/your-model.gguf \
  --port 8080 \
  --host 0.0.0.0
```

这里有几个关键点：

- `--jinja`：对工具调用很重要；
- `-c 65536`：设置上下文长度；
- `-ngl 99`：尽量把层放到 GPU；
- `--port 8080`：服务端口；
- `--host 0.0.0.0`：允许外部访问，局域网使用时注意安全。

### 3. Hermes 接入 llama.cpp

```bash
hermes model
```

选择 Custom endpoint：

```text
Base URL: http://127.0.0.1:8080/v1
API Key: llama-local
Model: 你的模型名
```

如果模型名不确定，可以先访问：

```bash
curl http://127.0.0.1:8080/v1/models
```

---

## 十八、本地部署方案 C：LM Studio，图形界面更友好

如果你不喜欢命令行，可以用 LM Studio。

基本步骤：

1. 安装 LM Studio；
2. 下载一个支持工具调用的模型；
3. 打开 Developer Server；
4. 确认接口地址，一般是：

```text
http://127.0.0.1:1234/v1
```

Hermes 配置：

```bash
hermes model
```

选择：

```text
Custom endpoint
```

填写：

```text
Base URL: http://127.0.0.1:1234/v1
API Key: lm-studio
Model: 当前加载的模型名
```

LM Studio 优点是界面清楚，适合新手；缺点是自动化和服务化能力不如 Ollama、vLLM、SGLang。

---

## 十九、本地部署方案 D：vLLM / SGLang，适合服务器玩家

如果你有大显卡、服务器或多卡环境，可以考虑 vLLM 或 SGLang。

### vLLM 示例

```bash
pip install vllm
```

启动示例：

```bash
vllm serve Qwen/Qwen3-Coder-30B-A3B-Instruct \
  --port 8000 \
  --max-model-len 65536 \
  --enable-auto-tool-choice \
  --tool-call-parser hermes
```

Hermes 里填：

```text
Base URL: http://127.0.0.1:8000/v1
Model: Qwen/Qwen3-Coder-30B-A3B-Instruct
```

### SGLang 示例

```bash
pip install "sglang[all]"
```

启动示例：

```bash
python -m sglang.launch_server \
  --model Qwen/Qwen3-Coder-30B-A3B-Instruct \
  --port 30000 \
  --context-length 65536 \
  --tp 1 \
  --tool-call-parser qwen
```

Hermes 里填：

```text
Base URL: http://127.0.0.1:30000/v1
```

这两种更适合有经验的用户。普通新手优先 Ollama。

---

## 二十、消息网关配置：让 Hermes 常驻后台

如果你想在手机上和 Hermes 聊，或者让它定时给你推送信息，就需要配置 Gateway。

执行：

```bash
hermes gateway setup
```

根据菜单选择平台。

### 国际用户推荐

#### Telegram

需要准备：

- Telegram Bot Token；
- 你的 Telegram User ID。

一般流程：

1. 找 `@BotFather` 创建机器人；
2. 获取 Bot Token；
3. 找 `@userinfobot` 获取自己的 User ID；
4. 执行 `hermes gateway setup`；
5. 选择 Telegram；
6. 填入 Token 和允许访问的 User ID。

#### Discord

适合群组、频道、多机器人协作。

大致流程：

1. 创建 Discord Bot；
2. 获取 Bot Token；
3. 邀请 Bot 到服务器；
4. 配置允许用户或频道；
5. 运行 `hermes gateway setup`。

### 国内用户推荐

#### 飞书 / Lark

如果你主要在国内使用，飞书是比较稳的选择。

适合：

- 个人自动化；
- 群内 AI 助手；
- 定时日报；
- 项目通知；
- 多 Agent 协作。

#### 企业微信 WeCom

企业微信更适合稳定生产化部署。

适合：

- 公司内部；
- 家庭或团队自动化；
- 长期通知；
- 手机端稳定使用。

#### 微信 Weixin

微信个人号接入要谨慎。它适合实验，不建议一开始就当生产主入口。

原因是：

- 个人微信生态限制更多；
- 扫码登录和 Bot 身份可能有差异；
- 群聊支持不一定稳定；
- 被风控后排查成本高。

如果你只是自己用，建议优先飞书或企业微信。

---

## 二十一、启动和安装 Gateway 服务

前台测试：

```bash
hermes gateway
```

如果消息平台能收到回复，再考虑安装成后台服务：

```bash
hermes gateway install
```

查看状态可以用：

```bash
hermes gateway status
```

如果命令有变化，以当前版本的帮助为准：

```bash
hermes gateway --help
```

---

## 二十二、Web Dashboard：图形化管理 Hermes

Hermes 现在有官方内置 Dashboard。

先安装 Web 依赖：

```bash
pip install 'hermes-agent[web,pty]'
```

启动：

```bash
hermes dashboard
```

默认访问：

```text
http://127.0.0.1:9119
```

如果你想用浏览器里的嵌入式 TUI，可以试：

```bash
hermes dashboard --tui
```

注意：

不要随便把 Dashboard 暴露到公网。尤其不要随便使用：

```bash
hermes dashboard --host 0.0.0.0 --insecure
```

这类命令可能让别人访问你的 Hermes 管理界面，存在泄露 API Key、执行命令、读写文件的风险。

如果真的要远程访问，建议使用：

- VPN；
- Tailscale；
- Cloudflare Tunnel + 鉴权；
- 内网反代 + 登录认证；
- SSH 隧道。

---

## 二十三、Open WebUI 接入 Hermes

如果你已经用 Open WebUI，也可以把 Hermes 当成 OpenAI-compatible API server 接进去。

先配置 Hermes API Server：

```bash
hermes config set API_SERVER_ENABLED true
hermes config set API_SERVER_KEY your-secret-key
hermes gateway
```

检查：

```bash
curl -s http://127.0.0.1:8642/health
curl -s -H "Authorization: Bearer your-secret-key" http://127.0.0.1:8642/v1/models
```

Open WebUI Docker 示例：

```bash
docker run -d -p 3000:8080 \
  -e OPENAI_API_BASE_URL=http://host.docker.internal:8642/v1 \
  -e OPENAI_API_KEY=your-secret-key \
  -e ENABLE_OLLAMA_API=false \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

注意：这不是把浏览器变成模型服务，而是让 Open WebUI 通过 Hermes 去调用 Agent Runtime。真正的工具执行、文件访问、终端执行都发生在 Hermes 所在机器上。

---

## 二十四、OpenClaw 用户是否要迁移？

如果你之前用过 OpenClaw，不建议直接删除。

更稳的做法是：

1. 保留 OpenClaw；
2. 安装 Hermes；
3. 先 dry-run 迁移；
4. 验证没问题后再逐步切换。

Hermes 支持 OpenClaw 迁移，可以先执行：

```bash
hermes claw migrate --dry-run
```

确认迁移内容后再执行：

```bash
hermes claw migrate
```

如果你不确定，千万不要直接加 `--overwrite`。

建议迁移顺序：

1. 先迁移记忆和用户说明；
2. 再迁移常用 skills；
3. 最后迁移消息网关和自动化任务；
4. 保留原 OpenClaw 配置备份至少 7 天。

---

## 二十五、安装完成后的验收清单

完成安装后，建议按下面顺序检查。

### 1. 检查 Hermes 是否安装成功

```bash
hermes --version
hermes doctor
```

### 2. 检查模型是否可用

```bash
hermes model
hermes
```

进入聊天后输入：

```text
请用一句话介绍你当前使用的模型和 Provider。
```

### 3. 检查工具调用

```text
请列出当前目录文件，并告诉我你调用了什么工具。
```

如果它只会文字回答，不会真正读取目录，说明工具权限或模型 tool calling 可能有问题。

### 4. 检查本地模型接口

Ollama：

```bash
curl http://127.0.0.1:11434/v1/models
```

llama.cpp：

```bash
curl http://127.0.0.1:8080/v1/models
```

LM Studio：

```bash
curl http://127.0.0.1:1234/v1/models
```

### 5. 检查 Gateway

```bash
hermes gateway --help
hermes gateway
```

手机端发一句：

```text
你好，收到请回复当前时间。
```

### 6. 检查 Dashboard

```bash
hermes dashboard
```

浏览器打开：

```text
http://127.0.0.1:9119
```

---

## 二十六、常见问题

### 问题 1：安装脚本卡住怎么办？

先检查 GitHub raw：

```bash
curl -I https://raw.githubusercontent.com
```

如果不通，说明不是 Hermes 的问题，而是网络访问问题。国内用户优先处理 WSL2 网络和代理。

### 问题 2：`hermes: command not found` 怎么办？

执行：

```bash
source ~/.bashrc
```

如果还不行，重新打开 Ubuntu 终端。

也可以查一下：

```bash
which hermes
echo $PATH
```

### 问题 3：API Key 填错了怎么办？

重新设置：

```bash
hermes model
```

或者：

```bash
hermes config set PROVIDER_API_KEY 新的key
```

具体变量名以 provider 文档和菜单提示为准。

### 问题 4：能聊天，但不会调用工具怎么办？

常见原因：

1. 模型不支持 tool calling；
2. 本地服务端没有开启工具调用；
3. 上下文太小；
4. 模型太弱；
5. Custom endpoint 配置不完整。

解决思路：

- 先用云端强模型验证 Hermes 本体没问题；
- 再切本地模型；
- 本地模型上下文设置到 32K 或 64K；
- llama.cpp 加 `--jinja`；
- vLLM 加 `--enable-auto-tool-choice` 和合适的 tool parser；
- 小模型优先做简单任务，不要一上来做复杂 Agent 任务。

### 问题 5：Ollama 在 Windows 跑，WSL 访问不到怎么办？

优先启用 WSL mirrored networking。

如果不行，就让 Windows Ollama 监听 `0.0.0.0`，并开放防火墙 11434 端口。

然后在 WSL 里测试：

```bash
curl http://Windows的局域网IP:11434/v1/models
```

### 问题 6：本地模型很慢怎么办？

可以尝试：

- 换小模型；
- 使用量化模型；
- 降低上下文；
- 用 GPU 加速；
- 不要同时开太多模型；
- 复杂任务交给云端模型，本地模型只做简单摘要或隐私任务。

### 问题 7：可以把 Dashboard 放公网吗？

不建议。

Dashboard 可能涉及：

- API Key；
- 文件读写；
- 命令执行；
- Workspace；
- 个人记忆。

如果要远程访问，优先用 VPN、Tailscale、SSH 隧道或带鉴权的反向代理。

---

## 二十七、推荐路线总结

### 国际用户最稳路线

```text
Windows + WSL2
→ 官方一键安装 Hermes
→ OpenAI / Claude / Gemini / OpenRouter
→ Telegram / Discord
→ hermes dashboard
```

### 国内用户最稳路线

```text
Windows + WSL2
→ 官方一键安装 Hermes
→ DeepSeek / Kimi / Qwen / MiniMax / GLM / MiMo
→ 飞书 / 企业微信
→ hermes dashboard
```

### 本地模型玩家路线

```text
Windows + WSL2
→ Hermes
→ Ollama / llama.cpp / LM Studio / vLLM / SGLang
→ Custom endpoint
→ 32K / 64K context
→ 测试 tool calling
```

### OpenClaw 老用户路线

```text
保留 OpenClaw
→ 安装 Hermes
→ hermes claw migrate --dry-run
→ 验证迁移内容
→ 分阶段切换
→ 不要直接删除旧环境
```

---

## 二十八、我个人更推荐的实践方式

如果你是第一次安装，不要一口气把所有功能都装满。

建议按这个顺序来：

1. 先装 WSL2；
2. 再装 Hermes；
3. 先接一个稳定云端模型；
4. 确认 `hermes` 基础聊天正常；
5. 确认工具调用正常；
6. 再配置 Gateway；
7. 再配置 Dashboard；
8. 最后折腾本地模型。

这样排查最简单。

很多人第一次失败，不是因为 Hermes 本身不能用，而是因为一开始就同时配置了：

- 本地模型；
- 自定义 API；
- 消息网关；
- Dashboard；
- Docker；
- 代理；
- Cron；
- OpenClaw 迁移。

任何一个环节出错，都会很难判断问题在哪。

新手最稳的方法永远是：**先跑通最小闭环，再逐步加功能。**

---

## 二十九、参考来源

- Hermes Agent 官方仓库：<https://github.com/NousResearch/hermes-agent>
- Hermes Agent 官方安装文档：<https://hermes-agent.nousresearch.com/docs/getting-started/installation>
- Hermes Agent Quickstart：<https://hermes-agent.nousresearch.com/docs/getting-started/quickstart>
- Hermes Agent AI Providers：<https://hermes-agent.nousresearch.com/docs/integrations/providers>
- Hermes Agent Windows WSL2 Guide：<https://hermes-agent.nousresearch.com/docs/user-guide/windows-wsl-quickstart>
- Hermes Agent Windows Native Guide：<https://hermes-agent.nousresearch.com/docs/user-guide/windows-native>
- Hermes Agent Web Dashboard：<https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard>
- Hermes Agent Messaging Gateway：<https://hermes-agent.nousresearch.com/docs/user-guide/messaging/>
- Hermes Agent Open WebUI：<https://hermes-agent.nousresearch.com/docs/user-guide/messaging/open-webui>
- Ollama Hermes 集成文档：<https://docs.ollama.com/integrations/hermes>
- Hermes Agent v0.14.0 Release：<https://github.com/NousResearch/hermes-agent/releases>
- Hermes Agent local model 相关社区讨论：<https://github.com/NousResearch/hermes-agent/issues/523>
