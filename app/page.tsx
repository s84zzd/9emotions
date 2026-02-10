"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Calendar, Sparkles, Zap, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [greeting, setGreeting] = useState("你好");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("早安");
    else if (hour < 18) setGreeting("下午好");
    else setGreeting("晚上好");
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FE] relative overflow-hidden pb-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-200/40 rounded-full blur-[80px]" />
      <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] bg-blue-200/40 rounded-full blur-[60px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-pink-200/30 rounded-full blur-[70px]" />

      <main className="relative z-10 px-6 pt-12 max-w-md mx-auto flex flex-col h-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-slate-400 text-sm font-medium tracking-wider uppercase mb-1">9Emotions</p>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {greeting}，<br />
            <span className="text-slate-500 font-normal">愿你此刻内心安宁。</span>
          </h1>
        </motion.div>

        {/* Main Action - Breathing Orb */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Link href="/check-in" className="relative group">
            {/* Pulsing Ring */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-xl"
            />
            
            {/* Main Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-white to-slate-50 shadow-2xl shadow-indigo-100 flex flex-col items-center justify-center border border-white/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3 shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <span className="text-slate-700 font-bold text-lg">开启觉察</span>
              <span className="text-slate-400 text-xs mt-1">记录当下情绪</span>
            </motion.div>
          </Link>
        </div>

        {/* Insights Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mt-8"
        >
          <Link 
            href="/reports/weekly"
            className="group relative overflow-hidden bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-orange-500 rotate-12" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">周报</h3>
            <p className="text-xs text-slate-400 mt-1">近7天能量趋势</p>
          </Link>

          <Link 
            href="/reports/monthly"
            className="group relative overflow-hidden bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wind className="w-12 h-12 text-purple-500 rotate-12" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">月报</h3>
            <p className="text-xs text-slate-400 mt-1">本月情绪洞察</p>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
