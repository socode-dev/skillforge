import { MdWarning } from "react-icons/md";
import Dialog from "../ui/Dialog";
import Button from "../ui/Button";
import { useAuthForm } from "../../hooks/useAuthForm";
import {
  settingsSchema,
  type DeleteAccountSchema,
} from "../../schemas/settingsSchema";
import useSettingsStore from "../../store/useSettingsStore";
import clsx from "clsx";

const DeleteAccount = () => {
  const isDialogOpen = useSettingsStore((state) => state.isDialogOpen);
  const closeDialog = useSettingsStore((state) => state.closeDialog);
  const deleteUserAccount = useSettingsStore(
    (state) => state.deleteUserAccount
  );
  const { deleteAccount } = settingsSchema;

  const form = useAuthForm<DeleteAccountSchema>(deleteAccount, "all");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onClose = () => {
    closeDialog("deleteAccount");
    reset();
  };

  const onSubmit = handleSubmit((data) =>
    deleteUserAccount(data.password, reset, setError)
  );

  if (!isDialogOpen.deleteAccount) return;

  return (
    <Dialog>
      <div className="p-2 mx-auto border-1 border-soft-destructive text-destructive w-12 h-12 rounded-full">
        <MdWarning className="w-full h-full" />
      </div>
      <h4 className="text-xl font-semibold  mt-2 text-center">
        Delete Account?
      </h4>
      <p className="text-sm text-muted-foreground text-center leading-relaxed mt-2">
        This action is permanent and cannot be undone. To continue, please enter
        your account password.
      </p>

      <form className="mt-4 w-full">
        <fieldset>
          <input
            {...register("password")}
            type="password"
            className="w-full py-2 px-4 rounded-radius bg-input text-foreground text-base border-1 border-border outline-destructive shadow-soft-destructive transition"
          />
          {errors.password && (
            <p className="text-xs text-destructive mt-1">
              {errors.password.message}
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-4 mt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="py-2 text-sm font-semibold"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            onClick={onSubmit}
            isDisabled={isSubmitting}
            className={clsx(
              "py-2 text-sm font-semibold",
              isSubmitting && "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Deleting" : "Delete Account"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default DeleteAccount;
