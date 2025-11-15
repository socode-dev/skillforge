import {
  ArrowLeftRight,
  Home,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";

export const sidebarData = [
  {
    id: 1,
    icon: Home,
    label: "Dashboard",
    link: "/home",
  },
  {
    id: 2,
    icon: Search,
    label: "Discover",
    link: "/home/discover",
  },
  {
    id: 3,
    icon: ArrowLeftRight,
    label: "Skill Requests",
    link: "/home/skill-requests",
  },
  {
    id: 4,
    icon: MessageSquare,
    label: "Messages",
    link: "/home/messages",
  },
  {
    id: 5,
    icon: User,
    label: "Profile",
    link: "/home/profile",
  },
  {
    id: 6,
    icon: Settings,
    label: "Settings",
    link: "/home/settings",
  },
];
