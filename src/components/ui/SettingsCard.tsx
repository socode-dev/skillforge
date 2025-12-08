import { ChevronRight, type LucideIcon } from "lucide-react";
import Button from "./Button";
import clsx from "clsx";

interface SettingsCardProps {
  icon: LucideIcon;
  heading: string;
  subHeading: string;
  value: string;
  handleEdit: () => void;
  className?: string;
}

const SettingsCard = ({
  icon,
  heading,
  subHeading,
  value,
  handleEdit,
  className,
}: SettingsCardProps) => {
  const Icon = icon;

  return (
    <div className={clsx("flex gap-4", className)}>
      <div
        className=" p-2
       bg-soft-primary text-primary rounded-radius w-fit h-fit"
      >
        <Icon size={17} />
      </div>
      <div className="grow">
        <h4 className="text-sm">{heading}</h4>
        <p className="text-xs text-muted-foreground mb-1">{subHeading}</p>
        <p className="text-xs text-foreground/60">Current: {value}</p>
      </div>

      <Button
        onClick={handleEdit}
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit h-fit py-2 text-sm text-primary self-center"
      >
        <span>Edit</span>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default SettingsCard;
