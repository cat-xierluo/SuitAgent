# 任务清单

## 已完成

- [x] 支持远程文档 URL 输入
- [x] 支持 Token 模式下的网页 URL 提取
- [x] 添加 `checktoken` Token 自检入口
- [x] 补充能力矩阵、官方 Crawl 与私有部署说明
- [x] 为精准模式增加模型版本与页码范围配置
- [x] 兼容读取官方 CLI 的 `~/.mineru/config.yaml` Token
- [x] 引入 Auto 模式：未配置 Token 时默认走免登录轻量接口
- [x] 保留标准 Token API 与 archive 归档主链
- [x] 清理 `MINERU_USER_TOKEN` 和未使用配置项
- [x] 创建 MinerU PDF 转 Markdown 技能基础框架
- [x] 实现 MinerU API 调用逻辑（scripts/convert.js）
- [x] 添加配置管理（config/.env）
- [x] 实现转换结果归档功能（archive/）
- [x] 编写 SKILL.md 使用说明
- [x] 添加 CHANGELOG.md 变更日志
- [x] 补充 DECISIONS.md 设计决策记录
- [x] 补充 TASKS.md 任务跟踪文档

## 待办事项

### 优化改进
- [ ] 添加跨平台支持（Windows、Linux）
- [ ] 优化错误处理和用户提示
- [ ] 添加转换进度显示
- [ ] 支持批量文件转换
- [ ] 添加配置验证功能（启动时检查 Token 有效性）

### 文档完善
- [ ] 添加更多故障排除案例
- [ ] 补充常见问题 FAQ
- [ ] 添加使用示例截图

### 功能增强
- [ ] 支持自定义输出格式（如保留原始图片）
- [ ] 添加转换质量选项
- [x] 支持从 URL 直接转换文档
- [ ] 添加转换历史记录管理

### 维护清理
- [ ] 实现 archive/ 目录自动清理（超过 N 天的归档）
- [ ] 添加归档存储空间告警
- [ ] 优化归档命名格式（更简洁）
