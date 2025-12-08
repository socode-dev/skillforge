import clsx from "clsx";
import { Eye, Users } from "lucide-react";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import type { SkillsFeedDataType } from "../../../lib/buildDiscoverFeeds";

const colors: string[] = [
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

const generateInitialIcon = (name: string) => {
  if (!name) return "";

  const firstLetter = name.charAt(0).toUpperCase();
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={clsx(
        "w-12 h-12 flex items-center justify-center rounded-radius text-xl font-semibold",
        randomColor
      )}
    >
      {firstLetter}
    </div>
  );
};

const SkillCard = ({
  data,
  className,
  size = "w-68 h-auto",
}: {
  data: SkillsFeedDataType;
  className?: string;
  size?: string;
}) => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "flex flex-col bg-card text-card-foreground p-4 border-border border-1 rounded-radius-xl",
        className,
        size
      )}
    >
      {generateInitialIcon(data.skillName)}

      <h4 className="my-2">{data.skillName}</h4>

      <p className="grow text-sm text-muted-foreground">{data.skillDesc}</p>

      <div className="flex justify-between items-center gap-4 mt-4">
        <p className="flex gap-2 text-xs text-muted-foreground">
          <Users size={15} />
          <span>{data.skillLearners} learners</span>
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={() => console.log("View skill details")}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Eye size={18} />
          <span>View</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
