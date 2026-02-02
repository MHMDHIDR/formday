import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { usePrayerData } from "@/hooks/usePrayerData";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";

// CONSTANT AS REQUESTED
const API_URL =
  "https://api.aladhan.com/v1/timingsByCity?city=Market%20Drayton&country=GB";

const PRAYER_NAMES = [
  { key: "Fajr", label: "Fajr", icon: Moon },
  { key: "Sunrise", label: "Sunrise", icon: Sunrise },
  { key: "Dhuhr", label: "Dhuhr", icon: Sun },
  { key: "Asr", label: "Asr", icon: Sun },
  { key: "Maghrib", label: "Maghrib", icon: Sunset },
  { key: "Isha", label: "Isha", icon: Moon },
];

export default function PrayersPage() {
  const {
    yearData,
    fetchValues,
    isLoading: isHookLoading,
    getTodayPrayers,
  } = usePrayerData();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Parse City/Country from the constant API_URL
  const { city, country } = useMemo(() => {
    try {
      const urlObj = new URL(API_URL);
      return {
        city: urlObj.searchParams.get("city") || "London",
        country: urlObj.searchParams.get("country") || "GB",
      };
    } catch {
      return { city: "Market Drayton", country: "GB" };
    }
  }, []);

  // Fetch data on mount if needed
  useEffect(() => {
    const hasData = Object.keys(yearData || {}).length > 0;
    if (!hasData) {
      fetchValues(city, country, 2026);
    }
  }, [yearData, fetchValues, city, country]);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const todayData = getTodayPrayers();

  // Find next prayer
  const nextPrayer = useMemo(() => {
    if (!todayData) return null;

    const now = new Date();
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Sort prayers by time
    const upcoming = PRAYER_NAMES.map((p) => {
      const timeStr =
        todayData.timings[p.key as keyof typeof todayData.timings];
      // Remove ' (BST)' etc if present
      const cleanTime = timeStr.split(" ")[0];
      return {
        ...p,
        time: cleanTime,
        minutes: timeToMinutes(cleanTime),
        isTomorrow: false,
      };
    }).filter((p) => p.minutes > currentMinutes);

    if (upcoming.length > 0) return upcoming[0];

    // If no more prayers today, return Fajr of tomorrow (simplified as first of list)
    const firstPrayer = PRAYER_NAMES[0];
    const timeStr =
      todayData.timings[
        firstPrayer.key as keyof typeof todayData.timings
      ].split(" ")[0];
    return {
      ...firstPrayer,
      time: timeStr,
      minutes: timeToMinutes(timeStr),
      isTomorrow: true,
    };
  }, [todayData, currentTime]);

  return (
    <div className="min-h-screen bg-emerald-950 pb-24 text-white font-sans selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-6">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
              Prayer Times
            </h1>
            <div className="flex items-center gap-2 text-emerald-400/80 mt-1 text-sm">
              <MapPin className="size-3" />
              <span>
                {city}, {country}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-emerald-100/90 font-medium">
              {todayData?.date.hijri.weekday.en || "..."}
            </div>
            <div className="text-xs text-emerald-400/60 font-mono">
              {todayData?.date.readable || "Loading 2026 data..."}
            </div>
          </div>
        </header>

        {/* Hero Card - Next Prayer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col items-center justify-center py-6">
            {!todayData || isHookLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin text-emerald-400" />
                <span className="text-sm text-emerald-400/60">
                  Syncing 2026 Calendar...
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-emerald-400/80 text-sm font-medium uppercase tracking-widest mb-2">
                  {nextPrayer?.isTomorrow
                    ? "First Prayer Tomorrow"
                    : "Next Prayer"}
                </h2>
                <div className="text-6xl sm:text-7xl font-bold text-white mb-2 tracking-tighter">
                  {nextPrayer?.time}
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-300">
                  {nextPrayer && <nextPrayer.icon className="size-4" />}
                  <span className="font-medium">{nextPrayer?.label}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Prayer Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todayData &&
            PRAYER_NAMES.map((prayer, i) => {
              const timeStr =
                todayData.timings[prayer.key as keyof typeof todayData.timings];
              const cleanTime = timeStr?.split(" ")[0];
              const isActive =
                nextPrayer &&
                nextPrayer.label === prayer.label &&
                !nextPrayer.isTomorrow;

              return (
                <motion.div
                  key={prayer.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                    isActive
                      ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 border-white/5 hover:bg-white/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-xl",
                        isActive
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/5 text-emerald-400/60",
                      )}
                    >
                      <prayer.icon className="size-5" />
                    </div>
                    <span
                      className={cn(
                        "font-medium",
                        isActive ? "text-white" : "text-emerald-100/70",
                      )}
                    >
                      {prayer.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xl font-semibold font-mono tracking-tight",
                      isActive ? "text-white" : "text-emerald-200",
                    )}
                  >
                    {cleanTime}
                  </span>
                </motion.div>
              );
            })}
        </div>

        {/* Hijri Date Card */}
        {todayData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm text-emerald-400/60 mb-1">Hijri Date</h3>
              <p className="text-lg font-medium text-emerald-100">
                {todayData.date.hijri.day} {todayData.date.hijri.month.en}{" "}
                {todayData.date.hijri.year}
              </p>
              <p className="text-xs text-emerald-500/50 font-arabic mt-0.5">
                {todayData.date.hijri.weekday.ar} -{" "}
                {todayData.date.hijri.month.ar}
              </p>
            </div>
            <Calendar className="size-8 text-emerald-500/20" />
          </motion.div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center text-xs text-emerald-500/30">
          <p>Data provided by Aladhan API</p>
          <p className="mt-1">
            {" "}
            cached for 2026 • {city}, {country}
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
