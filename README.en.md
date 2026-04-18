# session-digest

[中文](README.md)

Current version: `v1.0.5`

`session-digest` is a Codex/AI assistant skill for turning a conversation into long-lived Markdown material when the user says things like "summarize this chat", "wrap up", "session digest", or "总结一下".

## Design Origin and Positioning

This skill is inspired by `wrap-up` style session-closing tools: it also focuses on organizing conversation context at the end of a session so the result can be reviewed or handed off later.

The key difference is that `session-digest` is designed more directly for building a personal knowledge base. In addition to preserving project context, it actively scans the conversation for scattered reusable knowledge, such as concept explanations, tool usage, technical comparisons, practical principles, and reusable methods, then saves those pieces as standalone Markdown knowledge entries in the user's chosen knowledge repository.

In short, `wrap-up` is closer to a session handoff record; `session-digest` additionally extracts knowledge worth keeping beyond the project and turns it into searchable, accumulated personal knowledge assets.

## Core Outputs

1. Knowledge entries: reusable knowledge extracted from the conversation and saved as Obsidian-friendly Markdown files.
2. Project context report: a complete snapshot of the current project or task so a new AI instance can continue the work.

## File Structure

```text
.
├── SKILL.md
├── .session-digest.example.yml
├── README.md
├── README.en.md
└── LICENSE
```

## Installation

Copy this repository into your Codex skills directory:

```bash
mkdir -p "$HOME/.codex/skills/session-digest"
cp SKILL.md "$HOME/.codex/skills/session-digest/SKILL.md"
```

If you want to preconfigure the platform and knowledge repository path, copy the example config:

```bash
cp .session-digest.example.yml "$HOME/.codex/skills/session-digest/.session-digest.yml"
```

Then edit `.session-digest.yml` as needed:

```yaml
platform: codex
knowledge_repo: ~/knowledge-base
```

## Usage

In an AI environment that supports skills, trigger this skill with phrases such as:

```text
总结一下
wrap up
session digest
summarize this chat
help me organize this conversation
```

On first run, the skill confirms the current platform identifier and the general knowledge repository path. Later runs reuse `.session-digest.yml` from the same installed skill directory, so the configuration does not need to be repeated.

## Design Boundaries

- `SKILL.md` is the only required skill file.
- `.session-digest.yml` is local runtime configuration and may contain personal paths, so it is not committed to the repository.
- This repository does not include a concrete knowledge base directory or assume a fixed note structure beyond Obsidian-friendly Markdown.
- The current version does not provide automatic sync, scheduled summaries, or multi-device config merging, keeping the skill focused on its core responsibility.

## License

This repository is licensed under the MIT License. See `LICENSE`.
