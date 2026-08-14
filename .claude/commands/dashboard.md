---
name: dashboard
description: 启动/打开 SuitAgent 案件看板（case-dashboard skill 本地服务），支持 --review 周研判模式
---

# /dashboard - 案件看板

启动并打开本地案件看板服务（case-dashboard skill，端口 7879）。

## 执行流程

1. **健康检查**：`curl -s -m 2 http://127.0.0.1:7879/api/v1/overview` 判断服务是否存活。
2. **未运行则启动**：
   ```bash
   cd "<项目根>" && nohup python3 .claude/skills/case-dashboard/scripts/dashboard_server.py >/tmp/dashboard.log 2>&1 &
   ```
   启动后读 `/tmp/dashboard.log` 确认扫描案件数与写入引擎路径。
3. **打开浏览器**：`open http://127.0.0.1:7879`。
4. 已运行则直接打开并报告当前概况（从 overview 摘要：案件数 / 临期期限数）。

## /dashboard --review（周研判模式）

读取 `http://127.0.0.1:7879/api/v1/overview` 聚合 JSON，产出周研判报告（停滞案件、期限叠加风险、下一步建议）。
**护栏**：功能事实只以 case-dashboard skill 的 `references/manual.md` 为准；状态数字只以来自 API 的快照为准；快照没有的数据输出"未收录"，不得估算。

## 排障

- 端口被占：`lsof -ti:7879` 查进程（7879 本看板 / 8765 content-registry / 7878 idle-task-runner 互让）
- 扫描为空：确认在项目根启动（服务靠 cwd 向上发现案件目录，或 `--root` 显式指定）
- PyYAML 缺失：`pip3 install pyyaml`
- 某案件数据显示异常：读其 case.yaml / 遗留 yaml 定位格式问题，修复后续用（不要静默跳过）
