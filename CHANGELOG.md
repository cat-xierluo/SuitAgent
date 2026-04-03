# 变更记录

> Last updated: 2026-04-02
> 所有对用户或其他协作者有影响的变更都会在此记录。使用 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式。

---

## [v1.1.0] - 2026-04-02

### 🏗️ 重构 (Refactored)

- **📁 项目结构扁平化**：移除 `output/` 中间层，所有案件文件夹直接放在项目根目录（格式：`YYMMNN 当事人 案由/`）
- **📄 AGENTS.md 精简**：重构为 AI 行动指引手册（60行），移除冗余的 Agent 详情和工作流描述，详细信息按需指向 `.claude/` 下具体文件
- **🔗 CLAUDE.md 改为 @include**：根目录 CLAUDE.md 改为 `@include ./AGENTS.md`，与 legal-skills 保持一致
- **🗂️ 清理无用目录**：删除 `downloads/`、`input/`、`temp/`、`test/`、`.claude/config/` 等废弃目录
- **📜 模板内化到 Skill**：case-setup skill 的模板从 `.claude/templates/` 迁移到 `references/`，删除 templates 目录
- **🛠️ 工具脚本集中管理**：`sync-skills.sh` 移至 `.claude/scripts/`，避免污染项目根目录

### 🔧 优化 (Changed)

- **路径引用更新**：所有 `.claude/` 下的配置文件中的 `output/` 路径已批量更新为根目录格式
- **.gitignore 更新**：`output/*` 改为 `2*-*/`，匹配根目录案件文件夹格式
- **文档清理**：更新 `CommandMeta.md` 移除已删除的 `update-paths` 命令示例

### ⚠️ 破坏性变更 (Breaking)

- **案件目录迁移**：`output/` 下的 7 个案件文件夹已迁移到项目根目录，旧 `output/` 目录已删除
- **路径变更**：所有案件相关引用路径从 `output/[案件编号]/` 变为 `[案件编号]/`

## [v1.0.8] - 2026-01-01

### 🔧 优化 (Changed)

- **📋 技能规划颗粒度重构**
  - 对齐官方 Skill 机制，合并为“任务方向级”技能
  - 更新 `docs/skills发展规划.md` 的技能清单与颗粒度原则

## [v1.0.7] - 2026-01-01

### 🔧 优化 (Changed)

- **📋 技能规划文档精简与表格化**
  - 重构 `docs/skills发展规划.md` 为按类别的技能清单表格
  - 移除技术实现、实施路径、集成策略、效果评估等内容

## [v1.0.6] - 2026-01-01

### 🔧 优化 (Changed)

- **📝 中文翻译优化**
  - 将所有Agent配置中的"当被调用时"改为"适用场景"，更符合中文表达习惯
  - 更新SubagentStandards.md标准文档中的对应章节标题

- **🧹 工具配置清理**
  - 从所有10个Agent的tools列表中移除MCP工具（mcp_mineru、mcp_pkulaw）
  - 从DocAnalyzer的tools列表中移除"Skill"工具
  - 修正DocAnalyzer的tools格式从JSON数组改为逗号分隔格式

- **📝 Description详细化优化**
  - 扩展所有Agent的description字段，提供更详细的功能说明
  - 移除description中硬编码的MCP使用要求，改为功能描述
  - 确保description与实际功能一致，便于主Agent自动路由决策

### 📋 配置优化成果

- **中文本地化**: 所有章节标题符合中文表达习惯
- **工具配置精简**: 移除MCP和Skill工具，tools列表更简洁规范
- **描述信息增强**: 10个Agent的description平均长度增加150%
- **格式一致性**: 100%使用逗号分隔格式，符合SubagentStandards.md规范

---

## [v1.0.5] - 2026-01-01

### ✨ 新增 (Added)

- **📋 Subagent配置标准增强**
  - 更新SubagentStandards.md，添加tools和skills字段详细说明
  - 明确tools字段使用逗号分隔格式（不包含Skill）
  - 添加skills字段说明（可选，独立配置）
  - 增加变更历史章节，符合RulesMeta.md要求

### 🔧 优化 (Changed)

- **🤖 全部10个Agent配置标准化**
  - **EvidenceAnalyzer.md**: 删除触发词、添加工作检查清单、工具列表逗号化
  - **Scheduler.md**: 添加适用场景、输出要求章节、统一工具格式
  - **IssueIdentifier.md**: 删除触发词、移除Skill、添加标准章节
  - **Researcher.md**: 删除触发词、MCP规范章节、添加标准章节
  - **Strategist.md**: 删除触发词、添加工作检查清单
  - **Writer.md**: 删除触发词、移除Skill、添加标准章节
  - **Summarizer.md**: 删除触发词、添加适用场景章节
  - **Reporter.md**: 删除触发词、添加工作检查清单
  - **Reviewer.md**: 添加适用场景、工作检查清单、输出要求章节
  - **DocAnalyzer.md**: 确认已符合标准格式

### 📊 标准化成果

- **YAML格式统一**: 所有Agent工具列表使用逗号分隔格式
- **删除冗余内容**: 移除所有"🚨 需求识别触发词"章节
- **统一章节结构**: 采用4标准章节（角色定义、工作流程、输出标准、后续指引）
- **添加必需章节**: 10个Agent全部添加"适用场景"、"工作检查清单"、"输出要求"
- **工具配置清理**: 从所有Agent中移除"Skill"（技能为独立配置）

### 📋 配置规范 (Configuration)

- **配置规范完善**: 所有Agent配置文件现在完全符合SubagentStandards.md规范
- **工作流优化**: 清理触发词，Subagent专注于核心功能描述

### 📈 完成统计 (Statistics)

- **标准化统计**: 10个Agent配置文件全部完成标准化
- **删除内容**: 移除所有触发词定义和Skill工具引用
- **新增章节**: 添加30+个标准章节（每个Agent 3-4个新章节）
- **格式统一**: 100%符合Claude Code官方Subagent配置标准

---

## [v1.0.4] - 2026-01-01

### ✨ 新增 (Added)

