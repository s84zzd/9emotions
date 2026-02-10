"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, BarChart2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "首页",
      href: "/",
      icon: Home,
    },
    {
      label: "打卡",
      href: "/check-in",
      icon: PlusCircle,
    },
    {
      label: "周报",
      href: "/reports/weekly",
      icon: BarChart2,
    },
    {
      label: "月报",
      href: "/reports/monthly",
      icon: Calendar,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-[100] pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
