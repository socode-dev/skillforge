import { create } from "zustand";
import useAuthStore from "./useAuthStore";
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
    set((state) => ({ currentStep: state.currentStep - 1 }));
  },

  handleAddSkill: async (
    skillName,
    skillDesc,
    setSkillsValue,
    getSkillsValues
  ) => {
    const { currentUser, setCurrentUser } = useAuthStore.getState();
    let updatedSkills;

    if (!currentUser) return;

    console.log(currentUser);

    const currentSkills = currentUser.skills;

    if (!!currentSkills.length) {
      updatedSkills = [
        ...currentSkills,
        { id: uuidv4(), skillName, skillDesc },
      ];
    } else {
      updatedSkills = [{ id: uuidv4(), skillName, skillDesc }];
    }

    const updatedCurrentUser = { ...currentUser, skills: updatedSkills };

    setCurrentUser(updatedCurrentUser);

    const skills = getSkillsValues("skills");
    setSkillsValue("skills", [...skills, { skillName, skillDesc }]);

    set({ isSkillDialogOpen: false });
  },
}));

export default useMultiStepsStore;
