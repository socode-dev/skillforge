import { Edit2, Trash2 } from "lucide-react";
import useProfileStore from "@/store/useProfileStore";
import type { UserSkills } from "@/types/profile-store.type";

const SkillCard = ({skill}: {skill: UserSkills}) => {
    const openEditSkillModal = useProfileStore(state => state.openEditSkillModal);
    const openDeleteSkillDialog = useProfileStore(state => state.openDeleteSkillDialog);

    return (
        <div className="flex justify-between items-start gap-6 p-6 border border-border hover:border-muted-foreground/40 transition rounded-radius-xl shadow">
            <div className="space-y-2">
                <h4 className="text-lg font-medium">{skill.skillName}</h4>
                <p className="text-sm text-muted-foreground">{skill.skillDesc}</p>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => openEditSkillModal(skill)} type="button" className="flex items-center gap-2 py-1.5 px-2.5 border-border border rounded-radius hover:bg-accent hover:text-accent-foreground transition cursor-pointer">
                    <Edit2 size={15} /> 
                    <span className="text-sm font-medium max-sm:hidden">Edit</span>
                </button>
                
                <button onClick={() => openDeleteSkillDialog(skill)} type="button" className="py-1.5 px-2.5 border-destructive border rounded-radius text-destructive hover:bg-destructive hover:text-destructive-foreground transition cursor-pointer"><Trash2 size={15} /></button>
            </div>
        </div>
    )
}

export default SkillCard;
