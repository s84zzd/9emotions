use client;

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, BarChart2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "首页",
      href: "/",
      icon: Home,
      gradient: "from-purple-400 to-pink-400",
    },
    {
      label: "打卡",
      href: "/check-in",
      icon: PlusCircle,
      gradient: "from-pink-400 to-rose-400",
    },
    {
      label: "周报",
      href: "/reports/weekly",
      icon: BarChart2,
      gradient: "from-orange-400 to-pink-400",
    },
    {
      label: "月报",
      href: "/reports/monthly",
      icon: Calendar,
      gradient: "from-purple-400 to-indigo-400",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pb-safe">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/80 backdrop-blur-xl border-t border-purple-100/50" />
      
      {/* Top Glow Effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
      
      <div className="relative px-6 py-4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1.5 group"
              >
                {/* Active Indicator - Top Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn(
                      "absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r",
                      item.gradient
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Icon Container */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                    isActive 
                      ? "shadow-lg" 
                      : "hover:bg-purple-50/50"
                  )}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, var(--primary-light), var(--secondary))",
                          boxShadow: "0 8px 20px rgba(183, 148, 246, 0.25)",
                        }
                      : {}
                  }
                >
                  {/* Glow effect for active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
                      style={{
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.3, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  
                  <Icon 
                    className={cn(
                      "relative z-10 transition-all duration-300",
                      isActive 
                        ? "w-6 h-6 text-white stroke-[2.5]" 
                        : "w-5 h-5 text-gray-400 group-hover:text-gray-600"
                    )} 
                  />
                  
                  {/* Sparkle effect on hover */}
                  {!isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
                
                {/* Label */}
                <span 
                  className={cn(
                    "text-[10px] font-medium transition-all duration-300",
                    isActive 
                      ? "text-gradient" 
                      : "text-gray-500 group-hover:text-gray-700"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r",
                      item.gradient
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}