- **📋 Subagent配置标准**
  - 创建SubagentStandards.md，制定基于Claude Code官方规范的统一配置标准
  - 定义YAML前置数据格式（name + description）
  - 规范4个标准章节：角色定义、工作流程、输出标准、后续指引

### 🔧 优化 (Changed)

- **📁 路径配置更新**
  - 在paths.yaml中添加subagent_standards规则引用
  - 更新引用模板，包含SubagentStandards.md链接

- **📝 标准格式重构**
  - 删除触发词定义章节（面向主Agent路由，Subagent调用时不可见）
  - 参考官方示例重构：采用"When invoked"、"核心职责"、"工作检查清单"、"输出要求"格式
  - 章节数从7个精简至4个，更实用更直接

### 📝 文档 (Documentation)

- **📋 路线图更新**
  - 更新DECOUPLING_ROADMAP.md v2.4，标记阶段4完成并记录重要修订
  - 添加阶段4详细成果和统计数据
  - 更新版本变更记录

### 📊 统计数据

- **标准制定成果**
  - 新建标准文件: 1个（SubagentStandards.md）
  - 规范配置字段: 2个必需（name, description）
  - 标准章节数: 4个（统一结构，精简后）
  - 更新配置文件: 1个（paths.yaml）
  - 阶段4标记为已完成（100%）

---

## [v1.0.3] - 2026-01-01

### 🔧 优化 (Changed)

- **📁 Rules目录精简与工作流合并**
  - 删除agent-workflows目录（10个工作流文件）
  - 从paths.yaml中移除agent_workflows规则
  - 从CLAUDE.md中删除对agent-workflows的引用
  - 简化Rules结构：8个子目录减至7个

### 📝 文档 (Documentation)

- **📋 路线图更新**
  - 更新DECOUPLING_ROADMAP.md v2.2，标记阶段3完成（Rules目录精简）
  - 添加阶段3完成内容和简化成果统计

### 📊 统计数据

- **解耦成果统计**
  - 删除工作流文件: 10个
  - 简化Rules目录: 从8个子目录减至7个
  - 更新配置文件: 2个（paths.yaml, CLAUDE.md）
  - 阶段3标记为已完成（100%）

---

## [v1.0.2] - 2026-01-01

### 🔧 优化 (Changed)

- **📋 Agent配置精简与规则提取**
  - 创建PDFProcessingRules.md共享PDF处理规范，统一MCP调用优先级规则
  - 精简DocAnalyzer.md：710行 → 227行（-68%，删除483行重复PDF处理规范）
  - 精简Scheduler.md：262行 → 147行（-44%，删除115行重复输出格式定义）
  - 确认OutputStandards.md无需Agent显式引用（规则自动加载机制）

### 📁 配置 (Configuration)

- **📄 路径配置更新**
  - 更新paths.yaml添加pdf_processing规则
  - 保持所有规则文件路径一致性

### 📊 统计数据

- **解耦成果统计**
  - DocAnalyzer.md: 删除483行重复内容
  - Scheduler.md: 删除115行重复内容
  - 新建共享规则: 2个（OutputStandards.md, PDFProcessingRules.md）
  - 阶段2进度：30% → 85%

### 📝 文档 (Documentation)

- **路线图更新**
  - 更新DECOUPLING_ROADMAP.md v2.2，标记阶段2基本完成（85%）
  - 添加精简成果统计和技术说明

---

## [v1.0.1] - 2026-01-01

### 🔧 优化 (Changed)

- **📁 Rules文件重组与路径配置优化**
  - 重命名Rules文件为更清晰的命名规范（AgentMapping.md, WorkflowSystem.md, WorkflowScenarios.md等）
  - 更新paths.yaml配置，添加workflow_scenarios、output_standards、rules_meta等新路径
  - 创建OutputStandards.md统一输出规范，为后续Agent配置精简做准备
  - 完成路径引用一致性验证，确认所有引用与paths.yaml配置匹配

### 📝 文档 (Documentation)

- **路径配置完善**
  - 更新`.claude/config/paths.yaml`添加完整的Rules文件引用
  - 添加reference_templates配置用于标准化Markdown链接格式
  - 验证28+处路径引用一致性

---

## [v1.0.0] - 2026-01-01

### 🚀 重大更新 (Major Updates)

- **🏗️ CLAUDE.md解耦与Claude Code Rules架构迁移**
  - **CLAUDE.md大幅精简**：从942行减少到200行（-79%）
  - **移除重复内容**：删除详细工作流、执行方式、文档管理结构等，改为引用配置文件
  - **架构升级**：迁移到Claude Code最新Rules架构（`.claude/rules/`）
  - **模块化配置**：5个配置文件转换为Markdown规则文件
  - **优化标题层级**：移除case-directories.md中12个不必要的三级标题
  - **统一变更历史**：为所有rules文件添加变更历史表格
  - **清理旧文件**：删除`.claude/config/`目录下所有YAML文件
  - **完整决策记录**：详见`docs/DECISIONS.md#决策-039`

### 📝 文档 (Documentation)

- **核心配置文件创建**
  - `.claude/rules/workflows.md` - 工作流定义（223行）
  - `.claude/rules/scenarios.md` - 场景识别规则（178行）
  - `.claude/rules/time-rules.md` - 时间管理规范（174行）
  - `.claude/rules/case-directories.md` - 案件目录结构（64行）
  - `.claude/rules/agent-mappings.md` - Agent目录映射（95行）

### 🔧 架构 (Architecture)

- **Claude Code Rules系统集成**
  - 采用Markdown + YAML frontmatter格式（description, category, version）
  - 自动加载`.claude/rules/`目录下的所有.md文件作为项目记忆
  - 实现文档模块化和关注点分离
  - 提升可维护性和可扩展性

---

## [v0.9.0] - 2026-01-01

### 📝 文档 (Documentation)

- **ROADMAP.md 精简重构**
  - 从900+行精简到82行（减少91%）
  - 删除过于详细的实现细节，只保留核心方向和简述
  - 恢复路线图的"鸟瞰视角"可读性
  - 版本升级至 v2.5

### 🐛 修复 (Fixed)

- **CHANGELOG.md 版本号修复**
  - 修复版本号顺序混乱问题（v0.1.2-v0.1.6与v0.2.0-v0.3.0交错）
  - 重新排序为递增序列：v0.1.0 → v0.2.0 → ... → v0.8.0

