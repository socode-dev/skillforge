export interface ProfileDataType {
  id: number;
  name: string;
  job: string;
  skills: string[];
}

export const profilesData: ProfileDataType[] = [
  {
    id: 1,
    name: "Elena Martinez",
    job: "Full-Stack Developer & Mentor",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 2,
    name: "David Chen",
    job: "UX Designer & Research",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: 3,
    name: "Sarah Johnson",
    job: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL"],
  },
  {
    id: 4,
    name: "Alex Rivera",
    job: "Product Manager",
    skills: ["Strategy", "Anaylytics", "Agile"],
  },
  {
    id: 5,
    name: "Maya Patel",
    job: "Content Strategist",
    skills: ["SEO", "Copywriting", "Analytics"],
  },
  {
    id: 6,
    name: "James Kim",
    job: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "AWS"],
  },
];
