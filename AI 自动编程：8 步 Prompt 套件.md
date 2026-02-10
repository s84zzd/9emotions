**AI 自动编程：8 步 Prompt 套件（从文件夹开始）**
=================================

下面每一段都是你可以直接复制给 AI 的 Prompt。
**Step 1：生成项目文件夹结构（Project Structure）**
=======================================

代码
    你是资深全栈工程师，请根据以下要求生成一个完整的项目文件夹结构（不需要代码）：

    目标：构建一个情绪记录 + 推荐引擎 + 周报/月报系统的 DEMO。

    技术栈：
    - Next.js（App Router）
    - TypeScript
    - TailwindCSS
    - Supabase（数据库）
    - Chart.js（图表）
    - Emotion-based Recommendation Engine（内置逻辑）
    - Report Engine（周报=近7天，月报=当月）

    请输出：
    1. 完整文件夹结构（/app, /components, /lib, /api, /db, /types, /hooks, /charts）
    2. 每个文件夹的用途说明
    3. 每个关键文件的职责说明
    4. 不要生成代码，只生成结构
**Step 2：生成数据库 Schema（Supabase SQL）**
=====================================

代码
    请根据项目需求生成 Supabase SQL：

    数据表：
    - emotions（情绪记录）
    - scenes（场景记录）
    - activities（推荐活动库）
    - reports（周报/月报缓存）
    - users（用户表）

    要求：
    - 字段清晰
    - 类型合理
    - 包含 created_at / updated_at
    - 外键关系明确
    - 不需要示例数据
**Step 3：生成 TypeScript 类型（/types）**
===================================

代码
    请根据数据库结构 + 报告系统需求，生成 TypeScript 类型定义：

    包含：
    - Emotion
    - Scene
    - Activity
    - WeeklyReport（近7天）
    - MonthlyReport（当月）
    - 图表类型（4 个）
    - RecommendationEngine types
    - ReportEngine types

    要求：
    - 使用 interface
    - 模块化
    - 可直接用于前端和 API
**Step 4：生成推荐引擎（/lib/recommendation）**
======================================

代码
    请生成推荐引擎的代码（TypeScript）：

    功能：
    - 输入：emotions（1–2 个）、scene
    - 自动推断能量趋势（high / low / chaotic / stable）
    - 映射一级方向（cool_down / activate / stabilize / maintain）
    - 情绪微调方向（+1 / +0.5）
    - 过滤活动（scene + direction + emotion）
    - 排序（匹配度 + 强度 + 新鲜度）
    - 输出 3–5 个活动

    要求：
    - 纯函数
    - 无副作用
    - 可测试
    - 返回结构化结果
**Step 5：生成报告引擎（/lib/report）**
==============================

代码
    请生成报告引擎代码（TypeScript）：

    功能：
    - 周报 = 近 7 天（rolling 7 days）
    - 月报 = 当月（calendar month）
    - 自动生成：
      - 情绪概览
      - 场景洞察
      - 亮点
      - 挑战
      - 建议（周报=短期；月报=长期）
      - 图表数据（4 张图）

    要求：
    - 输入：用户最近 30 天的情绪 + 场景数据
    - 输出：WeeklyReport 或 MonthlyReport 类型
    - 纯函数
    - 模块化
**Step 6：生成 API（/app/api/...）**
===============================

代码
    请生成 Next.js API 代码：

    API：
    - POST /api/emotion → 写入情绪记录
    - GET /api/recommend → 返回推荐活动
    - GET /api/report/weekly → 返回周报（近7天）
    - GET /api/report/monthly → 返回月报（当月）

    要求：
    - 使用 Supabase client
    - 输入校验（zod）
    - 返回 JSON
    - 错误处理清晰
**Step 7：生成前端页面（/app/...）**
===========================

代码
    请生成 Next.js 前端页面代码：

    页面：
    - / → 情绪记录页
    - /recommend → 推荐结果页
    - /report/weekly → 周报页（含 2 张图表）
    - /report/monthly → 月报页（含 2 张图表）

    要求：
    - 使用 TailwindCSS
    - 使用组件库（你会在下一步生成）
    - 图表使用 Chart.js
    - 页面结构清晰
**Step 8：生成 UI 组件库（/components）**
=================================

代码
    请生成 UI 组件库代码：

    组件：
    - SectionHeader
    - EmotionTag
    - SceneTag
    - TrendTag
    - InsightCard
    - HighlightCard
    - ChallengeCard
    - RecommendationCard
    - ChartContainer
    - LayoutContainer

    要求：
    - TailwindCSS
    - 轻柔、女性向、圆角、留白
    - 可复用
🌟 你现在拥有一套完整的「AI 自动编程 Prompt 套件」
================================

这套 Prompt 的特点：

* **高度抽象 → AI 能自动补全细节**

* **模块化 → 每一步都能独立执行**

* **从文件夹结构 → 数据库 → 类型 → 引擎 → API → UI**

* **完全符合你当前的产品架构**

* **适配所有主流 AI 编程工具**

你只需要按顺序把这些 Prompt 给 AI，它就能自动生成整个 DEMO。