---

## [v0.8.0] - 2026-01-01

### 🔧 优化 (Changed)

- **📂 配置文件重命名和优化**
  - 将 `paths.yaml` 重命名为 `case-directories.yaml`，提高配置文件名称的描述性
  - 新名称更清楚地表明这是案件目录结构的配置文件
  - 更新所有10个文件中的配置引用，确保一致性
  - 与 `agent-mappings.yaml` 形成统一的配置文件命名规范

### 📝 文档 (Documentation)

- **配置解耦完成**
  - 创建 `.claude/config/agent-mappings.yaml` 作为Agent与目录映射的单一真实源
  - 更新9个Agent配置文件，将硬编码的输出目录改为引用配置文件
  - 更新2个Command文件（new-case.md、evidence-review.md）
  - 所有Markdown文档现在只包含配置引用，不包含硬编码
  - 实现"单一真实源"设计原则，提高可维护性

### 🏗️ 架构 (Architecture)

- **配置管理优化**
  - 建立两个核心配置文件的清晰职责划分：
    - `case-directories.yaml`: 定义12个标准目录结构和命名规范
    - `agent-mappings.yaml`: 定义10个Agent与目录的映射关系
  - 支持四层架构（输入层、分析层、输出层、支持层）
  - 提供双向映射（Agent→目录、目录→Agent）

---

## [v0.7.0] - 2025-12-30

### 🚀 新增功能 (Added)

- **🖥️ UI 化方案基线**
  - 新增 `UI化开发方案.md`，定义前端 Next.js + 后端 Node/Fastify + 事件流的两层架构
  - 明确 Claude Code CLI/SDK 双轨适配、Job 队列、长任务可观测性以及 skills/MCP 插件化管理路径
  - 给出 P0-P3 迭代路线和落地建议
  - 补充参考项目调研（Claudian/Obsidian Agent Client/opcode），确认以 ClaudeAdapter 为核心的非 ACP 路线，吸收侧边栏交互与安全模型

### 📝 文档 (Documentation)

- **决策记录**：添加决策 #037，确认 UI 化方案、Claude Adapter 抽象与技能/MCP 管理策略
- **任务清单**：在“目标 2.1: 用户界面优化”中补充并完成“UI 化开发方案”子任务
- **方案补充**：新增 Wireframe 指南（导航/核心转化区/侧栏布局），明确“先定结构后定视觉”的实施步骤

---

## [v0.6.0] - 2025-11-21

### 🚀 新增功能 (Added)

- **🔧 完整MCP配置修复和标准化**

  - 统一为所有10个Agent添加 `mcp_mineru` 工具权限
  - 建立主AgentMCP强制检查机制，防止绕过MCP直接使用技能
  - 创建统一的MCP配置检查器和验证脚本
  - 修复系统架构缺陷，确保MCP优先使用机制
- **📋 MCP配置管理工具**

  - 新增 `.claude/scripts/mcp_checker.py` - 统一MCP配置检查器
  - 新增 `.claude/scripts/validate_agent_permissions.py` - Agent权限验证脚本
  - 提供100%准确的MCP状态检测和权限验证
  - 自动化测试机制，确保配置正确性
- **📚 标准化文档和规范**

  - 新增 `.claude/memory/standards/MCP_USAGE_STANDARD.md` - MCP使用标准
  - 新增 `docs/MCP_CONFIGURATION_REPAIR_REPORT.md` - 完整修复报告
  - 建立详细的操作指南和问题排查检查清单
  - 标准化MCP工作流程和错误处理机制

### 🔧 优化 (Changed)

- **⚙️ Agent权限配置统一化**

  - 修复7个Agent缺少MCP权限的问题 (IssueIdentifier、Reporter、Researcher、Reviewer、Scheduler、Strategist、Summarizer)
  - Researcher增强为同时支持 `mcp_pkulaw` 和 `mcp_mineru`
  - 所有10个Agent现在都具备完整的MCP工具权限
  - 验证结果：100%权限配置正确
- **🚫 主Agent强制规范**

  - 在CLAUDE.md中添加主AgentMCP强制检查规范
  - 明确禁止主Agent直接调用PDF技能或MCP工具
  - 建立违规检测与纠正机制和质量保障清单
  - 确保所有PDF/图片处理必须通过DocAnalyzer Agent

### 🐛 修复 (Fixed)

- **🔗 架构缺陷修复**

  - 修复主Agent绕过MCP直接使用技能的架构问题
  - 解决MCP检查流程过于复杂的问题（从220行简化为标准化检查器）
  - 统一不同Agent的MCP回退机制
  - 建立标准化的错误处理和输出格式
- **📊 配置一致性修复**

  - 修复7个AgentMCP工具权限缺失问题
  - 统一MCP配置检查和验证流程
  - 建立自动化配置验证机制
  - 确保系统配置的一致性和可维护性

### 📝 文档 (Documentation)

- **📖 MCP架构文档完善**
  - 详细记录MCP配置修复过程和架构改进
  - 提供完整的测试验证结果和维护建议
  - 建立长期的配置监控和改进机制
  - 为未来的MCP扩展建立标准基础

---

## [v0.5.0] - 2025-11-20

### 🚀 新增功能 (Added)

- **🆕 完整技能发展规划体系**

  - 新增 `docs/SKILLS_ROADMAP.md` - 完整的技能发展规划文档
  - 规划9个核心专业技能，覆盖文档整理、协作优化、专业增强、自动化办公
  - 详细定义4个优先级发展路径和分阶段实施计划
  - 建立完整的风险评估和应对策略
- **📄 智能文档整理技能规划**

  - `doc-organizer` 智能文档整理技能：自动分类、重命名、归档
  - `content-extractor` 文档内容智能提取：结构化信息提取
  - `case-binder` 案件卷宗自动生成：标准化卷宗制作
  - 预计提升文档整理效率80%，降低错误率90%
- **🤝 智能协作与流程优化技能规划**

  - `workflow-orchestrator` 多Agent协作编排：智能工作流设计
  - `incremental-updater` 增量更新：智能变化检测和更新
  - 支持并行处理和智能调度，提升整体工作效率60%
