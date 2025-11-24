import { Check, Lock } from "lucide-react";
import Button from "../ui/Button";
import SettingsModal from "../ui/SettingsModal";
import useSettingsStore from "../../store/useSettingsStore";

const EditMultiFactor = () => {
  const { isEditModalOpen } = useSettingsStore();
  const closeModal = useSettingsStore((state) => state.closeModal);

  if (!isEditModalOpen.multiFactor) return;

  return (
    <SettingsModal
      heading="Edit Multi-Factor Authentication"
      onClose={() => closeModal("multiFactor", false)}
    >
      <div className="flex gap-3 py-6 px-4 bg-soft-primary/50 rounded-radius-xl">
        <Lock size={25} className="text-primary" />

        <div>
          <h4 className="text-sm mb-1.5">Multi-Factor Authentication</h4>

          <p className="text-xs text-muted-foreground">
            Add an extra layer of security to your account by requiring a
            verification code in addition to your password.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => console.log("Enable multi-factor auth")}
        variant="primary"
        className="w-full py-2 mt-4 text-sm font-semibold"
      >
        Enable Multi-Factor Authentication
      </Button>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button
          type="button"
          onClick={() => console.log("Save")}
          variant="primary"
          className="flex justify-center items-center gap-3 text-sm font-semibold py-2"
        >
          <Check size={16} />
          <span>Save Changes</span>
        </Button>

        <Button
          type="button"
          onClick={() => closeModal("multiFactor", false)}
          variant="outline"
          className="text-sm font-semibold py-2"
        >
          Cancel
        </Button>
      </div>
    </SettingsModal>
  );
};

export default EditMultiFactor;
