import {
  ArrowLeftRight,
  Home,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export const sidebarData = [
  {
    id: uuidv4(),
    icon: Home,
    label: "Dashboard",
    link: "/home",
  },
  {
    id: uuidv4(),
    icon: Search,
    label: "Discover",
    link: "/home/discover",
  },
  {
    id: uuidv4(),
    icon: ArrowLeftRight,
    label: "Skill Requests",
    link: "/home/skill-requests",
  },
  {
    id: uuidv4(),
    icon: MessageSquare,
    label: "Messages",
    link: "/home/messages",
  },
  {
    id: uuidv4(),
    icon: User,
    label: "Profile",
    link: "/home/profile",
  },
  {
    id: uuidv4(),
    icon: Settings,
    label: "Settings",
    link: "/home/settings",
  },
];
