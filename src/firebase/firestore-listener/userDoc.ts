import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const userDocListener = <T>(
    uid: string,
    setter: (user: T) => void
  ) => {
    if (!uid) {
      throw Error("Firestore Listener: uid is undefined");
    }
  
    const userRef = doc(db, "users", uid);
  
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        throw Error(
          `Firestore Listener: Document at users/${uid} does not exist`
        );
      }
  
      const data = snapshot.data();
  
      setter({ ...data, uid: snapshot.id } as T);
    });
  
    return unsubscribe;
  };