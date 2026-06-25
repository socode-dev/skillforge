import type { UserPresence } from "@/types/message.types";
import { getCreatedAtDate } from "@/utils/groupMessagesByDate";

const ONLINE_FRESHNESS_MS = 5 * 60 * 1000;

export const isUserOnline = (presence?: UserPresence) => {
  if (!presence?.isOnline) return false;
  if (!presence.lastSeenAt) return true;

  const lastSeenAt = getCreatedAtDate(presence.lastSeenAt).getTime();

  return Date.now() - lastSeenAt <= ONLINE_FRESHNESS_MS;
};

export const formatPresenceText = (presence?: UserPresence) => {
  if (isUserOnline(presence)) return "Online";
  if (!presence?.lastSeenAt) return "Offline";

  const lastSeenAt = getCreatedAtDate(presence.lastSeenAt);
  const diffMs = Date.now() - lastSeenAt.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60_000));

  if (diffMinutes < 60) return `Last seen ${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Last seen ${diffHours}h ago`;

  return `Last seen ${lastSeenAt.toLocaleDateString("en-GB")}`;
};
