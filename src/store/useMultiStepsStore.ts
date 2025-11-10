import { create } from "zustand";

interface StoreState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

const useMultiStepsStore = create<StoreState>()((set) => ({
  currentStep: 1,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextPage: () => {
    set((state) => ({ currentStep: state.currentStep + 1 }));
  },

  previousPage: () => {
    set((state) => ({ currentStep: state.currentStep - 1 }));
  },
}));

export default useMultiStepsStore;
