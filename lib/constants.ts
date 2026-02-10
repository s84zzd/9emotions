import { EmotionDefinition } from "@/types/emotion";

export const EMOTIONS: EmotionDefinition[] = [
  { zh: "快乐", en: "Joy", energy: [65, 85], value: 2, trend: "high", direction: "maintain" },
  { zh: "平静", en: "Calm", energy: [20, 40], value: -1, trend: "stable", direction: "maintain" },
  { zh: "满足", en: "Fulfillment", energy: [45, 65], value: 0, trend: "medium", direction: "maintain" },
  { zh: "期待", en: "Anticipation", energy: [55, 75], value: 1, trend: "medium", direction: "activate" },
  { zh: "焦虑", en: "Anxiety", energy: [70, 90], value: 2, trend: "chaotic", direction: "stabilize" },
  { zh: "压力", en: "Stress", energy: [60, 80], value: 2, trend: "high", direction: "cool_down" },
  { zh: "忧郁", en: "LowMood", energy: [10, 30], value: -2, trend: "low", direction: "activate" },
  { zh: "疲惫", en: "Fatigue", energy: [10, 30], value: -2, trend: "low", direction: "activate" },
  { zh: "懊悔", en: "Regret", energy: [25, 45], value: -1, trend: "low", direction: "activate" },
  { zh: "怀疑", en: "Doubt", energy: [40, 60], value: 0, trend: "medium", direction: "stabilize" }
];

export const EMOTION_MAP = EMOTIONS.reduce((acc, emotion) => {
  acc[emotion.en] = emotion;
  return acc;
}, {} as Record<string, EmotionDefinition>);

export const EMOTION_ZH_MAP = EMOTIONS.reduce((acc, emotion) => {
  acc[emotion.zh] = emotion;
  return acc;
}, {} as Record<string, EmotionDefinition>);
