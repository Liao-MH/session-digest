# session-digest

当前版本：`v1.0.3`

`session-digest` 是一个 Codex/AI 助手 skill，用于在用户要求“总结一下”“wrap up”“session digest”等场景下，将当前对话整理为可长期复用的 Markdown 资料。

## 设计来源与定位

这个 skill 的设计参考了 `wrap-up` 类会话收尾工具：它同样关注在一次对话结束时，把上下文整理成后续可接续、可回看的材料。

核心区别在于，`session-digest` 更偏向服务个人知识库构建。除了保存项目上下文，它会主动扫描对话中零散出现的通用知识，例如概念解释、工具使用方法、技术比较、经验原则和可复用方法论，并将这些内容整理为独立的 Markdown 知识条目，集中存入用户指定的知识库目录。

也就是说，`wrap-up` 更像是一次会话的交接记录；`session-digest` 额外把对话中值得长期沉淀的知识从项目脉络里提取出来，变成可检索、可积累的个人知识资产。

## 核心输出

1. 通用知识条目：从对话中抽取可复用知识，保存为 Obsidian 友好的 Markdown 文件。
2. 项目全景报告：保存当前项目或任务的完整上下文，便于新的 AI 实例继续工作。

## 文件结构

```text
.
├── SKILL.md
├── .session-digest.example.yml
└── LICENSE
```

## 安装方式

将本仓库复制到 Codex skills 目录：

```bash
mkdir -p "$HOME/.codex/skills/session-digest"
cp SKILL.md "$HOME/.codex/skills/session-digest/SKILL.md"
```

如果需要预配置平台和知识库路径，可以复制示例配置：

```bash
cp .session-digest.example.yml "$HOME/.codex/skills/session-digest/.session-digest.yml"
```

然后按需编辑 `.session-digest.yml`：

```yaml
platform: codex
knowledge_repo: ~/knowledge-base
```

## 使用方式

在支持 skills 的 AI 环境中，使用以下表达即可触发：

```text
总结一下
wrap up
session digest
summarize this chat
help me organize this conversation
```

首次运行时，skill 会确认当前平台标识和通用知识库路径。之后同一安装目录下会复用 `.session-digest.yml`，无需重复配置。

## 设计边界

- `SKILL.md` 是唯一必需的 skill 主文件。
- `.session-digest.yml` 是本地运行配置，可能包含个人路径，因此不会提交到仓库。
- 本仓库不内置具体知识库目录，也不假设用户使用 Obsidian 以外的固定笔记结构。
- 当前版本不提供自动同步、自动定时总结或多设备配置合并功能，避免超出 skill 的核心职责。

## 许可证

本仓库使用 MIT License。详见 `LICENSE`。
