import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "@functions/db";
import { SendPayload } from "@functions/types/skillRequest/SendPayload";
import {
  getSkillRequestCoinTransferRef,
  SKILL_REQUEST_COIN_AMOUNT,
} from "@functions/coins/skillRequestCoins";

export const sendSkillRequest = onCall<SendPayload>(async ({ auth, data }) => {
  if (!auth) {
    throw new HttpsError("unauthenticated", "User not authenticated");
  }

  const requesterId = auth.uid;
  const { skillId, skillName, skillDesc, owner, requester } = data;

  if (!skillId || !owner?.userId || !requester?.userId) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  if (requester.userId !== requesterId) {
    throw new HttpsError(
      "permission-denied",
      "Requester must match authenticated user"
    );
  }

  if (owner.userId === requesterId) {
    throw new HttpsError(
      "failed-precondition",
      "Cannot request your own skill"
    );
  }

  const requestId = uuidv4();
  const requestRef = db.collection("skillRequests").doc(requestId);
  const coinTransferRef = getSkillRequestCoinTransferRef(requestId);
  const requesterRef = db.collection("users").doc(requesterId);

  await db.runTransaction(async (tx) => {
    const existingQuery = db
      .collection("skillRequests")
      .where("skillId", "==", skillId)
      .where("requester.userId", "==", requesterId)
      .where("status", "in", ["PENDING", "ACCEPTED"])
      .limit(1);

    const [existingSnap, requesterSnap] = await Promise.all([
      tx.get(existingQuery),
      tx.get(requesterRef),
    ]);

    if (!existingSnap.empty) {
      throw new HttpsError(
        "already-exists",
        "You already have an active request for this skill"
      );
    }

    if (!requesterSnap.exists) {
      throw new HttpsError("not-found", "Requester document does not exist");
    }

    const requesterData = requesterSnap.data();
    const coinBalance = requesterData?.coinBalance;

    if (typeof coinBalance !== "number") {
      throw new HttpsError(
        "failed-precondition",
        "Requester coin balance is not available"
      );
    }

    if (coinBalance < SKILL_REQUEST_COIN_AMOUNT) {
      throw new HttpsError(
        "failed-precondition",
        "Insufficient coin balance"
      );
    }

    tx.update(requesterRef, {
      coinBalance: FieldValue.increment(-SKILL_REQUEST_COIN_AMOUNT),
      updatedAt: FieldValue.serverTimestamp(),
    });

    tx.set(requestRef, {
      requestId,

      skillId,
      skillName,
      skillDesc,

      owner,
      requester,

      participants: [owner.userId, requester.userId],

      status: "PENDING",
      coinAmount: SKILL_REQUEST_COIN_AMOUNT,
      coinTransferId: coinTransferRef.id,
      coinTransferStatus: "ESCROW",

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    tx.set(coinTransferRef, {
      transferId: coinTransferRef.id,
      requestId,
      skillId,
      skillName,
      requesterId,
      receiverId: owner.userId,
      amount: SKILL_REQUEST_COIN_AMOUNT,
      status: "ESCROW",
      reason: "SKILL_REQUEST",
      escrowedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return { requestId };
});
