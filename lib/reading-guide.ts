export type ReadingGuide = {
  audience: string;
  outcome: string;
  checkpoints: { label: string; headingText: string }[];
  related: { slug: string; reason: string }[];
};

// Editorial summaries of the published articles, not new verification claims.
const readingGuides: Record<string, ReadingGuide> = {
  "mcp-explainer-ai-agent": {
    audience: "刚接触 AI Agent，想先理解 MCP 的读者。",
    outcome: "理解 AI 如何连接工具，分清 MCP、API、插件与 RAG。",
    checkpoints: [
      { label: "先理解概念", headingText: "一句话讲清楚 MCP" },
      { label: "比较常见术语", headingText: "MCP 和插件、API、RAG 有什么区别？" },
      { label: "了解权限边界", headingText: "MCP 很强，但权限必须管住" },
    ],
    related: [
      { slug: "mcp-categories-for-beginners", reason: "理解了 MCP，再根据自己的任务选择工具。" },
      { slug: "openclaw-2026-install-guide", reason: "准备动手搭建时，从 Agent 的安装与模型接入开始。" },
    ],
  },
  "mcp-categories-for-beginners": {
    audience: "已经听说 MCP，正在挑选第一批工具的读者。",
    outcome: "按搜索、文件、知识库等用途选择 MCP，了解权限与安装顺序。",
    checkpoints: [
      { label: "从搜索工具开始", headingText: "第一类：搜索和网页读取 MCP" },
      { label: "查看安装顺序", headingText: "新手最推荐的安装顺序" },
      { label: "对照选择清单", headingText: "普通人可以记住这张判断表" },
    ],
    related: [
      { slug: "mcp-explainer-ai-agent", reason: "如果几个概念还容易混淆，可以先补上这篇基础说明。" },
      { slug: "hermes-agent-2026-install-guide", reason: "继续了解怎样把模型、工具和消息渠道连成一个 Agent。" },
    ],
  },
  "openclaw-2026-install-guide": {
    audience: "希望在 Windows + WSL2 中搭建个人 AI Agent 的读者。",
    outcome: "按文中路线安装 OpenClaw、接入模型，并检查 Gateway 与 Dashboard。",
    checkpoints: [
      { label: "准备安装环境", headingText: "三、推荐安装路线" },
      { label: "启动与验证", headingText: "第六部分：启动与验证" },
      { label: "常见问题", headingText: "第八部分：常见问题" },
    ],
    related: [
      { slug: "hermes-agent-2026-install-guide", reason: "比较另一套 Agent 的安装、模型接入和消息网关配置。" },
      { slug: "mcp-categories-for-beginners", reason: "Agent 跑起来后，再按实际需求选择外部工具。" },
    ],
  },
  "hermes-agent-2026-install-guide": {
    audience: "希望在 Windows + WSL2 安装 Hermes，并连接云端或本地模型的读者。",
    outcome: "完成安装路线梳理，了解模型接入、消息网关和安装后的验收方法。",
    checkpoints: [
      { label: "准备环境与账号", headingText: "四、安装前你需要准备什么？" },
      { label: "检查安装结果", headingText: "二十五、安装完成后的验收清单" },
      { label: "常见问题", headingText: "二十六、常见问题" },
    ],
    related: [
      { slug: "qwen36-35b-8gb-vram-llamacpp-local-guide", reason: "想继续尝试本地模型，可以先了解硬件、量化和混合推理。" },
      { slug: "openclaw-2026-install-guide", reason: "比较 OpenClaw 的模型接入、服务运行与维护方式。" },
    ],
  },
  "qwen36-35b-8gb-vram-llamacpp-local-guide": {
    audience: "有 8G 级显卡、愿意使用命令行，并准备研究本地模型的读者。",
    outcome: "理解显存与内存如何配合，按文中步骤配置 llama.cpp 并检查模型运行。",
    checkpoints: [
      { label: "先检查硬件", headingText: "推荐硬件配置" },
      { label: "查看启动方式", headingText: "五、Windows 一键启动脚本" },
      { label: "常见问题", headingText: "九、常见问题排查" },
    ],
    related: [
      { slug: "hermes-agent-2026-install-guide", reason: "模型运行后，继续了解如何通过兼容接口接入 Hermes Agent。" },
      { slug: "openclaw-2026-install-guide", reason: "了解另一条使用 Ollama 连接本地模型与 Agent 的路线。" },
    ],
  },
};

export function getReadingGuide(slug: string): ReadingGuide | undefined {
  return readingGuides[slug];
}
