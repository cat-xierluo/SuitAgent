---
name: sync-external
description: 跨项目文件同步 - 创建 @include 引用文件
---

# sync-external

跨项目文件同步工具。**在当前项目中创建 @include 引用文件**，指向其他项目的 commands/rules 文件。

---

## ⚡ 执行指令

当你收到此命令时，请按以下步骤执行：

### 1. 获取源文件路径

用户通过以下方式之一提供源文件路径：

**方式 A：直接提供完整文件路径（推荐）**
```
/sync-external /path/to/source-project/.claude/commands/some-command.md
```

**方式 B：提供项目路径 + 文件名**
```
/sync-external
源项目：/path/to/source-project
文件类型：command 或 rule
文件名：some-command.md
```

### 2. 验证源文件存在

使用 `test -f "{源文件路径}"` 验证文件存在。如果不存在，报错并退出。

### 3. 确定目标文件位置

根据源文件类型确定目标位置：
- 如果源文件在 `.../.claude/commands/` → 目标为 `{当前项目}/.claude/commands/{文件名}`
- 如果源文件在 `.../.claude/rules/` → 目标为 `{当前项目}/.claude/rules/{文件名}`

### 4. 创建引用文件

**重要**：创建的目标文件应**只包含一行** `@include` 指令，不要添加任何其他内容（包括 YAML frontmatter）。

```markdown
@include {源文件的绝对路径}
```

**示例**：
```markdown
@include ~/Library/Application Support/maoscripts/AutoWeave/.claude/commands/legal-proposal.md
```

### 5. 输出结果

```markdown
✅ 引用文件已创建

**目标文件**: .claude/commands/{文件名}
**源文件**: {源文件路径}
```

---

## ⚠️ 核心原则

| 原则 | 说明 |
|------|------|
| **只创建引用** | 目标文件只包含 `@include` 指令，不复制源文件内容 |
| **不添加额外内容** | 不要添加 YAML frontmatter、注释或其他内容 |
| **使用绝对路径** | `@include` 应使用源文件的绝对路径 |
| **单点维护** | 源文件修改后，所有引用项目自动同步 |

---

## 📋 完整示例

**输入**：
```
/sync-external ~/Library/Application Support/maoscripts/AutoWeave/.claude/commands/legal-proposal.md
```

**执行步骤**：
1. 验证源文件存在：`~/Library/Application Support/maoscripts/AutoWeave/.claude/commands/legal-proposal.md`
2. 确定目标位置：`{当前项目}/.claude/commands/legal-proposal.md`
3. 创建引用文件，内容如下：

```markdown
@include ~/Library/Application Support/maoscripts/AutoWeave/.claude/commands/legal-proposal.md
```

---

## 🔄 变更历史

| 版本 | 日期 | 更新内容 |
|:-----|:-----|:---------|
| v2.0.0 | 2026-01-08 | 重构：精简内容，突出执行指令，明确只创建 @include 引用 |
| v1.2.0 | 2026-01-08 | 智能路径检测，自动查找项目位置 |
| v1.0.0 | 2026-01-08 | 初始版本 |

---

*跨项目文件同步 - 创建 @include 引用，实现单点维护*
