import { v4 as uuidv4 } from "uuid";

export interface OverviewStatsType {
  id: string;
  emoji: string;
  count: number;
  label: string;
}

export const overviewStatsData: OverviewStatsType[] = [
  {
    id: uuidv4(),
    emoji: "📘",
    count: 5,
    label: "Active Skills Learning",
  },
  {
    id: uuidv4(),
    emoji: "🎓",
    count: 3,
    label: "Active Skills Teaching",
  },
  {
    id: uuidv4(),
    emoji: "⏱️",
    count: 12,
    label: "Pending Skills Requests",
  },
  {
    id: uuidv4(),
    emoji: "✅",
    count: 28,
    label: "Completed Skills",
  },
];
