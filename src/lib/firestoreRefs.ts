import { collection, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const collectionRef = (userID: string, subCollection: string) => {
  return collection(db, "users", userID, subCollection);
};

export const queryRef = (
  userID: string,
  subCollection: string,
  condition1: string,
  condition2: string
) => {
  return query(
    collectionRef(userID, subCollection),
    where(condition1, "==", condition2)
  );
};
