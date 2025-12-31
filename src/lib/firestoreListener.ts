import { db } from "./firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth } from "./firebase";

export const firestoreCollectionListener = <T>(
  uid: string,
  subCollection: string,
  setter: (value: T[]) => void
) => {
  if (!uid || !subCollection) {
    console.warn(
      "firestoreCollectionListener: uid or subCollection is undefined"
    );
    return () => {};
  }

  const subCollectionRef = collection(db, "users", uid, subCollection);

  const unsubscribe = onSnapshot(subCollectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ ...doc.data() }));

    if (!!data.length) {
      setter(data as T[]);
    } else {
      setter([] as T[]);
    }
  });

  return unsubscribe;
};

export const firestoreDocListener = <T>(
  uid: string,
  setter: (user: T) => void
) => {
  if (!uid) {
    console.warn("firestoreDocListener: uid is undefined");
    return () => {};
  }

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
    if (!docSnapshot.exists()) {
      console.warn(
        `firestoreDocListener: Document at users/${uid} does not exist`
      );
      return;
    }

    const data = docSnapshot.data();

    setter({ ...data, uid: docSnapshot.id } as T);
  });

  return unsubscribe;
};

export const firestoreUsersCollectionListener = <T>(
  currentUserId: string | null | undefined,
  setter: (users: T[]) => void
) => {
  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const usersCollectionRef = collection(db, "users");

  const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
    const allUsers = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const otherUsers = allUsers.filter(
      (user) => user.id !== currentUserId && user.id !== auth.currentUser?.uid
    );

    setter(otherUsers as T[]);
  });

  return unsubscribe;
};