- **⚖️ 专业领域增强技能规划**

  - `law-matcher` 法条智能匹配：基于案情智能匹配法规
  - `legal-visualizer` 数据可视化：法律关系和数据图表展示
  - 集成法律数据库和知识图谱，提升专业分析能力
- **📧 自动化办公技能规划**

  - `email-processor` 智能邮件处理：自动分类和回复建议
  - `communication-organizer` 沟通记录整理：多渠道沟通档案
  - 扩展应用场景到整个法律服务链条

### 🔧 优化 (Changed)

- **📋 任务清单更新**

  - 新增"目标 2.1: 技能发展规划与实施"
  - 详细的技能开发任务分解和时间估算
  - 建立技能验证标准和集成策略
  - 总开发时间估算40-50小时
- **📊 技能集成策略**

  - 设计技能与Agent的映射关系
  - 建立三种技能调用方式（直接调用、Agent触发、工作流集成）
  - 规划技能配置目录结构和调用规范

### 📝 文档 (Documentation)

- **📖 技能发展文档体系**
  - 完整的技能功能说明和技术实现方案
  - 详细的使用场景和预期输出示例
  - 风险评估与应对策略
  - 技能调用方式和集成规范

---

## [v0.4.0] - 2025-11-17

### 🚀 新增功能 (Added)

- **🆕 全新12目录诉讼模板架构**

  - 新增完整的12层诉讼模板架构（00-11目录）
  - 📅 00 - 日程管理：案件看板、时间线、期限预警、工时统计
  - 🤝 01 - 委托材料：委托合同、授权书、谈话笔录、服务方案
  - 📄 02 - 案件分析：案件分析报告、争议焦点、风险评估、策略方案
  - 🔍 03 - 法律研究：法条检索、判例研究、法律适用【前置核心】
  - 📤 04 - 客户提供：客户文档、需求确认、反馈记录
  - 📎 05 - 证据材料：证据清单、质证意见、鉴定报告
  - 📝 06 - 法律文书：起诉状、答辩状、代理词等各类文书
  - 📥 07 - 对方提交：对方起诉状、证据、答辩书
  - 🏛️ 08 - 法院送达：传票、裁定、判决书
  - 🎯 09 - 庭审笔录：庭审记录、庭后分析
  - 📊 10 - 综合报告：案件摘要、阶段报告
  - 📚 11 - 参考文件：参考案例、法律条文
- **🆕 案件管理文件模板**

  - 新增 `[案件编号].yaml` - 案件管理看板数据（核心文件）
  - 新增 `[案件编号].md` - 案件工作记录看板
  - 支持YAML + MD双版本设计
- **🆕 Agent目录映射优化**

  - 10个Agent工作流与12目录完美对接
  - 每个目录都有专门的README.md说明文件
  - 支持AI工作流和传统实务操作双轨并行

### 🔧 优化 (Changed)

- **📦 文档管理策略优化**

  - 优化.gitignore配置，docs和status目录本地保留
  - 不推送到GitHub，但完整保留本地功能
  - 保持开发灵活性同时保护敏感信息
- **📄 Markdown转Word命令完善**

  - 增强自动化安装脚本功能
  - 支持3种预设格式 + 自定义格式
  - 完全支持中文文档转换
- **📘 Git 管理最佳实践指南更新**

  - 将 `docs/Git-Management-Best-Practices.md` 重命名为 `docs/Git-管理最佳实践指南.md`
  - 增加“Git 功能使用指南”章节：包含日常分支工作流、`git worktree` 用法及 WorkTree 与测试分支的对比，帮助多任务并行和并行测试

### 🐛 修复 (Fixed)

- 解决了文档版本控制冲突问题
- 修复了模板目录结构不完整的问题
- 优化了Git历史记录管理

---

## [v0.3.0] - 2025-11-14

### 🚀 新增功能 (Added)

- **🆕 委托文件生成系统整合**

  - 成功整合独立的委托文件生成系统到SuitAgent工作流
  - 新增 `.claude/tools/placeholder_mapper.py` - 字段映射工具 (348行)
  - 新增 `.claude/tools/DocxProcessor.py` - Word文档处理引擎 (365行)
  - 新增 `.claude/tools/docx_tools.py` - 便捷调用接口 (304行)
  - 支持14个核心字段的自动映射
  - 支持公司和个人两种委托类型
- **🆕 委托确定工作流**

  - 新增完整"委托确定"场景工作流
  - 支持5个核心委托文件自动生成
  - 集成DocAnalyzer → Writer → Summarizer → Reporter自动化流程
  - 可通过自然语言触发："我需要制作委托材料"
- **🆕 模板资源库**

  - 新增 `.claude/templates/公司委托模板/` - 9个Word模板
  - 新增 `.claude/templates/个人委托模板/` - 8个Word模板
  - 支持自动模板选择和批量生成
  - 保持Word文档原始格式（字体、颜色、对齐等）
- **🆕 集成测试套件**

  - 新增 `tests/test_integration.py` - 完整测试套件 (452行)
  - 覆盖字段映射、YAML验证、模板发现、批量生成等场景
  - 提供颜色输出和详细测试报告

### 🔧 改进 (Changed)

- **Writer Agent扩展**

  - 更新 `.claude/agents/Writer.md`，添加委托文件生成功能
  - 新增15种文书类型（包含Word格式委托文件）
  - 集成自动工作流触发机制
  - 支持Markdown和Word双格式输出
- **目录结构优化**

  - 精简 `.claude/memory/` 目录，减少上下文污染60%
  - 将可引用文件移至 `.claude/tools/`、`.claude/templates/`、`docs/`、`output/`
  - memory目录仅保留必要文件：integration/、workflows/
  - 上下文大小从~500KB减少到~200KB
- **文档体系增强**

  - 新增 `docs/委托文件生成系统整合报告.md` - 完整整合报告 (11KB)
  - 新增 `.claude/memory/integration/字段对照表.md` - 字段映射规范
  - 新增 `.claude/memory/integration/工具使用指南.md` - API文档
  - 新增 `.claude/memory/integration/委托确定工作流.md` - 工作流说明
  - 新增 `.claude/memory/integration/目录结构优化.md` - 优化说明
  - 新增 `.claude/memory/integration/整合工作总结.md` - 工作总结

