flowchart TB
    %% 用户输入层
    A[用户输入模块<br/>• emotions（1-2 个）] --> B

    %% 能量趋势推断
    B[情绪 → 能量趋势推断模块<br/>• 规则映射<br/>• 多情绪合并策略] --> C

    %% 一级方向判定
    C[能量趋势 → 一级方向模块<br/>• high → cool_down<br/>• low → activate<br/>• chaotic → stabilize<br/>• stable → maintain] --> D

    %% 情绪微调方向
    D[情绪微调模块<br/>• 优先方向 +1<br/>• 次优方向 +0.5<br/>• 冲突时选最温和方向] --> E

    %% 活动过滤
    E[活动过滤模块<br/>• scene 匹配<br/>• direction 匹配<br/>• emotions 有交集] --> F

    %% 排序模块
    F[排序模块（Ranking）<br/>• 情绪匹配度<br/>• 场景适配度<br/>• 强度（轻优先）<br/>• 新鲜度] --> G

    %% 输出模块
    G[输出模块<br/>• final_direction<br/>• 3-5 个活动<br/>• debug_info（可选）]
