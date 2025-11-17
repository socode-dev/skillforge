import AccountSecurity from "./components/AccountSecurity";
import DangerZone from "./components/DangerZone";
import Preferences from "./components/Preferences";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 1, x: 1 }}
      exit={{ opacity: 0, x: -50, y: 50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full bg-background text-foreground pb-6 sm:px-8 md:px-10 tablet:px-12"
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
