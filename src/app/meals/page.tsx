"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Plus, Trash2, Flame } from "lucide-react";
import type { MealTemplate, WeeklyPlan } from "@/types/fitness";

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

const MealPlannerPage = () => {
  const { mealTemplates, setMealTemplates } = useFitnessData();
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>("monday");

  const templateForSelectedDay = mealTemplates.find(
    (t) => t.dayOfWeek === selectedDay,
  );

  const addMeal = () => {
    if (!templateForSelectedDay) {
      // Create new template
      const newTemplate: MealTemplate = {
        id: Math.random().toString(36).substring(2, 15),
        name: `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Meals`,
        dayOfWeek: selectedDay,
        meals: [{ name: "New Meal", description: "", calories: 0 }],
      };
      setMealTemplates((prev) => [...prev, newTemplate]);
    } else {
      // Add meal to existing template
      setMealTemplates((prev) =>
        prev.map((t) =>
          t.id === templateForSelectedDay.id
            ? {
                ...t,
                meals: [
                  ...t.meals,
                  { name: "New Meal", description: "", calories: 0 },
                ],
              }
            : t,
        ),
      );
    }
  };

  const removeMeal = (templateId: string, mealIndex: number) => {
    setMealTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, meals: t.meals.filter((_, i) => i !== mealIndex) }
          : t,
      ),
    );
  };

  const updateMeal = (
    templateId: string,
    mealIndex: number,
    field: string,
    value: string | number,
  ) => {
    setMealTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              meals: t.meals.map((m, i) =>
                i === mealIndex ? { ...m, [field]: value } : m,
              ),
            }
          : t,
      ),
    );
  };

  const totalCalories =
    templateForSelectedDay?.meals.reduce(
      (sum, m) => sum + (m.calories || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-accent" />
            Meal Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plan your daily meals
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
          {/* Day Selector */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Select Day
            </h3>

            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map(({ key, label }) => (
                <motion.button
                  key={key}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                    selectedDay === key
                      ? "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                  )}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(key)}
                >
                  <span className="text-xs font-medium">{label}</span>
                  <UtensilsCrossed className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Calories Summary */}
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-2xl bg-gradient-accent text-accent-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Calories</p>
                  <p className="text-3xl font-bold">{totalCalories}</p>
                </div>
                <Flame className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </motion.div>

          {/* Meals List */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Meals for {selectedDay}
            </h3>

            <div className="space-y-3">
              {templateForSelectedDay?.meals.map((meal, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-2xl bg-card shadow-card space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={meal.name}
                        onChange={(e) =>
                          updateMeal(
                            templateForSelectedDay.id,
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        className="w-full text-lg font-semibold bg-transparent border-none outline-none"
                        placeholder="Meal name"
                      />
                      <input
                        type="text"
                        value={meal.description || ""}
                        onChange={(e) =>
                          updateMeal(
                            templateForSelectedDay.id,
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        className="w-full text-sm text-muted-foreground bg-transparent border-none outline-none"
                        placeholder="Description (optional)"
                      />
                    </div>
                    <motion.button
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        removeMeal(templateForSelectedDay.id, index)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-warning" />
                    <input
                      type="number"
                      value={meal.calories || ""}
                      onChange={(e) =>
                        updateMeal(
                          templateForSelectedDay.id,
                          index,
                          "calories",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 bg-secondary rounded-lg px-3 py-1.5 text-sm"
                      placeholder="0"
                    />
                    <span className="text-sm text-muted-foreground">
                      calories
                    </span>
                  </div>
                </motion.div>
              ))}

              <motion.button
                className="w-full p-4 rounded-2xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-colors"
                whileTap={{ scale: 0.98 }}
                onClick={addMeal}
              >
                <Plus className="w-5 h-5" />
                Add Meal
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MealPlannerPage;
