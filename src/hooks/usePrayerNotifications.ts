import { useEffect, useRef, useCallback } from "react";
import { usePrayerData } from "./usePrayerData";
import {
  sendNotification,
  NOTIFICATION_PERMISSION_GRANTED,
} from "@/lib/notifications";

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

// Notification timing configuration (in minutes before prayer)
const NOTIFICATION_MINUTES_BEFORE = 10;

// Check interval in milliseconds (30 seconds for more responsive notifications)
const CHECK_INTERVAL_MS = 30 * 1000;

// Simple specialized reminders
const REMINDERS = [
  "Take a moment to disconnect and reconnect with your Creator.",
  "Success calls! Come to prayer, come to success.",
  "A few minutes for your soul, a lifetime of peace.",
  "The best of deeds is the prayer at its proper time.",
  "Pause your busy day for a spiritual recharge.",
];

/**
 * Parse prayer time string to Date object for today
 * Handles formats like "05:52 (BST)" or "05:52"
 */
function parsePrayerTime(timeStr: string): Date | null {
  if (!timeStr) return null;

  const timePart = timeStr.split(" ")[0];
  const [hoursStr, minutesStr] = timePart.split(":");

  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn("Failed to parse prayer time:", timeStr);
    return null;
  }

  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);

  return prayerDate;
}

/**
 * Get a unique storage key for tracking sent notifications
 */
function getNotificationStorageKey(
  dateStr: string,
  prayerName: string,
): string {
  return `prayer-notified-${dateStr}-${prayerName}`;
}

/**
 * Check if notification was already sent for this prayer today
 */
function wasNotificationSent(dateStr: string, prayerName: string): boolean {
  const key = getNotificationStorageKey(dateStr, prayerName);
  return localStorage.getItem(key) === "true";
}

/**
 * Mark notification as sent for this prayer today
 */
function markNotificationSent(dateStr: string, prayerName: string): void {
  const key = getNotificationStorageKey(dateStr, prayerName);
  localStorage.setItem(key, "true");
}

/**
 * Clean up old notification keys (older than today)
 * Keys are stored as: prayer-notified-{readable_date}-{prayerName}
 * We remove any keys that don't contain today's date portion
 */
function cleanupOldNotificationKeys(): void {
  // SSR safety check
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  // Get today's date in the format used by the API (e.g., "03 Feb 2026")
  const today = new Date();
  const dayStr = today.getDate().toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthStr = monthNames[today.getMonth()];
  const yearStr = today.getFullYear().toString();
  const todayPattern = `${dayStr} ${monthStr} ${yearStr}`;

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("prayer-notified-") && !key.includes(todayPattern)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
      console.log(
        `Prayer notifications: Cleaned up ${keysToRemove.length} old notification keys`,
      );
    }
  } catch (error) {
    console.warn("Failed to cleanup old notification keys:", error);
  }
}

export function usePrayerNotifications() {
  const { getTodayPrayers, yearData } = usePrayerData();
  const lastCheckRef = useRef<number>(0);
  const hasCleanedUpRef = useRef<boolean>(false);

  // Memoize the check function to avoid recreating on every render
  const checkPrayers = useCallback(() => {
    // SSR safety check
    if (typeof window === "undefined") {
      return;
    }

    const now = new Date();

    // Avoid checking too frequently (less than 20 seconds apart)
    if (now.getTime() - lastCheckRef.current < 20000) {
      return;
    }
    lastCheckRef.current = now.getTime();

    // Only proceed if notifications are granted
    if (
      !("Notification" in window) ||
      Notification.permission !== NOTIFICATION_PERMISSION_GRANTED
    ) {
      console.debug("Prayer notifications: Permission not granted");
      return;
    }

    const todayData = getTodayPrayers();
    if (!todayData) {
      console.debug("Prayer notifications: No prayer data available for today");
      return;
    }

    const timings = todayData.timings;
    const dateStr = todayData.date.readable;

    console.debug("Prayer notifications: Checking prayers for", dateStr);

    PRAYER_KEYS.forEach((prayerName) => {
      const timeStr = timings[prayerName];
      if (!timeStr) {
        console.debug(`Prayer notifications: No time found for ${prayerName}`);
        return;
      }

      const prayerDate = parsePrayerTime(timeStr);
      if (!prayerDate) return;

      const diffMs = prayerDate.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      // Check if within notification window:
      // - Prayer is in the future (diffMinutes > 0)
      // - Prayer is within NOTIFICATION_MINUTES_BEFORE minutes
      // We use a range to catch the notification even with check intervals
      const shouldNotify =
        diffMinutes > 0 && diffMinutes <= NOTIFICATION_MINUTES_BEFORE;

      if (shouldNotify) {
        if (wasNotificationSent(dateStr, prayerName)) {
          console.debug(
            `Prayer notifications: Already notified for ${prayerName}`,
          );
          return;
        }

        // Pick a random spiritual reminder
        const reminder =
          REMINDERS[Math.floor(Math.random() * REMINDERS.length)];
        const minutesRemaining = Math.ceil(diffMinutes);

        console.log(
          `Prayer notifications: Sending notification for ${prayerName} (${minutesRemaining} min away)`,
        );

        sendNotification(`🕌 ${prayerName} Prayer`, {
          body: `${prayerName} is in ${minutesRemaining} minute${minutesRemaining !== 1 ? "s" : ""}.\n${reminder}`,
          tag: `prayer-${prayerName}-${dateStr}`,
        });

        // Mark as done to prevent duplicate notifications
        markNotificationSent(dateStr, prayerName);
      }
    });
  }, [getTodayPrayers]);

  useEffect(() => {
    // Clean up old notification keys once per session
    if (!hasCleanedUpRef.current) {
      cleanupOldNotificationKeys();
      hasCleanedUpRef.current = true;
    }

    // Request permission if needed (most browsers require user gesture)
    if ("Notification" in window && Notification.permission === "default") {
      console.log(
        "Prayer notifications: Permission is default, will prompt on user interaction",
      );
    }

    // Initial check
    checkPrayers();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkPrayers, CHECK_INTERVAL_MS);

    console.log(
      `Prayer notifications: Started checking every ${CHECK_INTERVAL_MS / 1000}s, ` +
        `notifications ${NOTIFICATION_MINUTES_BEFORE} minutes before prayer`,
    );

    return () => {
      clearInterval(intervalId);
      console.log("Prayer notifications: Stopped checking");
    };
  }, [checkPrayers, yearData]); // yearData dependency ensures we re-run when prayer data loads
}
