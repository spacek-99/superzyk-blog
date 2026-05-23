---
title: "8G 显存跑 35B 多模态模型：Qwen3.6 + llama.cpp 本地部署教程"
description: "普通 8G 显卡如何通过 MoE 稀疏激活、GGUF 量化和 llama.cpp CPU Offload 跑起 35B 多模态模型。"
date: "2026-05-23"
tags:
  - AI 本地部署
  - llama.cpp
  - Qwen3.6
  - GGUF
  - 多模态模型
---

> 本文基于 2026 年 5 月查询整理。llama.cpp、GGUF 模型文件、CUDA 构建包和 Qwen 系列模型仍在快速更新，实际命令参数以后续官方文档为准。

## 核心结论

以前想在本地跑 30B 以上大模型，很多人第一反应是：至少要 24G 显存，甚至要多卡。

但 Qwen3.6-35B-A3B 这类 MoE 模型出来后，玩法变了。

它不是把 35B 参数全部塞进显卡，而是通过 **MoE 稀疏激活 + GGUF 量化 + llama.cpp CPU/RAM Offload**，让 8G 显存显卡也能参与运行 35B 级别多模态模型。

更准确地说：

> 8G 显存不是“装下 35B”，而是负责高频计算部分；系统内存负责承载大量 MoE 专家权重，模型在推理时只激活其中一小部分。

所以这套方案适合想在本地体验大模型、多模态图片识别、前端代码生成、隐私文档分析的普通玩家。

---

## 适合谁看？

如果你符合下面任意一种情况，这篇教程就值得收藏：

| 场景 | 适合程度 |
|---|---|
| 想在本地跑多模态大模型 | 很适合 |
| 显卡只有 8G / 12G 显存 | 很适合 |
| 想研究 GGUF 和 llama.cpp | 很适合 |
| 想做本地 AI 助手 / Agent | 适合 |
| 想完全替代云端顶级模型 | 不建议这样理解 |
| 只想点一下就用，不想看命令 | 更建议先用 LM Studio / Ollama |

---

## 推荐硬件配置

这不是“只要 8G 显存就够了”。真正影响体验的是 **显存 + 内存 + 硬盘 + 推理参数**。

| 硬件 | 建议配置 |
|---|---|
| 显卡 | NVIDIA 8G 显存起步，RTX 3070 / RTX 4060 Ti 8G / RTX 3060 12G 更稳 |
| 内存 | 32GB 起步，64GB 更推荐 |
| 硬盘 | 至少预留 40GB 以上空间 |
| 系统 | Windows 10/11 或 Linux |
| 推理框架 | llama.cpp |
| 模型格式 | GGUF |
| 推荐量化 | UD-Q4_K_M / Q4_K_M / Q4_K_S，根据内存和显存调整 |

> 如果你只有 16GB 内存，不建议直接尝试 35B。可以先从 7B、14B、30B-A3B 这类模型开始。

---

## 一、为什么 8G 显存能跑 35B？

关键不是玄学优化，而是三件事叠加：

1. **MoE 稀疏激活**
2. **GGUF 量化**
3. **llama.cpp CPU Offload 混合推理**

### 1. MoE：总参数大，但每次只激活一部分

传统 Dense 模型在推理时通常要参与大量参数计算，显存压力很高。

MoE 模型不同。它虽然总参数很多，但每个 token 只会路由到部分专家。以 Qwen3.6-35B-A3B 为例，模型总参数量是 35B，但活跃参数约 3B。

可以这样理解：

```text
Dense 模型：每次都要调动一整支大军
MoE 模型：每次只派出最相关的几个专家小队
```

所以 MoE 模型特别适合做“显存不够，但内存还算充足”的混合推理。

---

### 2. GGUF 量化：降低模型体积和内存压力

GGUF 是 llama.cpp 生态里常用的模型格式。

量化的作用是把模型权重从高精度压缩到更低位宽，从而减少显存和内存占用。常见量化有：

