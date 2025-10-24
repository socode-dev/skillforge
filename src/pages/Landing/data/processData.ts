import { Search, Share2, Users, type LucideIcon } from "lucide-react";

export interface Data {
  id: number;
  icon: LucideIcon;
  iconGradientColor: string;
  heading: string;
  desc: string;
  backgroundHoverColor: string;
}

export const processData: Data[] = [
  {
    id: 1,
    icon: Search,
    iconGradientColor: "from-blue-500 to-blue-400",
    heading: "Discover Skills",
    desc: "Explore what others are teaching and find the perfect march for you learning goals.",
    backgroundHoverColor: "hover:bg-soft-blue",
  },
  {
    id: 2,
    icon: Users,
    iconGradientColor: "from-primary to-primary/60",
    heading: "Request & Learn",
    desc: "Connect and learn directly from people who master the skills you want to acquire.",
    backgroundHoverColor: "hover:bg-primary/5",
  },
  {
    id: 3,
    icon: Share2,
    iconGradientColor: "from-fuchsia-700 to-pink-500",
    heading: "Share Your Knowledge",
    desc: "Teach your skills to others and help them grow while earning recognition.",
    backgroundHoverColor: "hover:bg-soft-pink",
  },
];
