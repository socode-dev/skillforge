import { motion } from "framer-motion";
import PersonalInfo from "@/pages/profile/component/PersonalInfo";
import ActivityOverview from "@/pages/profile/component/ActivityOverview";
import SkillSection from "@/pages/profile/component/SkillSection";
import Progress from "@/pages/profile/component/Progress";
import { useProfileRealtime } from "@/pages/profile/logic/useProfileRealtime";
import SkillFormDialog from "@/pages/profile/component/SkillFormDialog";
import DeleteSkillDialog from "@/pages/profile/component/DeleteSkillDialog";

const Profile = () => {
  useProfileRealtime();

  return <>
  <SkillFormDialog />
  <DeleteSkillDialog />

  <motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
  className="w-full bg-background text-foreground pb-6 px-6 md:px-8 lg:px-10 space-y-6"
>

<section className="w-full mb-8">
        <h2 className="text-2xl font-semibold mb-1">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and showcase your skills.
        </p>
      </section>

      <Progress />

      <PersonalInfo />

      <ActivityOverview />

      <SkillSection />
  </motion.main>
  </>;
};

export default Profile;
