import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";
import {
  type DayRecord,
  formatDateDisplay,
  calculateWorkoutCompletion,
  calculateMealCompletion,
} from "@/types/fitness";
import { Dumbbell, UtensilsCrossed, Moon } from "lucide-react";

interface TodaySnapshotProps {
  date: Date;
  dayRecord: DayRecord | null;
  dayType: "workout" | "rest";
  workoutName?: string;
  className?: string;
}

export function TodaySnapshot({
  date,
  dayRecord,
  dayType,
  workoutName,
  className,
}: TodaySnapshotProps) {
  const workoutCompletion = dayRecord
    ? calculateWorkoutCompletion(dayRecord.workouts)
    : 0;
  const mealCompletion = dayRecord
    ? calculateMealCompletion(dayRecord.meals)
    : 0;

  const isWorkoutDay = dayType === "workout";

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-card shadow-card",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-card pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today</p>
            <h2 className="text-xl font-bold text-foreground">
              {formatDateDisplay(date)}
            </h2>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              isWorkoutDay
                ? "bg-workout/10 text-workout"
                : "bg-rest/10 text-rest",
            )}
          >
            {isWorkoutDay ? (
              <>
                <Dumbbell className="w-4 h-4" />
                <span>Workout Day</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Rest Day</span>
              </>
            )}
          </div>
        </div>

        {/* Workout Focus */}
        {isWorkoutDay && workoutName && (
          <div className="mb-4 p-3 rounded-xl bg-secondary/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Today's Focus
            </p>
            <p className="text-lg font-semibold text-foreground">
              {workoutName}
            </p>
          </div>
        )}

        {/* Rest Day Message */}
        {!isWorkoutDay && (
          <div className="mb-4 p-3 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground">
              Recovery is part of the process. Take it easy today.
            </p>
          </div>
        )}

        {/* Progress Bars */}
        <div className="space-y-4">
          {isWorkoutDay && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-workout/10 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-workout" />
              </div>
              <div className="flex-1">
                <ProgressBar
                  value={workoutCompletion}
                  label="Workout"
                  variant="workout"
                  size="md"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1">
              <ProgressBar
                value={mealCompletion}
                label="Meals"
                variant="meal"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Motivational text */}
        <p className="mt-5 text-center text-sm text-muted-foreground italic">
          {workoutCompletion === 100 && mealCompletion === 100
            ? "Outstanding work today! 💪"
            : workoutCompletion > 50 || mealCompletion > 50
              ? "You're on track. Keep going!"
              : "Let's stay consistent today."}
        </p>
      </div>
    </motion.div>
  );
}
