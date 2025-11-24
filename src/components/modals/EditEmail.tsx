import { Check } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SettingsModal from "../../components/ui/SettingsModal";
import useSettingsStore from "../../store/useSettingsStore";
import { settingsSchema, type EmailSchema } from "../../schemas/settingsSchema";
import { useAuthForm } from "../../hooks/useAuthForm";
import useAuthStore from "../../store/useAuthStore";

const EditEmail = () => {
  const { isEditModalOpen } = useSettingsStore();
  const { currentUser } = useAuthStore();
  const closeModal = useSettingsStore((state) => state.closeModal);
  const emailSchema = settingsSchema.emailSchema;
  const handleEmailChange = useSettingsStore(
    (state) => state.handleEmailChange
  );

  const form = useAuthForm<EmailSchema>(emailSchema, "all", {
    currentEmail: currentUser?.email,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit((data) =>
    handleEmailChange(
      "email",
      data.currentEmail,
      data.newEmail,
      data.confirmPassword,
      reset,
      setError
    )
  );

  const onClose = () => {
    closeModal("email", false);
    reset();
  };

  if (!isEditModalOpen.email) return;

  return (
    <SettingsModal heading="Edit Email" onClose={onClose}>
      <form>
        <fieldset>
          <div>
            <Input
              {...register("currentEmail")}
              label="Current Email Address"
              type="email"
              name="currentEmail"
              className="flex flex-col w-full py-1.5 px-4 mt-2 text-sm"
            />
          </div>
          {errors.currentEmail && (
            <p className="text-xs text-destructive mt-1">
              {errors.currentEmail.message}
            </p>
          )}
        </fieldset>

        <fieldset>
          <div>
            <Input
              {...register("newEmail")}
              label="New Email Address"
              type="email"
              name="newEmail"
              className="flex flex-col w-full py-1.5 px-4 mt-2 text-sm"
            />
          </div>
          {errors.newEmail && (
            <p className="text-xs text-destructive mt-1">
              {errors.newEmail.message}
            </p>
          )}
        </fieldset>

        <fieldset className="mt-2">
          <div>
            <Input
              {...register("confirmPassword")}
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              className="flex flex-col w-full py-1.5 px-4 mt-2 text-sm"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </fieldset>

        <p className="text-xs text-muted-foreground mt-4">
          We'll send a verification email to your new address
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            onClick={onSubmit}
            isDisabled={isSubmitting}
            type="button"
            variant="primary"
            className="flex justify-center items-center gap-3 text-sm font-semibold py-2 disabled:opacity-20 disabled:cursor-not-allowed"
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

export default EditEmail;
