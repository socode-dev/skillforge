export interface SkillDataType {
  id: number;
  skillName: string;
  skillDesc: string;
  learners: number;
}

export const skillData: SkillDataType[] = [
  {
    id: 1,
    skillName: "UI/UX Design",
    skillDesc: "Learn the fundamentals of user interface and experience design",
    learners: 389,
  },
  {
    id: 2,
    skillName: "JavaScript Fundamentals",
    skillDesc: "Master the core concepts of JavaScript prgramming",
    learners: 27,
  },
  {
    id: 3,
    skillName: "Digital Marketing",
    skillDesc: "Explore modern marketing strategies and social media tactics",
    learners: 856,
  },
  {
    id: 4,
    skillName: "Data Visualization",
    skillDesc: "Create compelling visual stories with data using modern tools",
    learners: 654,
  },
  {
    id: 5,
    skillName: "Product Management",
    skillDesc:
      "Learn to build and ship successful products from ideation to launch",
    learners: 110,
  },
  {
    id: 6,
    skillName: "Motion Design",
    skillDesc: "Bring designs to life with animation and motion graphics",
    learners: 423,
  },
];

export const colors: string[] = [
  "bg-red-500/10  text-red-500",
  "bg-blue-500/10 text-blue-500",
  "bg-yellow-500/10 text-yellow-500",
  "bg-purple-500/10 text-purple-500",
  "bg-pink-500/10 0 text-pink-500",
  "bg-indigo-500/10 text-indigo-500",
  "bg-amber-500/10 text-amber-500",
  "bg-gray-500/10 text-gray-500",
  "bg-violet-500/10 text-violet-500",
  "bg-rose-500/10 text-rose-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-orange-500/10 text-orange-500",
];
