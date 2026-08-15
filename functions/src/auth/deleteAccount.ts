import { getAuth } from "firebase-admin/auth";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/db";

export const deleteAccount = onCall(async ({auth}) => {
  if (!auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const uid = auth.uid;

  await db.collection("users").doc(uid).delete();
  await getAuth().deleteUser(uid);

  return {success: true};
});
