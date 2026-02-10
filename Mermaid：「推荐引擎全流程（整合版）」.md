🌟 Mermaid：「推荐引擎全流程（整合版）」
=========================

mermaid
    flowchart TB

    %% 用户输入层
    A[用户输入<br/>• emotions（1-2 个）<br/>• scene（自动识别或用户选择）] --> B

    %% 情绪 → 能量趋势
    B[Step 1：情绪 → 能量趋势推断<br/><br/>烦躁/压力 → high<br/>焦虑 → chaotic<br/>无助/疲惫/忧郁 → low<br/>平静/满足/期待 → stable] --> C

    %% 能量趋势 → 一级方向
    C[Step 2：能量趋势 → 一级方向<br/><br/>high → cool_down<br/>low → activate<br/>chaotic → stabilize<br/>stable → maintain] --> D

    %% 情绪微调方向
    D[Step 3：情绪微调方向<br/><br/>优先方向 +1<br/>次优方向 +0.5<br/>冲突时选最温和方向] --> E

    %% 活动过滤
    E[Step 4：活动过滤<br/><br/>保留：<br/>• scene 匹配<br/>• direction 匹配<br/>• emotions 有交集] --> F

    %% 排序模块
    F[Step 5：排序（Ranking）<br/><br/>• 情绪匹配度<br/>• 场景适配度<br/>• 强度（轻优先）<br/>• 新鲜度（避免重复）] --> G

    %% 输出模块
    G[Step 6：输出推荐<br/><br/>• final_direction<br/>• 3-5 个活动<br/>• debug_info（可选）]
🌈 这张图的价值（你可以写进 PRD）
====================

### **1. 一图串起整个推荐引擎**

从输入 → 推断 → 方向 → 过滤 → 排序 → 输出所有逻辑一目了然。

### **2. 工程团队可以直接按模块拆分开发**

* emotion-to-energy 模块

* energy-to-direction 模块

* direction refinement 模块

* activity filtering 模块

* ranking 模块

* output formatter

### **3. 内容团队也能理解推荐逻辑**

知道每个活动为什么会被推荐。

### **4. UI 团队可以根据流程设计交互**

例如：

* 用户只需选情绪

* 场景自动识别或轻选择

* 推荐卡片展示 3–5 条
