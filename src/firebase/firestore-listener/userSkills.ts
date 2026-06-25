import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "../firebase"
import useProfileStore from "@/store/useProfileStore";
import type { UserSkills } from "@/types/profile-store.type";

export const userSkillsListener = (userId: string) => {
    if(!userId) throw Error("User not found");
    
    const {setSkills} = useProfileStore.getState();

    const q = query(collection(db, "users", userId, "skills"));

    const unsubscribe = onSnapshot(q, (snap) => {
        const skills = snap.docs.flatMap((doc) => {
            const data = doc.data() as Omit<UserSkills, "skillId">;

            if (data.isActive === false) return [];

            return [{
                ...data,
                skillId: doc.id,
                skillDesc: data.skillDesc ?? "",
            }];
        });

        setSkills(skills)
    }, (error) => console.error("User skills listener failed:", error));

    return unsubscribe;
}
