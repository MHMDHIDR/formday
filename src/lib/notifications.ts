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
 * Get the active service worker registration
 */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error("Error getting service worker registration:", error);
    return null;
  }
}

/**
 * Send a notification if permission is granted.
 * Uses Service Worker for PWA background notifications when available,
 * falls back to standard Notification API for foreground notifications.
 */
export async function sendNotification(
  title: string,
  options?: NotificationOptions,
) {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return;
  }

  if (Notification.permission !== NOTIFICATION_PERMISSION_GRANTED) {
    console.warn("Notification permission not granted");
    return;
  }

  const notificationOptions = {
    icon: "/icons/192.png",
    badge: "/icons/192.png",
    vibrate: [200, 100, 200],
    requireInteraction: true, // Keep notification visible until user interacts
    silent: false,
    ...options,
  } as NotificationOptions & { vibrate?: number[] };

  // Try to use Service Worker for PWA background notifications
  const swRegistration = await getServiceWorkerRegistration();

  if (swRegistration) {
    try {
      await swRegistration.showNotification(title, notificationOptions);
      console.log("Notification sent via Service Worker:", title);
      return;
    } catch (error) {
      console.warn("Service Worker notification failed, falling back:", error);
    }
  }

  // Fallback to standard Notification API (works only when app is in foreground)
  try {
    const notification = new Notification(title, notificationOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    console.log("Notification sent via Notification API:", title);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