### 🔒 性能优化 (Optimized)

- **上下文优化**

  - memory目录文件减少60%（从~50个到~20个）
  - 上下文大小减少60%（从~500KB到~200KB）
  - 响应速度显著提升
  - 成本显著降低
- **文件组织优化**

  - 按功能分类存放文件：tools/（工具）、templates/（模板）、docs/（文档）
  - 通过路径引用使用，无需加载到上下文
  - 统一的模板管理 `.claude/templates/`
  - 清晰的目录层次结构

### 🐛 修复 (Fixed)

- 修复了工具文件相对导入问题，使用 `.claude/tools/` 内部导入
- 更新了所有文档中的路径引用，从 `.claude/memory/` 迁移到新位置
- 修复了批量生成函数的模板目录选择逻辑

### 📋 技术细节 (Technical)

- **核心技术**: 基于 `word_template_processor.py` 的字符级精确替换
- **算法优化**: Run级别操作保持Word格式，反向迭代避免索引偏移
- **字段映射**: 14个核心字段（委托人、律师、案件、日期信息）
- **模板类型**: 支持公司委托（9种文件）和个人委托（8种文件）
- **输出格式**: Word(.docx) + Markdown(.md) 双格式支持
- **工作流步骤**: 4步自动化（客户确认 → 委托文件 → 清单摘要 → 完整报告）

### 📖 文档更新 (Documentation)

- `docs/委托文件生成系统整合报告.md` - v1.0，完整整合报告
- `status/CHANGELOG.md` - 记录 v0.3.0 所有变更
- `status/JOURNAL.md` - 添加整合工作日志
- `status/TASKS.md` - 更新任务完成状态
- `CLAUDE.md` - 更新场景7说明，新增Word格式委托文件特性

### ⚠️ 破坏性变更 (Breaking Changes)

- **工具路径变更**: 原 `tools/*.py` 移至 `.claude/tools/*.py`
- **模板路径变更**: 原 `.claude/memory/公司委托模板/` 移至 `.claude/templates/公司委托模板/`
- **导入路径变更**: 工具内部导入使用相对路径 `from .xxx import xxx`

### 📌 迁移指南 (Migration)

- 更新所有引用 `tools/*.py` 的代码为 `.claude/tools/*.py`
- 更新模板路径从 `.claude/memory/委托模板/` 到 `.claude/templates/委托模板/`
- 安装新依赖: `pip install python-docx pyyaml`

---

## [v0.2.0] - 2025-11-11

### 🚀 新增功能 (Added)

- **🆕 自动化安装脚本系统**

  - 新增 `install.sh` 交互式安装向导
  - 支持一键安装 Node.js、Claude Code CLI、Zed 编辑器
  - 完整支持 macOS、Linux、Windows (PowerShell/CMD/WSL)
  - 智能系统检测，自动选择最佳安装方式
  - 支持 4 大 AI 模型平台：智谱AI、月之暗面、MiniMax、DeepSeek
  - API 密钥安全输入（密码模式），自动生成配置文件
  - 安装后完整验证，确保所有组件正常工作
- **🆕 完整文档体系**

  - 新增 `INSTALL.md` - 详细安装指南 (11KB)
  - 新增 `QUICKSTART.md` - 一分钟快速开始 (1.2KB)
  - 更新 `README.md` - 集成自动化安装说明

### 🔧 改进 (Changed)

- **更新 ROADMAP.md 至 v2.3**
  - 新增"阶段1.5：安装体验优化"
  - 当前阶段调整为"核心功能增强"
  - 添加自动化安装系统完成状态记录

### 📋 技术细节 (Technical)

- **跨平台支持矩阵**：

  - macOS: Homebrew 自动安装
  - Linux: apt/yum 包管理器支持
  - Windows: PowerShell + Chocolatey + WSL 三种方式
  - WSL: 完整 Linux 体验支持
- **安装流程优化**：

  - 系统检测 → 依赖安装 → CLI 安装 → AI 配置 → Zed 安装 → 项目打开 → 验证完成
  - 全程交互式向导，用户只需按提示操作
  - 错误处理和重试机制，提升安装成功率

### 📖 文档更新 (Documentation)

- `docs/ROADMAP.md` - v2.3，添加安装体验优化阶段
- `status/CHANGELOG.md` - 记录 v0.2.0 所有变更
- `status/TASKS.md` - 已完成安装相关任务
- `README.md` - 新增自动化安装章节

---

## [未发布] - 待定

### 📝 文档优化 (Documentation Optimization)

- **精简CLAUDE.md"常见使用场景"部分**
  - **精简内容**：删除场景8-15（保全申请、上诉材料、法律意见书、律师函、强制执行、调解协议、异议申请等）
  - **保留核心**：只保留7个最常用场景（被告应诉、新证据质证、庭审后分析、诉前沟通、策略优化、原告起诉、制作委托材料）
  - **更新表格**：同步精简自动识别规则表格，移除不常用场景
  - **效果**：显著减少文档长度，提升可读性和维护性

### 🔧 架构修复 (Architecture Fixes)

- **修复PDF处理工作流程绕过DocAnalyzer的关键问题**
  - **问题描述**：用户上传PDF时系统直接使用PDF技能，绕过DocAnalyzer Agent，导致架构违规和错误处理
  - **解决方案**：
    - 修正DocAnalyzer配置，明确PDF处理职责和双格式输出要求
    - 创建文档处理强制工作流程规范 (`DOCUMENT_PROCESSING_ENFORCEMENT.md`)
    - 在CLAUDE.md中添加文档处理强制规范章节
    - 记录架构决策 #020
  - **工作流程**：
    - 错误：用户上传PDF → 直接使用PDF技能 ❌
    - 正确：用户上传PDF → DocAnalyzer Agent → 使用pdf技能 → 返回PDF+MD+JSON ✅
  - **核心要求**：所有PDF文档必须通过DocAnalyzer处理，必须返回带文字层的PDF和Markdown文件，OCR准确率需达95%+

