import { Check } from "lucide-react";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import useAuthStore from "../../store/useAuthStore";
import useSettingsStore from "../../store/useSettingsStore";

const PasswordUpdateSuccessful = () => {
  const { isDialogOpen } = useSettingsStore();
  const closeDialog = useSettingsStore((state) => state.closeDialog);
  const onSignout = useAuthStore((state) => state.onSignout);

  if (!isDialogOpen.password) return;

  return (
    <Dialog>
      <h3 className="flex  flex-col items-center gap-2 text-xl font-semibold">
        <span className="p-2 border-1 border-primary text-primary rounded-full">
          <Check size={20} />
        </span>
        <span>Password Updated</span>
      </h3>
      <p className="text-sm text-muted-foreground text-center mt-4">
        Your password has been changed successfully.
      </p>
      <p className="text-sm text-muted-foreground text-center mt-2">
        For security reasons, you will now be logged out. Please log in again
        using your new password.
      </p>

      <div className="w-fit mx-auto mt-6">
        <Button
          type="button"
          onClick={() => closeDialog("password", onSignout)}
          variant="primary"
          className="w-fit py-2 text-sm font-semibold"
        >
          Log In Again
        </Button>
      </div>
    </Dialog>
  );
};

export default PasswordUpdateSuccessful;
