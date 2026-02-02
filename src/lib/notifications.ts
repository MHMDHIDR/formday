export const NOTIFICATION_PERMISSION_GRANTED = "granted";
export const NOTIFICATION_PERMISSION_DENIED = "denied";
export const NOTIFICATION_PERMISSION_DEFAULT = "default";

/**
 * Request notification permissions from the user.
 * Returns the permission status.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return "denied";
  }

  if (Notification.permission === NOTIFICATION_PERMISSION_GRANTED) {
    return NOTIFICATION_PERMISSION_GRANTED;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Send a notification if permission is granted.
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === NOTIFICATION_PERMISSION_GRANTED) {
    const notification = new Notification(title, {
      icon: "/pwa-192x192.png", // Assumes standard PWA icon path, can be customized
      badge: "/pwa-192x192.png",
      // @ts-ignore - vibrate is valid on mobile
      vibrate: [200, 100, 200],
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}
