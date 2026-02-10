

下面这套 TypeScript 类型，会把你刚才那套 JSON Schema 落成 **可直接 import 的类型系统**，分三块：

* 输入层 `RecommendationInput`
* 内部逻辑层 `EngineContext`
* 输出层 `RecommendationOutput`

你可以放在 `types/recommendation.ts` 里统一管理。

* * *

### 基础枚举与类型

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
    
    export type EnergyTrend = "high" | "low" | "chaotic" | "stable";
    
    export type Direction =
      | "cool_down"
      | "activate"
      | "maintain"
      | "stabilize";
    
    export type IntensityPreference = "low" | "medium" | "high";

* * *

### 用户偏好（可选扩展）

    export interface UserPreferences {
      /** 用户不喜欢的活动类型（未来可扩展为枚举） */
      avoid_types?: string[];
      /** 用户偏好的活动强度 */
      preferred_intensity?: IntensityPreference;
    }

* * *

### 活动实体（与 480 条活动表结构对齐）

    export interface Activity {
      id: string;              // ACT-WORK-CD-01
      name: string;            // 深呼吸3次
      description: string;     // 用轻柔呼吸让身体从紧绷回到平稳
      regulation_type: "immediate" | "long_term";
      direction: Direction;
      scene: Scene;
      emotions: Emotion[];     // ["压力", "焦虑"]
    }

* * *

### 推荐引擎输入类型

    export interface RecommendationInput {
      /** 用户当前情绪（1–2 个） */
      emotions: Emotion[];
      /** 用户当前场景（6 大类） */
      scene: Scene;
      /** 用户能量趋势（上升/下降/混乱/平稳） */
      energy_trend: EnergyTrend;
      /** 可选：用户偏好（未来扩展） */
      user_preferences?: UserPreferences;
    }

* * *

### 引擎内部上下文（可选，但工程团队会很爱）

    export interface EngineFilters {
      scene_filter: Scene;
      direction_filter: Direction;
      emotion_filter: Emotion[];
    }
    
    export interface RankingWeights {
      emotion_match: number;
      scene_fit: number;
      intensity: number;
      novelty: number;
    }
    
    export interface EngineContext {
      /** 根据能量趋势推导出的一级方向 */
      primary_direction: Direction;
      /** 根据情绪微调后的方向 */
      emotion_adjusted_direction: Direction;
      /** 最终用于筛选活动的方向 */
      final_direction: Direction;
      /** 用于筛选活动的过滤条件 */
      filters: EngineFilters;
      /** 排序权重（可调） */
      ranking_weights: RankingWeights;
    }

* * *

### 推荐引擎输出类型

    export interface RecommendationDebugInfo {
      primary_direction?: Direction;
      emotion_adjusted_direction?: Direction;
      filters_applied?: string[];
    }
    
    export interface RecommendationOutput {
      /** 最终推荐方向 */
      final_direction: Direction;
      /** 最终推荐的 3–5 个活动 */
      activities: Activity[];
      /** 可选：用于调试和 A/B 测试 */
      debug_info?: RecommendationDebugInfo;
    }

* * *

### 推荐函数签名（工程落地最关键的一行）

    export interface RecommendationEngine {
      (input: RecommendationInput): RecommendationOutput;
    }

* * *


