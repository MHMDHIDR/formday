"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  CalendarDays,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
} from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/workout", icon: Dumbbell, label: "Workout" },
  { to: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { to: "/analytics", icon: BarChart3, label: "Stats" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          // Handle potential null pathname
          const currentPath = pathname || "";
          const isActive =
            currentPath === item.to ||
            (item.to !== "/" && currentPath.startsWith(item.to));

          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                "tap-target transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              )}
            >
              <motion.div
                className={cn(
                  "p-2 rounded-xl transition-colors duration-200",
                  isActive ? "bg-accent/10" : "bg-transparent",
                )}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive ? "text-purple-700" : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-purple-700" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-accent"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
