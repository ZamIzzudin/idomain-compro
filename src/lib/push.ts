import AxiosClient from "./axios";

const SW_PATH = "/sw-push.js";
const SUBSCRIBE_ENDPOINT = "/push/subscribe";
const UNSUBSCRIBE_ENDPOINT = "/push/unsubscribe";
const VAPID_ENDPOINT = "/push/vapid-public-key";

let cachedVapidKey: string | null = null;

async function getVapidPublicKey(): Promise<string> {
  if (cachedVapidKey) return cachedVapidKey;

  const { data } = await AxiosClient.get(VAPID_ENDPOINT);
  cachedVapidKey = data.data.publicKey as string;
  return cachedVapidKey;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  try {
    // Unregister any stale service workers first
    const existingRegs = await navigator.serviceWorker.getRegistrations();
    for (const oldReg of existingRegs) {
      await oldReg.unregister();
    }

    const reg = await navigator.serviceWorker.register(SW_PATH, {
      scope: "/",
    });

    // Wait for the SW to be active
    if (reg.installing) {
      await new Promise((resolve) => {
        const sw = reg.installing!;
        sw.addEventListener("statechange", () => {
          if (sw.state === "activated") resolve(null);
        });
      });
    }

    return reg;
  } catch (error) {
    console.error("SW registration failed:", error);
    return null;
  }
}

export async function subscribeToPush(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const reg = await registerServiceWorker();
  if (!reg) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  try {
    // Always fetch fresh key (don't use cache to avoid stale key issues)
    cachedVapidKey = null;
    const vapidKey = await getVapidPublicKey();

    console.log("[push] VAPID key length:", vapidKey.length);
    console.log("[push] VAPID key prefix:", vapidKey.substring(0, 15));

    if (!vapidKey || vapidKey.length < 80) {
      console.error("[push] VAPID public key too short or invalid:", vapidKey?.length);
      return false;
    }

    const keyArray = urlBase64ToUint8Array(vapidKey);
    console.log("[push] keyArray length:", keyArray.length, "bytes");

    // Remove any existing subscription that might use old key
    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) {
      await existingSub.unsubscribe();
    }

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyArray as unknown as BufferSource,
    });

    const subJson = subscription.toJSON();
    await AxiosClient.post(SUBSCRIBE_ENDPOINT, {
      endpoint: subJson.endpoint,
      keys: {
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      },
    });

    return true;
  } catch (error) {
    console.error("[push] Push subscription failed:", error);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;

  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();

    if (subscription) {
      await AxiosClient.post(UNSUBSCRIBE_ENDPOINT, {
        endpoint: subscription.endpoint,
      });
      await subscription.unsubscribe();
    }

    return true;
  } catch (error) {
    console.error("[push] Push unsubscribe failed:", error);
    return false;
  }
}

export async function sendTestNotification(): Promise<boolean> {
  try {
    await AxiosClient.post("/push/test");
    return true;
  } catch (error) {
    console.error("[push] Test notification failed:", error);
    return false;
  }
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
}
