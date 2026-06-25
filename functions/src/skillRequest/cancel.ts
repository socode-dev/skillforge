import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { FieldValue } from "firebase-admin/firestore";
import {
  getSkillRequestCoinTransferRef,
} from "@functions/coins/skillRequestCoins";
import { getReleaseAmount } from "@functions/skillRequest/helpers/completion";

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
    const coinTransferRef = getSkillRequestCoinTransferRef(requestId);

    await db.runTransaction(async (tx) => {
      const [snap, coinTransferSnap] = await Promise.all([
        tx.get(ref),
        tx.get(coinTransferRef),
      ]);

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

      if (!coinTransferSnap.exists) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer for this request was not found"
        );
      }

      const coinTransfer = coinTransferSnap.data();
      if (!coinTransfer) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer data is missing"
        );
      }
      const refundAmount = getReleaseAmount(coinTransfer);

      if (!["PENDING", "ESCROW"].includes(coinTransfer?.status)) {
        throw new HttpsError(
          "failed-precondition",
          "Only escrowed coin transfers can be reversed"
        );
      }

      if (coinTransfer.requesterId !== req.requester.userId) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer requester does not match skill request"
        );
      }

      const requesterRef = db.collection("users").doc(req.requester.userId);

      tx.update(requesterRef, {
        coinBalance: FieldValue.increment(refundAmount),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(coinTransferRef, {
        status: "REVERSED",
        updatedAt: FieldValue.serverTimestamp(),
        reversedAt: FieldValue.serverTimestamp(),
        reversedBy: uid,
        reverseReason: "SKILL_REQUEST_CANCELLED",
      });

      tx.update(ref, {
        status: "CANCELLED",
        coinTransferStatus: "REVERSED",
        updatedAt: FieldValue.serverTimestamp(),
        cancelledAt: FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  }
);
