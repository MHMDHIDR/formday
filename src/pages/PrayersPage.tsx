import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { usePrayerData } from "@/hooks/usePrayerData";
import { cn } from "@/lib/utils";
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Calendar as CalendarIcon,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
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

// Simple Calendar Component
function CustomCalendar({
  currentDate,
  onSelect,
  onClose,
}: {
  currentDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const [viewDate, setViewDate] = useState(currentDate);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(viewDate);
  const monthName = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  // Adjust for Monday start if needed, but standard Sunday start is fine for now
  // Or match the app style. User is probably UK based (Market Drayton), so Monday start is better?
  // Let's stick to simple Sunday start for generic compatibility or Monday.
  // API returns "Al Athnayn" so standard Gregorian.
  // Let's do Monday start for "Premium" feel in UK/Europe.

  // Adjusted for Monday start (0 = Mon, 6 = Sun)
  const firstDayMon = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-emerald-500/20 rounded-2xl p-4 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="size-5 text-emerald-400" />
          </button>
          <h3 className="font-semibold text-white">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="size-5 text-emerald-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
            <span key={d} className="text-xs text-emerald-500/50 font-medium">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array(firstDayMon)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
          {daysArray.map((day) => {
            const date = new Date(
              viewDate.getFullYear(),
              viewDate.getMonth(),
              day,
            );
            const isSelected =
              date.getDate() === currentDate.getDate() &&
              date.getMonth() === currentDate.getMonth() &&
              date.getFullYear() === currentDate.getFullYear();
            const isToday =
              new Date().setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);

            return (
              <button
                key={day}
                onClick={() => onSelect(date)}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all",
                  isSelected
                    ? "bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20"
                    : isToday
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "hover:bg-white/10 text-emerald-100/80",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 text-sm text-emerald-400 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};

export default function PrayersPage() {
  const {
    yearData,
    fetchValues,
    isLoading: isHookLoading,
    getPrayerDataForDate,
  } = usePrayerData();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  // Fetch data for the selected year if not already present
  useEffect(() => {
    const currentYear = selectedDate.getFullYear();
    if (!yearData[currentYear]) {
      fetchValues(city, country, currentYear);
    }
  }, [selectedDate, yearData, fetchValues, city, country]);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const displayData = getPrayerDataForDate(selectedDate);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handleNavigate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setDirection(days);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setDirection(date.getTime() > selectedDate.getTime() ? 1 : -1);
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  // Find next prayer (Only valid if displaying Today)
  const nextPrayer = useMemo(() => {
    if (!displayData || !isToday) return null;

    const now = new Date();
    const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcoming = PRAYER_NAMES.map((p) => {
      const timeStr =
        displayData.timings[p.key as keyof typeof displayData.timings];
      const cleanTime = timeStr.split(" ")[0];
      return {
        ...p,
        time: cleanTime,
        minutes: timeToMinutes(cleanTime),
        isTomorrow: false,
      };
    }).filter((p) => p.minutes > currentMinutes);

    if (upcoming.length > 0) return upcoming[0];

    // If no more prayers today, return Fajr of tomorrow
    const firstPrayer = PRAYER_NAMES[0];
    const timeStr =
      displayData.timings[
        firstPrayer.key as keyof typeof displayData.timings
      ].split(" ")[0];
    return {
      ...firstPrayer,
      time: timeStr,
      minutes: timeToMinutes(timeStr),
      isTomorrow: true,
    };
  }, [displayData, isToday, currentTime]); // Re-run if minutes change

  return (
    <div className="min-h-screen bg-emerald-950 pb-24 text-white font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-10">
        {/* Header with Navigation */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-200 to-teal-400 bg-clip-text text-transparent">
                Prayer Times
              </h1>
              <div className="flex items-center gap-2 text-emerald-400/80 mt-1 text-sm">
                <MapPin className="size-3" />
                <span>
                  {city}, {country}
                </span>
              </div>
            </div>

            <div className="flex gap-x-2.5">
              <AnimatePresence>
                {!isToday && (
                  <motion.button
                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    onClick={() => handleDateSelect(new Date())}
                    className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors border border-emerald-500/20 text-xs font-bold active:scale-95"
                  >
                    {new Date().getDate()}/
                    {new Date().toLocaleString("default", { month: "short" })}
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCalendarOpen(true)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 active:scale-95"
                >
                  <CalendarIcon className="size-5 text-emerald-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center justify-between bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
            <button
              onClick={() => handleNavigate(-1)}
              className="p-2 hover:bg-emerald-500/20 rounded-xl text-emerald-300 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="text-center">
              <span className="block text-emerald-100 font-medium">
                {selectedDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={
                    displayData?.date.hijri.date || selectedDate.toISOString()
                  }
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-xs text-emerald-500/60 font-mono"
                >
                  {displayData
                    ? `${displayData.date.hijri.day} ${displayData.date.hijri.month.en} ${displayData.date.hijri.year}`
                    : "Loading..."}
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavigate(1)}
              className="p-2 hover:bg-emerald-500/20 rounded-xl text-emerald-300 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <AnimatePresence mode="wait">
          {/* Only show Next Prayer card if it's today */}
          {isToday && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-center justify-center py-4">
                {!displayData || isHookLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-emerald-400" />
                    <span className="text-sm text-emerald-400/60">
                      Syncing data...
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
          )}
        </AnimatePresence>

        {/* Sliding Content */}
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={selectedDate.toISOString().split("T")[0]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayData ? (
              PRAYER_NAMES.map((prayer) => {
                const timeStr =
                  displayData.timings[
                    prayer.key as keyof typeof displayData.timings
                  ];
                const cleanTime = timeStr?.split(" ")[0];
                const isActive =
                  isToday &&
                  nextPrayer &&
                  nextPrayer.label === prayer.label &&
                  !nextPrayer.isTomorrow;

                return (
                  <div
                    key={prayer.key}
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
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center text-emerald-500/40">
                <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                <p>Loading schedule...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCalendarOpen && (
          <CustomCalendar
            currentDate={selectedDate}
            onSelect={handleDateSelect}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
