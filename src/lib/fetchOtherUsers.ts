import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

export const fetchOtherUsers = async () => {
  const usersDocRef = collection(db, "users");
  try {
    const usersDocSnap = await getDocs(usersDocRef);

    const allUsers = usersDocSnap.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return allUsers.filter((data) => data.id !== auth.currentUser?.uid);
  } catch (err) {
    console.error("Error:", err);
  }
};
