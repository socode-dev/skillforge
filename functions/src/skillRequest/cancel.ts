import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { FieldValue } from "firebase-admin/firestore";

export const cancelSkillRequest = onCall<{ requestId: string }>(
  async ({ auth, data }) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { uid } = auth;
    const { requestId } = data;

    if (!requestId) {
      throw new HttpsError("invalid-argument", "requestId is required");
    }

    const ref = db.collection("skillRequests").doc(requestId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);

      if (!snap.exists) {
        throw new HttpsError("not-found", "Skill request not found");
      }

      const req = snap.data();

      if (req?.requester.userId !== uid) {
        throw new HttpsError("permission-denied", "Only requester can cancel");
      }

      if (req.status !== "PENDING") {
        throw new HttpsError(
          "failed-precondition",
          "only pending requests can be cancelled"
        );
      }

      tx.update(ref, {
        status: "CANCELLED",
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  }
);
