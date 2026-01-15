import { onCall, HttpsError } from "firebase-functions/v2/https";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@functions/index";
import { FinalizeSignupPayload } from "@functions/types/auth";

export const finalizeSignup = onCall<FinalizeSignupPayload>(
  async ({ auth, data }) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "User not authenticated");
    }

    const { uid } = auth;
    const { profile, skills } = data;

    if (!profile?.name || !Array.isArray(skills) || !skills.length) {
      throw new HttpsError("invalid-argument", "Invalid sign up data");
    }

    const batch = db.batch();

    const userRef = db.collection("users").doc(uid);

    // Update user document
    batch.update(userRef, {
      userId: uid,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar ?? "",
      bio: profile.bio ?? "",
      skillsReview: profile.skillsReview,
      signupStepsCompleted: 4,
      ratingAvg: 0,
      ratingCount: 0,
      coinBalance: 50,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Create skills
    for (const skill of skills) {
      const skillId = uuidv4();
      const { skillName, skillDesc } = skill;

      const skillRef = db.collection("skills").doc(skillId);

      batch.set(skillRef, {
        skillId,
        skillName,
        skillDesc,

        ownerId: uid,
        ownerName: profile.name,
        ownerRole: profile.role,
        ownerAvatar: profile.avatar ?? "",

        learnersCount: 0,
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
      });

      // User-skill mirror
      const userSkillRef = userRef.collection("skills").doc(skillId);

      batch.set(userSkillRef, {
        skillId,
        skillName,
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
  }
);
