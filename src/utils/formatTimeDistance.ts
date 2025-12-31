import { formatDistanceToNow } from "date-fns";

export const formatTimeDistance = (date: number) => {
  if (!date) return "";

  const newDate = new Date(date);

  const distanceToNowFormat = formatDistanceToNow(newDate, { addSuffix: true });

  return distanceToNowFormat;
};
