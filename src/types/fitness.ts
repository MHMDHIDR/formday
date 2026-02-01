// Core data types for Formday

export type DayType = "workout" | "rest";

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  mins?: number;
  weight?: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  calories?: number;
  completed: boolean;
}

export interface DayRecord {
  date: string; // ISO date string YYYY-MM-DD
  dayType: DayType;
  workouts: Workout[];
  meals: Meal[];
  notes?: string;
}

export interface WeeklyPlan {
  monday: DayType;
  tuesday: DayType;
  wednesday: DayType;
  thursday: DayType;
  friday: DayType;
  saturday: DayType;
  sunday: DayType;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayOfWeek: keyof WeeklyPlan;
  exercises: (Omit<Exercise, "id" | "completed"> & { id?: string })[];
}

export interface MealTemplate {
  id: string;
  name: string;
  dayOfWeek: keyof WeeklyPlan;
  meals: Omit<Meal, "id" | "completed">[];
}

export interface UserProfile {
  name: string;
  email: string;
}

// Helper functions
export const getDateString = (date: Date): string => {
  return date.toISOString().split("T")[0] || "";
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00");
};

export const getDayOfWeek = (date: Date): keyof WeeklyPlan => {
  const days: (keyof WeeklyPlan)[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()] || "sunday";
};

export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const calculateWorkoutCompletion = (workouts: Workout[]): number => {
  if (workouts.length === 0) return 0;
  const totalExercises = workouts.reduce(
    (sum, w) => sum + w.exercises.length,
    0,
  );
  if (totalExercises === 0) return 0;
  const completedExercises = workouts.reduce(
    (sum, w) => sum + w.exercises.filter((e) => e.completed).length,
    0,
  );
  return Math.round((completedExercises / totalExercises) * 100);
};

export const calculateMealCompletion = (meals: Meal[]): number => {
  if (meals.length === 0) return 0;
  const completed = meals.filter((m) => m.completed).length;
  return Math.round((completed / meals.length) * 100);
};
