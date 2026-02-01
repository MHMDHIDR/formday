import { useLocalStorage } from "./useLocalStorage";
import { getDateString, getDayOfWeek } from "@/types/fitness";
import type {
  DayRecord,
  WeeklyPlan,
  WorkoutTemplate,
  MealTemplate,
  UserProfile,
} from "@/types/fitness";
import { useCallback } from "react";

// Generate stable unique IDs using timestamp + random
const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

const defaultWeeklyPlan: WeeklyPlan = {
  monday: "workout",
  tuesday: "workout",
  wednesday: "rest",
  thursday: "workout",
  friday: "workout",
  saturday: "rest",
  sunday: "rest",
};

const defaultWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: "default-push-day",
    name: "PUSH (chest / shoulders / triceps)",
    dayOfWeek: "monday",
    exercises: [
      { id: "push-0", name: "Incline Stairs (warm-up)", sets: 1, mins: 15 }, // 15 minutes
      { id: "push-1", name: "Bench Press or Push-ups", sets: 4, reps: 10 },
      { id: "push-2", name: "Incline Dumbbell Press", sets: 3, reps: 10 },
      {
        id: "push-3",
        name: "Shoulder Press (DB or machine)",
        sets: 3,
        reps: 10,
      },
      { id: "push-4", name: "Lateral Raises", sets: 3, reps: 15 },
      { id: "push-5", name: "Triceps Pushdowns or Dips", sets: 3, reps: 12 },
    ],
  },
  {
    id: "default-pull-day",
    name: "PULL (back / biceps)",
    dayOfWeek: "tuesday",
    exercises: [
      { id: "pull-0", name: "Incline Stairs (warm-up)", sets: 1, mins: 15 }, // 15 minutes
      { id: "pull-1", name: "Lat Pulldown or Pull-ups", sets: 4, reps: 10 },
      { id: "pull-2", name: "Seated Row or Barbell Row", sets: 3, reps: 10 },
      { id: "pull-3", name: "Face Pulls", sets: 3, reps: 15 },
      { id: "pull-4", name: "Dumbbell Curls", sets: 3, reps: 12 },
      { id: "pull-5", name: "Hammer Curls", sets: 2, reps: 12 },
    ],
  },
  {
    id: "default-legs-day",
    name: "LEGS",
    dayOfWeek: "thursday",
    exercises: [
      { id: "legs-0", name: "Incline Stairs (warm-up)", sets: 1, mins: 15 }, // 15 minutes
      { id: "legs-1", name: "Squats or Leg Press", sets: 4, reps: 10 },
      { id: "legs-2", name: "Romanian Deadlifts", sets: 3, reps: 10 },
      { id: "legs-3", name: "Walking Lunges", sets: 3, reps: 10 }, // each leg
      { id: "legs-4", name: "Leg Curls", sets: 3, reps: 12 },
      { id: "legs-5", name: "Standing Calf Raises", sets: 4, reps: 15 },
    ],
  },
  {
    id: "default-upper-body",
    name: "UPPER (full upper)",
    dayOfWeek: "friday",
    exercises: [
      { id: "upper-0", name: "Incline Stairs (warm-up)", sets: 1, mins: 15 }, // 15 minutes
      { id: "upper-1", name: "Incline Bench or Push-ups", sets: 3, reps: 10 },
      { id: "upper-2", name: "Pull-ups or Lat Pulldown", sets: 3, reps: 10 },
      { id: "upper-3", name: "Dumbbell Shoulder Press", sets: 3, reps: 10 },
      { id: "upper-4", name: "Chest Fly or Cable Fly", sets: 2, reps: 12 },
      { id: "upper-5", name: "EZ-Bar Curl", sets: 2, reps: 12 },
      { id: "upper-6", name: "Triceps Pushdowns", sets: 2, reps: 12 },
    ],
  },
];

const defaultMealTemplates: MealTemplate[] = [
  {
    id: "default-standard-day",
    name: "Standard Day",
    dayOfWeek: "monday",
    meals: [
      { name: "Breakfast", description: "Oatmeal with protein", calories: 450 },
      { name: "Lunch", description: "Chicken & rice bowl", calories: 650 },
      { name: "Snack", description: "Greek yogurt & nuts", calories: 300 },
      { name: "Dinner", description: "Salmon with vegetables", calories: 600 },
    ],
  },
];

