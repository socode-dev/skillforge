import {
  Target,
  TrendingUp,
  MessageCircle,
  Award,
  type LucideIcon,
} from "lucide-react";

export interface FeatureType {
  id: number;
  icon: LucideIcon;
  iconGradientColor: string;
  heading: string;
  desc: string;
  backgroundHoverColor: string;
}

export const featuresData: FeatureType[] = [
  {
    id: 1,
    icon: Target,
    iconGradientColor: "from-orange-400 to-red-500",
    heading: "Smart Matching",
    desc: "Our intelligent algorithm connects you with the most suitable learners and teachers based on your goals and expertise",
    backgroundHoverColor: "hover:bg-red-50/50",
  },
  {
    id: 2,
    icon: TrendingUp,
    iconGradientColor: "from-green-500 to-green-800",
    heading: "Progress Tracking",
    desc: "Visualize your skill growth with detailed analytics and milestone achievements to stay motivated.",
    backgroundHoverColor: "hover:bg-green-50/50",
  },
  {
    id: 3,
    icon: MessageCircle,
    iconGradientColor: "from-blue-500 to-blue-300",
    heading: "Real-Time Chat",
    desc: "Message instantly with your skill patners, share resources, and schedule sessions seamlessly.",
    backgroundHoverColor: "hover:bg-blue-50/50",
  },
  {
    id: 4,
    icon: Award,
    iconGradientColor: "from-fuchsia-700 to-pink-400",
    heading: "Reward System",
    desc: "Get rewarded for sharing your skills and helping others grow. Earn coins and recognition for every successful learning session.",
    backgroundHoverColor: "hover:bg-pink-50/50",
  },
];
