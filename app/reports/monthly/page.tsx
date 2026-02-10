"use client";

import { useEffect, useState } from "react";
import { MonthlyReport, Scene } from "@/types/report";
import { ArrowLeft, Calendar, Sparkles, TrendingUp, TrendingDown, Activity, PieChart } from "lucide-react";
import Link from "next/link";
import { ReportEngine } from "@/lib/report-engine/core";
import { CheckInService } from "@/lib/services/checkIn";
import { CheckInRecord } from "@/types/check-in";
import { EMOTIONS } from "@/lib/constants";
import { EmotionNameEn } from "@/types/emotion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { cn } from "@/lib/utils";

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 生成模拟数据 (30天)
function generateMockHistory(): CheckInRecord[] {
  const records: CheckInRecord[] = [];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = end.getDate();
  const scenes: Scene[] = ["work", "study", "relationship", "family", "alone", "social"];
  
  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    // 随机跳过几天不打卡，模拟真实情况
    if (Math.random() > 0.8) continue;

    const count = Math.floor(Math.random() * 3) + 1; 
    for (let j = 0; j < count; j++) {
       const emotion1 = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)].en;
       const emotion2 = Math.random() > 0.6 ? EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)].en : undefined;
       const emotions = emotion2 ? [emotion1, emotion2] : [emotion1];
       
       records.push({
         id: `mock-m-${i}-${j}`,
         user_id: "mock-user",
         emotions: emotions,
         scene: scenes[Math.floor(Math.random() * scenes.length)],
         created_at: new Date(date.setHours(9 + j * 4)).toISOString()
       });
    }
  }
  return records;
}

const commonOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#3A3550",
      bodyColor: "#666",
      borderColor: "rgba(0,0,0,0.05)",
      borderWidth: 1,
      padding: 10,
    },
  },
  scales: {
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { display: false } // Hide Y axis labels for cleaner look
    },
    x: {
      grid: { display: false },
      ticks: { color: "#999", maxTicksLimit: 10 } // Limit X axis labels
    }
  }
};

const doughnutOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      display: true, 
      position: 'right',
      labels: { usePointStyle: true, boxWidth: 8 }
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#3A3550",
      bodyColor: "#666",
      borderColor: "rgba(0,0,0,0.05)",
      borderWidth: 1,
      padding: 10,
    },
  },
  cutout: '60%', // Donut shape
};

