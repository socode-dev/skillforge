import { Check } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SettingsModal from "../ui/SettingsModal";
import useSettingsStore from "../../store/useSettingsStore";
import { useAuthForm } from "../../hooks/useAuthForm";
import {
  settingsSchema,
  type PasswordSchema,
} from "../../schemas/settingsSchema";

const EditPassword = () => {
  const { isEditModalOpen } = useSettingsStore();
  const closeModal = useSettingsStore((state) => state.closeModal);
  const handlePasswordChange = useSettingsStore(
    (state) => state.handlePasswordChange
  );
  const { passwordSchema } = settingsSchema;

  const form = useAuthForm<PasswordSchema>(passwordSchema, "all");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit((data) =>
    handlePasswordChange(
      "password",
      data.currentPassword,
      data.confirmNewPassword,
      setError,
      reset
    )
  );

  const onClose = () => {
    closeModal("password", false);
    reset();
  };

  if (!isEditModalOpen.password) return;

  return (
    <SettingsModal heading="Edit Password" onClose={onClose}>
      <form>
        <fieldset>
          <div>
            <Input
              {...register("currentPassword")}
              label="Current Password"
              type="password"
              name="currentPassword"
              className="flex flex-col w-full px-4 py-1.5 mt-2"
            />
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-destructive mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </fieldset>

        <fieldset className="my-2">
          <div>
            <Input
              {...register("newPassword")}
              label="New Password"
              type="password"
              name="newPassword"
              className="flex flex-col w-full px-4 py-1.5 mt-2"
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </fieldset>

        <fieldset>
          <div>
            <Input
              {...register("confirmNewPassword")}
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              className="flex flex-col w-full px-4 py-1.5 mt-2"
            />
          </div>
          {errors.confirmNewPassword && (
            <p className="text-xs text-destructive mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </fieldset>

        <p className="text-xs text-muted-foreground mt-4">
          Password must be at least 6 characters long
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
              "Submitting..."
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

export default EditPassword;
