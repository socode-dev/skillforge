import { auth, db } from "@/firebase/firebase";
import useAuthStore, { type CurrentUser } from "@/store/useAuthStore";
import useProfileStore from "@/store/useProfileStore";
import type { UserSkills } from "@/types/profile-store.type";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

const normalizeProfile = (
  data: Partial<CurrentUser["profile"]> & { fullName?: string },
  userId: string
): CurrentUser["profile"] => ({
  userId,
  avatar: data.avatar ?? "",
  name: data.name ?? data.fullName ?? "",
  email: data.email ?? "",
  bio: data.bio ?? "",
  role: data.role ?? "",
  signupStepsCompleted: data.signupStepsCompleted ?? 0,
  ratingAvg: data.ratingAvg,
  ratingCount: data.ratingCount,
  coinBalance: data.coinBalance,
  skillsReview: data.skillsReview ?? [],
});

export const useProfileRealtime = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const authResolved = useAuthStore((state) => state.authResolved);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!authResolved || !userId) return;

    const setCurrentUser = useAuthStore.getState().setCurrentUser;
    const { fetchUserCoinBalance, setSkills } = useProfileStore.getState();

    const unsubscribeUser = onSnapshot(
      doc(db, "users", userId),
      (snapshot) => {
        if (!snapshot.exists()) return;

        const profile = normalizeProfile(snapshot.data(), snapshot.id);

        fetchUserCoinBalance(profile.coinBalance ?? 0);
        setCurrentUser({
          profile,
          skills: useProfileStore.getState().skills,
        });
      },
      (error) => console.error("Profile listener failed:", error)
    );

    const unsubscribeSkills = onSnapshot(
      collection(db, "users", userId, "skills"),
      (snapshot) => {
        const skills = snapshot.docs.map((skillDoc) => {
          const data = skillDoc.data() as Omit<UserSkills, "skillId">;

          return {
            ...data,
            skillId: skillDoc.id,
            skillDesc: data.skillDesc ?? "",
          };
        });

        setSkills(skills);

        const latestUser = useAuthStore.getState().currentUser;
        if (latestUser) {
          setCurrentUser({
            ...latestUser,
            skills,
          });
        }
      },
      (error) => console.error("User skills listener failed:", error)
    );

    return () => {
      unsubscribeUser();
      unsubscribeSkills();
    };
  }, [authResolved, currentUser?.profile.userId]);
};
