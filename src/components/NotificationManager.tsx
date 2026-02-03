import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useEffect, useState, useCallback } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import { Bell, BellOff } from "lucide-react";

/**
 * Safely get notification permission (SSR-safe)
 */
function getNotificationPermission(): NotificationPermission {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission;
  }
  return "default";
}

export function NotificationManager() {
  // Initialize state safely for SSR
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isClient, setIsClient] = useState(false);

  // Mark when we're on the client
  useEffect(() => {
    setIsClient(true);
    setPermission(getNotificationPermission());
  }, []);

  // Listen for permission changes (when user grants/denies via browser settings)
  useEffect(() => {
    if (!isClient || !("permissions" in navigator)) return;

    const checkPermission = () => {
      setPermission(getNotificationPermission());
    };

    // Check periodically in case permission changed externally
    const intervalId = setInterval(checkPermission, 5000);

    return () => clearInterval(intervalId);
  }, [isClient]);

  // This hook runs the notification logic
  usePrayerNotifications();

  const handleEnable = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  }, []);

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  // If permission is default, show button to enable notifications
  if (permission === "default") {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={handleEnable}
          className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 animate-bounce"
          aria-label="Enable prayer notifications"
        >
          <Bell className="size-5" />
          <span className="text-sm font-medium pr-1">Enable Prayer Alerts</span>
        </button>
      </div>
    );
  }

  // If permission is denied, show a less prominent reminder
  if (permission === "denied") {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <div
          className="bg-gray-600 text-white p-3 rounded-full shadow-lg opacity-60 flex items-center gap-2"
          title="Notifications blocked - enable in browser settings"
        >
          <BellOff className="size-5" />
        </div>
      </div>
    );
  }

  // Permission is granted, notification logic runs in background
  return null;
}