| 量化 | 特点 |
|---|---|
| Q8 / FP16 | 质量更高，但资源需求大 |
| Q5_K_M | 质量较好，资源压力仍然偏高 |
| Q4_K_M / UD-Q4_K_M | 质量与资源比较平衡 |
| Q3 系列 | 更省资源，但质量可能下降 |

8G 显存用户不建议直接上 Q8 或 FP16。更稳的选择是：

```text
UD-Q4_K_M
Q4_K_M
Q4_K_S
```

如果仍然爆显存或内存，可以再降到 Q3 系列测试。

---

### 3. llama.cpp CPU Offload：把专家层放到系统内存

llama.cpp 的核心优势是轻量、跨平台、支持多种后端，并且可以做 CPU + GPU 混合推理。

这套方案的关键参数是：

```text
--cpu-moe
```

或者更精细一点：

```text
--n-cpu-moe N
```

它的作用是把 MoE 专家权重保留在 CPU/RAM 中，让 GPU 优先处理更高频、更适合显卡计算的部分。

简单理解：

| 硬件 | 负责内容 |
|---|---|
| GPU 显存 | 高频计算、部分层、注意力、KV Cache |
| CPU + 系统内存 | 庞大的 MoE 专家权重 |
| 硬盘 | 只负责存放模型文件，不应该参与频繁交换 |

> 注意：如果系统内存不够，Windows 把模型数据换到虚拟内存，速度会明显变慢，甚至卡死。

---

## 二、下载 llama.cpp

打开 llama.cpp 的 GitHub Releases 页面，下载适合自己显卡的构建包。

| 设备 | 推荐选择 |
|---|---|
| NVIDIA 显卡 | Windows x64 CUDA 版本 |
| AMD 显卡 | Vulkan / HIP 版本 |
| Intel 核显或独显 | SYCL 版本 |
| 没有独显 | CPU 版本 |

NVIDIA 用户不要机械理解成“30 系只能 CUDA 12，40 系只能 CUDA 13”。

更稳的做法是：

1. 先更新 NVIDIA 显卡驱动；
2. 新手优先尝试 CUDA 12 构建；
3. 如果驱动较新，再测试 CUDA 13 构建；
4. 启动日志里确认是否真的加载了 GPU backend。

---

## 三、下载模型文件

推荐使用 GGUF 版本，例如：

```text
unsloth/Qwen3.6-35B-A3B-GGUF
```

如果你要使用图片识别、多模态输入，还需要下载视觉投影文件：

```text
mmproj-F16.gguf
```

建议下载：

```text
主模型：Qwen3.6-35B-A3B-UD-Q4_K_M.gguf
视觉组件：mmproj-F16.gguf
```

多模态模型不是只下载一个主模型就完事。  
如果没有 `mmproj` 文件，网页里即使能聊天，也可能无法正确识别图片。

---

## 四、推荐目录结构

建议把 llama.cpp 和模型放在一个干净目录，避免中文路径、空格路径、OneDrive 同步路径。

例如：

```text
D:\AI\llama.cpp\
```

目录结构建议如下：

```text
llama.cpp/
├─ llama-server.exe
├─ llama-cli.exe
├─ models/
│  ├─ Qwen3.6-35B-A3B-UD-Q4_K_M.gguf
│  └─ mmproj-F16.gguf
└─ start-qwen36.bat
```

这样后续排查最省事。

---

## 五、Windows 一键启动脚本

在 llama.cpp 根目录新建：

```text
start-qwen36.bat
```

右键编辑，填入下面内容。

### 方案 A：本地模型文件启动

适合已经手动下载好模型文件的用户，国内网络环境也更稳。

```bat
@echo off
chcp 65001 >nul

set MODEL=.\models\Qwen3.6-35B-A3B-UD-Q4_K_M.gguf
set MMPROJ=.\models\mmproj-F16.gguf

.\llama-server.exe ^
  -m "%MODEL%" ^
  --mmproj "%MMPROJ%" ^
  --host 127.0.0.1 ^
  --port 8080 ^
  -ngl 99 ^
  --cpu-moe ^
  --flash-attn on ^
  --ctx-size 8192 ^
  -t 10 ^
  -b 512 ^
  -ub 512 ^
  --mlock ^
  --jinja ^
  --chat-template-kwargs "{\"enable_thinking\":false}"

pause
```

