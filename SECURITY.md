# 安全指南 (Security Guide)

## 概述 (Overview)

本文档概述了 9Emotions 项目的安全实践和改进建议。

## 已实施的安全措施 (Implemented Security Measures)

### 1. 依赖安全 (Dependency Security)
- ✅ **Next.js 已更新**: 从 14.1.0 升级到最新版本，修复了多个严重安全漏洞：
  - SSRF (Server-Side Request Forgery) 漏洞
  - 缓存投毒漏洞
  - DoS (拒绝服务) 漏洞
  - 授权绕过漏洞

### 2. HTTP 安全头 (Security Headers)
在 `next.config.js` 中配置了以下安全头：
- `Strict-Transport-Security`: 强制使用 HTTPS
- `X-Frame-Options`: 防止点击劫持攻击
- `X-Content-Type-Options`: 防止 MIME 类型嗅探
- `X-XSS-Protection`: 启用浏览器内置 XSS 防护
- `Referrer-Policy`: 控制引用信息泄露
- `Permissions-Policy`: 限制浏览器功能访问
- 禁用 `X-Powered-By` 头，避免泄露技术栈信息

### 3. 环境变量管理 (Environment Variables)
- ✅ 创建了 `.env.example` 文件，记录所需环境变量
- ✅ 更新了 `.gitignore`，确保所有环境文件不被提交
- ✅ 使用 `NEXT_PUBLIC_` 前缀标识公开的环境变量
- ⚠️ **注意**: Supabase 密钥使用的是 `ANON_KEY`（匿名密钥），这是公开的，仅用于客户端访问

### 4. 数据库安全 (Database Security)
- ✅ **行级安全 (RLS)**: 已在 Supabase 表上启用 RLS
- ✅ **访问策略**: 已配置基本的访问策略（当前允许匿名访问用于开发）
- ✅ **索引优化**: 添加了索引以提高查询性能
- ⚠️ **待改进**: 需要实施用户认证后，更新 RLS 策略仅允许用户访问自己的数据

### 5. 输入验证 (Input Validation)
- ✅ **CheckInService**: 添加了输入验证
  - 验证情绪数量（1-2 个）
  - 验证能量分数范围（0-100）
  - 限制备注长度（最多 500 字符）
  - 验证日期范围和查询限制
- ✅ **ActivityService**: 添加了结果数量限制和错误处理

### 6. XSS 防护 (XSS Protection)
- ✅ React 默认转义输出，防止 XSS
- ✅ 未使用 `dangerouslySetInnerHTML`
- ✅ 未使用 `eval()` 或其他危险函数
- ✅ 输入数据经过清理和长度限制

## 待改进的安全问题 (Security Issues to Address)

### 1. 高优先级 (High Priority)

#### xlsx 依赖漏洞
- **问题**: `xlsx@0.18.5` 存在原型污染和 ReDoS 漏洞
- **影响**: 仅用于开发脚本（`scripts/import_activities_db.js`），不包含在生产构建中
- **已采取措施**: 
  - 已移动到 `devDependencies`，确保不会打包到生产环境
  - 在脚本中添加了安全警告注释
  - 该脚本仅用于一次性数据导入，不在生产环境运行
- **长期建议解决方案**:
  ```bash
  # 选项 1: 移除 xlsx，转换为 CSV 格式
  npm uninstall xlsx
  # 使用 Node.js 内置的 CSV 解析或 csv-parse 库
  
  # 选项 2: 使用更安全的替代库（如 exceljs）
  npm install --save-dev exceljs
  
  # 选项 3: 将 Excel 文件预先转换为 CSV/JSON
  ```

#### 用户认证系统
- **问题**: 当前未实施用户认证
- **影响**: 所有数据对所有人开放（开发阶段可接受）
- **建议**:
  1. 实施 Supabase Auth
  2. 更新 RLS 策略限制数据访问
  3. 在 `check_ins` 表添加 `user_id` 列
  4. 更新所有查询以过滤用户数据

### 2. 中优先级 (Medium Priority)

#### 速率限制 (Rate Limiting)
- **问题**: 未实施 API 速率限制
- **建议**: 
  - 使用 Supabase 的内置速率限制功能
  - 或在 Next.js 中间件中实施速率限制
  - 使用 `@upstash/ratelimit` 或类似库

#### CSP (Content Security Policy)
- **建议**: 添加 CSP 头以进一步限制资源加载
  ```javascript
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
  ```

#### CORS 配置
- **当前状态**: 使用默认 Next.js CORS 配置
- **建议**: 如果需要跨域访问，明确配置允许的域名

### 3. 低优先级 (Low Priority)

#### 日志和监控
- **建议**: 
  - 实施安全事件日志记录
  - 监控异常访问模式
  - 使用 Sentry 或类似工具进行错误跟踪

#### 代码混淆
- **建议**: 在生产环境中启用代码压缩和混淆

## 最佳实践清单 (Security Checklist)

- [x] 使用最新版本的框架和依赖
- [x] 配置安全 HTTP 头
- [x] 保护环境变量
- [x] 启用数据库行级安全
- [x] 实施输入验证
- [x] 防止 XSS 攻击
- [ ] 实施用户认证和授权
- [ ] 添加 API 速率限制
- [ ] 配置 CSP 头
- [ ] 定期更新依赖
- [ ] 进行安全审计和渗透测试

## 安全响应流程 (Security Response Process)

如果发现安全漏洞：
1. 立即评估漏洞的严重性
2. 如果是紧急漏洞，立即修复并部署
3. 更新相关文档
4. 通知受影响的用户（如果适用）
5. 审查类似的潜在问题

## 定期维护 (Regular Maintenance)

建议定期执行以下任务：
- 每月运行 `npm audit` 检查依赖漏洞
- 每季度审查和更新安全策略
- 定期备份数据
- 监控安全公告和更新

## 联系方式 (Contact)

如有安全问题或发现漏洞，请通过 GitHub Issues 报告。

---

**最后更新**: 2026-02-10
**审核人**: GitHub Copilot AI Agent
