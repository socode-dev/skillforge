import { Plus, Sparkles, X } from "lucide-react";
import Heading from "./Heading";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import clsx from "clsx";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useMultiStepsStore from "../../../store/useMultiStepsStore";
import { ScrollToTop } from "../../../Layouts/ScrollToTop";
import { useAuthForm } from "../../../hooks/useAuthForm";
import {
  skillInputSchema,
  skillSchema,
  type SkillInputSchema,
  type SkillSchema,
} from "../../../schemas/skillSchema";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useAuthStore from "../../../store/useAuthStore";

const Skills = () => {
  const nextPage = useMultiStepsStore((state) => state.nextPage);
  const previousPage = useMultiStepsStore((state) => state.previousPage);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);

  // Skills array form
  const form = useAuthForm<SkillSchema>(skillSchema, "onSubmit", {
    skills: [],
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const skills = watch("skills");

  const onSubmit = handleSubmit(async (data) => {
    if (!skills.length && !currentUser) return;
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(docRef);
    if (!userDocSnap.exists()) return;

    updateDoc(docRef, {
      ...userDocSnap.data(),
      skills: data.skills,
      signupStepsCompleted: 2,
    });

    setCurrentUser({ ...currentUser, skills: data.skills });

    nextPage();
  });

  // Skill input form
  const inputForm = useAuthForm<SkillInputSchema>(
    skillInputSchema,
    "onChange",
    {
      skillInput: "",
    }
  );

  const {
    register: inputRegister,
    setValue: setinputValue,
    getValues: getinputValues,
    formState: { errors: inputErrors, isValid: isInputValid },
  } = inputForm;

  // Function to add skill
  const handleAdd = () => {
    const value = getinputValues("skillInput");

    if (!value) return;

    if (skills.includes(value)) {
      toast.error("Skill already added.");
      return;
    }

    const current = getValues("skills") ?? [];
    setValue("skills", [...current, value.trim()], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setinputValue("skillInput", "");

    toast("Skill added");
  };

  // Function to delete skill
  const deleteSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);

    setValue("skills", updatedSkills);
    toast("Skill removed");
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-auto"
    >
      <ScrollToTop />
      <Heading
        icon={Sparkles}
        heading="What skills can you teach?"
        desc="Share your expertise with the SkillForge community. Add skills you're confident teaching to others."
      />
      <section className="w-full flex gap-1">
        <div className="flex flex-col gap-2 grow">
          <Input
            {...inputRegister("skillInput")}
            type="text"
            label="Add Your Skills"
            name="skillInput"
            placeholder="e.g., UI Design, Python, Java..."
            className="py-3 px-5"
          />
        </div>

        <Button
          onClick={handleAdd}
          isDisabled={!isInputValid}
          type="button"
          variant="primary"
          className="h-fit py-3 self-end add disabled:opacity-0 disabled:cursor-not-allowed"
        >
          <Plus />
        </Button>
      </section>
      {inputErrors.skillInput && (
        <p className=" text-destructive text-xs">
          {inputErrors.skillInput.message}
        </p>
      )}

      <section
        className={clsx(
          "px-6 py-8 border border-border rounded-radius mt-8",
          skills.length ? "border-solid" : "border-dashed"
        )}
      >
        {!!skills.length && (
          <div className="w-full flex flex-wrap gap-4">
            {skills
              .filter((skill) => skill && skill.trim() !== "")
              .map((skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="flex items-center gap-3 text-sm text-primary font-semibold p-2 bg-soft-primary border-1 border-ring/20 rounded-radius"
                >
                  <span>{skill}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    onClick={() => deleteSkill(skill)}
                    className="p-1 rounded-full bg-primary/20 hover:bg-primary/30 transition cursor-pointer"
                  >
                    <X size={12} />
                  </motion.button>
                </div>
              ))}
          </div>
        )}

        {!skills.length && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted text-muted-foreground">
              <Sparkles size={30} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              No skills added yet. Share what you can teach!
            </p>
          </div>
        )}
      </section>
      {errors.skills && (
        <p className="text-destructive text-xs mt-1">{errors.skills.message}</p>
      )}

      <section className="grid grid-cols-2 gap-2 mt-8">
        <Button
          variant="outline"
          type="button"
          onClick={previousPage}
          className="py-3 text-sm font-semibold"
        >
          Back
        </Button>
        <Button
          variant="primary"
          type="button"
          isDisabled={!skills.length || isSubmitting}
          onClick={onSubmit}
          className="py-3 text-sm font-semibold disabled:opacity-0 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Loading..." : "Next"}
        </Button>
      </section>
    </motion.div>
  );
};

export default Skills;
