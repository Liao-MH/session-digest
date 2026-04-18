---
name: session-digest
description: Use when the user asks to summarize or archive a session, such as "总结一下", "wrap up", "session digest", "summarize this chat", or equivalent phrasing, in file-system or non-file-system AI environments.
---

# Session Digest

Extract reusable knowledge entries from AI conversations and generate panoramic project context reports that allow a new AI instance to seamlessly continue the work.

## 1. Output Language Rule

This rule applies globally to ALL outputs of this skill — file names, titles, summaries, tags, report prose, and any other generated text.

**The output language is determined by the conversation language.** Specifically:
- If the conversation is conducted in a single language, use that language for all outputs.
- If the conversation contains multiple languages, use the language of the **user's most recent message** at the time of triggering.
- The `source` field in Knowledge entries is an exception: it preserves the original conversation verbatim without translation.

## 2. First-Run Initialization

On the first invocation in a given environment, confirm two things with the user:

### 2.1 Platform Identifier

Ask the user which platform they are currently using. Example values:
- `claude-code`
- `claude-ai`
- `chatgpt`
- `codex`
- Other (user-defined)

If the platform can be automatically inferred from environment information (e.g., terminal environment in Claude Code), use the inferred result and inform the user, who may correct it.

### 2.2 Knowledge Repository Path

Ask the user where they want general knowledge entries to be centrally stored. For example:
- `~/knowledge-base/`
- `/path/to/my/notes/ai-knowledge/`

This path is global — regardless of which platform or project the digest is called from, all Knowledge entries go into this same repository.

**In non-file-system environments**: Record the user's declared path (annotate the target path in the output so the user can manually save the content there).

**Persistence**: Save the platform identifier and knowledge repository path to the skill's own directory as a global config file: `skills/session-digest/.session-digest.yml`. This ensures the configuration is shared across all projects and does not need to be re-specified per project. Subsequent invocations read this file automatically without re-asking. Config format:

```yaml
platform: claude-code
knowledge_repo: ~/knowledge-base/
```

## 3. Trigger Condition

Manual trigger only. Execute when the user explicitly expresses intent to summarize. Do not auto-remind or proactively suggest summarizing at the end of a conversation.

Trigger phrases include but are not limited to: "总结一下", "总结", "wrap up", "session digest", "提炼一下", "summarize this chat", "help me organize this conversation".

## 4. Execution Flow

Upon triggering, execute two independent tasks in parallel: Knowledge entry extraction + Project report generation.

The two tasks are **parallel and non-overlapping**:
- Knowledge captures only general knowledge that remains valuable outside the current project context.
- Project report focuses only on project/task-related context and does not include general knowledge content.

---

### Task A: Knowledge Entry Extraction

#### A1. Scan the Conversation for General Knowledge

Review the entire conversation history and identify interactions containing reusable general knowledge.

**Should extract**:
- Concept explanations, principle descriptions, technical comparisons (e.g., "difference between conda and venv")
- Language features, framework usage, tool usage
- Protocol principles, algorithm logic
- General best practices, methodologies
- Anything that remains valuable to the user outside the current project context

**Should skip**:
- Purely project-related discussions (these go into the Project report)
- Purely instructional interactions ("change this line" → "done")
- Small talk, confirmations, conversation management ("ok", "continue", "thanks")
- Content the user asked to be generated (e.g., the email content from "write me an email")

**If the entire conversation contains no extractable general knowledge**: Skip the Knowledge section entirely, do not generate an empty file, and state "No general knowledge entries in this session."

#### A2. Generate Structured Entries

Each Knowledge entry contains:

| Field | Description |
|-------|-------------|
| title | Short title summarizing the core topic |
| tags | 2-5 tags for retrieval |
| summary | A few sentences distilling the core conclusion/takeaway (reorganized, not copied verbatim) |
| source | Complete original Q&A record (all related turns, no truncation) |

**Language**: title, summary, and tags follow the output language rule defined in Section 1. Source preserves the original conversation verbatim without translation.

#### A3. Output Knowledge File

**Filename format**: `{platform}_{session_title}_{YYYY-MM-DD}.md`

Where `session_title` is a brief summary of the conversation topic (in the output language per Section 1), limited to 3-8 words, connected by underscores, avoiding special characters.

Examples:
- `claude-code_WebSocket原理与调试_2026-04-14.md`
- `chatgpt_Python_env_management_comparison_2026-04-14.md`
- `codex_React_SSR_hydration_2026-04-14.md`

**Storage location**: The user-specified knowledge repository path. If the same platform + title + date already exists, append suffix `-2`, `-3`.

**In non-file-system environments**: Output the complete Markdown directly in the conversation, with the target path annotated at the top for user reference.

**Knowledge file template**:

The Knowledge file must use Obsidian-compatible Markdown. In particular, the original Q&A source uses Obsidian's foldable callout syntax (`> [!quote]-`) instead of HTML `<details>` tags, ensuring proper rendering in Obsidian.

```markdown
# Knowledge Digest
- **Date**: {YYYY-MM-DD}
- **Platform**: {platform}
- **Source Session**: {brief session topic description}

---

## 1. {title}
**Tags**: `{tag1}` `{tag2}` `{tag3}`

**Summary**: {summary}

> [!quote]- Original Q&A
> **Q**: {user's original question, fully preserved}
>
> **A**: {AI's original answer, fully preserved}
>
> **Q**: {follow-up question if any, continue}
>
> **A**: {continue}

---

## 2. {title}
...
```

