import { RefreshCcw, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import { MdWarning } from "react-icons/md";

const DangerZone = () => {
  return (
    <section className="bg-soft-destructive/10 text-card-foreground p-4 border-1 border-destructive/20 rounded-radius-xl mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2.5 bg-soft-destructive rounded-radius text-destructive">
          <Trash2 size={20} />
        </div>
        <h3>Danger Zone</h3>
      </div>

      <div className="flex justify-between items-center border-destructive/20 border-b-1 pb-3">
        <div>
          <h4 className="text-sm">Reset Learning Progress</h4>
          <p className="text-xs text-muted-foreground">
            Clear all your learning progress and start fresh
          </p>
        </div>

        <Button
          type="button"
          onClick={() => console.log("Reset learning data")}
          variant="outline"
          className="flex items-center gap-3 text-destructive text-sm font-semibold border-2 border-destructive rounded-radius hover:bg-transparent"
        >
          <RefreshCcw size={15} />
          <span>Reset</span>
        </Button>
      </div>

      <div className="flex justify-between items-center pt-3">
        <div>
          <h4 className="text-sm">Delete Account</h4>
          <p className="text-xs text-muted-foreground">
            Permanently delete your account and all associated data
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          onClick={() => console.log("Delete your account")}
          className="flex items-center gap-3 text-sm font-semibold py-2"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </Button>
      </div>

      <p className="flex items-center gap-1 mt-1 text-xs">
        <MdWarning size={12} className="text-amber-500" />{" "}
        <span className="text-destructive">This action cannot be undone</span>
      </p>
    </section>
  );
};

export default DangerZone;
