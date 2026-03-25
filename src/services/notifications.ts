import { showToast, type ToastTone } from "../store/toast-store";

const PUSH_PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY?.trim() ?? "";

export interface NotificationStatus {
  supported: boolean;
  pushSupported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  pushConfigured: boolean;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const normalized = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(normalized);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    });
  }
}

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
}

export function isPushSupported() {
  return isNotificationSupported() && "PushManager" in window;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export async function getNotificationStatus(): Promise<NotificationStatus> {
  const supported = isNotificationSupported();
  const pushSupported = isPushSupported();

  if (!supported) {
    return {
      supported,
      pushSupported,
      permission: "denied",
      subscribed: false,
      pushConfigured: false,
    };
  }

  let subscribed = false;

  if (pushSupported) {
    const registration = await navigator.serviceWorker.ready;
    subscribed = Boolean(await registration.pushManager.getSubscription());
  }

  return {
    supported,
    pushSupported,
    permission: Notification.permission,
    subscribed,
    pushConfigured: Boolean(PUSH_PUBLIC_KEY),
  };
}

export async function subscribeToPushNotifications() {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  if (!PUSH_PUBLIC_KEY) {
    throw new Error("Missing VITE_WEB_PUSH_PUBLIC_KEY for push subscription setup.");
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    return existingSubscription;
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY),
  });
}

export async function unsubscribeFromPushNotifications() {
  if (!isPushSupported()) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return false;
  return subscription.unsubscribe();
}

export async function showAppNotification(title: string, body: string) {
  showToast({ title, description: body, tone: "info" });

  try {
    if (!isNotificationSupported()) return;
    const permission = await requestNotificationPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "healthhq-notification",
      data: { url: "/" },
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

export async function triggerDemoPushNotification(title: string, body: string) {
  if (!isNotificationSupported()) {
    throw new Error("Notifications are not supported in this browser.");
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({
    type: "SHOW_DEMO_PUSH",
    payload: {
      title,
      body,
      url: "/",
    },
  });
}

export function showToastNotification(
  title: string,
  description?: string,
  tone: ToastTone = "info"
) {
  showToast({ title, description, tone });
}
