export interface OverviewStatsType {
  id: number;
  emoji: string;
  count: number;
  label: string;
}

export const overviewStatsData: OverviewStatsType[] = [
  {
    id: 1,
    emoji: "📘",
    count: 5,
    label: "Active Skills Learning",
  },
  {
    id: 2,
    emoji: "🎓",
    count: 3,
    label: "Active Skills Teaching",
  },
  {
    id: 3,
    emoji: "⏱️",
    count: 12,
    label: "Pending Skills Requests",
  },
  {
    id: 4,
    emoji: "✅",
    count: 28,
    label: "Completed Skills",
  },
];