启动成功后打开：

```text
http://127.0.0.1:8080
```

---

### 方案 B：联网自动加载 Hugging Face 模型

适合网络环境比较好的用户。

```bat
@echo off
chcp 65001 >nul

set LLAMA_CACHE=%CD%\models-cache

.\llama-server.exe ^
  -hf unsloth/Qwen3.6-35B-A3B-GGUF:UD-Q4_K_M ^
  --host 127.0.0.1 ^
  --port 8080 ^
  -ngl 99 ^
  --cpu-moe ^
  --flash-attn on ^
  --ctx-size 8192 ^
  -t 10 ^
  -b 512 ^
  -ub 512 ^
  --mlock ^
  --jinja ^
  --chat-template-kwargs "{\"enable_thinking\":false}"

pause
```

如果你在国内网络环境下使用，优先推荐方案 A。

---

## 六、关键参数解释

### `-ngl 99`

`-ngl` 是 `--gpu-layers` 的缩写，表示尽可能把模型层放到 GPU。

```text
-ngl 99
```

它不是保证 99 层全部进显存，而是让 llama.cpp 尽量使用 GPU。低显存场景下通常需要配合 `--cpu-moe`。

---

### `--cpu-moe`

这是本教程最关键的参数。

```text
--cpu-moe
```

作用是把 MoE 权重留在 CPU/RAM 中，减少显存压力。

如果你想做更细的调优，可以使用：

```text
--n-cpu-moe 32
```

意思是让前 32 层 MoE 权重保留在 CPU。  
不同机器最优值不一样，需要自己测试。

---

### `--flash-attn on`

开启 Flash Attention。

```text
--flash-attn on
```

它通常可以降低 KV Cache 压力，对长上下文更友好。

如果启动报错，可以先改成：

```text
--flash-attn auto
```

或者直接去掉该参数。

---

### `--ctx-size 8192`

上下文长度。

```text
--ctx-size 8192
```

虽然 Qwen3.6 原生上下文很长，但低显存机器不要一上来开 128K 或 256K。  
8G 显存建议先从 4096 或 8192 开始。

| 配置 | 建议上下文 |
|---|---|
| 8G 显存 + 32GB 内存 | 4096 / 8192 |
| 8G 显存 + 64GB 内存 | 8192 / 16384 |
| 12G 显存 + 64GB 内存 | 16384 起步 |
| 24G 显存 + 64GB 内存 | 32768 或更高 |

---

### `-t 10`

CPU 线程数。

```text
-t 10
```

线程数不是越高越好。  
设置太高可能引发内存带宽竞争和线程调度开销，反而变慢。

| CPU | 建议线程 |
|---|---|
| 6 核 12 线程 | 6 到 10 |
| 8 核 16 线程 | 8 到 12 |
| 12 核以上 | 12 到 16 起步测试 |

---

### `-b 512` 和 `-ub 512`

```text
-b 512
-ub 512
```

`-b` 是 batch size，影响 prompt 处理吞吐。  
`-ub` 是 micro batch size，影响显存占用和实际执行分块。

8G 显存建议先用：

```text
-b 512 -ub 512
```

跑稳后再试：

```text
-b 1024 -ub 1024
```

如果爆显存，再降回 512 或 256。

---

### `--mlock`

```text
--mlock
```

作用是尽量把模型数据锁在内存里，避免被系统换到硬盘虚拟内存。

如果你的内存只有 32GB，开启它可能更稳，也可能因为内存紧张导致启动失败。  
失败就先去掉这个参数。

---

### `--jinja`

```text
--jinja
```

启用模型自带的 chat template。  
Qwen 系列模型建议保留。

---

### `--chat-template-kwargs "{\"enable_thinking\":false}"`

关闭 thinking 模式。

