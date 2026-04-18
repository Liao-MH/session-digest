# DEMANDS

## v1.0.0 - 2026-04-18

### 用户原始需求

将 `session-digest` 这个 skill 发布到用户的 GitHub。

### 已确认需求细节

- 从本机已安装的 `session-digest` skill 生成可发布仓库。
- GitHub 目标账号为 `Liao-MH`。
- 仓库名称采用 `session-digest`。
- 首次发布版本号采用 `v1.0.0`。
- 发布内容需要包含 skill 主文件、README、需求记录、开发日志、版本记录和基础验证脚本。
- 不发布本地真实 `.session-digest.yml`，因为该文件包含个人知识库路径。
- 提供 `.session-digest.example.yml` 作为可手动复制的配置模板。

### 实现边界

- 仅整理和发布当前 skill，不额外开发自动同步、定时总结或云端服务能力。
- 不擅自添加开源许可证，避免替用户作出授权决定。
- 若本地缺少可创建 GitHub 仓库的认证工具，则先完成本地可发布仓库，并明确说明远端发布卡点。
