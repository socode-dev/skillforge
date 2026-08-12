import Button from "@/components/ui/Button";
import { BookOpen, Plus, User } from "lucide-react";
import SkillCard from "@/pages/profile/component/SkillCard";
import useProfileStore from "@/store/useProfileStore";
import { useMemo } from "react";

const SkillSection = () => {
    const skills = useProfileStore(state => state.skills);
    const openAddSkillModal = useProfileStore(state => state.openAddSkillModal);

    const sortedSkills = useMemo(() => [...skills].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)), [skills]);

    return (
        <section className="p-6 border border-border rounded-radius-xl shadow space-y-6">
            <fieldset className="w-full flex items-start gap-4">
                <div className="p-2 rounded-radius bg-soft-primary text-primary"><User size={24} /></div>

                <div className="space-y-0.5 grow">
                    <h3 className="text-lg font-medium">My Skills</h3>
                    <p className="text-xs text-muted-foreground">Skills you can teach or share</p>
                </div>

                {!!sortedSkills.length && (<Button onClick={openAddSkillModal} type="button" variant="primary" className="flex items-center gap-2 py-2">
                    <Plus size={20} />
                    <span className="text-sm font-medium max-sm:hidden">Add Skill</span>
                </Button>)}
            </fieldset>

            <fieldset className="flex flex-col gap-4">
                {sortedSkills.length ? (
                    sortedSkills.map(skill => (
                        <SkillCard key={skill.skillId} skill={skill} />
                    ))
                ) : (
                    <div className="flex flex-col items-center my-10">
                        <BookOpen size={100} className="text-muted-foreground mb-4" />

                        <p className="text-base text-muted-foreground mb-8">You have no active skills.</p>

                        <Button onClick={openAddSkillModal} type="button" variant="primary" className="flex items-center gap-2 py-2">
                        <Plus size={20} />
                        <span className="text-sm font-medium">Add Skill</span>
                        </Button>
                    </div>
                )}
            </fieldset>
        </section>
    )
}

export default SkillSection;
