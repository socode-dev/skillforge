import { v4 as uuidv4 } from "uuid";

interface RecommendationsDataType {
  id: string;
  category: string;
  skill: string;
  desc: string;
  categoryColor: string;
  categoryBackground: string;
}

export const recommendationsData: RecommendationsDataType[] = [
  {
    id: uuidv4(),
    category: "Development",
    skill: "TypeScript Mastery",
    desc: "Learn advanced TypeScript techniques and types system patterns.",
    categoryColor: "text-blue-500",
    categoryBackground: "bg-blue-500/10",
  },
  {
    id: uuidv4(),
    category: "Marketing",
    skill: "Brand Strategy Workshop",
    desc: "Discover how to build a compelling brand identity and strategy that works.",
    categoryColor: "text-pink-600",
    categoryBackground: "bg-pink-600/10",
  },
  {
    id: uuidv4(),
    category: "Design",
    skill: "3D Modeling Fundamentals",
    desc: "Get started with 3D modeling using Blender and create stunning visual modeling.",
    categoryColor: "text-purple-600",
    categoryBackground: "bg-purple-600/10",
  },
  {
    id: uuidv4(),
    category: "Communication",
    skill: "Public Speaking Mastery",
    desc: "Overcome stage fright and deliver impactfull presentations.",
    categoryColor: "text-orange-600",
    categoryBackground: "bg-orange-600/10",
  },
  {
    id: uuidv4(),
    category: "Data Science",
    skill: "Data Visualization",
    desc: "Transform complex data into clear, actionable insight using modern data.",
    categoryColor: "text-green-600",
    categoryBackground: "bg-green-600/10",
  },
  {
    id: uuidv4(),
    category: "Writing",
    skill: "Creative Writing",
    desc: "Develop your storytelling skills and learn to craft compeling narratives.",
    categoryColor: "text-yellow-600",
    categoryBackground: "bg-yellow-600/10",
  },
];
