import type { ProfileEditSchema } from "@/schemas/profileSchema";
import type { Timestamp } from "firebase/firestore";

export interface UserSkills {
    skillId: string;
    skillName: string;
    skillDesc: string;
    isActive: boolean;
    createdAt: Timestamp;
}

export type SkillModalMode = "add" | "edit";

export interface ProfileStoreState {
    skills: UserSkills[];
    coinBalance: number;
    openEditModal: {profile: boolean; skill: boolean};
    skillModalMode: SkillModalMode;
    selectedSkill: UserSkills | null;
    skillPendingDelete: UserSkills | null;
    setOpenEditModal: (type: "profile" | "skill", value: boolean) => void;
    openAddSkillModal: () => void;
    openEditSkillModal: (skill: UserSkills) => void;
    openDeleteSkillDialog: (skill: UserSkills) => void;
    closeDeleteSkillDialog: () => void;
    setSkills: (skills: UserSkills[]) => void;
    fetchUserCoinBalance: (coinBalance: number) => void;
    onSubmitProfileEdit: (data: ProfileEditSchema) => Promise<void>;
    onSubmitSkill: (data: {skillName: string; skillDesc: string}) => Promise<void>;
    onDeleteSkill: () => Promise<void>;
  }
