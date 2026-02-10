"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Calendar, Sparkles, Zap, Wind, Heart, Star } from "lucide-react";
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
    <div className="min-h-screen bg-mesh relative overflow-hidden pb-24">
      {/* Enhanced Decorative Background Elements with Gradient */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-gradient-to-br from-pink-300/25 to-purple-200/25 rounded-full blur-[80px] float" />
      <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] bg-gradient-to-br from-purple-200/20 to-pink-200/30 rounded-full blur-[90px] breathe" />
      
      {/* Floating Hearts */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] right-[15%] opacity-10"
      >
        <Heart className="w-12 h-12 text-pink-400" fill="currentColor" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, -8, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[40%] left-[10%] opacity-10"
      >
        <Star className="w-10 h-10 text-purple-400" fill="currentColor" />
      </motion.div>

      <main className="relative z-10 px-6 pt-16 max-w-md mx-auto flex flex-col h-full">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <motion.p 
            className="text-gradient text-sm font-semibold tracking-widest uppercase mb-2 shimmer"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ✨ 9Emotions
          </motion.p>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-gradient">{greeting}</span>
            <span className="text-2xl">，</span>
            <br />
            <span className="text-[var(--text-soft)] font-light text-xl">
              愿你此刻内心安宁 🌸
            </span>
          </h1>
        </motion.div>

        {/* Main Action - Enhanced Breathing Orb */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] mb-8">
          <Link href="/check-in" className="relative group">
            {/* Outer Glow Ring */}
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.1, 0.4]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[-20px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(183,148,246,0.3) 0%, rgba(255,196,232,0.2) 50%, transparent 70%)',
                filter: 'blur(30px)'
              }}
            />
            
            {/* Middle Pulsing Ring */}
            <motion.div 
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-[-10px] bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-2xl"
            />
            
            {/* Main Button with Gradient */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center border-2 border-white/80 backdrop-blur-lg overflow-hidden glow"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5FA 50%, #F5EDFF 100%)',
                boxShadow: '0 20px 60px rgba(183, 148, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
              }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 shimmer opacity-30" />
              
              {/* Icon Container */}
              <motion.div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #F5EDFF 0%, #FFE5F1 100%)'
                }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-10 h-10 text-gradient relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-pink-200/50 blur-xl" />
              </motion.div>
              
              <span className="text-gradient font-bold text-2xl mb-1">开启觉察</span>
              <span className="text-[var(--text-soft)] text-sm">记录当下的情绪</span>
              
              {/* Bottom Sparkle */}
              <motion.div
                className="absolute bottom-8"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              </motion.div>
            </motion.div>
          </Link>
        </div>

        {/* Enhanced Insights Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 mb-4"
        >
          {/* Weekly Report Card */}
          <Link 
            href="/reports/weekly"
            className="group relative overflow-hidden card-gradient p-6 rounded-[24px] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(255,196,232,0.25)]"
          >
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-300">
              <Zap className="w-24 h-24 text-orange-500 rotate-12" />
            </div>
            
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600 flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            
            <h3 className="font-bold text-[var(--text-main)] text-lg mb-1 relative z-10">周报</h3>
            <p className="text-xs text-[var(--text-soft)] relative z-10">近7天能量趋势 ✨</p>
            
            {/* Hover Arrow */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <ArrowRight className="w-5 h-5 text-orange-500" />
            </motion.div>
          </Link>

          {/* Monthly Report Card */}
          <Link 
            href="/reports/monthly"
            className="group relative overflow-hidden card-gradient p-6 rounded-[24px] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(183,148,246,0.25)]"
          >
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-300">
              <Wind className="w-24 h-24 text-purple-500 rotate-12" />
            </div>
            
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            
            <h3 className="font-bold text-[var(--text-main)] text-lg mb-1 relative z-10">月报</h3>
            <p className="text-xs text-[var(--text-soft)] relative z-10">本月情绪洞察 🌙</p>
            
            {/* Hover Arrow */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <ArrowRight className="w-5 h-5 text-purple-500" />
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}