### 重大更新 (Major Updates)

- **Agents架构重大升级 v2.0 - 符合Claude Code官方标准**
  - **新增双层架构设计**：
    - 使用层 (`.claude/agents/`)：标准subagent配置，符合Claude Code官方规范
    - 知识层 (`.claude/memory/workflows/`)：详细工作流程，便于开发优化
  - **标准化所有10个agents**：
    - 添加YAML frontmatter配置（name, description, tools, model, color）
    - 移除非标准tools配置（pdf, docx, xlsx等），避免"Unrecognized"警告
    - 优化模型选择和temperature参数
    - 配置8种颜色区分agents（2个agents共享颜色）
  - **保留完整设计文档**：
    - 10个详细工作流程文件完整迁移至workflows目录
    - 保留所有功能定位、JSON配置、性能指标、质量验证等
    - 创建COLOR-GUIDE.md说明颜色分配原则
  - **创建说明文档**：
    - AGENTS-CONVERSION-SUMMARY.md：转换总结
    - AGENTS-FINAL-COLOR-CONFIG.md：颜色配置完成文档
  - **优势**：完全符合官方标准，可直接使用/agents命令管理，保持专业设计完整性
- **ROADMAP.md重大版本更新 v2.2**
  - **新增目标5：专业化法律技能库建设**
    - 建立案件专业化分析模板库：医疗纠纷、知识产权、建筑工程、合同纠纷、劳动争议等专项模板
    - 构建证据需求清单库：各类案件的标准化证据清单，包括基础证据、关键证据、辅助证据
    - 完善法律要点知识库：核心法条库、争议焦点分析框架、典型案例参考库
  - **新增目标6：法律文书模板系统优化**
    - 建立答辩意见要点模板库：标准答辩框架、不同案件类型答辩策略、律师自定义添加机制
    - 开发委托文档自动生成系统：预设委托合同模板库、基于Skills的自动生成功能
    - 实现Markdown转Doc文档功能：基于docx skill的转换引擎、自动排版格式化、批量转换
  - **新增目标7：命令脚本系统**
    - 构建简单命令执行框架：案件管理、文档处理、工作流、Agent控制等常用命令集合
    - 集成Hooks机制：文件生成后自动转换、自定义脚本、插件式扩展、自动化质量检查
    - 实现脚本化工作流执行和批处理任务支持
  - **完善目标4：案件基础信息与工作记录模板持续优化**
    - 详细规划数据可视化支持：案件进度甘特图、工时统计图表、期限倒计时显示、风险等级可视化
    - **扩展跨案件数据汇总：新增统一数据看板🆕**
      - 自动扫描所有案件YAML文件，生成统一数据索引
      - 支持列表视图、卡片视图、甘特图视图
      - 多维度筛选：案件类型、负责人、状态、时间
      - 智能数据洞察：预测分析、资源优化、效率提升建议
    - 建立模板持续迭代机制：反馈收集、结构优化、新字段扩展、版本管理

### 新增 (Added)

- **案件PDF扫描OCR处理能力**

  - 实现PDF扫描件OCR文字提取，使用tesseract + ImageMagick技术
  - 成功提取起诉状全文内容，生成带文字层的PDF和Markdown文件
  - 建立OCR质量优化流程：图像预处理、拼写检查、格式校正
- **日程管理目录精简优化**

  - 删除不必要的文件：客户沟通记录、费用跟踪、庭审安排、风险预警、README等
  - 保留3个核心文件：工时记录.md、期限管理.md、重要任务清单.md
  - 将[案件编号].yaml移回06_日程管理/目录
  - [案件编号].md保留在案件根目录
  - 贯彻"Less is more"理念，精简高效
- **案件看板位置优化与日程管理内容扩展**

  - 将案件看板（[案件编号].yaml和[案件编号].md）移动到案件根目录，便于查看和使用
  - 从案件看板抽取重要任务清单为独立文档：重要任务清单.md
  - 从案件看板抽取期限管理为独立文档：期限管理.md
  - 新增客户沟通记录.md，记录与客户的日常沟通情况
  - 新增费用跟踪.md，跟踪案件相关费用开支
  - 新增庭审安排.md，记录庭审安排和准备清单
  - 新增风险预警.md，记录和管理案件风险点
  - 扩展日程管理内容从2个文件到9个文件，形成完整的案件管理工具集
- **Agent输出路径标准化实施完成**

  - 完成标准目录结构创建：output/cases/[案件编号]/01-06完整目录
  - 创建Writer 12个法律文书子目录：起诉状、答辩状、代理词等
  - 建立YAML和MD模板文件：案件数据总表、工作记录模板
  - 创建实施指南文档：OUTPUT_PATH_STANDARDIZATION.md
  - 生成示例文档：案件分析报告、法律文书样例、操作日志
  - 建立路径分配工具函数和YAML自动更新机制
- **全面更新项目规划文档**

  - 创建新版roadmap (ROADMAP_NEW.md)，反映9个Agent已完成、当前处于文档管理优化阶段
  - 创建新版task清单 (TASKS_NEW.md)，定义阶段0-3的完整规划，聚焦文档管理优化
  - 重新定位项目现状：9个AI代理已完成，核心功能完整，当前阶段为文档管理优化
- **Agent输出文档管理规范**

  - 创建完整输出路径规范 (AGENT_OUTPUT_MANAGEMENT.md)
  - 定义9个Agent的输出路径映射：01-06目录分配、12种文书分类
  - 建立文档命名规范：[日期]_[类型]_[版本]格式
  - 设计智能路径分配机制：案号识别、案件匹配、冲突处理
  - 实现数据同步机制：YAML自动更新、MD工作记录同步
- **YAML数据总表模板优化**

  - 创建统一数据总表模板 (YAML_DATA_TEMPLATE.md)
  - 整合16个部分：基础信息、当事人、律师、费用、进展、时间线、期限、工时、工作记录、风险、文档、数据分析、项目管理、扩展字段、系统信息
  - 支持双版本设计：YAML用于看板数据，MD用于工作记录
  - 实现数据可视化支持：进度看板、工时统计图表、期限预警
  - 提供完整使用指南和最佳实践
