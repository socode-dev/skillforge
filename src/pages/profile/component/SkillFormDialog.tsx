import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import { useAuthForm } from "@/hooks/useAuthForm";
import { skillInputSchema, type SkillInputSchema } from "@/schemas/skillSchema";
import useProfileStore from "@/store/useProfileStore";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

const SkillFormDialog = () => {
  const openEditModal = useProfileStore(state => state.openEditModal);
  const setOpenEditModal = useProfileStore(state => state.setOpenEditModal);
  const skillModalMode = useProfileStore(state => state.skillModalMode);
  const selectedSkill = useProfileStore(state => state.selectedSkill);
  const onSubmitSkill = useProfileStore(state => state.onSubmitSkill);

  const form = useAuthForm<SkillInputSchema>(skillInputSchema, "onSubmit", {
    skillName: selectedSkill?.skillName ?? "",
    skillDesc: selectedSkill?.skillDesc ?? "",
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    if(!openEditModal.skill) return;

    reset({
      skillName: selectedSkill?.skillName ?? "",
      skillDesc: selectedSkill?.skillDesc ?? "",
    });
  }, [openEditModal.skill, reset, selectedSkill?.skillDesc, selectedSkill?.skillName]);

  const onClose = () => {
    setOpenEditModal("skill", false);
    reset();
  };

  if(!openEditModal.skill) return null;

  return (
    <Dialog>
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{skillModalMode === "edit" ? "Edit Skill" : "Add Skill"}</h2>

        <button onClick={onClose} className="cursor-pointer">
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit(onSubmitSkill)}>
        <fieldset className="flex flex-col gap-1 mb-4">
          <div className="flex flex-col gap-2">
            <Input
              {...register("skillName")}
              type="text"
              label="Skill Name *"
              name="skillName"
              placeholder="JavaScript Fundamentals"
              className="p-2 bg-muted"
              labelClassName="text-foreground/80"
            />
          </div>

          {errors.skillName && (
            <p className="text-xs text-destructive">{errors.skillName.message}</p>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-1 mb-6">
          <div className="flex flex-col gap-2">
            <Input
              {...register("skillDesc")}
              type="text"
              label="Skill Description *"
              name="skillDesc"
              placeholder="Master the core concepts of JavaScript programming"
              className="p-2 bg-muted"
              labelClassName="text-foreground/80"
            />
          </div>

          {errors.skillDesc && (
            <p className="text-xs text-destructive">{errors.skillDesc.message}</p>
          )}
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-2">
          <Button type="submit" variant="primary" isDisabled={isSubmitting} className="flex items-center justify-center gap-3">
            {isSubmitting ? "Saving..." : (
              <>
                <Check size={20} />
                <span className="text-sm">{skillModalMode === "edit" ? "Save Changes" : "Add Skill"}</span>
              </>
            )}
          </Button>

          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </fieldset>
      </form>
    </Dialog>
  );
};

export default SkillFormDialog;
