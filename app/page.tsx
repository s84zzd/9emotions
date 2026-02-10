import Link from "next/link";
import { ArrowRight, BarChart3, Calendar, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      <main className="w-full max-w-md space-y-8">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            9Emotions
          </h1>
          <p className="text-gray-500">觉察每一次情绪流动</p>
        </div>

        {/* Main Action */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <Link 
            href="/check-in"
            className="relative w-full aspect-[4/3] bg-white rounded-xl flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-all border border-indigo-50"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Plus className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">开始记录</h2>
              <p className="text-sm text-gray-400 mt-1">此刻，你的感受是？</p>
            </div>
          </Link>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/reports/weekly"
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">周报</h3>
            <p className="text-xs text-gray-400 mt-1">近7天能量趋势</p>
          </Link>

          <Link 
            href="/reports/monthly"
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">月报</h3>
            <p className="text-xs text-gray-400 mt-1">当月情绪洞察</p>
          </Link>
        </div>

        {/* Footer */}
        <footer className="pt-12 text-center text-xs text-gray-300">
          <p>© 2026 9Emotions Lab</p>
        </footer>

      </main>
    </div>
  );
}
