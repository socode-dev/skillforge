import { Check } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SettingsModal from "../../components/ui/SettingsModal";
import useSettingsStore from "../../store/useSettingsStore";
import { useAuthForm } from "../../hooks/useAuthForm";
import { settingsSchema, type NameSchema } from "../../schemas/settingsSchema";
import useAuthStore from "../../store/useAuthStore";

const EditName = () => {
  const { currentUser } = useAuthStore();
  const { isEditModalOpen } = useSettingsStore();
  const closeModal = useSettingsStore((state) => state.closeModal);
  const handleNameEdit = useSettingsStore((state) => state.handleNameEdit);
  const { nameSchema } = settingsSchema;

  if (!currentUser) return;
  const form = useAuthForm<NameSchema>(nameSchema, "onChange", {
    name: currentUser.name,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit((data) => handleNameEdit(data.name, reset));

  const onClose = () => {
    closeModal("name", false);
    reset();
  };

  if (!isEditModalOpen.name) return;

  return (
    <SettingsModal heading="Edit Name" onClose={onClose}>
      <form>
        <fieldset>
          <div>
            <Input
              {...register("name")}
              label="Full Name"
              type="text"
              name="name"
              className="flex flex-col w-full py-1.5 px-4 mt-2"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </fieldset>

        <p className="text-xs text-muted-foreground mt-4">
          Your full name is visible to all SkillForge users{" "}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            onClick={onSubmit}
            isDisabled={isSubmitting}
            type="button"
            variant="primary"
            className="flex justify-center items-center gap-3 text-sm font-semibold py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Check size={16} />
                <span>Save Changes</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="text-sm font-semibold py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </SettingsModal>
  );
};

export default EditName;