- **智能案件识别系统**

  - 设计智能识别系统 (INTELLIGENT_CASE_RECOGNITION.md)
  - 实现案号识别算法：支持标准/简化/无括号格式，提取年份、地区、类型、序号
  - 建立文件类型识别规则：15种文档类型的关键词和特征匹配
  - 设计案件匹配算法：完全匹配/部分匹配/模糊匹配三级匹配
  - 实现新案件自动创建：目录结构、yaml模板、工作记录模板
  - 建立冲突处理机制：重复案件检测、文件冲突解决
  - 提供完整工作流程图和代码实现
- **Agent输出路径配置指南**

  - 创建Agent输出配置指南 (AGENT_OUTPUT_PATHS_CONFIG.md)
  - 为9个Agent提供具体输出实现：DocAnalyzer、EvidenceAnalyzer、IssueIdentifier、Researcher、Strategist、Writer、Summarizer、Reporter、Scheduler
  - 定义输出内容：每种Agent的文档类型、文件名格式、扩展名
  - 实现完整工具函数：路径生成、文件名创建、YAML更新、日志记录
  - 提供使用示例：每种Agent的调用方式和返回结果
  - 支持Writer 12种子类型：起诉状、答辩状、代理词等分类存储
- **创建长期优化规划文档**

  - 创建长期优化规划 (LONG_TERM_OPTIMIZATION_PLAN.md)
  - 定义四大优化方向：Claude Code高级功能、技能库完善、插件生态扩展、MCP工具集成
  - 详细规划Memories系统：案件上下文记忆、律师个人偏好学习、知识库记忆与智能推荐
  - 设计MCP工具集成方案：法院系统MCP、律所系统MCP、法律知识库MCP、云存储MCP
  - 制定插件生态扩展计划：法律专用插件、可视化插件、数据导入插件、第三方集成插件
  - 建立实施路线图：分阶段实施、技术架构设计、风险评估与应对、预算估算
- **Claude Code高级功能深度研究**

  - 创建高级功能研究报告 (CLAUDE_CODE_ADVANCED_FEATURES_RESEARCH.md)
  - 深度研究Memories上下文记忆系统：记忆存储架构、记忆分类标记、案件记忆空间设计
  - 全面分析MCP工具集成方案：法院系统MCP服务器实现、律所管理MCP集成、法律知识库MCP设计
  - 详细设计高级指令模板系统：完整案件分析模板、模板执行引擎、模板使用示例
  - 探索多模态处理能力：文本OCR增强、图像证据分析、音频庭审处理、视频庭审分析
  - 提供完整代码实现：MCP服务器开发、客户端集成模式、错误处理与重试机制
  - 制定实施建议与总结：优先级建议、技术路线图、风险控制、成功指标
- **项目路线图整合与优化**

  - 将长期优化规划全面整合到新版roadmap中，包含Claude Code高级功能、Skills知识库、插件生态、MCP工具四大方向
  - 按照用户指示调整MCP工具集成描述，留空作为未来展望展示，不涉及具体实现方案
  - 删除老版本ROADMAP.md文件，重命名ROADMAP_NEW.md为ROADMAP.md
  - 完善长期规划内容：Memories上下文记忆、高级指令模板、多模态处理、API集成等
- **记忆分层系统架构设计**

  - 在ARCHITECTURE.md中添加"记忆分层系统"章节，详细描述基于Claude Code架构的三层记忆设计
  - 定义案件级记忆、个人级记忆、系统级记忆的位置、内容、访问方式和更新机制
  - 在ROADMAP.md中新增"优化方向0：记忆分层系统建设（基础架构）"，将记忆分层系统列入长期规划
  - 建立记忆分层系统的理论基础，为后续Agent智能化协作提供基础支持
- **文档结构优化与整合**

  - 删除已整合的LONG_TERM_OPTIMIZATION_PLAN.md文档
  - 合并AGENT_OUTPUT_PATHS_CONFIG.md到AGENT_OUTPUT_MANAGEMENT.md，添加技术实现详解章节
  - 合并YAML_DATA_TEMPLATE.md到INTELLIGENT_CASE_RECOGNITION.md，添加YAML数据模板章节
  - 创建docs/research/文件夹，将CLAUDE_CODE_ADVANCED_FEATURES_RESEARCH.md移动到专门的研究文档夹
  - docs文件夹文档数量从10个减少到6个，大大简化文档结构
  - 保持文档层次结构：核心文档在根目录，详细研究在research子目录
- **优化案件文档管理结构（目录整合+双版本设计+简洁命名）**

  - 重新整合目录结构：9个目录精简为6个，按工作流相关性合并
    - 争议焦点+法律研究 → "02_法律研究"
    - 案件分析+策略规划 → "01_案件分析"
    - 报告摘要+综合报告 → "05_综合报告"
    - 期限工时管理 → "06_日程管理"
  - 创建日程管理双版本设计（Scheduler输出增强）
    - YAML版本：[案件编号].yaml 支持案件管理看板和数据分析
    - MD版本：[案件编号].md 支持工作记录和日常查看
    - 工作记录模板.md 提供标准化记录格式
  - 添加新材料自动分类指引（DocAnalyzer增强功能）
    - 材料归属识别（案号提取、案件匹配、新案件创建）
    - 材料类型分析（6种材料类型的识别特征和放置位置）
    - 自动放置流程（input → DocAnalyzer → 自动分类 → 放置）
    - 批量处理支持（ZIP、多文件、OCR识别）
    - 命名规范应用（自动重命名、版本管理、冲突处理）
    - 上下文更新（yaml/md文件更新、进度标记）
    - 完整示例操作流程演示
  - 添加PDF扫描处理指引（DocAnalyzer OCR增强）
    - PDF扫描与OCR识别（文字层提取、OCR识别、准确率95%+、多语言支持）
    - 双格式输出设计（带文字层的PDF + Markdown文件）
    - 质量优化机制（预处理、后处理、人工校对、质量报告）
    - 支持法律文档场景（扫描合同、法院传票、证据材料、判决书）
    - 完整示例操作流程演示
  - 编写完整的目录使用说明（README.md）
  - 更新所有相关文档反映新的目录结构
