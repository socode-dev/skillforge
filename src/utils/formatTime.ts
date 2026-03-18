// import { formatDistanceToNow } from "date-fns";
import type { Timestamp } from "firebase/firestore";
import { getCreatedAtDate, isSameDay } from "./groupMessagesByDate";

type SerializedTimestamp = { seconds: number; nanoseconds?: number };

type DateInput = number | Date | Timestamp | SerializedTimestamp;

export const formatTime = (date: DateInput) => {
  if (!date) return "";

  const dateCreated = getCreatedAtDate(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if(isSameDay(dateCreated, today)) {
    return dateCreated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  } if(isSameDay(dateCreated, yesterday)) {
    return "Yesterday";
  } else {
    return dateCreated.toLocaleDateString("en-GB");
  }

};
