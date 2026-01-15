import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { UserDocPayload } from "@functions/types/auth";

export const createInitialUserDoc = onCall<UserDocPayload["profile"]>(
  async ({ auth, data }) => {
    if (!auth)
      throw new HttpsError("unauthenticated", "User not authenticated");

    const { uid } = auth;
    const { name, role, avatar, skillsReview, bio, email } = data;

    if (!name || !email)
      throw new HttpsError("invalid-argument", "Invalid sign up data");

    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);

    batch.set(userRef, {
      userId: uid,
      name,
      avatar,
      email,
      bio,
      role,
      skillsReview,
      signupStepsCompleted: 1,
    });

    await batch.commit();
  }
);