- **规范化案件文档管理结构**

  - 创建output/cases/[案件编号]/目录结构，为9个agents建立专门输出文件夹
  - 细化Writer输出为12种文书类型（起诉状、答辩状、代理词、申请书等）
  - 创建Scheduler期限工时管理（日程安排、工时统计、期限提醒）
  - 建立模板库支持标准化文档生成
  - 编写各目录使用说明和输出格式规范
  - 定义统一命名规范（案件编号、文档命名、版本管理）
- **AI代理协作规范**

  - 重写docs/DEVELOPMENT.md为AI代理协作规范
  - 定义Agent配置、知识库、官方技能集成标准
  - 明确协作流程和工作流编排机制

### 变更 (Changed)

- **项目配置纠正**
  - 清理不必要Python项目配置（setup.py、requirements.txt等）
  - 更新README.md为AI代理协作使用说明
  - 重写DEVELOPMENT.md为AI代理协作规范
  - 重新聚焦Claude Code协作系统核心功能
  - 创建 `docs/` 和 `status/` 目录结构
  - 编写项目路线图 (`docs/ROADMAP.md`)
  - 编写决策记录文档 (`docs/DECISIONS.md`)
  - 编写架构文档 (`docs/ARCHITECTURE.md`)
  - 编写任务清单 (`status/TASKS.md`)
  - 编写变更记录 (`status/CHANGELOG.md`)
  - 编写工作日志 (`status/JOURNAL.md`)
- 建立AI代理协作与文档协议 (`CLAUDE.md`)
- 定义8个核心工作流模块（XXXer命名模式）
  - DocAnalyzer - 起诉文档解析器
  - EvidenceAnalyzer - 证据分析器
  - IssueIdentifier - 争议焦点识别器
  - Researcher - 法律研究者
  - Strategist - 法律策略规划器
  - Writer - 法律文书起草器
  - Summarizer - 报告摘要生成器
  - Reporter - 报告整合器
- 完善SubAgent配置规范
  - 统一配置结构和格式标准
  - 添加详细的概述、功能描述和步骤定义
  - 完善输入输出规范和错误处理机制

### 变更 (Changed)

- 重构项目文档结构，引入模块化设计理念
- 优化架构设计，采用Sub-Workflows设计模式
- **统一Agent命名为XXXer模式** - 所有8个agent采用简洁、功能明确的新命名，提升可读性和易用性
- **实现主Agent自动化工作流编排** - 添加自动化编排功能，支持文件类型自动识别和场景智能匹配，实现一键启动工作流
- **扩展支持沟通记录场景** - 新增"诉前沟通"和"诉讼中沟通"两个自动化场景，分别用于法律服务方案出具和策略优化
- **扩展支持原告起诉场景** - 新增"原告起诉"完整流程，从案件材料到完整起诉材料包（起诉状+证据目录等）
- **扩展支持委托材料制作场景** - 新增"制作委托材料"场景，自动生成委托合同、授权委托书、谈话笔录等
- **大规模扩展核心场景覆盖** - 新增7个重要法律场景（保全申请、上诉材料、律师函、法律意见书、强制执行申请、调解协议、异议申请），场景数量从8个增加到15个，专注于诉讼全流程
- **架构优化：整合模板到Memory知识库** - 将 `.claude/templates/` 中的文书模板整合到标准Memory组件 `.claude/memory/legal_templates.md`，提升管理效率和协作规范性
- **架构优化：移除不符合标准的skills目录** - 删除 `.claude/skills/` 目录，该目录包含的是API文档描述而非真正的Skills，不符合Claude Code标准
- **集成Claude Code官方Skills库** - 从Anthropic官方仓库抓取xlsx、pdf、docx三个官方技能，显著增强项目的文档处理能力
- **DocAnalyzer增强：支持ZIP处理和OCR智能重命名** - 新增压缩包解压、OCR识别、文档类型判断、智能重命名、文件整理等功能，支持法院文件批量处理
- **新增Scheduler工作流：法律期限管理和工时统计** - 实现法定期限自动计算、案件时间线管理、工作记录和工时统计分析，支持律师执业全流程的期限管理和工时管理

### 修复 (Fixed)

- 填补项目缺乏系统化文档的空白

### 移除 (Removed)

- N/A

### 安全 (Security)

- N/A

---

## [v0.1.0] - 2025-10-31

### 新增 (Added)

- 初始项目架构
  - 创建项目README.md
  - 定义核心功能和特性
  - 建立8个工作流的设计理念
  - 设计模块化架构
  - 制定上下文最小化策略
- 基础目录结构
  - `.claude/` 配置目录
  - `data/` 输入数据目录
  - `output/` 输出报告目录
- 基础配置文件
  - `requirements.txt` 依赖管理
  - `CLAUDE.md` 协作协议

### 变更 (Changed)

- N/A

### 修复 (Fixed)

- N/A

### 移除 (Removed)

- N/A

### 安全 (Security)

- N/A

---

## 版本说明

### 版本号规则

- 主版本号：API不兼容的重大变更
- 次版本号：向后兼容的功能增加
- 修订号：向后兼容的问题修复

### 变更类型

- **新增 (Added)**: 新功能、新特性
- **变更 (Changed)**: 对现有功能的修改
- **修复 (Fixed)**: 问题修复
- **移除 (Removed)**: 已移除的功能
- **安全 (Security)**: 安全相关的修复

### 变更记录规范

每次发布新版本时，请按以下格式记录：

```markdown
## [版本号] - 发布日期

### 新增 (Added)
- 简短描述
- 详细说明...

### 变更 (Changed)
- 变更内容描述
- 变更原因和影响...

### 修复 (Fixed)
- 问题描述
- 修复方案...

### 移除 (Removed)
- 已移除功能描述
- 移除原因...

### 安全 (Security)
- 安全漏洞描述
- 修复方案...
```

---

## 重要变更

### [0.1.0] - 2025-10-31

这是项目的首个正式版本，标志着项目启动和基础架构的建立。

**主要变更：**

- 项目初始化完成
- 定义了8个核心工作流
- 建立了文档协作协议
- 创建了基础项目结构

**影响范围：**

- 整个项目
- 所有协作者
