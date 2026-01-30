"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useFitnessData } from "@/hooks/useFitnessData";
import { ProgressBar } from "@/components/ProgressBar";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Dumbbell,
  UtensilsCrossed,
  Moon,
  Check,
  Circle,
} from "lucide-react";
import {
  parseDate,
  formatDateDisplay,
  calculateWorkoutCompletion,
  calculateMealCompletion,
} from "@/types/fitness";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const DayDetailPage = () => {
  const params = useParams();
  const dateString = params.dateString as string;
  const router = useRouter();
  const {
    getDayRecord,
    getDayType,
    createDayRecord,
    toggleExercise,
    toggleMeal,
  } = useFitnessData();

  const navigateBack = () => router.back();
  const navigate = (path: string) => router.push(path);

  const date = dateString ? parseDate(dateString) : new Date();
  let dayRecord = getDayRecord(date);
  const dayType = getDayType(date);

  // Create record if it doesn't exist
  useEffect(() => {
    if (!dayRecord && dateString) {
      createDayRecord(date);
    }
  }, [dateString]);

  // Re-fetch after creation
  dayRecord = getDayRecord(date);

  const workoutCompletion = dayRecord
    ? calculateWorkoutCompletion(dayRecord.workouts)
    : 0;
  const mealCompletion = dayRecord
    ? calculateMealCompletion(dayRecord.meals)
    : 0;

  const isWorkoutDay = dayType === "workout";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 rounded-xl hover:bg-secondary tap-target"
              whileTap={{ scale: 0.95 }}
              onClick={navigateBack}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex-1">
              <h1 className="text-xl font-bold">{formatDateDisplay(date)}</h1>
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  isWorkoutDay ? "text-workout" : "text-rest",
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
          </div>
        </div>
      </header>

      <main className="container py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Progress Overview */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-2xl bg-card shadow-card space-y-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Progress
            </h3>

            {isWorkoutDay && (
              <ProgressBar
                value={workoutCompletion}
                label="Workout"
                variant="workout"
                size="lg"
              />
            )}

            <ProgressBar
              value={mealCompletion}
              label="Meals"
              variant="meal"
              size="lg"
            />
          </motion.div>

          {/* Workouts Section */}
          {isWorkoutDay &&
            dayRecord?.workouts &&
            dayRecord.workouts.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Workouts
                </h3>

                {dayRecord.workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="p-4 rounded-2xl bg-card shadow-card space-y-3"
                  >
                    <h4 className="font-semibold text-foreground">
                      {workout.name}
                    </h4>

                    <div className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <motion.button
                          key={exercise.id}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                            exercise.completed
                              ? "bg-success/10"
                              : "bg-secondary/50 hover:bg-secondary",
                          )}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            toggleExercise(date, workout.id, exercise.id)
                          }
                        >
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                              exercise.completed
                                ? "border-success bg-success"
                                : "border-muted-foreground",
                            )}
                          >
                            {exercise.completed && (
                              <Check className="w-4 h-4 text-success-foreground" />
                            )}
                          </div>

                          <div className="flex-1 text-left">
                            <p
                              className={cn(
                                "font-medium",
                                exercise.completed &&
                                  "line-through text-muted-foreground",
                              )}
                            >
                              {exercise.name}
                            </p>
                            {(exercise.sets || exercise.reps) && (
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets && `${exercise.sets} sets`}
                                {exercise.sets && exercise.reps && " × "}
                                {exercise.reps && `${exercise.reps} reps`}
                                {exercise.weight && ` @ ${exercise.weight}kg`}
                              </p>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          {/* Rest Day Message */}
          {!isWorkoutDay && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-card shadow-card text-center"
            >
              <Moon className="w-12 h-12 text-rest mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Rest Day</h3>
              <p className="text-muted-foreground">
                Recovery is part of the process. Take it easy today and let your
                body rebuild.
              </p>
            </motion.div>
          )}

          {/* Meals Section */}
          {dayRecord?.meals && dayRecord.meals.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                Meals
              </h3>

              <div className="p-4 rounded-2xl bg-card shadow-card space-y-2">
                {dayRecord.meals.map((meal) => (
                  <motion.button
                    key={meal.id}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                      meal.completed
                        ? "bg-accent/10"
                        : "bg-secondary/50 hover:bg-secondary",
                    )}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleMeal(date, meal.id)}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                        meal.completed
                          ? "border-accent bg-accent"
                          : "border-muted-foreground",
                      )}
                    >
                      {meal.completed && (
                        <Check className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p
                        className={cn(
                          "font-medium",
                          meal.completed &&
                            "line-through text-muted-foreground",
                        )}
                      >
                        {meal.name}
                      </p>
                      {meal.description && (
                        <p className="text-sm text-muted-foreground">
                          {meal.description}
                          {meal.calories && ` • ${meal.calories} cal`}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {dayRecord &&
            dayRecord.workouts.length === 0 &&
            dayRecord.meals.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="p-8 rounded-2xl bg-card shadow-card text-center"
              >
                <Circle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">No records yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding workouts or meals for this day.
                </p>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-workout text-workout-foreground font-medium"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/workout")}
                  >
                    Add Workout
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/meals")}
                  >
                    Add Meals
                  </motion.button>
                </div>
              </motion.div>
            )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DayDetailPage;
