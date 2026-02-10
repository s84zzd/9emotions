import { EmotionNameEn, RegulationDirection, EnergyTrend } from "@/types/emotion";
import { Scene } from "@/types/report";
import { Activity } from "@/types/activity";
import { EMOTION_MAP } from "@/lib/constants";
import { TREND_TO_DIRECTION, EMOTION_DIRECTION_PRESETS } from "./rules";

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
  availableActivities: Activity[]; // Add this
}

export class RecommendationEngine {
  /**
   * 核心推荐算法 - 完整实现流程图逻辑
   */
  static recommend(context: RecommendationContext): RecommendationResult {
    const { emotions, scene, availableActivities } = context;

    // Step 3: 情绪微调方向 (加权计算)
    // 同时也获取 scores 用于 debug
    const { direction: targetDirection, scores } = this.calculateWeightedDirection(emotions);

    // Step 4 & 5: 场景过滤 & 活动排序
    const activities = this.filterAndRankActivities(availableActivities, targetDirection, scene, emotions);

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
    activities: Activity[],
    direction: RegulationDirection,
    scene: Scene,
    emotions: EmotionNameEn[]
  ): Activity[] {
    // 1. 过滤 (Filter)
    const candidates = activities.filter(act => {
      // 必须匹配方向
      if (act.direction !== direction) return false;
      // 必须匹配场景
      if (!act.scenes.includes(scene)) return false;
      return true;
    });

    // 2. 排序 (Rank)
    // 策略：按强度分组 -> 组内随机洗牌 -> 按强度优先级合并 -> 取前3
    
    // Helper to shuffle array
    const shuffle = <T>(array: T[]): T[] => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const low = candidates.filter(c => c.intensity === 'low');
    const medium = candidates.filter(c => c.intensity === 'medium');
    const high = candidates.filter(c => c.intensity === 'high');

    // 组内随机
    const shuffledLow = shuffle(low);
    const shuffledMedium = shuffle(medium);
    const shuffledHigh = shuffle(high);

    // 合并：优先推荐低强度，如果不够再补中强度，最后高强度
    // TODO: 未来可以根据用户当前能量值动态调整优先级（例如能量极低时只推low）
    return [...shuffledLow, ...shuffledMedium, ...shuffledHigh].slice(0, 3);
  }
}