```text
--chat-template-kwargs "{\"enable_thinking\":false}"
```

适合普通聊天、图片识别、前端页面生成、快速测试。

如果你要做复杂推理，可以改成：

```text
--chat-template-kwargs "{\"enable_thinking\":true}"
```

但 thinking 模式通常更慢，也更吃上下文。

---

## 七、8G 显存推荐三套参数

### 稳定优先

适合第一次启动，先确认能跑起来。

```bat
.\llama-server.exe ^
  -m ".\models\Qwen3.6-35B-A3B-UD-Q4_K_M.gguf" ^
  --mmproj ".\models\mmproj-F16.gguf" ^
  --host 127.0.0.1 ^
  --port 8080 ^
  -ngl 99 ^
  --cpu-moe ^
  --flash-attn on ^
  --ctx-size 4096 ^
  -t 8 ^
  -b 512 ^
  -ub 512 ^
  --jinja ^
  --chat-template-kwargs "{\"enable_thinking\":false}"
```

---

### 平衡体验

适合 8G 显存 + 32GB/64GB 内存用户。

```bat
.\llama-server.exe ^
  -m ".\models\Qwen3.6-35B-A3B-UD-Q4_K_M.gguf" ^
  --mmproj ".\models\mmproj-F16.gguf" ^
  --host 127.0.0.1 ^
  --port 8080 ^
  -ngl 99 ^
  --cpu-moe ^
  --flash-attn on ^
  --ctx-size 8192 ^
  -t 10 ^
  -b 512 ^
  -ub 512 ^
  --mlock ^
  --jinja ^
  --chat-template-kwargs "{\"enable_thinking\":false}"
```

---

### 速度优先

适合已经能稳定启动后继续调参。

```bat
.\llama-server.exe ^
  -m ".\models\Qwen3.6-35B-A3B-UD-Q4_K_M.gguf" ^
  --mmproj ".\models\mmproj-F16.gguf" ^
  --host 127.0.0.1 ^
  --port 8080 ^
  -ngl 99 ^
  --n-cpu-moe 32 ^
  --flash-attn on ^
  --ctx-size 8192 ^
  -t 10 ^
  -b 1024 ^
  -ub 1024 ^
  --mlock ^
  --jinja ^
  --chat-template-kwargs "{\"enable_thinking\":false}"
```

如果爆显存，按顺序调整：

```text
1. --n-cpu-moe 32 改回 --cpu-moe
2. --ctx-size 8192 降到 4096
3. -b 1024 降到 512
4. -ub 1024 降到 512
5. 换更低量化版本
```

---

## 八、启动成功后怎么用？

命令行窗口不要关闭。  
浏览器打开：

```text
http://127.0.0.1:8080
```

你会看到 llama.cpp 自带的 Web UI。

可以测试三类任务。

### 1. 图片识别

上传一张图片，让模型描述画面、识别文字、数物体、分析表格。

示例提示词：

```text
请仔细观察这张图片，先描述整体画面，再列出你能识别出的关键物体，最后给出数量判断。
```

---

### 2. 前端代码生成

适合测试 Qwen3.6 的代码能力。

示例提示词：

```text
请写一个单文件 HTML 页面：主题是 AI 本地部署教程落地页，要求有深色科技风、玻璃拟态卡片、渐变按钮、响应式布局，并且所有 CSS 和 JS 都写在一个 HTML 文件中。
```

---

### 3. 本地隐私任务

可以用它分析本地截图、合同片段、说明书、报错日志。

示例提示词：

```text
请分析这张截图里的报错信息，按“问题原因、解决步骤、验证命令”的格式输出。
```

---

## 九、常见问题排查

### 1. 双击 bat 一闪而过

脚本最后保留：

```bat
pause
```

这样可以看到报错信息。

---

### 2. 提示找不到 CUDA DLL

通常是 llama.cpp CUDA 版本和本地驱动 / 运行库不匹配。

建议按顺序处理：

