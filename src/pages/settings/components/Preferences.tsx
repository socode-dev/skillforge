import { Bell, ChevronDown, ChevronUp, Palette } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import ThemeSelect from "../../../components/ui/ThemeSelect";
import useSettingsStore from "../../../store/useSettingsStore";

const Preferences = () => {
  const { isNotificationAllowed, setNotificationAllowed } = useSettingsStore();
  const [isPreferenceOpen, setIsPreferenceOpen] = useState<boolean>(false);

  return (
    <section className="w-full bg-card text-card-foreground px-4 border-1 border-border rounded-radius-xl mb-6">
      <button
        onClick={() => setIsPreferenceOpen((prev) => !prev)}
        className="w-full flex justify-between items-center py-6 cursor-pointer"
      >
        <h3 className="flex items-center gap-4">
          <span className="p-2 bg-soft-primary text-primary rounded-radius">
            <Palette size={18} />
          </span>
          <span className="text-sm font-semibold">Preferences</span>
        </h3>

        {isPreferenceOpen ? (
          <ChevronUp size={18} className="lg:hidden" />
        ) : (
          <ChevronDown size={18} className="lg:hidden" />
        )}
      </button>

      <div
        className={clsx(
          "lg:h-fit overflow-y-hidden transition-all duration-300",
          isPreferenceOpen ? "max-lg:h-fit" : "max-lg:h-0"
        )}
      >
        <div>
          <div className="flex gap-4 mb-4">
            <div className="p-2">
              <Palette size={20} className="text-primary" />
            </div>
            <div className="grow">
              <h4 className="text-sm">Dark Mode</h4>
              <p className="text-muted-foreground text-xs">Switch theme</p>
            </div>

            <ThemeSelect />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <div className="p-2">
              <Bell size={20} className="text-primary" />
            </div>
            <div className="grow">
              <h4 className="text-sm">Push Notifications</h4>
              <p className="text-muted-foreground text-xs">In-app updates</p>
            </div>

            <button
              onClick={() => setNotificationAllowed(!isNotificationAllowed)}
              type="button"
              className={clsx(
                "p-1 w-10 h-5 rounded-full relative self-center transition duration-500 cursor-pointer",
                isNotificationAllowed ? "bg-primary" : "bg-muted-foreground/50"
              )}
            >
              <div
                className={clsx(
                  "absolute top-[50%] translate-y-[-50%] w-3.5 h-3.5 bg-background rounded-full transition duration-500",
                  isNotificationAllowed ? "right-1" : "left-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preferences;
