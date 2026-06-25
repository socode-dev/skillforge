import {
  getCachedUserPresence,
  subscribeToUserPresence,
} from "@/lib/userPresenceService";
import { useCallback, useSyncExternalStore } from "react";

export const useUserPresence = (userId?: string) => {
  const subscribe = useCallback(
    (notify: () => void) => subscribeToUserPresence(userId, notify),
    [userId]
  );

  const getSnapshot = useCallback(() => getCachedUserPresence(userId), [userId]);

  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
};
