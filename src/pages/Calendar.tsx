import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Moon,
  Check,
  Circle,
} from "lucide-react";
import {
  getDateString,
  calculateWorkoutCompletion,
  calculateMealCompletion,
} from "@/types/fitness";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const router = useNavigate();
  const { dayRecords, getDayType } = useFitnessData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (path: string) => router(path);

  const today = new Date();
  const todayString = getDateString(today);

  const { year, month, days } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const daysArray: (Date | null)[] = [];

    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      daysArray.push(null);
    }

    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(new Date(y, m, i));
    }

    return { year: y, month: m, days: daysArray };
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayStatus = (date: Date) => {
    const dateString = getDateString(date);
    const record = dayRecords[dateString];
    const dayType = getDayType(date);

    if (!record) {
      return { hasRecord: false, dayType, completion: 0 };
    }

    const workoutCompletion = calculateWorkoutCompletion(record.workouts);
    const mealCompletion = calculateMealCompletion(record.meals);
    const avgCompletion =
      dayType === "workout"
        ? Math.round((workoutCompletion + mealCompletion) / 2)
        : mealCompletion;

    return {
      hasRecord: true,
      dayType,
      completion: avgCompletion,
      isComplete: avgCompletion === 100,
    };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto py-4 px-2">
          <div className="flex items-center justify-between">
            <motion.button
              className="p-2 rounded-xl hover:bg-secondary tap-target"
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <h1 className="text-xl font-bold">
              {MONTHS[month]} {year}
            </h1>

            <motion.button
              className="p-2 rounded-xl hover:bg-secondary tap-target"
              whileTap={{ scale: 0.95 }}
              onClick={goToNextMonth}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Calendar Grid */}
      <main className="container py-6 mx-auto px-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateString = getDateString(date);
              const isToday = dateString === todayString;
              const isPast = date < today && !isToday;
              const status = getDayStatus(date);

              return (
                <motion.button
                  key={dateString}
                  className={cn(
                    "relative aspect-square rounded-xl flex flex-col items-center justify-center gap-1",
                    "transition-all duration-200 tap-target",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isToday &&
                      "ring-2 ring-accent ring-offset-2 ring-offset-background",
                    !isPast && "hover:bg-secondary",
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/day/${dateString}`)}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isToday && "text-accent",
                      isPast && !status.hasRecord && "text-muted-foreground/50",
                    )}
                  >
                    {date.getDate()}
                  </span>

                  {/* Day type indicator */}
                  <div className="flex items-center gap-0.5">
                    {status.dayType === "workout" ? (
                      <Dumbbell
                        className={cn(
                          "size-3",
                          status.isComplete
                            ? "text-success"
                            : "text-workout/60",
                        )}
                      />
                    ) : (
                      <Moon className="size-3 text-rest/60" />
                    )}

                    {/* Completion indicator */}
                    {status.hasRecord &&
                      (status.isComplete ? (
                        <Check className="size-3 text-success" />
                      ) : status.completion > 0 ? (
                        <Circle className="w-2 h-2 text-warning fill-warning" />
                      ) : null)}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Dumbbell className="size-4 text-workout" />
              <span>Workout</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-rest" />
              <span>Rest</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-success" />
              <span>Complete</span>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
