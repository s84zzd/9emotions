##  周报 / 月报 TypeScript 类型定义

**基础类型（Shared）**
----------------

    export type Emotion =
      | "压力"
      | "烦躁"
      | "焦虑"
      | "无助"
      | "疲惫"
      | "忧郁"
      | "平静"
      | "满足"
      | "期待";
    
    export type Scene =
      | "work"
      | "study"
      | "relationship"
      | "family"
      | "alone"
      | "social";
    
    export type EmotionTrend = "rising" | "falling" | "chaotic" | "stable";

* * *

🌈 **图表类型（Charts）**
===================

**周报图表（Weekly = 近 7 天）**
------------------------

### 1. 情绪波动折线图（Emotion Trend Line）

    export interface WeeklyEmotionTrendPoint {
      date: string;        // "2026-02-02"
      energy: number;      // -2 ~ +2
      emotion: Emotion;    // "压力"
    }
    
    export interface WeeklyEmotionTrendChart {
      type: "weekly_emotion_trend";
      data: WeeklyEmotionTrendPoint[];
    }

### 2. 场景分布条形图（Scene Frequency Bar）

    export interface WeeklySceneFrequencyItem {
      scene: Scene;
      count: number;
    }
    
    export interface WeeklySceneFrequencyChart {
      type: "weekly_scene_frequency";
      data: WeeklySceneFrequencyItem[];
    }

* * *

**月报图表（Monthly = 当月）**
----------------------

### 1. 情绪结构玫瑰图（Emotion Structure Rose）

    export interface MonthlyEmotionStructureItem {
      emotion: Emotion;
      count: number;
    }
    
    export interface MonthlyEmotionStructureChart {
      type: "monthly_emotion_structure";
      data: MonthlyEmotionStructureItem[];
    }

### 2. 情绪趋势曲线（Emotion Trend Curve）

    export interface MonthlyEmotionTrendPoint {
      day: number;     // 1 ~ 30
      energy: number;  // -2 ~ +2
    }
    
    export interface MonthlyEmotionTrendChart {
      type: "monthly_emotion_trend";
      data: MonthlyEmotionTrendPoint[];
    }

* * *

🌟 **周报类型（Weekly Report = 近 7 天）**
==================================

    export interface WeeklyReport {
      period: "weekly"; // 近7天
      emotion_summary: {
        top_emotions: Emotion[];
        emotion_trend: EmotionTrend;
        positive_ratio: number;
        negative_ratio: number;
      };
      scene_insights: Array<{
        scene: Scene;
        frequency: number;
        dominant_emotions: Emotion[];
        insight: string;
      }>;
      highlights: string[];
      challenges: string[];
      recommendations: Array<{
        type: "short_term";
        content: string;
      }>;
      charts: [
        WeeklyEmotionTrendChart,
        WeeklySceneFrequencyChart
      ];
    }

* * *

🌈 **月报类型（Monthly Report = 当月）**
================================

    export interface MonthlyReport {
      period: "monthly"; // 当月
      emotion_structure: {
        positive_ratio: number;
        negative_ratio: number;
        dominant_emotions: Emotion[];
      };
      trend_analysis: {
        emotion_trend: EmotionTrend;
        pattern: string; // “高压力 + 高恢复”等
      };
      scene_patterns: Array<{
        scene: Scene;
        frequency: number;
        dominant_emotions: Emotion[];
        insight: string;
      }>;
      highlights: string[];
      challenges: string[];
      recommendations: Array<{
        type: "long_term";
        content: string;
      }>;
      charts: [
        MonthlyEmotionStructureChart,
        MonthlyEmotionTrendChart
      ];
    }

* * *

🌟 **顶层类型（自动识别周报 / 月报）**
========================

    export type Report = WeeklyReport | MonthlyReport;

* * *

🌈 你现在拥有的能力（非常强）
================

这套类型定义已经完全支持：

* 周报 = 近 7 天
* 月报 = 当月
* 图表自动适配周期
* 图表数据结构清晰
* 文案模块化
* 洞察与建议可自动生成
* 工程团队可以直接实现
* 内容团队可以直接填充

你现在的报告系统已经具备 **产品级别的完整性**。

* * *

🌟 如果你愿意，我还能继续为你构建：
===================

### ✔ 更新后的「报告生成引擎伪代码（可直接实现）」

### ✔ 图表生成引擎的 TypeScript 类型定义

### ✔ 周报 / 月报的 UI 布局（图表 + 文案）

### ✔ 周报 / 月报的文案库（100+ 条可直接使用）

### ✔ 报告生成引擎的 Mermaid 数据流图（DFD）

你想继续哪一个方向，我马上为你构建。
