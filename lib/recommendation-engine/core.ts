import { EmotionNameEn, RegulationDirection, EnergyTrend } from "@/types/emotion";
import { Scene } from "@/types/report";
import { Activity } from "@/types/activity";
import { EMOTION_MAP } from "@/lib/constants";
import { TREND_TO_DIRECTION, EMOTION_DIRECTION_PRESETS } from "./rules";

import { ACTIVITIES } from "@/lib/data/activities";

export interface RecommendationResult {
  activities: Activity[];
  final_direction: RegulationDirection;
  debug_info?: {
    trend: EnergyTrend;
    scores: Record<RegulationDirection, number>;
  };
}


export interface RecommendationContext {
  emotions: EmotionNameEn[];
  scene: Scene;
}

export class RecommendationEngine {
  /**
   * 核心推荐算法 - 完整实现流程图逻辑
   */
  static recommend(context: RecommendationContext): RecommendationResult {
    const { emotions, scene } = context;

    // Step 3: 情绪微调方向 (加权计算)
    // 同时也获取 scores 用于 debug
    const { direction: targetDirection, scores } = this.calculateWeightedDirection(emotions);

    // Step 4 & 5: 场景过滤 & 活动排序
    const activities = this.filterAndRankActivities(targetDirection, scene, emotions);

    // Step 6: 输出推荐
    return {
      activities,
      final_direction: targetDirection,
      debug_info: {
        trend: this.calculateTrend(emotions), // 仅供展示
        scores
      }
    };
  }

  /**
   * 辅助：计算基础能量趋势 (Step 1)
   */
  private static calculateTrend(emotions: EmotionNameEn[]): EnergyTrend {
     if (emotions.length === 0) return "stable";
     // 简单逻辑：取第一个情绪的趋势
     return EMOTION_MAP[emotions[0]].trend;
  }

  /**
   * Step 3: 情绪微调方向 - 加权算法
   * 规则：优先方向 +1.0，次优方向 +0.5
   */
  private static calculateWeightedDirection(emotions: EmotionNameEn[]): { direction: RegulationDirection, scores: Record<RegulationDirection, number> } {
    const scores: Record<RegulationDirection, number> = {
      activate: 0,
      cool_down: 0,
      stabilize: 0,
      maintain: 0,
    };

    if (emotions.length === 0) return { direction: "maintain", scores };

    emotions.forEach(emotion => {
      const preset = EMOTION_DIRECTION_PRESETS[emotion];
      if (preset) {
        // 累加分数
        scores[preset.primary] += 1.0;
        if (preset.secondary) {
          scores[preset.secondary] += 0.5;
        }
      }
    });

    // 找出得分最高的方向
    let bestDirection: RegulationDirection = "maintain";
    let maxScore = -1;

    // 定义方向的“温和度”优先级 (当分数相同时，优先选择更温和的方向)
    // 顺序：maintain (最温和) > stabilize > cool_down > activate (最强烈)
    const gentlenessPriority: RegulationDirection[] = ["maintain", "stabilize", "cool_down", "activate"];

    // 遍历寻找最高分
    (Object.keys(scores) as RegulationDirection[]).forEach(dir => {
      const score = scores[dir];
      if (score > maxScore) {
        maxScore = score;
        bestDirection = dir;
      } else if (score === maxScore) {
        // 分数相同，比较温和度 (index 越小越温和)
        const currentPriority = gentlenessPriority.indexOf(bestDirection);
        const newPriority = gentlenessPriority.indexOf(dir);
        if (newPriority < currentPriority) {
          bestDirection = dir;
        }
      }
    });

    return { direction: bestDirection, scores };
  }

  /**
   * Step 4 & 5: 过滤与排序
   */
  private static filterAndRankActivities(
    direction: RegulationDirection,
    scene: Scene,
    emotions: EmotionNameEn[]
  ): Activity[] {
    // 1. 过滤 (Filter)
    const candidates = ACTIVITIES.filter(act => {
      // 必须匹配方向
      if (act.direction !== direction) return false;
      // 必须匹配场景
      if (!act.scenes.includes(scene)) return false;
      return true;
    });

    // 2. 排序 (Rank)
    // 排序规则：强度(low > medium > high) -> 匹配度(简化为默认) -> 新鲜度(随机扰动)
    return candidates.sort((a, b) => {
      // 优先级 1: 强度 (Intensity) - 越轻越好
      const intensityScore = { low: 1, medium: 2, high: 3 };
      if (intensityScore[a.intensity] !== intensityScore[b.intensity]) {
        return intensityScore[a.intensity] - intensityScore[b.intensity];
      }

      // 优先级 2: 时长 (Duration) - 越短越好 (作为轻量的代理指标)
      if (a.duration_min !== b.duration_min) {
          return a.duration_min - b.duration_min;
      }

      // 优先级 3: 新鲜度 (随机扰动 - 简单模拟)
      return Math.random() - 0.5;
    }).slice(0, 3); // 返回前3个
  }
}
