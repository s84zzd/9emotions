export type EmotionNameZh = "快乐" | "平静" | "满足" | "期待" | "焦虑" | "压力" | "忧郁" | "疲惫" | "懊悔" | "怀疑";
export type EmotionNameEn = "Joy" | "Calm" | "Fulfillment" | "Anticipation" | "Anxiety" | "Stress" | "LowMood" | "Fatigue" | "Regret" | "Doubt";

export type EnergyTrend = "high" | "stable" | "medium" | "chaotic" | "low";
export type RegulationDirection = "maintain" | "activate" | "stabilize" | "cool_down";

export interface EmotionDefinition {
  zh: EmotionNameZh;
  en: EmotionNameEn;
  energy: [number, number]; // [min, max]
  value: number; // -2 ~ +2 (mapping for charts/db)
  trend: EnergyTrend;
  direction: RegulationDirection;
  description?: string; // 简短描述
  color?: string; // 对应的主色调 hex
}
