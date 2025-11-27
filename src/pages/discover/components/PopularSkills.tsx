import { skillData } from "../data/skillsData";
import SkillCard from "./SkillCard";

const PopularSkills = () => {
  return (
    <section className="mb-6">
      <h3 className="mb-4">Popular Skills</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skillData.map((data) => (
          <SkillCard data={data} size="w-full h-auto" />
        ))}
      </div>
    </section>
  );
};

export default PopularSkills;
