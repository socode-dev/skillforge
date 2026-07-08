import { Sparkles } from "lucide-react";
import SkillCard from "@/pages/discover/components/SkillCard";
import useUsersStore, {
  type SkillDataType,
} from "@/store/useUsersAndSkillsStore";
import { shuffleArray } from "@/utils/shuffleArray";
import { useMemo } from "react";

const Recommendations = ({searchValue}: {searchValue: string}) => {
  const skills = useUsersStore(state => state.skills);
  const shuffledSkills = useMemo(() => shuffleArray(skills) as SkillDataType[], [skills]);

  const slicedSkills = useMemo(() => shuffledSkills.slice(0, 6).filter(skill => skill.skillName.toLowerCase().includes(searchValue.toLowerCase()) || skill.skillDesc.toLowerCase().includes(searchValue.toLowerCase())), [shuffledSkills, searchValue]);

  if(!slicedSkills.length) return null;

  return (
    <section className="mb-6">
      <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <Sparkles size={20} className="text-primary" />
          <span>Recommended for You</span>
      </h3>

      

      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="flex gap-4 w-max max-w-full snap-x snap-mandatory">
          {slicedSkills.map((skill) => (
            <SkillCard
              key={skill.skillId}
              skill={skill}
              size="min-w-80 h-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