export function useFitnessData() {
  const [dayRecords, setDayRecords, recordsLoading] = useLocalStorage<
    Record<string, DayRecord>
  >("formday-records", {});
  const [weeklyPlan, setWeeklyPlan, planLoading] = useLocalStorage<WeeklyPlan>(
    "formday-weekly-plan",
    defaultWeeklyPlan,
  );
  const [workoutTemplates, setWorkoutTemplates, workoutsLoading] =
    useLocalStorage<WorkoutTemplate[]>(
      "formday-workout-templates",
      defaultWorkoutTemplates,
    );
  const [mealTemplates, setMealTemplates, mealsLoading] = useLocalStorage<
    MealTemplate[]
  >("formday-meal-templates", defaultMealTemplates);
  const [profile, setProfile, profileLoading] = useLocalStorage<UserProfile>(
    "formday-profile",
    { name: "", email: "" },
  );

  // Combined loading state
  const isLoading =
    recordsLoading ||
    planLoading ||
    workoutsLoading ||
    mealsLoading ||
    profileLoading;

  const getDayRecord = useCallback(
    (date: Date): DayRecord | null => {
      const dateString = getDateString(date);
      return dayRecords[dateString] || null;
    },
    [dayRecords],
  );

  const getTodayRecord = useCallback((): DayRecord | null => {
    return getDayRecord(new Date());
  }, [getDayRecord]);

  const getDayType = useCallback(
    (date: Date): "workout" | "rest" => {
      const dayOfWeek = getDayOfWeek(date);
      return weeklyPlan[dayOfWeek];
    },
    [weeklyPlan],
  );

  const getWorkoutTemplateForDay = useCallback(
    (date: Date): WorkoutTemplate | null => {
      const dayOfWeek = getDayOfWeek(date);
      return workoutTemplates.find((t) => t.dayOfWeek === dayOfWeek) || null;
    },
    [workoutTemplates],
  );

  const getMealTemplateForDay = useCallback(
    (date: Date): MealTemplate | null => {
      const dayOfWeek = getDayOfWeek(date);
      return (
        mealTemplates.find((t) => t.dayOfWeek === dayOfWeek) ||
        mealTemplates[0] ||
        null
      );
    },
    [mealTemplates],
  );

  const createDayRecord = useCallback(
    (date: Date): DayRecord => {
      const dateString = getDateString(date);
      const dayType = getDayType(date);
      const workoutTemplate = getWorkoutTemplateForDay(date);
      const mealTemplate = getMealTemplateForDay(date);

      const record: DayRecord = {
        date: dateString,
        dayType,
        workouts:
          workoutTemplate && dayType === "workout"
            ? [
                {
                  id: generateId(),
                  name: workoutTemplate.name,
                  completed: false,
                  exercises: workoutTemplate.exercises.map((e) => ({
                    ...e,
                    id: generateId(),
                    completed: false,
                  })),
                },
              ]
            : [],
        meals: mealTemplate
          ? mealTemplate.meals.map((m) => ({
              ...m,
              id: generateId(),
              completed: false,
            }))
          : [],
      };

      setDayRecords((prev) => ({ ...prev, [dateString]: record }));
      return record;
    },
    [
      getDayType,
      getWorkoutTemplateForDay,
      getMealTemplateForDay,
      setDayRecords,
    ],
  );

  const updateDayRecord = useCallback(
    (date: Date, updates: Partial<DayRecord>) => {
      const dateString = getDateString(date);
      setDayRecords((prev) => ({
        ...prev,
        [dateString]: {
          ...(prev[dateString] || {
            date: dateString,
            dayType: "rest",
            workouts: [],
            meals: [],
          }),
          ...updates,
        },
      }));
    },
    [setDayRecords],
  );

  const toggleExercise = useCallback(
    (date: Date, workoutId: string, exerciseId: string) => {
      const dateString = getDateString(date);
      setDayRecords((prev) => {
        const record = prev[dateString];
        if (!record) {
          console.warn(
            `toggleExercise: No record found for date ${dateString}. Creating record is required first.`,
          );
          return prev;
        }

        return {
          ...prev,
          [dateString]: {
            ...record,
            workouts: record.workouts.map((w) =>
              w.id === workoutId
                ? {
                    ...w,
                    exercises: w.exercises.map((e) =>
                      e.id === exerciseId
                        ? { ...e, completed: !e.completed }
                        : e,
                    ),
                  }
                : w,
            ),
          },
        };
      });
    },
    [setDayRecords],
  );

  const toggleMeal = useCallback(
    (date: Date, mealId: string) => {
      const dateString = getDateString(date);
      setDayRecords((prev) => {
        const record = prev[dateString];
        if (!record) {
          console.warn(
            `toggleMeal: No record found for date ${dateString}. Creating record is required first.`,
          );
          return prev;
        }

        return {
          ...prev,
          [dateString]: {
            ...record,
            meals: record.meals.map((m) =>
              m.id === mealId ? { ...m, completed: !m.completed } : m,
            ),
          },
        };
      });
    },
    [setDayRecords],
  );

  const getRecordsInRange = useCallback(
    (startDate: Date, endDate: Date): DayRecord[] => {
      const records: DayRecord[] = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        const record = getDayRecord(current);
        if (record) {
          records.push(record);
        }
        current.setDate(current.getDate() + 1);
      }

      return records;
    },
    [getDayRecord],
  );

  return {
    // Loading state
    isLoading,

    // Data
    dayRecords,
    weeklyPlan,
    workoutTemplates,
    mealTemplates,
    profile,

    // Getters
    getDayRecord,
    getTodayRecord,
    getDayType,
    getWorkoutTemplateForDay,
    getMealTemplateForDay,
    getRecordsInRange,

    // Setters
    createDayRecord,
    updateDayRecord,
    toggleExercise,
    toggleMeal,
    setWeeklyPlan,
    setWorkoutTemplates,
    setMealTemplates,
    setProfile,
  };
}