**Callout format notes**:
- `> [!quote]-` creates a collapsed-by-default foldable callout in Obsidian. The user clicks to expand and see the full Q&A.
- Every line inside the callout must be prefixed with `>`.
- If the AI's answer contains code blocks, indent them properly within the callout (each line prefixed with `>`).
- In non-Obsidian Markdown renderers (e.g., GitHub), this degrades gracefully to a nested blockquote — content remains fully readable, just without the folding UI.

---

### Task B: Project Panoramic Report

#### B1. Objective

Generate a panoramic project context report. The core goal is: **handing this report to a completely new AI instance gives it enough context to seamlessly pick up and continue from where the work currently stands.**

This is not an itemized knowledge extraction — it is a coherent, structured narrative report. Do not worry about output length. Completeness takes priority over brevity — missing critical context is more harmful than a long report.

#### B2. Content Coverage

Provide a comprehensive report on everything discussed in the conversation that relates to the project or task. The report should outline all elements to such a degree that by giving this report to a new AI instance, it will have all the necessary context to pick up and continue from where things currently stand.

Do not limit yourself to a predefined set of dimensions. Let the conversation content dictate what the report covers and how it is structured. The report may touch on goals, decisions, rationale, current state, unresolved problems, plans, constraints, dependencies, user preferences, code architecture, environment setup, or anything else that emerged in the conversation — whatever is needed for full context transfer.

The only hard rule is: **err on the side of including too much rather than too little.** A new AI instance can skim past redundant context, but it cannot recover information that was omitted.

#### B3. Merge-Update Logic

The Project report is not regenerated from scratch each time — it is **merge-updated on top of the existing report**.

**Session-first confirmation** (applies to EVERY first invocation within the current session, regardless of whether project.md already exists):

Before generating or updating the Project report, briefly assess the current session's content and ask the user for confirmation:

1. Assess whether this session contains substantive project/task-related content (code changes, design decisions, debugging, implementation work, etc.) or is primarily knowledge-oriented (concept questions, tool comparisons, general how-tos with no clear project scope).
2. State the assessment and ask: **"This session appears to be [a development session / primarily a knowledge Q&A session]. Do you want to [generate / update] the Project Panoramic Report?"**
   - If the user says **no**: skip the Project report entirely for this invocation. State "Project Panoramic Report skipped for this session."
   - If the user says **yes**: proceed with generation or merge-update as described below.
3. If the skill is invoked **more than once within the same session**, skip this confirmation from the second invocation onward — the user's intent has already been established.

**First generation** (user confirmed yes, no existing project.md found):

Generate the full report directly from conversation content. Structure it however best fits the content.

**Merge-update** (user confirmed yes, existing project.md found):
1. Read the existing project.md
2. Understand its structure and content
3. Identify what the current conversation adds, changes, or invalidates:
   - New information → integrate it into the appropriate place in the report
   - Changed or overturned decisions → update in-place, do not retain outdated information
   - Resolved issues → reflect the resolution, remove or update the old description
   - Evolved understanding → rewrite the affected sections to reflect the current state of knowledge
4. The report's structure may evolve across updates — sections can be added, removed, merged, or reorganized as the project evolves
5. Update the `Last Updated` timestamp in the report header

**Key principle**: The merged report must be self-contained. The reader should not need to know how many update cycles this report has been through — it should read as if freshly written, reflecting the latest full picture.

#### B4. Output Project File

**Storage location**: `{platform}_Session_Digest/project.md` under the current project directory.

Example: If the project root is `/home/user/my-app/` and the platform is `claude-code`, output to:
`/home/user/my-app/claude-code_Session_Digest/project.md`

**In non-file-system environments**:
1. Infer the most likely project root directory from paths, file names, and other clues mentioned in the conversation.
2. Present the inferred result to the user for confirmation. For example: "Based on the conversation, I infer the project directory is `/home/user/my-app/`. The Project report will be stored at `/home/user/my-app/claude-ai_Session_Digest/project.md`. Is this correct?"
3. After confirmation, output the full report in the conversation with the target path annotated.

**If the conversation contains no project/task-related content**: Skip the Project section entirely, do not generate an empty report, and state "No project-related content in this session."

**Project report header**: Every project.md must begin with the following metadata block. Everything after it is free-form — structure the report however best serves the content.

```markdown
# Project Context Report

- **Project**: {project name}
- **Last Updated**: {YYYY-MM-DD}
- **Platform**: {platform}
- **Session Count**: {number of merge-updates this report has been through}

---

{free-form report content — structure determined by conversation content}
```

## 5. Edge Cases

- **No general knowledge and no project content**: Tell the user "This conversation was primarily operational — no content to archive."
- **Knowledge only, no Project**: Output only the Knowledge file, note that there is no project content.
- **Project only, no Knowledge**: Output only the Project report, note that there are no general knowledge entries.
- **Same topic discussed multiple times**: Knowledge entries merge into one (source includes all related turns); Project report reflects the final conclusion.
- **User corrected an AI error**: Knowledge summary records only the final correct conclusion; source fully preserves the entire process including the error. Project report retains only the correct information.
- **Cross-platform**: Knowledge files from different platforms go into the same repository but remain physically separate (filename includes platform identifier). Project reports are stored in platform-specific subdirectories; no cross-platform merging.
