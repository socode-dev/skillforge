import {
  ChevronDown,
  ChevronUp,
  Key,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import SettingsCard from "../../../components/ui/SettingsCard";
import useAuthStore from "../../../store/useAuthStore";
import { useState } from "react";
import clsx from "clsx";
import useSettingsStore from "../../../store/useSettingsStore";

const AccountSecurity = () => {
  const { currentUser } = useAuthStore();
  const setIsEditModalOpen = useSettingsStore(
    (state) => state.setIsEditModalOpen
  );
  const [isAccountSecurityOpen, setIsAccountSecurityOpen] =
    useState<boolean>(false);

  if (!currentUser) return;

  return (
    <section className="w-full bg-card text-card-foreground px-4 border-1 border-border rounded-radius-xl mb-6">
      <button
        onClick={() => setIsAccountSecurityOpen((prev) => !prev)}
        className="w-full flex justify-between items-center py-6 cursor-pointer"
      >
        <h3 className="flex items-center gap-4">
          <span className="p-2 bg-soft-primary text-primary rounded-radius">
            <Shield size={18} />
          </span>
          <span className="text-sm font-semibold">Account & Security</span>
        </h3>

        {isAccountSecurityOpen ? (
          <ChevronUp size={18} className="lg:hidden" />
        ) : (
          <ChevronDown size={18} className="lg:hidden" />
        )}
      </button>

      <div
        className={clsx(
          "lg:h-fit overflow-y-hidden transition-all duration-300",
          isAccountSecurityOpen ? "max-lg:h-fit" : "max-lg:h-0"
        )}
      >
        <SettingsCard
          icon={User}
          heading="Name"
          subHeading="Your full name"
          value={currentUser.name}
          handleEdit={() => setIsEditModalOpen("name", true)}
          className="mb-4 border-b-1 border-border pb-4 rounded-b-radius"
        />

        <SettingsCard
          icon={Mail}
          heading="Email Address"
          subHeading="Primary email"
          value={currentUser.email}
          handleEdit={() => setIsEditModalOpen("email", true)}
          className="mb-4 border-b-1 border-border pb-4 rounded-b-radius"
        />

        <SettingsCard
          icon={Key}
          heading="Password"
          subHeading="Change password"
          value={"••••••••"}
          handleEdit={() => setIsEditModalOpen("password", true)}
          className="mb-4 border-b-1 border-border pb-4 rounded-b-radius"
        />

        <SettingsCard
          icon={Lock}
          heading="Multi-Factor Authentication"
          subHeading="Extra security"
          value={"Disabled"}
          handleEdit={() => setIsEditModalOpen("multiFactor", true)}
          className="mb-6"
        />
      </div>
    </section>
  );
};

export default AccountSecurity;
