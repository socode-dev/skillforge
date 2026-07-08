import useUsersAndSkillsStore, { type SkillDataType } from "@/store/useUsersAndSkillsStore";
import { db } from "../firebase";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";

const DISCOVER_SKILLS_LIMIT = 60;

export const skillsCollectionListener = (
    currentUserId: string | null | undefined
  ) => {
    const { setSkills } = useUsersAndSkillsStore.getState();
  
    if (!currentUserId) {
      throw Error(
        "Current User Id is undefined"
      );
    }
  
    const skillsQuery = query(
      collection(db, "skills"),
      where("isActive", "==", true),
      limit(DISCOVER_SKILLS_LIMIT)
    );
  
    const unsubscribe = onSnapshot(skillsQuery, (snapshot) => {
      if (snapshot.empty) {
        setSkills([]);
        return;
      }
  
      const allSkills = snapshot.docs.map((doc) => ({
        ...(doc.data() as SkillDataType),
      }));
  
      const otherSkills = allSkills.filter(
        (skill) => skill.ownerId !== currentUserId);
  
      setSkills(otherSkills);
    }, (error) => console.error("Skills collection listener failed:", error));
  
    return unsubscribe;
  };
