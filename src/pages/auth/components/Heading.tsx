import type { LucideIcon } from "lucide-react";

interface HeadingProps {
  icon: LucideIcon;
  heading: string;
  desc: string;
}

const Heading = ({ icon, heading, desc }: HeadingProps) => {
  const Icon = icon;

  return (
    <div className="flex gap-4 mb-8">
      <div className="p-2 w-fit h-fit bg-soft-primary text-primary rounded-radius shadow">
        <Icon size={20} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <p className="text-muted-foreground w-4/5">{desc}</p>
      </div>
    </div>
  );
};

export default Heading;