1. 更新 NVIDIA 驱动；
2. 确认下载的是 Windows x64 CUDA 构建；
3. 新手优先测试 CUDA 12 版本；
4. 仍失败就换 Vulkan 版测试；
5. 启动日志里确认是否启用了 GPU backend。

---

### 3. 显存不足

优先降低这些参数：

```text
--ctx-size
-b
-ub
```

再考虑换量化版本：

```text
UD-Q4_K_S
Q4_K_S
Q3_K_M
```

---

### 4. 内存占用太高

可以尝试：

```text
去掉 --mlock
降低 --ctx-size
降低 batch
关闭其他大型软件
增加系统内存
```

如果系统频繁占满内存并开始读写硬盘，推理速度会断崖式下降。

---

### 5. 上传图片后没有视觉能力

检查是否加载了：

```text
mmproj-F16.gguf
```

本地启动时必须带：

```text
--mmproj ".\models\mmproj-F16.gguf"
```

如果使用 `-hf` 自动下载模型，也要观察启动日志，确认 mmproj 是否正确加载。

---

### 6. 速度很慢

优先检查：

1. 是否下载了 CPU 版而不是 CUDA 版；
2. 启动日志是否显示 GPU backend；
3. 任务管理器里 GPU 是否有计算占用；
4. 是否内存不足导致系统换页；
5. 参数是否开得太激进。

---

## 十、不要过度夸大本地模型能力

这类视频经常会出现一句话：

> 本地模型已经超过 ChatGPT、Gemini、Claude。

这个说法不够严谨。

更准确的表达是：

> 在某些图片识别、前端代码生成、长上下文或特定提示词任务中，本地 Qwen3.6-35B-A3B 可能表现非常亮眼，甚至在个别测试里优于云端模型。但这不代表它在所有任务上全面超过顶级闭源模型。

本地大模型的真正优势不是“全面碾压云端”，而是：

| 优势 | 说明 |
|---|---|
| 隐私 | 图片、日志、合同、代码可以本地处理 |
| 可控 | 参数、模型、上下文、接口都能自己调 |
| 低成本 | 跑起来后不按 token 计费 |
| 可集成 | 能接入本地 Agent、脚本、NAS、自动化工作流 |
| 可折腾 | 适合学习模型部署和推理优化 |

---

## 十一、适合新手的最终建议

如果你是第一次部署本地大模型，不建议一上来就追求极限速度。

推荐路线：

```text
第一步：先确认 llama.cpp 能启动
第二步：先跑 7B / 14B 模型熟悉流程
第三步：再下载 Qwen3.6-35B-A3B GGUF
第四步：先用 --cpu-moe 跑稳
第五步：再调 --ctx-size、-b、-ub、--n-cpu-moe
第六步：最后再测试图片识别和前端代码生成
```

最重要的一点：

> 能跑起来，比参数看起来高级更重要。  
> 跑稳以后，再一点点压榨性能。

---

## 十二、总结

这套方案的核心不是“8G 显存奇迹塞下 35B”，而是：

```text
MoE 稀疏激活
+ GGUF 量化
+ llama.cpp 混合推理
+ CPU/RAM 承载专家权重
+ GPU 负责高频计算
```

只要你有一张 8G 显存显卡，再配合足够系统内存，就可以在本地体验 35B 级别多模态模型。

它适合做：

- 图片识别
- 前端代码生成
- 本地隐私文档分析
- AI Agent 原型实验
- 个人知识库问答
- 本地自动化助手

这也是本地 AI 最有意思的地方：  
不是为了取代所有云端模型，而是把一部分真正属于自己的 AI 能力，部署在自己的电脑里。

---

## 参考资料

- Qwen3.6-35B-A3B Hugging Face 模型卡：`https://huggingface.co/Qwen/Qwen3.6-35B-A3B`
- llama.cpp server README：`https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md`
- Qwen 官方 llama.cpp 本地运行说明：`https://qwen.readthedocs.io/en/v2.0/run_locally/llama.cpp.html`
- OpenAI Codex IDE Extension：`https://developers.openai.com/codex/ide`
