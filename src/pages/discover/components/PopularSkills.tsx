import useUsersStore from "@/store/useUsersAndSkillsStore";
import SkillCard from "@/pages/discover/components/SkillCard";
import { useMemo } from "react";

const PopularSkills = ({searchValue}: {searchValue: string}) => {
  const skills = useUsersStore(state => state.skills);

  const filteredSkills = useMemo(() => skills.filter(skill => skill.skillName.toLowerCase().includes(searchValue.toLowerCase()) || skill.skillDesc.toLowerCase().includes(searchValue.toLowerCase())), [skills, searchValue]);

  if(!filteredSkills.length) {
    return <p className="mb-20 mt-14 text-center text-xl text-muted-foreground">No skill matched.</p>
  }

  return (
    <section className="mb-6">
      <h3 className="mb-4 text-xl">Popular Skills</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <SkillCard key={skill.skillId} skill={skill} size="w-full h-auto" />
        ))}
      </div>
    </section>
  );
};

export default PopularSkills;
