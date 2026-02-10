import { CheckInRecord } from "@/types/check-in";
import { WeeklyReport, MonthlyReport, Scene, Emotion, EmotionTrend, WeeklyEmotionTrendPoint, WeeklySceneFrequencyItem } from "@/types/report";
import { EMOTION_MAP } from "@/lib/constants";
import { EmotionNameZh } from "@/types/emotion";

// Helper to get start/end dates
export function getWeeklyRange(now: Date = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export class ReportEngine {
  /**
   * Generate Weekly Report
   * @param checkIns All check-ins (engine will filter by date)
   * @param now Current date (default to today)
   */
  static generateWeeklyReport(checkIns: CheckInRecord[], now: Date = new Date()): WeeklyReport {
    const { start, end } = getWeeklyRange(now);
    
    // Filter records for the last 7 days
    const periodRecords = checkIns.filter(r => {
      const d = new Date(r.created_at);
      return d >= start && d <= end;
    });

    // ... (rest of weekly logic) ...
    // 1. Calculate Daily Energy Trend & Chart Data
    const trendData = this.calculateDailyEnergy(periodRecords, start, 7);
    
    // 2. Calculate Scene Frequency & Chart Data
    const sceneData = this.calculateSceneFrequency(periodRecords);
    
    // 3. Calculate Emotion Summary
    const summary = this.calculateEmotionSummary(periodRecords, trendData);

    // 4. Generate Scene Insights
    const sceneInsights = this.generateSceneInsights(periodRecords);

    // 5. Generate Highlights, Challenges, Recommendations
    const { highlights, challenges, recommendations } = this.generateTextContent(summary, sceneInsights);

    return {
      period: "weekly",
      emotion_summary: summary,
      charts: [
        {
          type: "weekly_emotion_trend",
          data: trendData
        },
        {
          type: "weekly_scene_frequency",
          data: sceneData
        }
      ],
      scene_insights: sceneInsights,
      highlights,
      challenges,
      recommendations
    };
  }

  /**
   * Generate Monthly Report
   * @param checkIns All check-ins
   * @param month Date in the target month (default now)
   */
  static generateMonthlyReport(checkIns: CheckInRecord[], month: Date = new Date()): MonthlyReport {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = end.getDate();

    const periodRecords = checkIns.filter(r => {
      const d = new Date(r.created_at);
      return d >= start && d <= end;
    });

    const trendData = this.calculateDailyEnergy(periodRecords, start, daysInMonth);
    const summary = this.calculateEmotionSummary(periodRecords, trendData);
    const sceneInsights = this.generateSceneInsights(periodRecords);
    
    // Monthly specific charts
    const structureData = this.calculateEmotionStructure(periodRecords);

    return {
      period: "monthly",
      emotion_structure: {
        positive_ratio: summary.positive_ratio,
        negative_ratio: summary.negative_ratio,
        dominant_emotions: summary.top_emotions
      },
      trend_analysis: {
        emotion_trend: summary.emotion_trend,
        pattern: this.analyzeMonthlyPattern(trendData)
      },
      scene_patterns: sceneInsights,
      highlights: [`本月共记录 ${periodRecords.length} 次情绪`, ...summary.top_emotions.map(e => `主要情绪为 ${e}`)],
      challenges: summary.negative_ratio > 0.5 ? ["本月整体压力较大"] : [],
      recommendations: [
        { type: "long_term", content: "建议下个月尝试建立规律的运动习惯" }
      ],
      charts: [
        {
          type: "monthly_emotion_structure",
          data: structureData
        },
        {
          type: "monthly_emotion_trend",
          data: trendData.map((d, i) => ({ day: i + 1, energy: d.energy }))
        }
      ]
    };
  }

  // --- Internal Helpers ---

  private static calculateEmotionStructure(records: CheckInRecord[]) {
     const counts: Record<string, number> = {};
     records.forEach(r => r.emotions.forEach(e => {
         const zh = EMOTION_MAP[e].zh;
         counts[zh] = (counts[zh] || 0) + 1;
     }));
     return Object.entries(counts)
        .map(([emotion, count]) => ({ emotion: emotion as EmotionNameZh, count }))
        .sort((a, b) => b.count - a.count);
  }

  private static analyzeMonthlyPattern(trendData: WeeklyEmotionTrendPoint[]): string {
      // Simple pattern detection
      const energies = trendData.map(d => d.energy);
      const avg = energies.reduce((a, b) => a + b, 0) / (energies.length || 1);
      if (avg > 0.5) return "高能量积极型";
      if (avg < -0.5) return "低能量恢复型";
      return "波动平衡型";
  }

  private static calculateDailyEnergy(records: CheckInRecord[], startDate: Date, days: number): WeeklyEmotionTrendPoint[] {
    const result: WeeklyEmotionTrendPoint[] = [];
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().slice(0, 10);
      const weekday = weekdays[date.getDay()];
      
      const daysRecords = records.filter(r => r.created_at.startsWith(dateStr));
      
      let energySum = 0;
      let count = 0;
      let dominantEmotion: EmotionNameZh | null = null;
      let maxEmotionCount = 0;
      const emotionCounts: Record<string, number> = {};

      daysRecords.forEach(r => {
        r.emotions.forEach(e => {
          const info = EMOTION_MAP[e];
          if (info) {
            energySum += (info.energy[0] + info.energy[1]) / 2;
            count++;
            emotionCounts[info.zh] = (emotionCounts[info.zh] || 0) + 1;
            if (emotionCounts[info.zh] > maxEmotionCount) {
              maxEmotionCount = emotionCounts[info.zh];
              dominantEmotion = info.zh;
            }
          }
        });
      });

      result.push({
        date: weekday, // Use weekday for display as per mock
        energy: count > 0 ? Number((energySum / count).toFixed(1)) : 0,
        emotion: dominantEmotion || "平静"
      });
    }
    return result;
  }

  private static calculateSceneFrequency(records: CheckInRecord[]): WeeklySceneFrequencyItem[] {
    const counts: Record<string, number> = {};
    records.forEach(r => {
      counts[r.scene] = (counts[r.scene] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([scene, count]) => ({ scene: scene as Scene, count }))
      .sort((a, b) => b.count - a.count);
  }

  private static calculateEmotionSummary(records: CheckInRecord[], trendData: WeeklyEmotionTrendPoint[]) {
    const emotionCounts: Record<string, number> = {};
    let positiveCount = 0;
    let negativeCount = 0;
    let total = 0;

    records.forEach(r => {
      r.emotions.forEach(e => {
        const info = EMOTION_MAP[e];
        if (info) {
            emotionCounts[info.zh] = (emotionCounts[info.zh] || 0) + 1;
            if (info.value > 0) positiveCount++;
            if (info.value < 0) negativeCount++;
            total++;
        }
      });
    });

    // Top emotions
    const top_emotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(e => e[0] as EmotionNameZh);

    // Trend calculation (simple linear check)
    let emotion_trend: EmotionTrend = "stable";
    const energies = trendData.map(d => d.energy);
    // Remove zeros if no data? No, 0 is valid. But if no data, it's 0.
    // Simple heuristic: compare last 3 days avg vs first 3 days avg
    if (energies.length >= 2) {
        const startAvg = (energies[0] + energies[1]) / 2;
        const endAvg = (energies[energies.length-1] + energies[energies.length-2]) / 2;
        if (endAvg > startAvg + 0.5) emotion_trend = "rising";
        else if (endAvg < startAvg - 0.5) emotion_trend = "falling";
        else emotion_trend = "stable";
        // TODO: Detect "chaotic" (high variance)
    }

    return {
        top_emotions,
        emotion_trend,
        positive_ratio: total > 0 ? Number((positiveCount / total).toFixed(2)) : 0,
        negative_ratio: total > 0 ? Number((negativeCount / total).toFixed(2)) : 0
    };
  }

  private static generateSceneInsights(records: CheckInRecord[]) {
      // Group by scene
      const sceneGroups: Record<string, CheckInRecord[]> = {};
      records.forEach(r => {
          if (!sceneGroups[r.scene]) sceneGroups[r.scene] = [];
          sceneGroups[r.scene].push(r);
      });

      return Object.entries(sceneGroups).map(([scene, sceneRecords]) => {
          // Find dominant emotion in this scene
          const eCounts: Record<string, number> = {};
          sceneRecords.forEach(r => r.emotions.forEach(e => {
              const zh = EMOTION_MAP[e].zh;
              eCounts[zh] = (eCounts[zh] || 0) + 1;
          }));
          const sorted = Object.entries(eCounts).sort((a, b) => b[1] - a[1]);
          const dominant = sorted.slice(0, 2).map(x => x[0] as EmotionNameZh);
          
          return {
              scene: scene as Scene,
              frequency: sceneRecords.length,
              dominant_emotions: dominant,
              insight: this.getInsightText(scene as Scene, dominant[0])
          };
      }).sort((a, b) => b.frequency - a.frequency).slice(0, 3); // Top 3 scenes
  }

  private static getInsightText(scene: Scene, emotion: EmotionNameZh): string {
      // Simple template based generation
      const map: Record<Scene, string> = {
          work: "工作", study: "学习", relationship: "亲密关系", family: "家庭", alone: "独处", social: "社交"
      };
      return `在${map[scene]}场景中，你最常感到${emotion}。`;
  }

  private static generateTextContent(summary: any, sceneInsights: any[]) {
      const highlights = [];
      const challenges = [];
      const recommendations: { type: "short_term", content: string }[] = [];

      if (summary.emotion_trend === "rising") highlights.push("本周情绪能量整体呈上升趋势，状态越来越好。");
      if (summary.positive_ratio > 0.6) highlights.push("正面情绪占比超过 60%，这是充实的一周。");
      if (sceneInsights.length > 0 && sceneInsights[0].scene === "alone") highlights.push("独处是你本周的高频场景，享受与自己相处的时光。");

      if (summary.emotion_trend === "falling") challenges.push("本周后期情绪能量有所下滑，注意及时休息。");
      if (summary.negative_ratio > 0.6) challenges.push("负面情绪占比较高，可能面临了一些压力。");
      if (summary.top_emotions.includes("焦虑")) challenges.push("焦虑情绪出现频率较高，试着放慢节奏。");

      // Recommendations
      if (challenges.length > 0) {
          recommendations.push({ type: "short_term", content: "尝试每天睡前进行 5 分钟冥想，帮助平复心绪。" });
          recommendations.push({ type: "short_term", content: "周末安排一次户外散步，接触大自然。" });
      } else {
          recommendations.push({ type: "short_term", content: "保持当前的节奏，继续记录美好的瞬间。" });
      }

      // Defaults if empty
      if (highlights.length === 0) highlights.push("本周情绪波动较小，保持了平稳的心态。");
      if (challenges.length === 0) challenges.push("没有明显的挑战，状态保持得不错。");

      return { highlights, challenges, recommendations };
  }
}

