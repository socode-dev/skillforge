import useRequestsStore, { type SkillRequest } from "@/store/useRequestsStore";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const skillRequestListener = (currentUserId: string) => {
    const { setSkillRequests } = useRequestsStore.getState();
  
    if (!currentUserId) {
      throw Error(
        "firestoreUsersCollectionListener: currentUserId is undefined"
      );
    }
  
    const collectionRef = collection(db, "skillRequests");
  
    const q = query(
      collectionRef,
      where("participants", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );
  
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setSkillRequests([]);
          return;
        }
  
        const skillRequests = snapshot.docs.map((request) => ({
          requestId: request.id,
          ...request.data(),
        } as SkillRequest));
        
        setSkillRequests(skillRequests);
      },
      (error) => console.error("Skill request listener failed:", error)
    );
  
    return unsubscribe;
  };
