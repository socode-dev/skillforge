import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import useProfileStore from "@/store/useProfileStore";
import { Trash2, X } from "lucide-react";

const DeleteSkillDialog = () => {
  const skillPendingDelete = useProfileStore(state => state.skillPendingDelete);
  const closeDeleteSkillDialog = useProfileStore(state => state.closeDeleteSkillDialog);
  const onDeleteSkill = useProfileStore(state => state.onDeleteSkill);

  if(!skillPendingDelete) return null;

  return (
    <Dialog>
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Delete Skill</h2>

        <button onClick={closeDeleteSkillDialog} className="cursor-pointer">
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Are you sure you want to delete {skillPendingDelete.skillName}? This will remove it from your profile and the public skills list.
      </p>

      <fieldset className="grid grid-cols-2 gap-2">
        <Button type="button" variant="destructive" onClick={onDeleteSkill} className="flex items-center justify-center gap-3">
          <Trash2 size={18} />
          <span className="text-sm">Delete</span>
        </Button>

        <Button type="button" variant="outline" onClick={closeDeleteSkillDialog}>
          Cancel
        </Button>
      </fieldset>
    </Dialog>
  );
};

export default DeleteSkillDialog;
