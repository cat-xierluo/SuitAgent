# SuitAgent Dashboard 本地服务（已迁入 case-dashboard skill）

> **v1.4.0 起，服务与前端迁至 case-dashboard skill**（legal-skills 源仓库，本项目经符号链接
> `.claude/skills/case-dashboard` 消费）。旧的根目录 `dashboard.html` 与 `scripts/dashboard_server.py`
> 已移除。推荐用 `/dashboard` 命令启动。

## 启动

```bash
# 方式一：命令（推荐，自动健康检查 + 启动 + 打开浏览器）
/dashboard

# 方式二：直接启动（在项目根运行）
python3 .claude/skills/case-dashboard/scripts/dashboard_server.py
```

默认监听 `http://127.0.0.1:7879`。参数：`--port`、`--host`、`--root`（默认
`SUITAGENT_ROOT` 环境变量，或从 cwd 向上发现含案件目录的祖先）。

## 数据源（5 种）

| 类型 | 格式 | 写回路径 |
| --- | --- | --- |
| **V** | **case.yaml v4.0（canonical，case-progress 契约）** | **经 case_store CLI（--actor user，行级 source 保护）** |
| A | yaml v2.1.0（英文 key，存量） | 行级 patch（M4 后消亡） |
| B | yaml v3.0（中文 key，存量） | 只读 |
| C | yaml 自定义中文（存量） | 只读 |
| D | 案件信息.md checkbox（存量） | checkbox 行级 patch（M4 后消亡） |
| none | 仅目录 | —（M4 迁移时补最小 case.yaml） |

新案件由 new-case v4.0 模板生成 case.yaml，天然 canonical。

## API（v1，版本化契约见 skill `references/API.md`）

| 路径 | 作用 |
| --- | --- |
| `GET /` | 返回看板前端（skill `assets/dashboard.html`） |
| `GET /api/v1/overview` | 全局聚合：案件统计 + 期限预警（三级告警 + 抵消过滤）+ 任务三态池 |
| `GET /api/v1/cases` | 案件列表摘要 |
| `GET /api/v1/case/<id>` | 单案件完整数据 |
| `GET /api/v1/project` | 项目 TASKS/JOURNAL/CHANGELOG 摘要 |
| `POST /api/v1/task/toggle` | 切换任务状态（V 案件经 case_store；A/D 遗留 patch） |
| `POST /api/v1/open` | macOS `open` 打开案件文件夹 |

## 端口约定

- 7879（SuitAgent Dashboard / case-dashboard skill）
- 8765（content-registry Dashboard）
- 7878（idle-task-runner Dashboard）

三个 skill 同时运行不冲突。
