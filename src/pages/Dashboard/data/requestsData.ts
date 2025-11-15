interface RequestDataType {
  id: number;
  name: string;
  skill: string;
  time: string;
  isActive: boolean;
}

export const outgoingRequestData: RequestDataType[] = [
  {
    id: 1,
    name: "David Wilson",
    skill: "Machine Learning",
    time: "3h ago",
    isActive: false,
  },
  {
    id: 2,
    name: "Olivia Martinez",
    skill: "SEO Optimization",
    time: "1d ago",
    isActive: true,
  },
];

export const incomingRequestData: RequestDataType[] = [
  {
    id: 1,
    name: "Emma johnson",
    skill: "React Performance",
    time: "4h ago",
    isActive: true,
  },
  {
    id: 2,
    name: "Michael Brown",
    skill: "Figma Prototyping",
    time: "2h ago",
    isActive: true,
  },
];
