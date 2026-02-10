"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EMOTIONS } from "@/lib/constants";
import { RecommendationEngine, RecommendationResult } from "@/lib/recommendation-engine/core";
import { CheckInService } from "@/lib/services/checkIn";
import { ActivityService } from "@/lib/services/activity";
import { ACTIVITIES as FALLBACK_ACTIVITIES } from "@/lib/data/activities";
import type { EmotionNameEn, RegulationDirection } from "@/types/emotion";
import type { Scene } from "@/types/report";
import type { Activity } from "@/types/activity";
import { 
  Check,
  X,
  ArrowRight,
  Loader2,
  Waves, 
  Sparkles, 
  Zap, 
  Wind, 
  Infinity as InfinityIcon, 
  HelpCircle, 
  Moon, 
  Sun, 
  Star,
  Coffee,
  BookOpen,
  Heart,
  Home,
  User,
  Users
} from "lucide-react";

// UI Config for Emotions (High Fidelity)
const EMOTION_UI_CONFIG: Record<string, { gradient: string; icon: any; color: string; shadow: string }> = {
  "焦虑": { 
    gradient: "from-[#FF9A9E] to-[#FECFEF]", // Pinkish
    icon: Waves, 
    color: "text-rose-700",
    shadow: "shadow-pink-200"
  },
  "忧郁": { 
    gradient: "from-[#a18cd1] to-[#fbc2eb]", // Blue/Purple
    icon: Sparkles, 
    color: "text-indigo-700",
    shadow: "shadow-purple-200"
  },
  "压力": { 
    gradient: "from-[#ffecd2] to-[#fcb69f]", // Orange
    icon: Sparkles, 
    color: "text-orange-700",
    shadow: "shadow-orange-200"
  },
  "期待": { 
    gradient: "from-[#f6d365] to-[#fda085]", // Warm Yellow
    icon: Waves, 
    color: "text-amber-800",
    shadow: "shadow-orange-200"
  },
  "懊悔": { 
    gradient: "from-[#c471f5] to-[#fa71cd]", // Purple
    icon: InfinityIcon, 
    color: "text-purple-800",
    shadow: "shadow-purple-200"
  },
  "怀疑": { 
    gradient: "from-[#84fab0] to-[#8fd3f4]", // Green/Blue
    icon: HelpCircle, 
    color: "text-teal-800",
    shadow: "shadow-teal-200"
  },
  "快乐": { 
    gradient: "from-[#fa709a] to-[#fee140]", // Yellow/Red
    icon: Moon, // "Yellow Moon"
    color: "text-rose-800",
    shadow: "shadow-yellow-200"
  },
  "平静": { 
    gradient: "from-[#89f7fe] to-[#66a6ff]", // Blue
    icon: Waves, 
    color: "text-blue-800",
    shadow: "shadow-blue-200"
  },
  "满足": { 
    gradient: "from-[#fdfbfb] to-[#ebedee]", // White
    icon: Star, 
    color: "text-slate-600",
    shadow: "shadow-gray-200"
  }
};

// 场景定义
const SCENES: { id: Scene; label: string; icon: any }[] = [
  { id: "work", label: "工作", icon: Coffee },
  { id: "study", label: "学习", icon: BookOpen },
  { id: "relationship", label: "亲密关系", icon: Heart },
  { id: "family", label: "家庭", icon: Home },
  { id: "alone", label: "独处", icon: User },
  { id: "social", label: "社交", icon: Users },
];

