import useUsersStore from "../../../store/useUsersStore";
import SkillCard from "./SkillCard";

const PopularSkills = () => {
  const { skills } = useUsersStore();

  return (
    <section className="mb-6">
      <h3 className="mb-4">Popular Skills</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.skillID} data={skill} size="w-full h-auto" />
        ))}
      </div>
    </section>
  );
};

export default PopularSkills;
