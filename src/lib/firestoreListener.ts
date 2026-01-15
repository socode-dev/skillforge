import { db } from "./firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth } from "./firebase";
import type { SkillDataType } from "@/store/useUsersAndSkillsStore";
import useUsersAndSkillsStore from "@/store/useUsersAndSkillsStore";
import useRequestsStore, { type SkillRequest } from "@/store/useRequestsStore";

// export const firestoreSubCollectionListener = <T>(
//   uid: string,
//   subCollection: string,
//   setter: (value: T[]) => void
// ) => {
//   if (!uid || !subCollection) {
//     console.warn(
//       "firestoreCollectionListener: uid or subCollection is undefined"
//     );
//     return () => {};
//   }

//   const subCollectionRef = collection(db, "users", uid, subCollection);

//   const unsubscribe = onSnapshot(subCollectionRef, (snapshot) => {
//     const data = snapshot.docs.map((doc) => ({ ...doc.data() }));

//     if (!!data.length) {
//       setter(data as T[]);
//     } else {
//       setter([] as T[]);
//     }
//   });

//   return unsubscribe;
// };

export const firestoreDocListener = <T>(
  uid: string,
  setter: (user: T) => void
) => {
  if (!uid) {
    console.warn("firestoreDocListener: uid is undefined");
    return () => {};
  }

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.warn(
        `firestoreDocListener: Document at users/${uid} does not exist`
      );
      return;
    }

    const data = snapshot.data();

    setter({ ...data, uid: snapshot.id } as T);
  });

  return unsubscribe;
};

export const skillsCollectionListener = (
  currentUserId: string | null | undefined
) => {
  const { setSkills } = useUsersAndSkillsStore.getState();

  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const collectionRef = collection(db, "skills");

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    if (snapshot.empty) {
      console.warn(`firestoreListener: Document at skills/ does not exist`);
      return;
    }

    const allSkills = snapshot.docs.map((doc) => ({
      ...(doc.data() as SkillDataType),
    }));

    const otherSkills = allSkills.filter(
      (skill) =>
        skill.ownerId !== currentUserId &&
        skill.ownerId !== auth.currentUser?.uid
    );

    setSkills(otherSkills);
  });

  return unsubscribe;
};

export const skillRequestListener = (currentUserId: string) => {
  const { setSkillRequests } = useRequestsStore.getState();

  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const collectionRef = collection(db, "skillRequests");

  const q = query(
    collectionRef,
    where("participants", "array-contains", currentUserId),
    orderBy("updatedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      console.warn(
        `firestoreListener: Document at skillRequests/ does not exist`
      );
      return;
    }

    const skillRequests = snapshot.docs.map((request) => {
      const { participants, ...rest } = request.data();

      return { ...rest } as SkillRequest;
    });
    setSkillRequests(skillRequests);
  });

  return unsubscribe;
};
