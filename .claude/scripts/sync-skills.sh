#!/bin/bash
# sync-skills.sh
# 将 .claude/skills/ 中的符号链接替换为 legal-skills 源目录的实际拷贝
# 用法: bash .claude/scripts/sync-skills.sh [--dry-run]

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SKILLS_DIR="$PROJECT_DIR/.claude/skills"
SOURCE_DIR="/Users/maoking/Library/Application Support/maoscripts/skills/legal-skills/skills"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "[dry-run] 以下操作仅为预览，不会实际执行"
    echo ""
fi

# 需要同步的 skill 列表（符号链接）
SYNC_SKILLS=("md2word" "mineru-ocr" "skill-architect")

sync_count=0
skip_count=0
error_count=0

for skill in "${SYNC_SKILLS[@]}"; do
    link_path="$SKILLS_DIR/$skill"
    source_path="$SOURCE_DIR/$skill"

    # 检查源目录是否存在
    if [[ ! -d "$source_path" ]]; then
        echo "⚠️  跳过 $skill: 源目录不存在 ($source_path)"
        skip_count=$((skip_count + 1))
        continue
    fi

    # 检查当前状态
    if [[ -L "$link_path" ]]; then
        current_target=$(readlink "$link_path")
        action="替换符号链接"
    elif [[ -d "$link_path" ]]; then
        action="更新本地目录"
    else
        action="新建"
    fi

    echo "📦 $skill: $action"
    echo "   源: $source_path"

    if $DRY_RUN; then
        echo "   → [dry-run] 将删除并复制"
        sync_count=$((sync_count + 1))
        echo ""
        continue
    fi

    # 删除现有的符号链接或目录
    if [[ -L "$link_path" ]] || [[ -d "$link_path" ]]; then
        rm -rf "$link_path"
    fi

    # 复制源目录
    if cp -R "$source_path" "$link_path"; then
        # 复制成功后删除 .DS_Store
        find "$link_path" -name ".DS_Store" -delete 2>/dev/null || true
        echo "   ✅ 同步完成"
        sync_count=$((sync_count + 1))
    else
        echo "   ❌ 同步失败"
        error_count=$((error_count + 1))
    fi
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━"
if $DRY_RUN; then
    echo "预览完成: $sync_count 个将同步, $skip_count 个跳过"
else
    echo "同步完成: $sync_count 个已同步, $skip_count 个跳过, $error_count 个失败"
fi
