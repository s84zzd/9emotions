

* * *

🌟 推荐引擎 JSON Schema（可直接用于工程实现）
==============================

以下 Schema 使用 **JSON Schema Draft-07** 风格，工程团队可直接复制使用。

* * *

**1. 推荐引擎输入（Input Schema）**
---------------------------

    {
      "$id": "https://emotion-app/recommendation/input.schema.json",
      "title": "RecommendationEngineInput",
      "type": "object",
      "required": ["emotions", "scene", "energy_trend"],
      "properties": {
        "emotions": {
          "type": "array",
          "minItems": 1,
          "maxItems": 2,
          "items": {
            "type": "string",
            "enum": [
              "压力", "烦躁", "焦虑",
              "无助", "疲惫", "忧郁",
              "平静", "满足", "期待"
            ]
          },
          "description": "用户当前情绪（1–2 个）"
        },
        "scene": {
          "type": "string",
          "enum": [
            "work", "study", "relationship",
            "family", "alone", "social"
          ],
          "description": "用户当前场景（6 大类）"
        },
        "energy_trend": {
          "type": "string",
          "enum": ["high", "low", "chaotic", "stable"],
          "description": "用户能量趋势（上升/下降/混乱/平稳）"
        },
        "user_preferences": {
          "type": "object",
          "description": "可选：用户偏好（未来扩展）",
          "properties": {
            "avoid_types": {
              "type": "array",
              "items": { "type": "string" },
              "description": "用户不喜欢的活动类型"
            },
            "preferred_intensity": {
              "type": "string",
              "enum": ["low", "medium", "high"],
              "description": "用户偏好的活动强度"
            }
          }
        }
      }
    }

* * *

**2. 推荐引擎内部处理（Engine Logic Schema）**
------------------------------------

这个 Schema 用于工程团队定义内部逻辑模块的结构（非对外 API）。
    {
      "$id": "https://emotion-app/recommendation/engine.schema.json",
      "title": "RecommendationEngineLogic",
      "type": "object",
      "properties": {
        "primary_direction": {
          "type": "string",
          "enum": ["cool_down", "activate", "maintain", "stabilize"],
          "description": "根据能量趋势推导出的一级方向"
        },
        "emotion_adjusted_direction": {
          "type": "string",
          "enum": ["cool_down", "activate", "maintain", "stabilize"],
          "description": "根据情绪微调后的方向"
        },
        "final_direction": {
          "type": "string",
          "enum": ["cool_down", "activate", "maintain", "stabilize"],
          "description": "最终用于筛选活动的方向"
        },
        "filters": {
          "type": "object",
          "properties": {
            "scene_filter": { "type": "string" },
            "direction_filter": { "type": "string" },
            "emotion_filter": {
              "type": "array",
              "items": { "type": "string" }
            }
          },
          "description": "用于筛选活动的过滤条件"
        },
        "ranking_weights": {
          "type": "object",
          "properties": {
            "emotion_match": { "type": "number" },
            "scene_fit": { "type": "number" },
            "intensity": { "type": "number" },
            "novelty": { "type": "number" }
          },
          "description": "排序权重（可调）"
        }
      }
    }

* * *

**3. 推荐引擎输出（Output Schema）**
----------------------------

这是前端、客户端、UI 团队会直接使用的输出结构。
    {
      "$id": "https://emotion-app/recommendation/output.schema.json",
      "title": "RecommendationEngineOutput",
      "type": "object",
      "required": ["activities", "final_direction"],
      "properties": {
        "final_direction": {
          "type": "string",
          "enum": ["cool_down", "activate", "maintain", "stabilize"],
          "description": "最终推荐方向"
        },
        "activities": {
          "type": "array",
          "minItems": 3,
          "maxItems": 5,
          "items": {
            "type": "object",
            "required": ["id", "name", "description", "scene", "direction"],
            "properties": {
              "id": { "type": "string" },
              "name": { "type": "string" },
              "description": { "type": "string" },
              "scene": { "type": "string" },
              "direction": { "type": "string" },
              "emotions": {
                "type": "array",
                "items": { "type": "string" }
              }
            }
          },
          "description": "最终推荐的 3–5 个活动"
        },
        "debug_info": {
          "type": "object",
          "description": "可选：用于调试和 A/B 测试",
          "properties": {
            "primary_direction": { "type": "string" },
            "emotion_adjusted_direction": { "type": "string" },
            "filters_applied": {
              "type": "array",
              "items": { "type": "string" }
            }
          }
        }
      }
    }

* * *

🌈 工程团队看到会非常开心，因为：
==================

* 输入、内部逻辑、输出 **三层结构清晰**
* 字段类型、枚举值、约束都非常明确
* 可直接用于 **TypeScript、Go、Java、Python** 的类型生成
* 可直接用于 **API 校验、日志埋点、A/B 测试**
* 完全贴合你产品的哲学：温柔、轻量、可扩展

* * *


===================
