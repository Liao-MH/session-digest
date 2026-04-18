# CHANGELOG

## v1.0.0 - 2026-04-18

### 用户需求

用户要求将 `session-digest` skill 发布到 GitHub。

### 已做改动

- 版本号设为 `v1.0.0`，作为首次可发布版本。
- 从本机已安装 skill 复制并整理 `SKILL.md`。
- 收窄 `SKILL.md` frontmatter description，使其更符合 skill 触发描述规范。
- 新增 `.gitignore`，排除包含个人路径的 `.session-digest.yml`。
- 新增 `.session-digest.example.yml`，提供安全的配置模板。
- 新增 `README.md`，说明功能、安装、使用、边界和验证方式。
- 新增 `docs/DEMANDS.MD`，结构化记录本次发布需求。
- 新增 `VERSION` 与 `package.json`，记录版本。
- 新增 `tests/release-version.test.mjs`，验证版本一致性和 skill 基础格式。

### 影响文件

- `.gitignore`
- `.session-digest.example.yml`
- `README.md`
- `SKILL.md`
- `VERSION`
- `docs/CHANGELOG.md`
- `docs/DEMANDS.MD`
- `package.json`
- `tests/release-version.test.mjs`

### 验证结果

已执行并通过：

```bash
npm test
git diff --check
```
