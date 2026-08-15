import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@functions/db";
import { getSkillRequestCoinTransferRef } from "@functions/coins/skillRequestCoins";
import { addSystemMessageToTransaction } from "@functions/chat/systemMessage";
import {
  assertAcceptedRequest,
  assertEscrowTransfer,
  assertTransferParticipants,
  getCompletionContext,
  getReleaseAmount,
} from "@functions/skillRequest/helpers/completion";

export const confirmSkillCompletion = onCall<{ requestId: string }>(
  async ({auth, data}) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const {uid} = auth;
    const {requestId} = data;

    if (!requestId) {
      throw new HttpsError("invalid-argument", "requestId is required");
    }

    const requestRef = db.collection("skillRequests").doc(requestId);
    const coinTransferRef = getSkillRequestCoinTransferRef(requestId);

    await db.runTransaction(async (tx) => {
      const [requestSnap, coinTransferSnap] = await Promise.all([
        tx.get(requestRef),
        tx.get(coinTransferRef),
      ]);

      if (!requestSnap.exists) {
        throw new HttpsError("not-found", "Skill request not found");
      }

      if (!coinTransferSnap.exists) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer for this request was not found"
        );
      }

      const req = requestSnap.data();
      const context = getCompletionContext(req);

      if (context.ownerUserId !== uid) {
        throw new HttpsError(
          "permission-denied",
          "Only skill owner can confirm completion"
        );
      }

      assertAcceptedRequest(req?.status);

      if (req?.completionStatus !== "REQUESTED") {
        throw new HttpsError(
          "failed-precondition",
          "Requester must mark the lesson completed first"
        );
      }

      const coinTransfer = coinTransferSnap.data();
      const amount = getReleaseAmount(coinTransfer);

      assertEscrowTransfer(coinTransfer);
      assertTransferParticipants(coinTransfer, context);

      const ownerRef = db.collection("users").doc(context.ownerUserId);
      const chatRef = db.collection("chats").doc(context.chatId);

      const [ownerSnap, chatSnap] = await Promise.all([
        tx.get(ownerRef),
        tx.get(chatRef),
      ]);

      if (!ownerSnap.exists) {
        throw new HttpsError("not-found", "Skill owner document not found");
      }

      if (!chatSnap.exists) {
        throw new HttpsError("not-found", "Chat not found");
      }

      tx.update(ownerRef, {
        coinBalance: FieldValue.increment(amount),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(coinTransferRef, {
        status: "RELEASED",
        updatedAt: FieldValue.serverTimestamp(),
        releasedAt: FieldValue.serverTimestamp(),
        releasedBy: uid,
      });

      tx.update(requestRef, {
        status: "COMPLETED",
        completionStatus: "CONFIRMED",
        coinTransferStatus: "RELEASED",
        completedAt: FieldValue.serverTimestamp(),
        completedBy: context.requesterUserId,
        completionConfirmedAt: FieldValue.serverTimestamp(),
        completionConfirmedBy: uid,
        updatedAt: FieldValue.serverTimestamp(),
      });

      addSystemMessageToTransaction(
        tx,
        chatRef,
        context.chatId,
        `"${context.skillName}" lesson completed. Coins released to the skill owner.`,
        context.requesterUserId
      );
    });

    return {success: true};
  }
);
