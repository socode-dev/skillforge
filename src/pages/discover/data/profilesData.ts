import { v4 as uuidv4 } from "uuid";

export interface ProfileDataType {
  id: string;
  name: string;
  job: string;
  skills: string[];
}

export const profilesData: ProfileDataType[] = [
  {
    id: uuidv4(),
    name: "Elena Martinez",
    job: "Full-Stack Developer & Mentor",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: uuidv4(),
    name: "David Chen",
    job: "UX Designer & Research",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: uuidv4(),
    name: "Sarah Johnson",
    job: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL"],
  },
  {
    id: uuidv4(),
    name: "Alex Rivera",
    job: "Product Manager",
    skills: ["Strategy", "Anaylytics", "Agile"],
  },
  {
    id: uuidv4(),
    name: "Maya Patel",
    job: "Content Strategist",
    skills: ["SEO", "Copywriting", "Analytics"],
  },
  {
    id: uuidv4(),
    name: "James Kim",
    job: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "AWS"],
  },
];
