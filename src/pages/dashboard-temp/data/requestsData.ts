import { v4 as uuidv4 } from "uuid";

interface RequestDataType {
  id: string;
  name: string;
  skill: string;
  time: string;
  isActive: boolean;
}

export const outgoingRequestData: RequestDataType[] = [
  {
    id: uuidv4(),
    name: "David Wilson",
    skill: "Machine Learning",
    time: "3h ago",
    isActive: false,
  },
  {
    id: uuidv4(),
    name: "Olivia Martinez",
    skill: "SEO Optimization",
    time: "1d ago",
    isActive: true,
  },
];

export const incomingRequestData: RequestDataType[] = [
  {
    id: uuidv4(),
    name: "Emma johnson",
    skill: "React Performance",
    time: "4h ago",
    isActive: true,
  },
  {
    id: uuidv4(),
    name: "Michael Brown",
    skill: "Figma Prototyping",
    time: "2h ago",
    isActive: true,
  },
];
