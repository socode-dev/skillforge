import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import useAuthStore from "../../store/useAuthStore";
import useSettingsStore from "../../store/useSettingsStore";

const EmailUpdateSuccessful = () => {
  const { isDialogOpen } = useSettingsStore();
  const closeDialog = useSettingsStore((state) => state.closeDialog);
  const onSignout = useAuthStore((state) => state.onSignout);

  if (!isDialogOpen.email) return;

  return (
    <Dialog>
      <h3 className="text-xl font-semibold">Verify Your New Email</h3>
      <p className="text-sm text-muted-foreground mt-4">
        We've sent a verification link to your new email address.
      </p>
      <ul className="mt-4 list-disc px-8 text-sm text-muted-foreground">
        <li className="">Check your inbox.</li>
        <li>If you don't see it, check your spam folder.</li>
      </ul>
      <p className="text-sm mt-4">
        Once you verify your email, log in again to finish updating your
        account.
      </p>

      <div className="w-fit mx-auto mt-4">
        <Button
          type="button"
          onClick={() => closeDialog("email", onSignout)}
          variant="primary"
          className="w-fit py-2 text-sm font-semibold"
        >
          Ok
        </Button>
      </div>
    </Dialog>
  );
};

export default EmailUpdateSuccessful;
