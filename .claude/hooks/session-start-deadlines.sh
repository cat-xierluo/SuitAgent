#!/usr/bin/env bash
# SessionStart 期限预警：注入"未来 30 天临期期限与开庭"摘要（M6 零风险切片）
# 依据 DataRules.md 契约；只读不写，无阻断语义。脚本静默失败（项目外/引擎缺失时不打扰）。
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
CS="$ROOT/.claude/skills/case-progress/scripts/case_store.py"
[ -f "$CS" ] || exit 0
OUT="$(python3 "$CS" --root "$ROOT" report --days 30 2>/dev/null)" || exit 0
# 仅在有预警时输出（无临期不打扰）
echo "$OUT" | grep -q "⚠️" && echo "$OUT"
exit 0
