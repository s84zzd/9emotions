flowchart TD
    A[用户输入情绪<br/>（1-2 个）] --> B{情绪类型判断}

    %% 高能量（High）
    B -->|烦躁 / 压力| C[能量趋势：high<br/>（能量过高）]

    %% 混乱（Chaotic）
    B -->|焦虑| D[能量趋势：chaotic<br/>（能量混乱）]

    %% 低能量（Low）
    B -->|无助 / 疲惫 / 忧郁| E[能量趋势：low<br/>（能量过低）]

    %% 平稳（Stable）
    B -->|平静 / 满足 / 期待| F[能量趋势：stable<br/>（能量平稳）]

    %% 输出
    C --> G[输出：high]
    D --> G[输出：chaotic]
    E --> G[输出：low]
    F --> G[输出：stable]
