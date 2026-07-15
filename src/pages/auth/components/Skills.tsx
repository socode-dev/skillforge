import { Briefcase, Plus, Sparkles, X } from "lucide-react";
import Heading from "@/pages/auth/components/Heading";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import { motion } from "framer-motion";
import useMultiStepsStore from "@/store/useMultiStepsStore";
import { ScrollToTop } from "@/layouts/ScrollToTop";
import useAuthStore from "@/store/useAuthStore";
import { useSkillsContext } from "@/context/useSkillsContext";
import Input from "@/components/ui/Input";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Skills = () => {
  const nextPage = useMultiStepsStore((state) => state.nextPage);
  const previousPage = useMultiStepsStore((state) => state.previousPage);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setIsSkillDialogOpen = useMultiStepsStore(
    (state) => state.setIsSkillDialog
  );
  const {
    skillsRegister: register,
    skillsHandleSubmit: handleSubmit,
    skillsFormState,
  } = useSkillsContext();
  const { errors, isSubmitting, isValid } = skillsFormState;

  if (!currentUser) return;

  const skills = currentUser.skills;

  const onSubmit = handleSubmit(async (data) => {
    await updateDoc(doc(db, "users", currentUser.profile.userId), {
      role: data.role,
      skillsReview: currentUser.profile.skillsReview,
      signupStepsCompleted: increment(1),
    });

    setCurrentUser({
      ...currentUser,
      profile: {
        ...currentUser.profile,
        role: data.role,
        signupStepsCompleted: currentUser.profile.signupStepsCompleted + 1,
      },
    });

    nextPage();
  });

  const deleteSkill = (name: string) => {
    if (!name) return;

    const skills = currentUser.skills;

    if (!skills) return;

    const filteredSkills = skills.filter((skill) => skill.skillName !== name);

    setCurrentUser({
      profile: { ...currentUser.profile, skillsReview: filteredSkills },
      skills: filteredSkills,
    });
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
        heading="Share Your Expertise"
        desc="Tell us about your professional role and the skills you can teach to help others grow."
      />

      <fieldset className="mb-6">
        <div className="flex flex-col gap-2 relative">
          <Input
            {...register("role")}
            type="text"
            label="Your Role or Expertise"
            name="role"
            placeholder="e.g., Frontend Developer, Product Designer, Data Scientist..."
            className="py-2 pl-10 pr-5 bg-card"
          />
          <Briefcase
            size={20}
            className="text-muted-foreground absolute top-[80%] left-2 translate-y-[-80%]"
          />
        </div>
        {errors.role && (
          <p className="text-destructive text-xs mt-1">{errors.role.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          What best describes your professional role or area of expertise?
        </p>
      </fieldset>

      <button
        onClick={() => setIsSkillDialogOpen(true)}
        type="button"
        className="flex items-center gap-3 py-1 px-4 border-1 border-accent/20 bg-soft-primary rounded-full text-sm text-primary font-semibold cursor-pointer"
      >
        <Plus size={15} /> <span>Add Skill</span>
      </button>
      <p className="text-xs text-muted-foreground mt-2">
        Add specific skills you're confident teaching to others
      </p>

      <section
        className={clsx(
          "px-6 py-8 border border-border rounded-radius mt-6",
          skills.length ? "border-solid" : "border-dashed"
        )}
      >
        {!!skills.length && (
          <div className="w-full flex flex-wrap gap-4">
            {skills.map(({ skillName, skillDesc }, i) => (
              <div
                key={`skill-${i}-${skillName}-${skillDesc}`}
                className="flex items-center gap-3 text-sm text-primary font-semibold p-2 bg-soft-primary border-1 border-ring/20 rounded-radius"
              >
                <span>{skillName}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  onClick={() => deleteSkill(skillName)}
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
          onClick={onSubmit}
          isDisabled={!skills.length || isSubmitting || !isValid}
          className="py-3 text-sm font-semibold disabled:opacity-0 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Next"}
        </Button>
      </section>
    </motion.div>
  );
};

export default Skills;
