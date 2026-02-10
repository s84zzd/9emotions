# 9Emotions (9情绪)

> 觉察每一次情绪流动，发现内心的能量。

9Emotions 是一个专注于情绪追踪与调节的 Web 应用程序。通过记录当下的情绪状态和场景，系统会基于心理学原理为您推荐个性化的调节活动，并生成周期性的情绪洞察报告，帮助您更好地了解和管理自己的情绪能量。

## ✨ 主要功能

- **情绪打卡 (Check-in)**
  - 精心设计的 9 种基础情绪选择（焦虑、忧郁、压力、期待、懊悔、怀疑、快乐、平静、满足）。
  - 结合 6 种生活场景（工作、学习、亲密关系、家庭、独处、社交）。
  - 沉浸式 UI 体验，使用弥散渐变与流畅动效。

- **智能推荐引擎**
  - 基于当前情绪能量（激活/平静）和方向（正向/负向），智能推荐调节活动。
  - 内置丰富的活动库，涵盖冥想、运动、阅读、社交等多种类型。

- **数据洞察报告**
  - **周报**: 7天能量趋势图、场景频率分析。
  - **月报**: 30天情绪结构分析、长周期模式识别。
  - 可视化图表展示，直观呈现情绪变化。

- **移动端适配**
  - 响应式设计，完美适配手机浏览器。
  - 类似原生 App 的交互体验，底部导航栏快速切换。

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图表**: Chart.js / React-chartjs-2
- **图标**: Lucide React
- **数据处理**: XLSX (用于导入活动库)

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或者
yarn install
```

### 环境配置

1. 复制 `.env.example` 文件并重命名为 `.env.local`
2. 填入你的 Supabase 项目配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 并填入实际的 Supabase 配置。

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可查看应用。

### 手机端预览

确保手机和电脑连接同一 Wi-Fi，运行以下命令启动服务：

```bash
npm run dev -- -H 0.0.0.0
```

然后在手机浏览器输入电脑的局域网 IP 地址（例如 `http://192.168.x.x:3000`）。

## 📂 项目结构

```
9emotions/
├── app/                  # Next.js 应用路由
│   ├── check-in/         # 打卡页面
│   ├── reports/          # 报表页面 (周报/月报)
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局 (包含底部导航)
│   └── page.tsx          # 首页
├── components/           # 可复用组件
│   └── BottomNav.tsx     # 底部导航栏
├── lib/                  # 核心逻辑库
│   ├── recommendation-engine/ # 推荐引擎核心
│   ├── report-engine/    # 报表生成引擎
│   └── constants.ts      # 常量定义
├── types/                # TypeScript 类型定义
└── public/               # 静态资源
```

## 📅 待办事项 (Roadmap)

- [x] 基础 UI 搭建与动效实现
- [x] 推荐引擎逻辑开发
- [x] 周报/月报功能实现
- [x] 移动端适配与高保真重构
- [x] **安全审计与改进** (已完成基础安全措施)
- [ ] **接入 Supabase 数据库** (进行中)
- [ ] 用户认证体系 (Login/Auth)
- [ ] 更多个性化设置

## 🔒 安全

本项目已实施基本安全措施，包括：
- 更新依赖以修复已知漏洞
- 配置 HTTP 安全头
- 输入验证和清理
- 数据库行级安全 (RLS)

详细信息请参阅 [SECURITY.md](./SECURITY.md)。

## 📄 许可证

[MIT](LICENSE)
