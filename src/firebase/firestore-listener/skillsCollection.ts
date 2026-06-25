import useUsersAndSkillsStore, { type SkillDataType } from "@/store/useUsersAndSkillsStore";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const skillsCollectionListener = (
    currentUserId: string | null | undefined
  ) => {
    const { setSkills } = useUsersAndSkillsStore.getState();
  
    if (!currentUserId) {
      throw Error(
        "Current User Id is undefined"
      );
    }
  
    const collectionRef = collection(db, "skills");
  
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (snapshot.empty) {
        setSkills([]);
        return;
      }
  
      const allSkills = snapshot.docs.map((doc) => ({
        ...(doc.data() as SkillDataType),
      }));
  
      const otherSkills = allSkills.filter(
        (skill) => skill.isActive && skill.ownerId !== currentUserId);
  
      setSkills(otherSkills);
    }, (error) => console.error("Skills collection listener failed:", error));
  
    return unsubscribe;
  };
