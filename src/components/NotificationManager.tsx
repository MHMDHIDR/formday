import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import { Bell } from "lucide-react";

export function NotificationManager() {
  // This hook runs the logic.
  // We can also add a UI element here to toggler permissions if denied/default.
  usePrayerNotifications();

  const [permission, setPermission] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "default",
  );

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  };

  // If permission is default, we might want to show a small button.
  // If granted, we show nothing (logic runs in background).
  // If denied, we can't do much.

  if (permission === "default") {
    // Return a small persistent floating button or just null and rely on the auto-prompt in the hook?
    // The hook auto-prompts. But modern browsers block auto-prompts often.
    // It is safer to render a UI button.
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={handleEnable}
          className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 animate-bounce"
        >
          <Bell className="size-5" />
          <span className="text-sm font-medium pr-1">Enable Prayer Alerts</span>
        </button>
      </div>
    );
  }

  return null;
}
