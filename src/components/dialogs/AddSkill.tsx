import { X } from "lucide-react";
import { useSkillsContext } from "../../context/useSkillsContext";
import useMultiStepsStore from "../../store/useMultiStepsStore";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";

const AddSkill = () => {
  const isSkillDialogOpen = useMultiStepsStore(
    (state) => state.isSkillDialogOpen
  );
  const setIsSkillDialogOpen = useMultiStepsStore(
    (state) => state.setIsSkillDialog
  );
  const handleAddSkill = useMultiStepsStore((state) => state.handleAddSkill);

  const {
    inputRegister: register,
    inputHandleSubmit: handleSubmit,
    inputReset: reset,
    setSkillsValue,
    getSkillsValues,
    inputFormState,
  } = useSkillsContext();

  const { errors, isSubmitting, isValid } = inputFormState;

  const onSubmit = (skilllName: string, skillDesc: string) => {
    handleAddSkill(skilllName, skillDesc, setSkillsValue, getSkillsValues);
    reset();
  };

  const onClose = () => {
    setIsSkillDialogOpen(false);
    reset();
  };

  if (!isSkillDialogOpen) return;

  return (
    <Dialog>
      <button
        onClick={onClose}
        className="self-end p-2 w-fit h-fit hover:bg-muted rounded-radius transition cursor-pointer mb-4"
      >
        <X size={20} />
      </button>
      <form className="w-full">
        <fieldset className="space-y-1 mb-4">
          <div className="flex flex-col gap-2">
            <Input
              {...register("skillName")}
              type="text"
              label="Skill Name"
              name="skillName"
              placeholder="JavaScript Fundamentals"
              className="py-2 px-4"
            />
          </div>
          {errors.skillName && (
            <p className="text-xs text-destructive">
              {errors.skillName.message}
            </p>
          )}
        </fieldset>

        <fieldset className="mb-4">
          <div className="flex flex-col gap-2">
            <Input
              {...register("skillDesc")}
              type="text"
              label="Skill Description"
              name="skillDesc"
              placeholder="Master the core concepts of JavaScript programming"
              className="py-2 px-4"
            />
          </div>
          {errors.skillDesc && (
            <p className="text-xs text-destructive">
              {errors.skillDesc.message}
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-sm font-semibold py-2"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit((data) =>
              onSubmit(data.skillName, data.skillDesc)
            )}
            whileTap={{ scaleY: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            isDisabled={!isValid || isSubmitting}
            type="button"
            variant="primary"
            className="text-sm font-semibold py-2 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddSkill;
