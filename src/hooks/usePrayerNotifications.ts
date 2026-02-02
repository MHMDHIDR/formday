import { useEffect, useRef } from "react";
import { usePrayerData } from "./usePrayerData";
import {
  sendNotification,
  requestNotificationPermission,
} from "@/lib/notifications";

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Simple specialized reminders
const REMINDERS = [
  "Take a moment to disconnect and reconnect with your Creator.",
  "Success calls! Come to prayer, come to success.",
  "A few minutes for your soul, a lifetime of peace.",
  "The best of deeds is the prayer at its proper time.",
  "Pause your busy day for a spiritual recharge.",
];

export function usePrayerNotifications() {
  const { getTodayPrayers } = usePrayerData();
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    // Request permission on mount (or maybe we should do this on a user interaction button?
    // sticking to simple for now, but usually better on interaction)
    // For now, let's just ensure we log if we don't have it, but we won't force prompt aggressively
    // on load unless the user has already interacted or we decide to.
    // Let's rely on the user clicking a specific "Enable Notifications" button ideally,
    // but the requirement said "add push notifications" - I'll let the user approve when they visit.
    if ("Notification" in window && Notification.permission === "default") {
      // Optional: Prompt immediately or wait for user action.
      // I will prompt immediately for simplicity as requested.
      requestNotificationPermission();
    }

    const checkPrayers = () => {
      const now = new Date();
      // Avoid checking too frequently in the same minute
      if (now.getTime() - lastCheckRef.current < 50000) return;
      lastCheckRef.current = now.getTime();

      const todayData = getTodayPrayers();
      if (!todayData) return;

      const timings = todayData.timings;
      const dateStr = todayData.date.readable; // To mark unique notifications per day

      PRAYER_KEYS.forEach((prayerName) => {
        const timeStr = timings[prayerName as keyof typeof timings];
        if (!timeStr) return;

        // Parse Prayer Time
        // timeStr format example: "05:52 (BST)" or just "05:52"
        const [hours, minutes] = timeStr.split(" ")[0].split(":").map(Number);

        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        const diffMinutes =
          (prayerDate.getTime() - now.getTime()) / (1000 * 60);

        // Check if within 5-6 minutes window (using 6 to be safe for "5 min before")
        // We want to notify exactly once when we enter the "5 minutes remaining" zone.
        // Or simply: if diff is between 4 and 5 minutes.
        if (diffMinutes > 0 && diffMinutes <= 5) {
          const storageKey = `notified-${dateStr}-${prayerName}`;
          const alreadyNotified = localStorage.getItem(storageKey);

          if (!alreadyNotified) {
            // Pick a random spiritual reminder
            const reminder =
              REMINDERS[Math.floor(Math.random() * REMINDERS.length)];

            sendNotification(`Upcoming Prayer: ${prayerName}`, {
              body: `${prayerName} is in ${Math.ceil(diffMinutes)} minutes. ${reminder}`,
              tag: `prayer-${prayerName}`, // Ensures we don't spam multiple for same prayer if logic loops
            });

            // Mark as done
            localStorage.setItem(storageKey, "true");
          }
        }
      });
    };

    const intervalId = setInterval(checkPrayers, 60 * 1000); // Check every minute
    checkPrayers(); // Initial check

    return () => clearInterval(intervalId);
  }, [getTodayPrayers]);
}
