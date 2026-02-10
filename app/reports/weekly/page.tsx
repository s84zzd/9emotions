"use client";

import { useEffect, useState } from "react";
import { WeeklyReport, Scene } from "@/types/report";
import { ArrowLeft, Calendar, Sparkles, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import Link from "next/link";
import { ReportEngine, getWeeklyRange } from "@/lib/report-engine/core";
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
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ScriptableContext
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { EMOTION_ZH_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 生成模拟数据
function generateMockHistory(): CheckInRecord[] {
  const records: CheckInRecord[] = [];
  const { start } = getWeeklyRange();
  const scenes: Scene[] = ["work", "study", "relationship", "family", "alone", "social"];
  
  // 生成过去 7 天的数据，每天 1-3 条
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 per day
    for (let j = 0; j < count; j++) {
       // Random emotion
       const emotion1 = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)].en;
       // Optional second emotion
       const emotion2 = Math.random() > 0.5 ? EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)].en : undefined;
       const emotions = emotion2 ? [emotion1, emotion2] : [emotion1];
       
       records.push({
         id: `mock-${i}-${j}`,
         user_id: "mock-user",
         emotions: emotions,
         scene: scenes[Math.floor(Math.random() * scenes.length)],
         created_at: new Date(date.setHours(9 + j * 4)).toISOString() // Spread out in day
       });
    }
  }
  return records;
}

// 图表通用配置
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
      cornerRadius: 8,
      displayColors: false,
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
    y: { grid: { color: "#f3f4f6" }, ticks: { display: false } }
  }
};

export default function WeeklyReportPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { start, end } = getWeeklyRange();
        const records = await CheckInService.getHistory(start, end);
        
        if (records.length > 0) {
           const generatedReport = ReportEngine.generateWeeklyReport(records);
           setReport(generatedReport);
        } else {
           // Fallback to mock data if no records found (for demo purposes)
           const mockData = generateMockHistory();
           const generatedReport = ReportEngine.generateWeeklyReport(mockData);
           setReport(generatedReport);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        // Fallback on error
        const mockData = generateMockHistory();
        const generatedReport = ReportEngine.generateWeeklyReport(mockData);
        setReport(generatedReport);
      }
    };

    fetchData();
  }, []);

  if (!report) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const { emotion_summary, scene_insights, highlights, challenges, recommendations } = report;

  // Chart Data Preparation
  const trendChartData = {
    labels: report.charts[0].data.map(d => d.date),
    datasets: [{
      data: report.charts[0].data.map(d => d.energy),
      borderColor: "#7C6FF6",
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(124, 111, 246, 0.2)");
        gradient.addColorStop(1, "rgba(124, 111, 246, 0)");
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#7C6FF6",
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  const sceneChartData = {
    labels: report.charts[1].data.map(d => d.scene),
    datasets: [{
      data: report.charts[1].data.map(d => d.count),
      backgroundColor: "#AFA7FF",
      borderRadius: 6,
      barThickness: 20,
    }]
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-text-main">你的近 7 天</h1>
          <p className="text-xs text-gray-500">2026.02.02 - 02.08</p>
        </div>
      </header>

      <main className="px-6 space-y-8 mt-2">
        {/* 副标题总结 */}
        <section className="text-center py-4">
          <p className="text-primary font-medium text-lg leading-relaxed">
            “这周虽然有些起伏，<br/>但你在周末找回了平静。”
          </p>
        </section>

        {/* 图表区 1: 情绪波动 */}
        <section className="bg-white rounded-[20px] p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              情绪波动
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">能量趋势</span>
          </div>
          <div className="h-40 w-full">
            <Line data={trendChartData} options={commonOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            周初的高能量主要来自焦虑，周中能量滑落，好在周末逐渐回稳。
          </p>
        </section>

        {/* 图表区 2: 场景分布 */}
        <section className="bg-white rounded-[20px] p-5 shadow-soft">
           <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              场景分布
            </h2>
          </div>
          <div className="h-40 w-full">
            <Bar data={sceneChartData} options={commonOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            工作场景占用了你 40% 的精力，其次是独处。
          </p>
        </section>

        {/* 模块 1: 本周概览 */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-soft">
            <h3 className="text-xs text-gray-400 mb-2">高频情绪</h3>
            <div className="flex flex-wrap gap-2">
              {report.emotion_summary.top_emotions.map(e => (
                <span key={e} className="bg-tag-bg text-primary text-xs px-2 py-1 rounded-lg font-medium">
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft flex flex-col justify-between">
            <h3 className="text-xs text-gray-400">整体趋势</h3>
            <div className="flex items-center gap-2 mt-1">
              {getTrendIcon(report.emotion_summary.emotion_trend)}
              <span className="text-sm font-semibold text-text-main capitalize">
                {getTrendLabel(report.emotion_summary.emotion_trend)}
              </span>
            </div>
          </div>
        </section>

        {/* 模块 2: 亮点与挑战 */}
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-[20px] border border-green-100">
            <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 本周亮点
            </h3>
            <ul className="space-y-2">
              {report.highlights.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-green-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-[20px] border border-orange-100">
            <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> 需要关注
            </h3>
             <ul className="space-y-2">
              {report.challenges.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-orange-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 模块 3: 下周建议 */}
        <section>
          <h2 className="text-lg font-bold text-text-main mb-4">下周小建议</h2>
          <div className="space-y-3">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-soft border-l-4 border-primary">
                <p className="text-sm text-gray-700 font-medium">{rec.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 底部 CTA */}
        <div className="pt-4 pb-8 text-center space-y-4">
          <button className="w-full bg-primary text-white py-4 rounded-full font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform">
            继续记录情绪
          </button>
          <button className="text-sm text-gray-400 hover:text-primary transition-colors">
            查看完整历史记录
          </button>
        </div>
      </main>
    </div>
  );
}

// 辅助函数
function getTrendIcon(trend: string) {
  switch (trend) {
    case "rising": return <TrendingUp className="w-5 h-5 text-red-400" />;
    case "falling": return <TrendingDown className="w-5 h-5 text-blue-400" />;
    case "stable": return <Minus className="w-5 h-5 text-green-400" />;
    default: return <Activity className="w-5 h-5 text-orange-400" />;
  }
}

function getTrendLabel(trend: string) {
  const map: Record<string, string> = {
    rising: "能量上升",
    falling: "能量下降",
    stable: "情绪平稳",
    chaotic: "波动较大"
  };
  return map[trend] || trend;
}
