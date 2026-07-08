import AccountSecurity from "@/pages/settings/components/AccountSecurity";
import DangerZone from "@/pages/settings/components/DangerZone";
import Preferences from "@/pages/settings/components/Preferences";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full bg-background text-foreground pb-6 px-6 md:px-8 lg:px-10"
    >
      <section className="w-full mb-8">
        <h2 className="text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account, preferences, and security settings.
        </p>
      </section>
      <AccountSecurity />
      <Preferences />
      <DangerZone />
    </motion.main>
  );
};

export default Settings;
