import { EMOTIONS, EMOTION_MAP } from "@/lib/constants";
import { EmotionNameEn, RegulationDirection, EnergyTrend } from "@/types/emotion";
import { Scene } from "@/types/report";

// 能量趋势到推荐方向的映射（一级逻辑）
export const TREND_TO_DIRECTION: Record<EnergyTrend, RegulationDirection> = {
  high: "cool_down",
  low: "activate",
  chaotic: "stabilize",
  stable: "maintain",
  medium: "maintain", // 满足和期待归为 maintain
};

// 情绪微调方向（二级逻辑）
export const EMOTION_DIRECTION_PRESETS: Record<EmotionNameEn, { primary: RegulationDirection; secondary?: RegulationDirection }> = {
  Joy: { primary: "maintain" },
  Calm: { primary: "maintain" },
  Fulfillment: { primary: "maintain" },
  Anticipation: { primary: "maintain", secondary: "activate" },
  Anxiety: { primary: "stabilize", secondary: "cool_down" },
  Stress: { primary: "cool_down", secondary: "stabilize" },
  LowMood: { primary: "activate", secondary: "stabilize" },
  Fatigue: { primary: "activate", secondary: "maintain" },
  Regret: { primary: "activate", secondary: "stabilize" },
  Doubt: { primary: "stabilize", secondary: "activate" },
};

// 场景过滤规则描述（三级逻辑 - 实际过滤在 core.ts 中通过 activity.scene_id 实现）
export const SCENE_CONSTRAINTS: Record<Scene, string> = {
  work: "不可离开太久、不做大动作、不打断工作流",
  study: "不可强刺激、不跳出学习状态",
  relationship: "不制造冲突、不引发对方误解",
  family: "不制造额外负担、不引发紧张",
  alone: "可自由、可身体动作、可表达",
  social: "必须隐蔽、不突兀、不引人注意",
};
