# session-digest

当前版本：`v1.0.0`

`session-digest` 是一个 Codex/AI 助手 skill，用于在用户要求“总结一下”“wrap up”“session digest”等场景下，将当前对话整理为两类输出：

1. 可复用的通用知识条目，集中保存到用户指定的知识库。
2. 项目全景上下文报告，保存到当前项目目录，便于新的 AI 实例无缝接续工作。

## 文件结构

```text
.
├── SKILL.md
├── .session-digest.example.yml
├── VERSION
├── docs/
│   ├── CHANGELOG.md
│   └── DEMANDS.MD
├── tests/
│   └── release-version.test.mjs
└── package.json
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

## 验证

```bash
npm test
```

验证内容包括版本号一致性、README/CHANGELOG/DEMANDS 的版本记录，以及 skill frontmatter 的基础格式。

## 许可证

当前未指定开源许可证。未经作者另行授权，本仓库内容不默认授予开源使用权。
