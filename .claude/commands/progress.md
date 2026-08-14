---
name: progress
description: 案件项目管理命令——自然语言更新案件进度（新增任务/推进任务/登记期限/更新阶段），明确操作直接路由 case_store CLI，语义复杂时主 Agent 执行 case-progress skill 的状态同步流程
---

# /progress - 更新案件进度

将自然语言描述的案件进度变更写入 case.yaml（唯一状态真值）。本命令是 case-progress skill 的编排入口（契约见 `.claude/rules/DataRules.md`）。

## 执行流程

1. **确定案件**：从参数或上下文确定案件短码（6 位数字）；不确定时先 `list` 再询问用户。
   ```bash
   python3 .claude/skills/case-progress/scripts/case_store.py list
   ```
2. **意图分类并路由**：
   - **明确操作**（新增任务 / 推进某任务 / 登记某期限 / 更新阶段）→ 先 `show` 确认 task_id 与现状，再执行对应 CLI：
     `add-task` / `set-status` / `add-deadline` / `set-stage`
   - **语义复杂**（"把这次庭审的结果同步进去"、"根据新判决书更新进度"）→ 主 Agent 直接执行 **case-progress skill 的"工作流收尾状态同步"流程**（加载状态 → 盘点产出 → 映射判断 → CLI 写回 → 校验汇报；见其 SKILL.md，不派 subagent）
   - **查看类**（"看下进度"）→ `show` 摘要汇报；跨案件总览建议 `/dashboard`
3. **保护规则**（DataRules）：
   - source=user 的任务被拒绝写入时，向用户说明并请其确认（或建议经看板操作）
   - "已结案"标记与阶段解锁是律师操作，不代行
   - 期限需含起算日与法律依据；信息不足时询问，不臆造
4. **校验汇报**：写入后 `validate` 确认，输出变更摘要（before → after）。

## 示例

- `/progress 260127 起诉状初稿完成了` → show 找到任务 → `set-status 260127 task_001 done`
- `/progress 251229 登记上诉期限，判决书 8 月 10 日送达` → `add-deadline 251229 上诉期限 --start 2026-08-10 --days 15 --end 2026-08-25 --basis "民诉法第171条，判决送达之日起15日"`
- `/progress 260221 立案了，案号下来了` → `set-stage` + 更新 法院案号（案号字段变更经状态同步流程或提示律师）
- `/progress 把今天的质证结果同步到案件里` → 执行状态同步流程（盘点产出 → 映射 → CLI 写回）