export default function MonthlyReportPage() {
  const [report, setReport] = useState<MonthlyReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const records = await CheckInService.getHistory(start, end);
        
        if (records.length > 0) {
           const generatedReport = ReportEngine.generateMonthlyReport(records);
           setReport(generatedReport);
        } else {
           // Fallback to mock data if no records found
           const mockData = generateMockHistory();
           const generatedReport = ReportEngine.generateMonthlyReport(mockData);
           setReport(generatedReport);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        // Fallback on error
        const mockData = generateMockHistory();
        const generatedReport = ReportEngine.generateMonthlyReport(mockData);
        setReport(generatedReport);
      }
    };

    fetchData();
  }, []);

  if (!report) return <div className="min-h-screen flex items-center justify-center text-gray-400">生成月报中...</div>;

  const { emotion_structure, trend_analysis, scene_patterns, highlights, challenges, recommendations } = report;

  // Chart 1: Emotion Structure (Doughnut)
  const structureChartData = {
    labels: report.charts[0].data.map(d => d.emotion),
    datasets: [{
      data: report.charts[0].data.map(d => d.count),
      backgroundColor: [
        "#FFB7B2", "#B5EAD7", "#E2F0CB", "#FFDAC1", "#C7CEEA", "#F7D9C4", "#D4E1F5", "#F0FFF0"
      ],
      borderWidth: 0,
    }]
  };

  // Chart 2: Monthly Trend (Line)
  const trendChartData = {
    labels: report.charts[1].data.map(d => `${d.day}日`),
    datasets: [
      {
        label: "能量趋势",
        data: report.charts[1].data.map(d => d.energy),
        borderColor: "#7C6FF6",
        backgroundColor: "rgba(124, 111, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Header */}
      <header className="bg-white p-6 sticky top-0 z-10 border-b border-gray-100/50 backdrop-blur-md bg-white/80">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/check-in" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">月度情绪报告</h1>
          <div className="w-8" /> {/* Placeholder for balance */}
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        
        {/* 1. Overview Card */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
             <Calendar className="w-5 h-5 text-indigo-500" />
             <h2 className="font-semibold text-gray-800">本月概览</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-indigo-50/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-indigo-600">
                  {Math.round(emotion_structure.positive_ratio * 100)}%
                </span>
                <span className="text-xs text-gray-500">积极情绪占比</span>
             </div>
             <div className="bg-orange-50/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-bold text-orange-500">
                  {Math.round(emotion_structure.negative_ratio * 100)}%
                </span>
                <span className="text-xs text-gray-500">消极情绪占比</span>
             </div>
          </div>

          <div className="space-y-3">
             {highlights.map((text, i) => (
               <div key={i} className="flex gap-3 items-start text-sm text-gray-600">
                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                 <p>{text}</p>
               </div>
             ))}
          </div>
        </section>

        {/* 2. Emotion Structure Chart */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
             <PieChart className="w-5 h-5 text-pink-500" />
             <h2 className="font-semibold text-gray-800">情绪构成</h2>
           </div>
           <div className="h-64 w-full">
             <Doughnut data={structureChartData} options={doughnutOptions} />
           </div>
           <p className="text-center text-sm text-gray-500 mt-4">
             主导情绪：<span className="font-medium text-gray-800">{emotion_structure.dominant_emotions.join("、")}</span>
           </p>
        </section>

        {/* 3. Monthly Trend Chart */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
             <Activity className="w-5 h-5 text-blue-500" />
             <h2 className="font-semibold text-gray-800">能量波动</h2>
           </div>
           <div className="h-48 w-full">
             <Line data={trendChartData} options={commonOptions} />
           </div>
           <div className="mt-4 p-3 bg-blue-50/50 rounded-xl text-sm text-gray-600 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <span className="font-medium text-blue-700">模式识别：</span>
                {trend_analysis.pattern}
                <p className="text-xs text-gray-400 mt-1">
                  {trend_analysis.emotion_trend === "rising" ? "整体呈上升趋势，状态逐渐回暖。" : 
                   trend_analysis.emotion_trend === "falling" ? "整体呈下降趋势，需注意月末疲劳。" : 
                   "整体保持平稳，情绪管理能力不错。"}
                </p>
              </div>
           </div>
        </section>

        {/* 4. Scene Insights */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-5 h-5 text-amber-500" />
             <h2 className="font-semibold text-gray-800">场景洞察</h2>
           </div>
           <div className="space-y-4">
             {scene_patterns.map((item, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                      {getSceneIcon(item.scene)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {getSceneLabel(item.scene)}
                      </div>
                      <div className="text-xs text-gray-500">
                        记录 {item.frequency} 次
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">常伴随</div>
                    <div className="text-sm font-medium text-gray-700">
                      {item.dominant_emotions.join(" ")}
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </section>

        {/* 5. Long-term Recommendations */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-200">
           <div className="flex items-center gap-2 mb-4 opacity-90">
             <Sparkles className="w-5 h-5" />
             <h2 className="font-semibold">下月建议</h2>
           </div>
           <div className="space-y-4">
             {recommendations.map((rec, i) => (
               <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                 <p className="text-sm leading-relaxed opacity-90">{rec.content}</p>
               </div>
             ))}
             {challenges.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs opacity-60 mb-2">需要关注的挑战</p>
                  {challenges.map((c, i) => (
                    <p key={i} className="text-sm opacity-80 flex items-center gap-2">
                      <Minus className="w-3 h-3" /> {c}
                    </p>
                  ))}
                </div>
             )}
           </div>
        </section>

      </main>
    </div>
  );
}

// Helpers
function getSceneIcon(scene: Scene): string {
  const map: Record<Scene, string> = {
    work: "💼", study: "📚", relationship: "💕", family: "🏠", alone: "🧘‍♀️", social: "👯‍♀️"
  };
  return map[scene] || "📍";
}

function getSceneLabel(scene: Scene): string {
  const map: Record<Scene, string> = {
    work: "工作", study: "学习", relationship: "亲密关系", family: "家庭", alone: "独处", social: "社交"
  };
  return map[scene] || scene;
}
