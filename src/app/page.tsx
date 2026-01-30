"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFitnessData } from "@/hooks/useFitnessData";
import { TodaySnapshot } from "@/components/TodaySnapshot";
import { NavCard } from "@/components/NavCard";
import { BottomNav } from "@/components/BottomNav";
import {
  CalendarDays,
  Dumbbell,
  UtensilsCrossed,
  BarChart3,
  User,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const router = useRouter();
  const {
    getTodayRecord,
    getDayType,
    getWorkoutTemplateForDay,
    createDayRecord,
  } = useFitnessData();

  const today = new Date();
  let todayRecord = getTodayRecord();
  const dayType = getDayType(today);
  const workoutTemplate = getWorkoutTemplateForDay(today);

  // Create today's record if it doesn't exist
  if (!todayRecord) {
    todayRecord = createDayRecord(today);
  }

  const navigate = (path: string) => router.push(path);

  const navItems = [
    {
      icon: CalendarDays,
      label: "Calendar",
      onClick: () => navigate("/calendar"),
      description: "Plan your week",
    },
    {
      icon: Dumbbell,
      label: "Workouts",
      onClick: () => navigate("/workout"),
      description: "Build strength",
    },
    {
      icon: UtensilsCrossed,
      label: "Meals",
      onClick: () => navigate("/meals"),
      description: "Fuel your body",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      onClick: () => navigate("/analytics"),
      description: "Track progress",
    },
    {
      icon: User,
      label: "Profile",
      onClick: () => navigate("/profile"),
      description: "Your settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Formday
              </h1>
              <p className="text-sm text-muted-foreground">
                Progress, not perfection.
              </p>
            </div>
            <motion.button
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5 text-secondary-foreground" />
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Today's Snapshot */}
          <motion.div variants={itemVariants}>
            <TodaySnapshot
              date={today}
              dayRecord={todayRecord}
              dayType={dayType}
              workoutName={workoutTemplate?.name}
            />
          </motion.div>

          {/* Quick Action - View Today */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() =>
                navigate(`/day/${today.toISOString().split("T")[0]}`)
              }
              className="w-full p-4 rounded-2xl bg-gradient-accent text-accent-foreground font-semibold shadow-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Today's Plan →
            </motion.button>
          </motion.div>

          {/* Navigation Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {navItems.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  custom={index}
                >
                  <NavCard
                    icon={item.icon}
                    label={item.label}
                    description={item.description}
                    onClick={item.onClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <NavCard
              icon={User}
              label="Profile"
              description="Your settings"
              onClick={() => navigate("/profile")}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
