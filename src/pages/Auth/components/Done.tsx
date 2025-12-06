import { CheckCircle2, Sparkles } from "lucide-react";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import useMultiStepsStore from "../../../store/useMultiStepsStore";
import { ScrollToTop } from "../../../Layouts/ScrollToTop";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Done = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const previousPage = useMultiStepsStore((state) => state.previousPage);

  const onSubmit = async () => {
    if (!currentUser) return;

    try {
      const docRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(docRef);

      if (!userDocSnap.exists()) return;

      updateDoc(docRef, { ...userDocSnap.data(), signupStepsCompleted: 4 });

      setCurrentUser({ ...currentUser, signupStepsCompleted: 4 });

      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!currentUser) return;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full flex flex-col items-center gap-6"
    >
      <ScrollToTop />
      <div className="p-6 bg-primary/20 text-primary rounded-full">
        <CheckCircle2 size={50} />
      </div>
      <h3>Welcome to SkillForge!</h3>
      <p className="text-center text-muted-foreground">
        Your profile is all set up. You're ready to start your learning and
        teaching journey!
      </p>

      <div className="w-full h-auto bg-background p-6 space-y-4 border-border border-1 rounded-radius shadow">
        <div className="flex items-center gap-4">
          <Sparkles size={20} className="text-primary" />
          <span>Your Profile Summary</span>
        </div>

        <div className=" w-full flex gap-4">
          <div className="w-20 aspect-square p-1 border-1 border-border rounded-full">
            <img
              src={currentUser.avatar}
              alt="My Profile Picture"
              className="w-full h-full rounded-full"
              loading="lazy"
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold">{currentUser.name}</h4>
            <p className="text-base text-muted-foreground">
              {currentUser.role}
            </p>
            <hr className="text-border" />
            <p className="text-muted-foreground text-sm mt-1">
              {currentUser.email}
            </p>
          </div>
        </div>

        <hr className="mx-auto text-border" />

        <div className="space-y-4">
          <h5 className="text-muted-foreground text-sm font-semibold">
            Skills You Can Teach ({currentUser.skills.length})
          </h5>

          <div className="flex flex-wrap gap-2">
            {currentUser.skills.map((skill) => (
              <span
                key={skill.id}
                className="py-1.5 px-4 bg-soft-primary text-primary text-sm font-semibold border-1 border-ring/20 rounded-radius"
              >
                {skill.skillName}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-8">
        <Button
          variant="outline"
          type="button"
          onClick={previousPage}
          className="py-3 font-semibold text-sm"
        >
          Back
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={onSubmit}
          className="py-3 font-semibold text-sm"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default Done;
