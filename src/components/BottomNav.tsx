import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home,
  CalendarDays,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/workout", icon: Dumbbell, label: "Workout" },
  { to: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { to: "/analytics", icon: BarChart3, label: "Stats" },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-inset">
      <div className="relative flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          // Handle potential null pathname
          const currentPath = pathname || "";
          const isActive =
            currentPath === item.to ||
            (item.to !== "/" && currentPath.startsWith(item.to));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl z-10",
                "tap-target transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2",
              )}
            >
              {/* Animated bubble background */}
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-600/15 to-green-500/20 rounded-2xl shadow-lg shadow-green-500/20"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icon container with smooth animations */}
              <motion.div
                className="relative p-2 rounded-xl"
                animate={{
                  scale: isActive ? 1.05 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                whileTap={{ scale: 0.92 }}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive
                      ? "text-green-700 drop-shadow-sm"
                      : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </motion.div>

              {/* Label with smooth fade and slide */}
              <motion.span
                className={cn(
                  "text-xs font-medium transition-all duration-300 relative z-10",
                  isActive ? "text-green-700" : "text-muted-foreground",
                )}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  fontWeight: isActive ? 600 : 500,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                {item.label}
              </motion.span>

              {/* Bottom indicator dot with smooth animation */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-green-600"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
