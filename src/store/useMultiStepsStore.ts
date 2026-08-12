import { create } from "zustand";
import useAuthStore, { type SkillType } from "./useAuthStore";
import { v4 as uuidv4 } from "uuid";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { SkillSchema } from "../schemas/skillSchema";

interface StoreState {
  currentStep: number;
  isSkillDialogOpen: boolean;
  setIsSkillDialog: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  handleAddSkill: (
    skillName: string,
    skillDesc: string,
    setSkillsValue: UseFormSetValue<SkillSchema>,
    getSkillsValues: UseFormGetValues<SkillSchema>
  ) => Promise<void>;
}

const useMultiStepsStore = create<StoreState>()((set) => ({
  currentStep: 1,
  isSkillDialogOpen: false,

  setIsSkillDialog: (value) => set({ isSkillDialogOpen: value }),

  setCurrentStep: (step) => set({ currentStep: step }),

  nextPage: () => {
    set((state) => ({ currentStep: state.currentStep + 1 }));
  },

  previousPage: () => {
    const { currentUser, setCurrentUser } = useAuthStore.getState();
    set((state) => ({ currentStep: state.currentStep - 1 }));

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          signupStepsCompleted: currentUser.profile.signupStepsCompleted - 1,
        },
      });
    }
  },

  handleAddSkill: async (
    skillName,
    skillDesc,
    setSkillsValue,
    getSkillsValues
  ) => {
    const { currentUser, setCurrentUser } = useAuthStore.getState();
    let updatedSkills: SkillType[];

    if (!currentUser) return;

    const currentSkills = currentUser.skills;

    if (currentSkills.length) {
      updatedSkills = [
        ...currentSkills,
        { id: uuidv4(), skillName, skillDesc, learnersCount: 0 },
      ];
    } else {
      updatedSkills = [
        { id: uuidv4(), skillName, skillDesc, learnersCount: 0 },
      ];
    }

    const skillsReview = updatedSkills.map((skill) => ({
      id: skill.id,
      skillName: skill.skillName,
      skillDesc: skill.skillDesc,
    }));

    const updatedCurrentUser = {
      profile: { ...currentUser.profile, skillsReview },
      skills: updatedSkills,
    };

    setCurrentUser(updatedCurrentUser);

    const skills = getSkillsValues("skills");
    setSkillsValue("skills", [...skills, { skillName, skillDesc }]);

    set({ isSkillDialogOpen: false });
  },
}));

export default useMultiStepsStore;
