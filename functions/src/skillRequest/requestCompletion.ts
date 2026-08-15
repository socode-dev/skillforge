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
} from "@functions/skillRequest/helpers/completion";

export const requestSkillCompletion = onCall<{ requestId: string }>(
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

      if (context.requesterUserId !== uid) {
        throw new HttpsError(
          "permission-denied",
          "Only requester can mark a lesson completed"
        );
      }

      assertAcceptedRequest(
        req?.status,
        "Only accepted requests can be marked completed"
      );

      if (req?.completionStatus === "REQUESTED") {
        throw new HttpsError(
          "already-exists",
          "Completion has already been requested"
        );
      }

      const coinTransfer = coinTransferSnap.data();

      assertEscrowTransfer(coinTransfer);
      assertTransferParticipants(coinTransfer, context);

      const chatRef = db.collection("chats").doc(context.chatId);
      const chatSnap = await tx.get(chatRef);

      if (!chatSnap.exists) {
        throw new HttpsError("not-found", "Chat not found");
      }

      tx.update(requestRef, {
        completionStatus: "REQUESTED",
        completionRequestedAt: FieldValue.serverTimestamp(),
        completionRequestedBy: uid,
        updatedAt: FieldValue.serverTimestamp(),
      });

      addSystemMessageToTransaction(
        tx,
        chatRef,
        context.chatId,
        `"${context.skillName}" completion was requested. Please confirm when the lesson is complete in Skill Request Page.`,
        context.ownerUserId
      );
    });

    return {success: true};
  }
);
