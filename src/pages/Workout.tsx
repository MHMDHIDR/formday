import { useState, useEffect } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { Dumbbell, Plus, Trash2, GripVertical, Check } from "lucide-react";
import type { WeeklyPlan, WorkoutTemplate } from "@/types/fitness";
import ActionButton from "@/components/ActionButton";

const WEEKDAYS: { key: keyof WeeklyPlan; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface ExerciseItemProps {
  exercise: WorkoutTemplate["exercises"][0];
  index: number;
  templateId: string;
  updateExercise: (
    templateId: string,
    index: number,
    field: string,
    value: string | number,
  ) => void;
  removeExercise: (templateId: string, index: number) => void;
}

const ExerciseItem = ({
  exercise,
  index,
  templateId,
  updateExercise,
  removeExercise,
}: ExerciseItemProps) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={exercise}
      id={exercise.id}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileDrag={{
        scale: 1.02,
        zIndex: 10,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none p-1 hover:bg-black/5 rounded active:cursor-grabbing"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2">
        <input
          type="text"
          value={exercise.name}
          onChange={(e) =>
            updateExercise(templateId, index, "name", e.target.value)
          }
          className="col-span-3 bg-transparent border-none outline-none font-medium"
          placeholder="Exercise name"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={exercise.sets || ""}
            onChange={(e) =>
              updateExercise(
                templateId,
                index,
                "sets",
                parseInt(e.target.value) || 0,
              )
            }
            className="w-12 bg-background rounded px-2 py-1 text-sm text-center"
            placeholder="0"
          />
          <span className="text-xs text-muted-foreground">sets</span>
        </div>
        <div className="flex items-center gap-1">
          {exercise.reps ? (
            <>
              <input
                type="number"
                value={exercise.reps || ""}
                onChange={(e) =>
                  updateExercise(
                    templateId,
                    index,
                    "reps",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-12 bg-background rounded px-2 py-1 text-sm text-center"
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">reps</span>
            </>
          ) : (
            <>
              <input
                type="number"
                value={exercise.mins || ""}
                onChange={(e) =>
                  updateExercise(
                    templateId,
                    index,
                    "duration",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-12 bg-background rounded px-2 py-1 text-sm text-center"
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">mins</span>
            </>
          )}
        </div>
      </div>

      <motion.button
        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
        whileTap={{ scale: 0.9 }}
        onClick={() => removeExercise(templateId, index)}
      >
        <Trash2 className="size-4 cursor-pointer" />
      </motion.button>
    </Reorder.Item>
  );
};

export default function WorkoutPlannerPage() {
  const { weeklyPlan, setWeeklyPlan, workoutTemplates, setWorkoutTemplates } =
    useFitnessData();
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>("monday");

  const toggleDayType = (day: keyof WeeklyPlan) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: prev[day] === "workout" ? "rest" : "workout",
    }));
  };

  const templateForSelectedDay = workoutTemplates.find(
    (t) => t.dayOfWeek === selectedDay,
  );

  const addExercise = () => {
    if (!templateForSelectedDay) {
      // Create new template
      const newTemplate: WorkoutTemplate = {
        id: Math.random().toString(36).substring(2, 15),
        name: `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Workout`,
        dayOfWeek: selectedDay,
        exercises: [
          {
            id: Math.random().toString(36).substring(2, 9),
            name: "New Exercise",
            sets: 3,
            reps: 10,
          },
        ],
      };
      setWorkoutTemplates((prev) => [...prev, newTemplate]);
    } else {
      // Add exercise to existing template
      setWorkoutTemplates((prev) =>
        prev.map((t) =>
          t.id === templateForSelectedDay.id
            ? {
                ...t,
                exercises: [
                  ...t.exercises,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    name: "New Exercise",
                    sets: 3,
                    reps: 10,
                  },
                ],
              }
            : t,
        ),
      );
    }
  };

  const removeExercise = (templateId: string, exerciseIndex: number) => {
    setWorkoutTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              exercises: t.exercises.filter((_, i) => i !== exerciseIndex),
            }
          : t,
      ),
    );
  };

  const updateExercise = (
    templateId: string,
    exerciseIndex: number,
    field: string,
    value: string | number,
  ) => {
    setWorkoutTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              exercises: t.exercises.map((e, i) =>
                i === exerciseIndex ? { ...e, [field]: value } : e,
              ),
            }
          : t,
      ),
    );
  };

  const updateTemplateName = (templateId: string, name: string) => {
    setWorkoutTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, name } : t)),
    );
  };

  // Ensure all exercises have IDs for drag and drop
  useEffect(() => {
    let hasChanges = false;
    const patchedTemplates = workoutTemplates.map((t) => {
      const needsPatch = t.exercises.some((e) => !e.id);
      if (needsPatch) {
        hasChanges = true;
        return {
          ...t,
          exercises: t.exercises.map((e) =>
            e.id ? e : { ...e, id: Math.random().toString(36).substring(2, 9) },
          ),
        };
      }
      return t;
    });

    if (hasChanges) {
      setWorkoutTemplates(patchedTemplates);
    }
  }, [workoutTemplates, setWorkoutTemplates]);

  const handleReorder = (newExercises: WorkoutTemplate["exercises"]) => {
    if (!templateForSelectedDay) return;

    setWorkoutTemplates((prev) =>
      prev.map((t) =>
        t.id === templateForSelectedDay.id
          ? { ...t, exercises: newExercises }
          : t,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto py-4 px-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="size-6 text-workout" />
            Workout Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plan your weekly workout schedule
          </p>
        </div>
      </header>

      <main className="container pt-6 pb-10 mx-auto px-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Weekly Schedule */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Weekly Schedule
            </h3>

            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map(({ key, label }) => (
                <motion.button
                  key={key}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                    selectedDay === key &&
                      "ring-2 ring-accent ring-offset-2 ring-offset-background",
                    weeklyPlan[key] === "workout"
                      ? "bg-workout/10 text-workout"
                      : "bg-secondary text-muted-foreground",
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(key)}
                >
                  <span className="text-xs font-medium">{label}</span>
                  <Dumbbell
                    className={cn(
                      "size-4",
                      weeklyPlan[key] === "rest" && "opacity-30",
                    )}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Day Type Toggle */}
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold capitalize">{selectedDay}</h4>
                  <p className="text-sm text-muted-foreground">
                    {weeklyPlan[selectedDay] === "workout"
                      ? "Workout Day"
                      : "Rest Day"}
                  </p>
                </div>
                <motion.button
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all",
                    weeklyPlan[selectedDay] === "workout"
                      ? "bg-workout text-workout-foreground"
                      : "bg-rest text-rest-foreground",
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDayType(selectedDay)}
                >
                  {weeklyPlan[selectedDay] === "workout"
                    ? "Set to Rest"
                    : "Set to Workout"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Workout Template */}
          {weeklyPlan[selectedDay] === "workout" && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Exercises for {selectedDay}
              </h3>

              <div className="p-4 rounded-2xl bg-card shadow-card space-y-4">
                {templateForSelectedDay && (
                  <input
                    type="text"
                    value={templateForSelectedDay.name}
                    onChange={(e) =>
                      updateTemplateName(
                        templateForSelectedDay.id,
                        e.target.value,
                      )
                    }
                    className="w-full text-lg font-semibold bg-transparent border-none outline-none focus:ring-0"
                    placeholder="Workout Name"
                  />
                )}

                {templateForSelectedDay && (
                  <Reorder.Group
                    axis="y"
                    values={templateForSelectedDay.exercises}
                    onReorder={handleReorder}
                    className="space-y-4"
                  >
                    {templateForSelectedDay.exercises.map((exercise, index) => (
                      <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        templateId={templateForSelectedDay.id}
                        updateExercise={updateExercise}
                        removeExercise={removeExercise}
                      />
                    ))}
                  </Reorder.Group>
                )}

                <ActionButton onClick={addExercise}>
                  <Plus className="size-4" />
                  Add Exercise
                </ActionButton>
              </div>
            </motion.div>
          )}

          {/* Rest Day Info */}
          {weeklyPlan[selectedDay] === "rest" && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-card shadow-card text-center"
            >
              <div className="w-16 h-16 rounded-full bg-rest/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-rest" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Rest Day</h3>
              <p className="text-muted-foreground">
                No workouts scheduled. Recovery is essential for muscle growth
                and preventing injury.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
