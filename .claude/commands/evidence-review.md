# /evidence-review - 证据质证

## 功能说明

对新证据进行全面的质证分析，评估证据的三性（真实性、合法性、关联性），生成质证意见书和补充证据建议。

## 使用方式

### 基本用法
```bash
/evidence-review [参数]
```

### 参数选项

#### 必需参数
- `--evidence-path TEXT` - 证据文件路径（.pdf, .docx, .jpg, .png等）
- `--case-id TEXT` - 案件编号

#### 可选参数
- `--evidence-type [合同|发票|转账记录|聊天记录|邮件|录音|录像|照片|证言|鉴定报告|其他]` - 证据类型
- `--evidence-source [己方提供|对方提供|法院调取|第三方提供]` - 证据来源
- `--reviewer-name TEXT` - 质证人姓名
- `--output-dir TEXT` - 输出目录（默认：参见 [AgentMapping.md](../rules/AgentMapping.md) 中 EvidenceAnalyzer 的主要输出目录）

### 使用示例

#### 1. 合同质证
```bash
/evidence-review \
  --evidence-path "合同书.pdf" \
  --case-id "[2025]京0105民初1234号" \
  --evidence-type "合同" \
  --evidence-source "对方提供" \
  --reviewer-name "李四律师"
```

#### 2. 聊天记录质证
```bash
/evidence-review \
  --evidence-path "微信聊天记录.pdf" \
  --case-id "张三诉李四合同纠纷案" \
  --evidence-type "聊天记录" \
  --evidence-source "己方提供" \
  --reviewer-name "王五律师"
```

#### 3. 批量质证（目录）
```bash
/evidence-review \
  --evidence-path "证据材料/" \
  --case-id "[2025]京0105民初1234号" \
  --evidence-type "其他" \
  --reviewer-name "赵六律师"
```

## SubAgent 工作流

本命令对应 [Workflow.md](../rules/Workflow.md) 中定义的**场景2：新证据质证**工作流。

触发后按以下顺序调用 Agent：

1. **DocAnalyzer** - 解析证据文件，提取结构化信息
2. **EvidenceAnalyzer** - 三性质证分析（真实性、合法性、关联性），生成质证意见
3. **Researcher** - 检索相关法条和判例
4. **Writer** - 起草质证意见书和补充证据清单
5. **Summarizer** - 生成证据质证摘要

> 工作流完整定义和触发条件详见 [Workflow.md](../rules/Workflow.md)

## 输出目录概览

> 目录结构定义在 [AgentMapping.md](../rules/AgentMapping.md) 中，EvidenceAnalyzer 主要输出至 `05 - 📎 证据材料`

| 目录 | 负责Agent | 典型输出 |
| ------ | --------- | -------- |
| `05 - 📎 证据材料` | EvidenceAnalyzer | 质证意见书、补充证据建议、证据缺口分析 |
| `03 - 🔍 法律研究` | Researcher | 相关法条检索报告 |
| `06 - 📝 法律文书` | Writer | 质证意见书、证据目录 |
| `10 - 📊 综合报告` | Summarizer | 证据质证综合报告 |

> 文件命名和格式标准详见 [OutputStandards.md](../rules/OutputStandards.md)

## 技术实现说明

- **文档解析**：由 [DocAnalyzer](../agents/DocAnalyzer.md) 执行，支持 PDF、DOCX、图片等格式，遵循 [PDFProcessingRules.md](../rules/PDFProcessingRules.md)
- **三性分析**：由 [EvidenceAnalyzer](../agents/EvidenceAnalyzer.md) 执行，包括真实性、合法性、关联性的专业质证
- **文书生成**：由 [Writer](../agents/Writer.md) 执行，输出标准法律文书格式

## 相关命令

- `/new-case` - 创建新案件
- `/deepresearch` - 法律深度研究
