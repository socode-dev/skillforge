import { formatDistanceToNow } from "date-fns";
import type { Timestamp } from "firebase/firestore";

type SerializedTimestamp = { seconds: number; nanoseconds?: number };

type DateInput = number | Date | Timestamp | SerializedTimestamp;

const isFirestoreTimestamp = (value: DateInput): value is Timestamp => {
  return (
    value !== null &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  );
};

const isSerializedTimestamp = (
  value: DateInput
): value is SerializedTimestamp => {
  return (
    value !== null &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  );
};

export const formatTimeDistance = (date: DateInput) => {
  if (!date) return "";

  let newDate: Date;

  if (isFirestoreTimestamp(date)) {
    newDate = date.toDate();
  } else if (isSerializedTimestamp(date)) {
    newDate = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    newDate = date;
  } else {
    newDate = new Date(date);
  }

  const distanceToNowFormat = formatDistanceToNow(newDate, { addSuffix: true });

  return distanceToNowFormat;
};
