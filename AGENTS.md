# SuitAgent 法律智能分析系统

## 系统定位

SuitAgent 是面向律师的诉讼辅助系统，通过10个专业Agent处理诉讼全生命周期的分析工作。

## 核心工作模式

**两种入口，任选其一：**

1. **文档入口**：上传法律文档 → 自动识别类型 → 触发对应工作流
2. **场景入口**：描述需求（如"我收到了起诉状"）→ 自动匹配工作流

> 详细工作流定义见 [`.claude/rules/Workflow.md`](.claude/rules/Workflow.md)

## 协作核心原则

1. **理解用户意图优先** — 在执行任何操作前，先理解用户想要什么结果
2. **遵循工作流规范** — 使用预设工作流或自由组合Agent，减少手动操作
3. **保持上下文连贯** — 案件信息在Agent间传递时，确保关键信息不丢失
4. **输出到正确位置** — 每个Agent有固定的输出目录，遵循 [`.claude/rules/AgentMapping.md`](.claude/rules/AgentMapping.md)
5. **文档边界清晰** — 项目建设文档（`docs/`、`status/`）与案件档案（根目录案件文件夹）严格分开

## 重要指令

- Do what has been asked; nothing more, nothing less.
- NEVER create files unless they're absolutely necessary.
- ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (*.md) unless requested.

## 规范文件索引（按需查阅）

| 目录 | 何时查阅 |
|------|---------|
| `.claude/agents/` | 定义某个Agent的详细职责和输出格式 |
| `.claude/rules/` | 工作流、输出标准、时间规范等核心规则 |
| `.claude/skills/` | Skill的使用说明 |
| `.claude/commands/` | /new-case、/deepresearch 等命令用法 |
| `.claude/scripts/` | sync-skills.sh 等工具脚本 |
| `docs/` | 架构文档、路线图 |
| `status/` | 当前任务、变更记录、工作日志 |