export default function CheckInPage() {
  // 状态管理
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionNameEn[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>(FALLBACK_ACTIVITIES);

  // 加载活动库
  useEffect(() => {
    const loadActivities = async () => {
      const data = await ActivityService.getAll();
      if (data && data.length > 0) {
        setAllActivities(data);
      }
    };
    loadActivities();
  }, []);

  // 处理情绪选择（最多2个）
  const toggleEmotion = (emotion: EmotionNameEn) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotion)) {
        return prev.filter((e) => e !== emotion);
      }
      if (prev.length >= 2) {
        return [prev[1], emotion]; 
      }
      return [...prev, emotion];
    });
  };

  // 提交记录
  const handleSubmit = async () => {
    if (selectedEmotions.length === 0 || !selectedScene) return;
    
    setStep("loading");
    
    // 模拟网络延迟
    // await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const recResult = RecommendationEngine.recommend({
        emotions: selectedEmotions,
        scene: selectedScene,
        availableActivities: allActivities
      });
      setResult(recResult);

      // Save to Supabase
      await CheckInService.create({
        emotions: selectedEmotions,
        scene: selectedScene,
        energy_score: 50, // TODO: Calculate real energy score
        note: ""
      });

      setStep("result");
    } catch (error) {
      console.error("Submission failed:", error);
      // TODO: Show error toast
      setStep("input");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] p-6 flex flex-col items-center">
      <header className="w-full max-w-md mb-8 pt-6 px-2">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
        >
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">此刻，</h1>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">你的感受是？</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">选择最符合当下的情绪和场景</p>
        </motion.div>
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col gap-8 pb-32">
        {/* 步骤 1: 情绪选择 (九宫格) */}
        <section>
          <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-lg font-bold text-slate-700">情绪</h2>
            <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full transition-colors",
                selectedEmotions.length === 2 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
            )}>
              {selectedEmotions.length}/2
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {EMOTIONS.map((emotion, idx) => {
              const isSelected = selectedEmotions.includes(emotion.en);
              const ui = EMOTION_UI_CONFIG[emotion.zh] || { 
                  gradient: "from-gray-50 to-gray-100", 
                  icon: Sparkles, 
                  color: "text-gray-500",
                  shadow: "shadow-gray-200"
              };
              const Icon = ui.icon;
              
              return (
                <motion.button
                  key={emotion.en}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleEmotion(emotion.en)}
                  className={cn(
                    "aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden bg-gradient-to-br",
                    ui.gradient,
                    ui.shadow,
                    isSelected ? "ring-4 ring-primary/20 scale-105 shadow-xl" : "shadow-sm hover:shadow-md hover:scale-[1.02] opacity-90 hover:opacity-100"
                  )}
                >
                  <Icon className={cn("w-7 h-7 stroke-[2]", ui.color)} />
                  <span className={cn("text-sm font-bold tracking-wide", ui.color)}>{emotion.zh}</span>
                  
                  {isSelected && (
                    <motion.div
                      layoutId="check"
                      className="absolute top-2 right-2 bg-white/30 rounded-full p-1 text-white backdrop-blur-sm"
                    >
                      <Check className="w-3 h-3 stroke-[4]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* 步骤 2: 场景选择 */}
        <section>
          <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">当前场景</h2>
          <div className="grid grid-cols-3 gap-3">
            {SCENES.map((scene, idx) => {
                const Icon = scene.icon;
                return (
                  <motion.button
                    key={scene.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedScene === scene.id ? 1.05 : 1
                    }}
                    transition={{ 
                      delay: 0.3 + idx * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedScene(scene.id)}
                    className={cn(
                      "py-4 px-2 rounded-2xl text-sm font-semibold transition-all duration-200 border flex flex-col items-center gap-2",
                      selectedScene === scene.id
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                        : "border-transparent bg-white text-slate-500 shadow-sm hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {scene.label}
                  </motion.button>
                );
            })}
          </div>
        </section>

        {/* 底部按钮区域 */}
        <div className="fixed bottom-[70px] left-0 right-0 p-6 bg-gradient-to-t from-[#F8F9FE] via-[#F8F9FE]/90 to-transparent pointer-events-none z-50">
          <div className="max-w-md mx-auto pointer-events-auto">
            <AnimatePresence mode="wait">
              {step === "loading" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-14 rounded-full bg-white shadow-lg flex items-center justify-center gap-3 text-primary font-bold border border-primary/10"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">
                    {allActivities.length > 50 
                      ? `正在从 ${allActivities.length} 个活动中筛选...` 
                      : "生成个性化建议中..."}
                  </span>
                </motion.div>
              ) : step === "result" ? (
                <motion.div
                   initial={{ opacity: 0, y: 100 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="fixed inset-0 bg-[#F8F9FE] z-[60] flex flex-col overflow-y-auto"
                >
                      <div className="p-6 max-w-md mx-auto w-full">
                        <header className="flex justify-between items-center mb-8 pt-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">推荐方案</h2>
                                <p className="text-slate-400 text-sm flex items-center gap-1">
                                  基于云端 {allActivities.length} 个活动库智能匹配
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                  setStep("input");
                                  setSelectedEmotions([]);
                                  setSelectedScene(null);
                                  setResult(null);
                                }}
                                className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="space-y-6">
                            {/* 能量状态卡片 */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">当前能量趋势</div>
                                        <h3 className="font-bold text-slate-800 text-lg">
                                            {result?.final_direction ? getTrendLabel(result.final_direction) : "为你推荐"}
                                        </h3>
                                    </div>
                                </div>
                                
                                {result?.final_direction && (
                                  <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                        建议方向：{getDirectionLabel(result.final_direction)}
                                    </span>
                                  </div>
                                )}

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {result?.final_direction ? getTrendDescription(result.final_direction) : "请选择情绪和场景以获取建议。"}
                                </p>
                            </div>

                            {/* 活动列表 */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 ml-1">推荐活动</h3>
                                {result?.activities.map((activity, idx) => (
                                    <motion.div 
                                        key={activity.id} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-start"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shrink-0">
                                            {/* 这里可以用 mapping 替换 emoji */}
                                            ✨
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-800">{activity.name}</h4>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                                    {activity.duration_min} min
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed">{activity.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="h-24" /> {/* Spacer */}
                      </div>
                </motion.div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={selectedEmotions.length === 0 || !selectedScene}
                  className={cn(
                    "w-full h-14 rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-300",
                    selectedEmotions.length > 0 && selectedScene
                      ? "bg-primary text-white shadow-primary/30 hover:shadow-primary/50 translate-y-0 opacity-100 hover:scale-[1.02]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed translate-y-0 opacity-100"
                  )}
                >
                  <span>开始记录</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function getDirectionLabel(direction: string): string {
  const map: Record<string, string> = {
    "maintain": "保持当下",
    "activate": "激活能量",
    "stabilize": "稳固身心",
    "cool_down": "降温冷静"
  };
  return map[direction] || "为你推荐";
}

function getTrendLabel(direction: RegulationDirection): string {
  // Level 2 Reverse Logic: Direction -> Trend
  const map: Record<string, string> = {
    "cool_down": "能量过高 (High)",
    "activate": "能量过低 (Low)",
    "stabilize": "能量混乱 (Chaotic)",
    "maintain": "能量平稳 (Stable)"
  };
  return map[direction] || "能量波动";
}

function getTrendDescription(direction: RegulationDirection): string {
  const map: Record<string, string> = {
    "cool_down": "检测到你当前能量水平较高，可能伴随压力或烦躁。建议进行降温类活动，平复心绪。",
    "activate": "检测到你当前能量不足，可能感到疲惫或低落。建议进行激活类活动，提升活力。",
    "stabilize": "检测到你内心能量纷乱，可能感到焦虑或不安。建议进行稳固类活动，重建秩序。",
    "maintain": "你的能量状态平稳良好。建议继续保持当下的节奏，享受生活。"
  };
  return map[direction] || "我们检测到你的情绪能量正在波动。以下建议旨在帮助你调节状态。";
}
