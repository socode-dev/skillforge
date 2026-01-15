import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "@functions/index";
import { SendPayload } from "@functions/types/skillRequest/SendPayload";

export const sendSkillRequest = onCall<SendPayload>(async ({ auth, data }) => {
  if (!auth) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }

  const requesterId = auth.uid;
  const { skillId, skillName, skillDesc, owner, requester } = data;

  if (!skillId || !owner?.userId || !requester.userId) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  if (owner.userId === requesterId) {
    throw new HttpsError(
      "failed-precondition",
      "Cannot request your own skill"
    );
  }

  const existingSnap = await db
    .collection("skillRequets")
    .where("skillId", "==", "skillId")
    .where("requesterId", "==", requesterId)
    .where("status", "in", ["PENDING", "ACCEPTED"])
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    throw new HttpsError(
      "already-exists",
      "You already have an active request for this skill"
    );
  }

  const requestId = uuidv4();
  const requestRef = db.collection("skillRequests").doc(requestId);

  await requestRef.set({
    requestId,

    skillId,
    skillName,
    skillDesc,

    owner,
    requester,

    participants: [owner.userId, requester.userId],

    status: "PENDING",

    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { requestId };
});
