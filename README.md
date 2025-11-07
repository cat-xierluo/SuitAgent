# SuitAgent - 诉讼法律服务智能分析系统

---

## 📖 项目介绍文章

想了解SuitAgent的完整设计思路和使用场景？查看详细文章：

**👉 [SuitAgent：基于Claude Code的AI代理诉讼法律服务系统](https://mp.weixin.qq.com/s/Atm48_tpp7bcQhT12P7Btg)**

---

## 👨‍💼 关于作者

我是一名律师，如想进一步交流，欢迎添加我的微信：

<div align="center">
  <img src="微信二维码.jpg" width="200" alt="微信二维码"/>
  <p><strong></strong></p>
</div>

---



## 项目概述

SuitAgent 是一个基于 **Claude Code 架构** 的诉讼法律服务智能分析系统，采用10个专业AI代理协作的模式，将复杂的诉讼案件分析分解为多个可独立执行的工作流，实现法律文书的工程化生成。

## ✨ 核心特性

- 🎯 **多阶段覆盖**：从诉前分析到判决执行，全流程支持
- 🚀 **一键启动**：上传文档即可自动分析，无需复杂配置
- 🔄 **灵活组合**：10个专业AI代理可自由组合使用
- 📊 **标准化输出**：统一的文档管理结构和命名规范
- 📱 **终端操作**：基于命令行界面，（并不）简单易用

## 📋 目录
- [项目概述](#项目概述)
- [核心特性](#-核心特性)
- [系统架构](#-系统架构)
- [10个AI代理介绍](#-10个ai代理介绍)
  - [1. DocAnalyzer - 文档分析](#1-docanalyzer文档分析)
  - [2. EvidenceAnalyzer - 证据分析](#2-evidenceanalyzer证据分析)
  - [3. IssueIdentifier - 争议识别](#3-issueidentifier争议识别)
  - [4. Researcher - 法律研究](#4-researcher法律研究)
  - [5. Strategist - 诉讼策略](#5-strategist诉讼策略)
  - [6. Writer - 法律文书](#6-writer法律文书)
  - [7. Summarizer - 摘要生成](#7-summarizer摘要生成)
  - [8. Reporter - 案件报告](#8-reporter案件报告)
  - [9. Scheduler - 日程规划](#9-scheduler日程规划)
  - [10. Reviewer - 智能审查](#10-reviewer智能审查)
- [安装指南](#-安装指南)
  - [前提条件：安装Node.js](#前提条件安装nodejs)
  - [第一步：安装Claude Code CLI](#第一步安装claude-code-cli)
  - [第二步：下载并安装Zed编辑器](#第二步下载并安装zed编辑器推荐新手)
  - [第三步：配置AI模型](#第三步配置ai模型)
  - [第四步：配置API密钥](#第四步配置api密钥)
  - [第五步：环境变量配置工具（可选）](#第五步环境变量配置工具可选)
  - [第六步：验证安装](#第六步验证安装)
- [快速开始](#-快速开始)
- [常见使用场景](#-常见使用场景)
- [文档管理](#-文档管理)
- [常见问题](#-常见问题)
- [实用工具链接](#-实用工具链接)

## 🏗️ 系统架构

SuitAgent 采用**四层架构设计**，将10个Agent按职能分为4个层级：

### 📊 Agent分层架构

```
┌─────────────────────────────────────────┐
│              输入层 (Input Layer)        │  文档数据采集与解析
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │  DocAnalyzer    │ │ EvidenceAnalyzer│ │
│  │   文档分析      │ │   证据分析      │ │
│  └─────────────────┘ └─────────────────┘ │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│              分析层 (Analysis Layer)     │  智能分析与研究
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │IssueIdentifier│ │   Researcher       │ │
│  │  争议识别    │ │   法律研究         │ │
│  └─────────────┘ └─────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │        Strategist                   │ │
│  │        诉讼策略                     │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│              输出层 (Output Layer)      │  文书生成与报告
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   Writer    │ │     Reporter        │ │
│  │  法律文书    │ │   报告整合         │ │
│  └─────────────┘ └─────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │        Summarizer                   │ │
│  │        摘要生成                     │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│            支持层 (Support Layer)       │  质量保证与辅助
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │  Scheduler  │ │     Reviewer        │ │
│  │  日程规划    │ │   智能审查         │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
```

### 🎯 架构优势

**分层设计带来以下优势**：
- ✅ **职责清晰**：每层专注于特定任务类型，避免功能重叠
- ✅ **松耦合**：层与层之间通过标准接口交互，便于维护和扩展
- ✅ **灵活组合**：可按需启用特定层级的Agent，支持增量更新
- ✅ **易于理解**：清晰的层次结构帮助用户快速理解系统工作原理

### 📋 各层职责说明

| 层级 | 职责 | 包含Agent |
|------|------|-----------|
| **输入层** | 文档数据采集与解析 | DocAnalyzer、EvidenceAnalyzer |
| **分析层** | 智能分析与研究 | IssueIdentifier、Researcher、Strategist |
| **输出层** | 文书生成与报告 | Writer、Reporter、Summarizer |
| **支持层** | 质量保证与辅助 | Scheduler、Reviewer |

### 🔄 典型工作流

**标准流程**：
```
输入层 → 分析层 → 输出层 → 支持层
  ↓        ↓        ↓        ↓
文档解析  争议识别  文书起草  质量审查
证据分析  法律研究  报告整合  日程规划
          策略制定  摘要生成
```

## 🤖 10个AI代理介绍

### 1. DocAnalyzer（文档分析）
**职责**：智能解析各类法律文档
- 📄 支持格式：PDF、Word、图片（OCR识别）
- 📝 提取信息：案由、当事人、诉讼请求、事实理由、关键时间
- 🎯 适用场景：起诉状、答辩状、庭审笔录、判决书、证据材料
- ✅ 质量保证：内嵌验证机制，自动检测提取准确性

### 2. EvidenceAnalyzer（证据分析）
**职责**：深度分析证据材料
- 🔍 证据分类：直接证据、间接证据、传来证据
- 📊 证明力评估：评分系统（1-10分）
- ⚠️ 薄弱环节：自动识别证据不足的地方
- 📋 补充建议：生成补充证据清单
- ✅ 质量保证：内嵌验证机制，交叉验证证据链

### 3. IssueIdentifier（争议识别）
**职责**：精准识别争议焦点
- 🎯 核心争点：提取案件本质争议
- 🏷️ 法条归类：自动关联相关法律条文
- 📐 逻辑关系：分析当事人法律关系
- 🔄 动态更新：根据新证据调整争议点
- ✅ 质量保证：内嵌验证机制，确保焦点识别的准确性

### 4. Researcher（法律研究）
**职责**：全方位法律研究
- 📚 判例检索：相似案例智能匹配
- 📖 法条解读：深入分析法律条文
- 🔗 适用路径：提供法律适用建议
- 🔄 迭代优化：根据检索结果自动优化关键词
- ✅ 质量保证：内嵌验证机制，确保法律研究准确性

### 5. Strategist（诉讼策略）
**职责**：制定诉讼策略方案
- ⚖️ SWOT分析：优势、劣势、机会、威胁
- 📈 风险评估：量化诉讼风险（高/中/低）
- 🎯 策略建议：多套可行方案
- 📊 胜率分析：基于案例数据的成功率预测
- ✅ 质量保证：专项审查流程，确保策略合理性

### 6. Writer（法律文书）
**职责**：专业法律文书起草
- 📝 12种文书：起诉状、答辩状、代理词、上诉状等
- 🎨 模板库：内置标准化文书模板
- ✏️ 个性化：根据案件特点定制内容
- 📏 格式规范：符合法院要求的格式
- ✅ 质量保证：专项审查，确保文书专业性

### 7. Summarizer（摘要生成）
**职责**：生成各类精简摘要
- 📄 执行摘要：3分钟了解全案
- ⚠️ 风险摘要：重点突出风险点
- 💡 建议摘要：可执行的行动建议
- 📊 数据摘要：关键数据可视化
- ✅ 质量保证：内嵌验证机制，确保摘要准确性

### 8. Reporter（案件报告）
**职责**：生成综合性分析报告
- 📑 结构化报告：专业的报告格式
- 📈 多格式输出：Markdown、Word、PDF
- 📊 图表生成：可视化数据展示
- 🔄 自动整合：汇总所有代理的分析结果
- ✅ 质量保证：最终审查，确保报告完整性

### 9. Scheduler（日程规划）
**职责**：期限管理与工时统计
- ⏰ 期限计算：自动计算各类法定期限
- 📅 时间线管理：可视化案件进展
- 📊 工时统计：详细的工作时间记录
- 🔔 智能提醒：重要期限提前预警
- ✅ 质量保证：内嵌验证机制，确保计算准确性

### 10. 🆕 Reviewer（智能审查）
**职责**：质量把关专家
- 🔍 跨Agent审查：全面审查所有输出质量
- 📏 规范检查：格式、逻辑、完整性检查
- ⚠️ 风险识别：预警潜在问题
- ⭐ 质量评级：A/B/C/D四级评分
- 🎯 改进建议：提供具体修改意见
- ✅ 质量保证：专业质量把关，确保输出质量

## 🛠️ 安装指南

### 前提条件：安装Node.js

SuitAgent 基于 **Claude Code CLI** 运行，而Claude Code CLI需要Node.js环境。

**方式一：使用Homebrew（推荐，macOS）**：
```bash
brew install node
```

**方式二：使用nvm（推荐，管理多版本）**：
```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端，然后安装最新LTS版本
nvm install --lts
nvm use --lts
nvm alias default --lts
```

**方式三：官网下载安装包**：
- 访问 [Node.js官网](https://nodejs.org/)
- 下载适合您操作系统的LTS版本（长期支持版）
- 运行安装包，按提示完成安装

**验证安装**：
```bash
node --version  # 应显示v18.x.x或更高版本
npm --version   # 应显示9.x.x或更高版本
```

### 第一步：安装Claude Code CLI

SuitAgent 基于 **Claude Code CLI** 运行，这是终端中的AI助手。

**使用npm安装**：
```bash
npm install -g @anthropic-ai/claude-code
```

**检查是否安装成功**：
```bash
claude --version
```

### 第二步：下载并安装Zed编辑器（推荐新手）

- 访问 [Zed官网](https://zed.dev/)
- 下载适合您操作系统的版本
- 安装并打开Zed

### 第三步：配置AI模型

访问以下平台获取API密钥（推荐国产大模型）：

- **[智谱AI开放平台](https://open.bigmodel.cn/)** - GLM-4.6
- **[月之暗面开放平台](https://platform.moonshot.cn/)** - kimi-k2-turbo
- **[MiniMax开放平台](https://www.minimaxi.com/)** - MiniMax-M2
- **[DeepSeek开放平台](https://platform.deepseek.com/)** - DeepSeek-V3.2

### 第四步：配置API密钥

创建配置文件：
```bash
cd /path/to/SuitAgent
nano .claude/settings.local.json
```

**配置示例**（智谱AI）：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_MODEL": "GLM-4.6",
    "ANTHROPIC_SMALL_FAST_MODEL": "GLM-4.6",
  }
}
```

**配置示例**（月之暗面）：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_api_key_here",
    "ANTHROPIC_BASE_URL": "https://api.moonshot.cn/anthropic",
    "ANTHROPIC_MODEL": "kimi-k2-turbo-preview",
    "ANTHROPIC_SMALL_FAST_MODEL": "kimi-k2-turbo-preview"
  }
}
```

**配置示例**（MiniMax）：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_BASE_URL": "https://api.minimaxi.com/anthropic",
    "ANTHROPIC_MODEL": "MiniMax-M2",
    "ANTHROPIC_SMALL_FAST_MODEL": "MiniMax-M2"
  }
}
```

**配置示例**（DeepSeek）：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_MODEL": "DeepSeek-V3.2-Exp",
    "ANTHROPIC_SMALL_FAST_MODEL": "DeepSeek-V3.2-Exp"
  }
}
```

### 第五步：环境变量配置工具（可选）
如果需要频繁切换不同AI模型服务或API密钥，推荐使用 **cc-switch** 工具进行环境变量管理。

#### 推荐安装方式：图形化应用（各平台）

**macOS用户（推荐）**：
```bash
# 通过Homebrew安装图形化应用
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

**Windows用户**：
- 访问 [GitHub Releases](https://github.com/farion1231/cc-switch/releases)
- 下载 `CC-Switch-v{版本号}-Windows.msi` 安装包
- 运行安装程序完成安装
- 或下载 `CC-Switch-v{版本号}-Windows-Portable.zip` 绿色版

**Linux用户**：
- 访问 [GitHub Releases](https://github.com/farion1231/cc-switch/releases)
- 下载 `CC-Switch-v{版本号}-Linux.deb` 包
- 运行 `sudo dpkg -i CC-Switch-v{版本号}-Linux.deb` 安装
- 或下载 `CC-Switch-v{版本号}-Linux.AppImage` 安装包

#### 备选安装方式：命令行工具（开发者）
```bash
npm install -g cc-switch
```

### 第六步：验证安装

**运行测试命令**：
```bash
claude --help
```

详见[安装指南](#-安装指南)中的"第三步：配置AI模型"。

## 🚀 快速开始

### 最简单的使用方法（推荐新手）

**1. 下载并安装Zed编辑器**
- 访问 [Zed官网](https://zed.dev/)
- 下载适合您操作系统的版本
- 安装并打开Zed

**2. 在Zed中打开SuitAgent项目**
- 点击 `File` → `Open Folder`
- 选择SuitAgent文件夹
- 项目将在Zed中打开

**3. 在Zed中启动终端**
- 按 `Cmd + ``（反引号，数字1旁边的键）
- 或点击底部状态栏的终端图标
- 终端会自动在项目目录中打开

**4. 启动SuitAgent**
```bash
claude
```

**5. 上传文件开始分析**
```
您：我收到了一份起诉状，需要应诉
系统：[自动启动工作流 → 生成答辩状]
```

**6. 在Zed中查看结果**
- 文件树自动显示生成的文件夹
- 双击文件即可查看内容
- 输出文件保存在 `output/[案件编号]/` 目录

## 🎯 常见使用场景

### 场景1：收到起诉状（被告应诉）
**您只需说**：
- "收到起诉状"
- "需要应诉"
- "准备答辩"

**系统自动执行**：
```
1. DocAnalyzer(分析起诉状) → [内嵌验证]
2. IssueIdentifier(识别争议焦点) → [内嵌验证]
3. Researcher(法律检索) → [内嵌验证]
4. Strategist(制定应诉策略) → [专项审查]
5. Writer(起草答辩状) → [专项审查]
6. Reviewer(自动触发，质量审查) → [跨Agent质量把关]
7. Summarizer(生成摘要) → [内嵌验证]
8. Reporter(整合报告) → [最终审查]
```

**输出成果**：
- ✅ 争议焦点分析
- ✅ 法律检索报告
- ✅ 应诉策略方案
- ✅ 答辩状草稿
- ✅ 证据清单
- ✅ 完整案件报告

### 场景2：新证据质证
**您只需说**：
- "有新证据"
- "需要质证"
- "证据审查"

**系统自动执行**：
```
DocAnalyzer(分析新证据) + EvidenceAnalyzer(证据分析) → Researcher(针对性法条研究) → Writer(质证意见书) → Summarizer(证据摘要)
```


### 场景3：庭审后分析
**您只需说**：
- "庭审结束"
- "分析庭审"
- "调整策略"

**系统自动执行**：
```
DocAnalyzer(庭审笔录分析) → EvidenceAnalyzer(对比前后证据) → Strategist(调整策略) → Summarizer(庭审摘要) → Reporter(阶段报告)
```


### 场景4：原告起诉（完整起诉流程）
**您只需说**：
- "准备起诉"
- "委托起诉"
- "需要起诉状"

**系统自动执行**：
```
DocAnalyzer(案件材料分析) → IssueIdentifier(识别争议焦点) → Researcher(法律检索) → EvidenceAnalyzer(证据分析) → Writer(起诉状) → Writer(证据目录) → Summarizer(案件摘要) → Reporter(整合完整起诉包)
```


### 场景5：诉前咨询（出具服务方案）
**您只需说**：
- "客户咨询"
- "初步沟通"
- "需要服务方案"

**系统自动执行**：
```
DocAnalyzer(沟通记录分析) → IssueIdentifier(识别客户需求) → Strategist(制定服务方案) → Writer(法律服务方案书) → Summarizer(方案摘要)


## 📊 自动化工作流编排

SuitAgent 采用**智能工作流编排**技术，能够：

1. **自动识别文件类型** - 起诉状、证据、庭审笔录等
2. **自动分析使用场景** - 应诉、分析、新证据等
3. **自动规划流程** - 选择最佳工作流组合
4. **一键执行** - 无需手动选择，自动完成

### 自动识别规则

| 文件类型 | 识别关键词 | 自动场景 | 建议工作流 |
|----------|------------|----------|-----------|
| **起诉状** | "原告"、"被告"、"诉讼请求" | 被告应诉 | DocAnalyzer → IssueIdentifier → Researcher → Strategist → Writer |
| **证据材料** | "证据"、"附件"、"证明" | 证据质证 | DocAnalyzer + EvidenceAnalyzer → Researcher → Writer |
| **庭审笔录** | "庭审"、"审判员"、"当事人" | 庭审后分析 | DocAnalyzer → EvidenceAnalyzer → Strategist |
| **判决书** | "判决"、"裁定"、"法院认为" | 判决分析 | DocAnalyzer → IssueIdentifier → Researcher |
| **律师函** | "律师函"、"催告函" | 法律催告 | DocAnalyzer → Strategist → Writer |


## ❓ 常见问题（FAQ）

### Q1: 我是律师但不太懂技术，能用SuitAgent吗？
**A**: 当然可以！推荐使用Zed编辑器：

**使用Zed（推荐新手）**：
1. 下载安装 [Zed编辑器](https://zed.dev/)
2. 在Zed中打开SuitAgent项目
3. 按 `Cmd + `` 打开内置终端
4. 输入简单指令，如："我收到起诉状，需要应诉"
5. 上传文档，系统自动完成所有工作

### Q2: 没有Claude账号怎么办？
**A**: SuitAgent 推荐使用国产大模型，无需海外账号：
- 智谱AI（GLM-4.6）- 推荐⭐⭐⭐⭐⭐
- 月之暗面（kimi-k2-turbo）- 推荐⭐⭐⭐⭐⭐
- MiniMax（MiniMax-M2）- 推荐⭐⭐⭐⭐（免费使用）
- DeepSeek（DeepSeek-V3.2）- 推荐⭐⭐⭐⭐

详见[安装指南](#-安装指南)中的"第三步：配置AI模型"。

### Q2: 如何快速切换不同AI模型？
**A**: 推荐使用cc-switch工具：

#### 方式一：图形化应用（推荐）

**macOS用户**：
```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```
然后从启动台或应用程序文件夹中打开cc-switch。

**Windows/Linux用户**：
- 访问 [GitHub Releases](https://github.com/farion1231/cc-switch/releases)
- 下载对应系统的安装包
- 安装后运行cc-switch应用
- 在应用中点击选择AI模型服务商即可

#### 方式二：命令行工具（开发者）
```bash
npm install -g cc-switch

# 快速切换模型
cc-switch use zhipu   # 切换到智谱AI
cc-switch use moonshot # 切换到月之暗面
cc-switch use minimax # 切换到MiniMax
cc-switch use deepseek # 切换到DeepSeek

# 查看当前配置
cc-switch current
```

详见[安装指南](#-安装指南)中的"第五步：环境变量配置工具（可选）"。

### Q3: 终端是什么？怎么打开？
**A**: 终端是电脑中的命令行工具，操作简单就像发微信。

**打开方式**：
- **macOS**：按 `Cmd + 空格`，输入"终端"或"Terminal"
- **Windows**：按 `Win + R`，输入"cmd"或"powershell"
- **Linux**：按 `Ctrl + Alt + T`

### Q4: 运行出错怎么办？
**A**: 按以下步骤排查：

1. **检查Claude Code是否安装**：
```bash
claude --version
```
如果没有输出，说明未安装，请重新按[安装指南](#-安装指南)安装。

2. **检查配置文件是否正确**：
```bash
cat .claude/settings.local.json
```
确保API密钥和模型配置正确。如果没有此文件，请先创建并配置。

3. **检查项目目录**：
```bash
pwd
```
确保在SuitAgent目录下。

### Q5: 支持哪些文档格式？
**A**: 支持多种格式：
- **PDF**：自动OCR识别扫描件
- **Word**：.docx格式
- **图片**：.jpg, .png等（OCR识别）
- **纯文本**：.txt格式

### Q6: 生成的法律文书可以直接使用吗？
**A**: SuitAgent 生成的文书是专业草稿，建议：
1. 人工审核确保事实准确性
2. 根据具体案情调整
3. 符合当地法院格式要求
4. 律师最终把关

### Q7: 如何查看生成的文件？
**A**: 有两种方式查看生成的文件：

**方式1：使用Zed（推荐）**：
- 在Zed左侧文件树中展开 `output/[案件编号]/`
- 双击文件即可查看
- 文件树实时更新，新生成的文件会自动显示

**方式2：使用终端命令**：
```bash
# macOS
open output/[案件编号]/

# Windows
start output\[案件编号]\

# Linux
xdg-open output/[案件编号]/
```

### Q8: 可以批量处理多个案件吗？
**A**: 可以！将多个案件文档放入input目录，系统会自动：
1. 识别每个案件的类型
2. 为每个案件创建独立文件夹
3. 批量执行分析工作流
4. 生成独立的案件报告

### Q9: 生成的文件保存在哪里？
**A**: 文件按照标准化目录结构保存：

**主要位置**：`output/[案件编号]/`

**目录结构**：
- `01_案件分析/` - 案件分析报告、策略方案
- `02_法律研究/` - 争议焦点、法律研究报告
- `03_证据材料/` - 证据目录、质证意见
- `04_法律文书/` - 各类法律文书（起诉状、答辩状等）
- `05_综合报告/` - 案件摘要、综合分析报告
- `06_日程管理/` - 期限提醒、工时统计、时间线管理

**快速查看**：
- **使用Zed（推荐）**：在左侧文件树中展开`output/`目录
- **使用终端**：运行 `open output/` (macOS) 或 `start output\` (Windows)

### Q10: 想要自定义工作流可以吗？
**A**: 可以！高级用户可以：
1. 修改 `.claude/agents/` 下的配置文件
2. 调整Agent之间的协作方式
3. 添加自定义的法律文书模板
4. 调整输出格式和结构


## 🔗 实用工具链接

### 代码编辑器
- **[Zed](https://zed.dev/)** - 推荐新手使用，内置终端，图形化操作
- **[cc-switch项目主页](https://github.com/farion1231/cc-switch)** - 快速切换不同AI模型配置
- **[Visual Studio Code](https://code.visualstudio.com/)** - 流行的代码编辑器

### AI模型平台
- **[智谱AI开放平台](https://open.bigmodel.cn/)** - GLM-4.6，推荐⭐⭐⭐⭐⭐
- **[月之暗面开放平台](https://platform.moonshot.cn/)** - kimi-k2-turbo，推荐⭐⭐⭐⭐⭐
- **[MiniMax开放平台](https://www.minimaxi.com/)** - MiniMax-M2，免费API，推荐⭐⭐⭐⭐
- **[DeepSeek开放平台](https://platform.deepseek.com/)** - DeepSeek-V3.2，推荐⭐⭐⭐⭐

### 相关资源
- **[Claude Code官方文档](https://docs.anthropic.com/claude-code)** - 了解Claude Code
- **[Node.js官网](https://nodejs.org/)** - 安装Node.js和npm
