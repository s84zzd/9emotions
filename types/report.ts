import { EmotionNameZh } from "@/types/emotion";

// 使用核心常量作为 Source of Truth
export type Emotion = EmotionNameZh;

export type Scene =
  | "work"
  | "study"
  | "relationship"
  | "family"
  | "alone"
  | "social";

// 报告中的趋势描述 (Rising/Falling) 区别于情绪本身的能量趋势 (High/Low)
export type EmotionTrend = "rising" | "falling" | "chaotic" | "stable";

export interface WeeklyEmotionTrendPoint {
  date: string;        // "2026-02-02"
  energy: number;      // -2 ~ +2
  emotion: Emotion;    // "压力"
}

export interface WeeklyEmotionTrendChart {
  type: "weekly_emotion_trend";
  data: WeeklyEmotionTrendPoint[];
}

export interface WeeklySceneFrequencyItem {
  scene: Scene;
  count: number;
}

export interface WeeklySceneFrequencyChart {
  type: "weekly_scene_frequency";
  data: WeeklySceneFrequencyItem[];
}

export interface MonthlyEmotionStructureItem {
  emotion: Emotion;
  count: number;
}

export interface MonthlyEmotionStructureChart {
  type: "monthly_emotion_structure";
  data: MonthlyEmotionStructureItem[];
}

export interface MonthlyEmotionTrendPoint {
  day: number;     // 1 ~ 30
  energy: number;  // -2 ~ +2
}

export interface MonthlyEmotionTrendChart {
  type: "monthly_emotion_trend";
  data: MonthlyEmotionTrendPoint[];
}

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

export type Report = WeeklyReport | MonthlyReport;
