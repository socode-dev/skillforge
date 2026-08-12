import { createContext, useContext, type ReactNode } from "react";
import { useAuthForm } from "../hooks/useAuthForm";
import {
  skillInputSchema,
  skillSchema,
  type SkillInputSchema,
  type SkillSchema,
} from "../schemas/skillSchema";
import type { UseFormReturn } from "react-hook-form";

interface SkillsContextState {
  skillsForm: UseFormReturn<SkillSchema>;
  skillInputForm: UseFormReturn<SkillInputSchema>;

  skillsRegister: UseFormReturn<SkillSchema>["register"];
  skillsHandleSubmit: UseFormReturn<SkillSchema>["handleSubmit"];
  skillsReset: UseFormReturn<SkillSchema>["reset"];
  watchSkills: UseFormReturn<SkillSchema>["watch"];
  setSkillsValue: UseFormReturn<SkillSchema>["setValue"];
  getSkillsValues: UseFormReturn<SkillSchema>["getValues"];
  skillsFormState: UseFormReturn<SkillSchema>["formState"];

  inputRegister: UseFormReturn<SkillInputSchema>["register"];
  inputHandleSubmit: UseFormReturn<SkillInputSchema>["handleSubmit"];
  inputReset: UseFormReturn<SkillInputSchema>["reset"];
  inputFormState: UseFormReturn<SkillInputSchema>["formState"];
}

const SkillsContext = createContext<SkillsContextState | null>(null);

export const SkillsProvider = ({ children }: { children: ReactNode }) => {
  const skillsForm = useAuthForm<SkillSchema>(skillSchema, "onSubmit", {
    skills: [],
  });
  const skillInputForm = useAuthForm<SkillInputSchema>(
    skillInputSchema,
    "onSubmit"
  );

  const {
    register: skillsRegister,
    handleSubmit: skillsHandleSubmit,
    reset: skillsReset,
    watch: watchSkills,
    setValue: setSkillsValue,
    getValues: getSkillsValues,
    formState: skillsFormState,
  } = skillsForm;

  const {
    register: inputRegister,
    handleSubmit: inputHandleSubmit,
    reset: inputReset,
    formState: inputFormState,
  } = skillInputForm;

  return (
    <SkillsContext.Provider
      value={{
        skillsForm,
        skillInputForm,
        skillsRegister,
        skillsHandleSubmit,
        skillsReset,
        watchSkills,
        setSkillsValue,
        getSkillsValues,
        skillsFormState,
        inputRegister,
        inputHandleSubmit,
        inputReset,
        inputFormState,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkillsContext = () => {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error("useSkillsContext must be used within a SkillsProvider");
  }
  return context;
};
