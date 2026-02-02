import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface PrayerTiming {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface PrayerData {
  timings: PrayerTiming;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
  meta: any;
}

// Map of "Month Number" -> Array of Days
type YearlyPrayerData = Record<string, PrayerData[]>;

export function usePrayerData() {
  const [yearData, setYearData, isLoading] = useLocalStorage<YearlyPrayerData>(
    "prayers-2026-cache",
    {},
  );

  const [lastFetched, setLastFetched] = useLocalStorage<number>(
    "prayers-last-fetched",
    0,
  );

  const fetchValues = useCallback(
    async (city: string, country: string, year: number) => {
      try {
        // Check if we already have data and it's fresh (optional logic, but here we just check if empty)
        // Since it's a fixed year 2026, once we have it, we have it.
        // But we might want to refresh if it was empty.

        const response = await fetch(
          `https://api.aladhan.com/v1/calendarByCity/${year}?city=${city}&country=${country}&method=2`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch prayer data");
        }

        const result = await response.json();
        if (result.code === 200 && result.data) {
          setYearData(result.data);
          setLastFetched(Date.now());
        }
      } catch (error) {
        console.error("Error fetching prayer data:", error);
      }
    },
    [setYearData, setLastFetched],
  );

  // Helper to get today's prayer times from the yearly cache
  const getTodayPrayers = useCallback((): PrayerData | null => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString(); // '1' to '12'
    const day = today.getDate(); // 1 to 31

    // API returns months as "1", "2"...
    // And arrays are 0-indexed, so day 1 is index 0.
    if (yearData && yearData[month]) {
      const dayData = yearData[month][day - 1];
      if (dayData) return dayData;
    }
    return null;
  }, [yearData]);

  return {
    yearData,
    isLoading,
    fetchValues,
    getTodayPrayers,
    lastFetched,
  };
}
