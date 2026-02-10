"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeChatGuide() {
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    // Check if user agent contains 'MicroMessenger'
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)![0] === "micromessenger") {
      setIsWeChat(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {isWeChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-start pt-12 px-8 text-white"
        >
          {/* Top Right Arrow */}
          <div className="absolute top-4 right-6 animate-bounce">
            <ArrowUpRight className="w-12 h-12 text-white" />
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-4">
              <ExternalLink className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold">请在浏览器中打开</h2>
            
            <div className="space-y-4 text-slate-300">
              <p>微信可能会拦截此链接</p>
              <p className="text-sm border-t border-white/10 pt-4">
                1. 点击右上角的 <span className="font-bold text-white">...</span> 按钮
                <br />
                2. 选择 <span className="font-bold text-white">在浏览器打开</span>
              </p>
            </div>

            <button 
              onClick={() => setIsWeChat(false)}
              className="mt-8 text-xs text-slate-500 hover:text-white transition-colors"
            >
              我知道了，继续尝试访问
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
