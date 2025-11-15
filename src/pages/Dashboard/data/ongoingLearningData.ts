interface OngoingLearningType {
  id: number;
  heading: string;
  name: string;
  desc: string;
  progress: number;
}

export const ongoingLearningData: OngoingLearningType[] = [
  {
    id: 1,
    heading: "Advanced React Patterns",
    name: "Sarah Mitchell",
    desc: "Master advanced React patterns including compound components, rencer props.",
    progress: 68,
  },
  {
    id: 2,
    heading: "UI/UX Design Fundamentals",
    name: "Alex Chen",
    desc: "Learn the core principles of user interface and user experience design.",
    progress: 45,
  },
  {
    id: 3,
    heading: "Python for Data Science",
    name: "Dr. Maria Rodriguez",
    desc: "Deep dive into Python libraries for data analysis and machine learning.",
    progress: 2,
  },
  {
    id: 4,
    heading: "Digital Marketing Strategy",
    name: "James Thompson",
    desc: "build effective digital marketing campaigns that drive real results.",
    progress: 30,
  },
];
