import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SkillCard from "./SkillCard";
import useUsersStore from "../../../store/useUsersStore";
import { shuffleArray } from "../../../utils/shuffleArray";

const Recommendations = () => {
  const { skills } = useUsersStore();
  const shuffledSkills = shuffleArray(skills);

  const slicedSkills = shuffledSkills.slice(0, 6);

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles size={20} className="text-primary" />
          <span>Recommended for You</span>
        </h3>

        <Link
          to={""}
          className="text-sm font-semibold text-primary hover:text-primary-dark transition"
        >
          View all
        </Link>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="flex gap-4 w-max max-w-full snap-x snap-mandatory">
          {slicedSkills.map((skill) => (
            <SkillCard
              key={skill.skillId}
              data={skill}
              size="min-w-80 h-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
