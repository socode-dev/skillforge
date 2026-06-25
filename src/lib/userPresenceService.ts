import { db } from "@/firebase/firebase";
import type { UserPresence } from "@/types/message.types";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  updateDoc,
} from "firebase/firestore";

const HEARTBEAT_INTERVAL_MS = 60_000;
const presenceEntries = new Map<
  string,
  {
    listeners: Set<() => void>;
    presence?: UserPresence;
    unsubscribe?: Unsubscribe;
  }
>();

const updatePresence = async (userId: string, isOnline: boolean) => {
  if (!userId) return;

  await updateDoc(doc(db, "users", userId), {
    isOnline,
    lastSeenAt: serverTimestamp(),
  });
};

export const markUserOnline = (userId: string) => updatePresence(userId, true);

export const markUserOffline = (userId: string) =>
  updatePresence(userId, false);

export const startUserPresence = (userId: string) => {
  if (!userId) return () => {};

  const markCurrentState = () => {
    if (!navigator.onLine) {
      markOffline();
      return;
    }

    markOnline();
  };

  const markVisible = () => {
    if (document.visibilityState !== "visible") return;

    markOnline();
  };

  const markOnline = () => {
    void markUserOnline(userId).catch((err) =>
      console.error("Failed to mark user online:", err)
    );
  };

  const markOffline = () => {
    void markUserOffline(userId).catch((err) =>
      console.error("Failed to mark user offline:", err)
    );
  };

  markCurrentState();

  const heartbeatId = window.setInterval(() => {
    if (navigator.onLine) {
      markOnline();
    }
  }, HEARTBEAT_INTERVAL_MS);

  window.addEventListener("online", markOnline);
  window.addEventListener("offline", markOffline);
  window.addEventListener("focus", markOnline);
  window.addEventListener("beforeunload", markOffline);
  window.addEventListener("pagehide", markOffline);
  document.addEventListener("visibilitychange", markVisible);

  return () => {
    window.clearInterval(heartbeatId);
    window.removeEventListener("online", markOnline);
    window.removeEventListener("offline", markOffline);
    window.removeEventListener("focus", markOnline);
    window.removeEventListener("beforeunload", markOffline);
    window.removeEventListener("pagehide", markOffline);
    document.removeEventListener("visibilitychange", markVisible);
  };
};

export const getCachedUserPresence = (userId?: string) => {
  if (!userId) return undefined;

  return presenceEntries.get(userId)?.presence;
};

export const subscribeToUserPresence = (
  userId: string | undefined,
  listener: () => void
) => {
  if (!userId) return () => {};

  let entry = presenceEntries.get(userId);

  if (!entry) {
    entry = { listeners: new Set() };
    presenceEntries.set(userId, entry);
  }

  entry.listeners.add(listener);

  if (!entry.unsubscribe) {
    entry.unsubscribe = onSnapshot(
      doc(db, "users", userId),
      (snapshot) => {
        const currentEntry = presenceEntries.get(userId);
        if (!currentEntry) return;

        if (!snapshot.exists()) {
          currentEntry.presence = undefined;
        } else {
          const data = snapshot.data();

          currentEntry.presence = {
            isOnline: data.isOnline === true,
            lastSeenAt: data.lastSeenAt,
          };
        }

        currentEntry.listeners.forEach((notify) => notify());
      },
      (error) => console.error("User presence listener failed:", error)
    );
  }

  return () => {
    const currentEntry = presenceEntries.get(userId);
    if (!currentEntry) return;

    currentEntry.listeners.delete(listener);

    if (currentEntry.listeners.size === 0) {
      currentEntry.unsubscribe?.();
      presenceEntries.delete(userId);
    }
  };
};
