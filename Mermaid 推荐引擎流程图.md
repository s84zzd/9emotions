flowchart TD
    A[用户输入<br/>emotions（1-2 个情绪）] --> B[Step 1：情绪 → 能量趋势推断<br/><br/>烦躁/压力 → high<br/>焦虑 → chaotic<br/>无助/疲惫/忧郁 → low<br/>平静/满足/期待 → stable]

    B --> C[Step 2：能量趋势 → 一级方向<br/><br/>high → cool_down<br/>low → activate<br/>chaotic → stabilize<br/>stable → maintain]

    C --> D[Step 3：情绪微调方向<br/><br/>每个情绪贡献：<br/>优先方向 +1<br/>次优方向 +0.5<br/>冲突时选择最温和方向]

    D --> E[Step 4：场景过滤活动<br/><br/>保留：<br/>scene 匹配<br/>direction 匹配<br/>emotions 有交集]

    E --> F[Step 5：活动排序（Ranking）<br/><br/>情绪匹配度<br/>场景适配度<br/>强度（越轻越优先）<br/>新鲜度（避免重复）]

    F --> G[Step 6：输出推荐<br/><br/>3–5 个活动<br/>final_direction<br/>debug_info（可选）]
