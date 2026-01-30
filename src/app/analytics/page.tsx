"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  calculateWorkoutCompletion,
  calculateMealCompletion,
  getDateString,
} from "@/types/fitness";

type TimeRange = "7d" | "30d" | "3m" | "6m" | "12m";

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "12m", label: "1 Year" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AnalyticsPage = () => {
  const { dayRecords, getDayType } = useFitnessData();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const { chartData, stats } = useMemo(() => {
    const today = new Date();
    let daysBack = 7;

    switch (timeRange) {
      case "30d":
        daysBack = 30;
        break;
      case "3m":
        daysBack = 90;
        break;
      case "6m":
        daysBack = 180;
        break;
      case "12m":
        daysBack = 365;
        break;
    }

    const data: {
      date: string;
      workout: number;
      meals: number;
      label: string;
    }[] = [];
    let totalWorkoutCompletion = 0;
    let totalMealCompletion = 0;
    let workoutDays = 0;
    let completedWorkoutDays = 0;

    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = getDateString(date);
      const record = dayRecords[dateString];
      const dayType = getDayType(date);

      const workoutCompletion = record
        ? calculateWorkoutCompletion(record.workouts)
        : 0;
      const mealCompletion = record ? calculateMealCompletion(record.meals) : 0;

      if (dayType === "workout") {
        workoutDays++;
        if (workoutCompletion === 100) completedWorkoutDays++;
        totalWorkoutCompletion += workoutCompletion;
      }
      totalMealCompletion += mealCompletion;

      // Simplify labels based on time range
      let label = "";
      if (timeRange === "7d") {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (timeRange === "30d") {
        label = date.getDate().toString();
      } else {
        label = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      data.push({
        date: dateString,
        workout: workoutCompletion,
        meals: mealCompletion,
        label,
      });
    }

    const avgWorkout =
      workoutDays > 0 ? Math.round(totalWorkoutCompletion / workoutDays) : 0;
    const avgMeals = Math.round(totalMealCompletion / daysBack);
    const consistency =
      workoutDays > 0
        ? Math.round((completedWorkoutDays / workoutDays) * 100)
        : 0;

    return {
      chartData: data,
      stats: {
        avgWorkout,
        avgMeals,
        consistency,
        completedWorkoutDays,
        workoutDays,
      },
    };
  }, [dayRecords, getDayType, timeRange]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress over time
          </p>
        </div>
      </header>

      <main className="container py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Time Range Selector */}
          <motion.div variants={itemVariants}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {TIME_RANGES.map(({ value, label }) => (
                <motion.button
                  key={value}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    timeRange === value
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(value)}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-4 rounded-2xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-workout">
                {stats.avgWorkout}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Workout</p>
            </div>
            <div className="p-4 rounded-2xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-accent">
                {stats.avgMeals}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Meals</p>
            </div>
            <div className="p-4 rounded-2xl bg-card shadow-card text-center">
              <p className="text-2xl font-bold text-success">
                {stats.consistency}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Consistency</p>
            </div>
          </motion.div>

          {/* Completion Trend Chart */}
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Completion Trend</h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="workoutGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--workout))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--workout))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="mealsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        boxShadow: "var(--shadow-lg)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="workout"
                      name="Workout"
                      stroke="hsl(var(--workout))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#workoutGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="meals"
                      name="Meals"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#mealsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-workout" />
                  <span className="text-muted-foreground">Workout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Meals</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Summary</h3>
              </div>
              <p className="text-muted-foreground">
                In the last{" "}
                {timeRange === "7d"
                  ? "7 days"
                  : timeRange === "30d"
                    ? "30 days"
                    : timeRange === "3m"
                      ? "3 months"
                      : timeRange === "6m"
                        ? "6 months"
                        : "year"}
                , you completed{" "}
                <span className="font-semibold text-success">
                  {stats.completedWorkoutDays}
                </span>{" "}
                out of{" "}
                <span className="font-semibold">{stats.workoutDays}</span>{" "}
                scheduled workout days.
              </p>
              <p className="text-sm text-muted-foreground mt-2 italic">
                {stats.consistency >= 80
                  ? "Outstanding consistency! Keep it up! 💪"
                  : stats.consistency >= 50
                    ? "You're making progress. Stay consistent!"
                    : "Every step counts. Let's build that habit!"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AnalyticsPage;
