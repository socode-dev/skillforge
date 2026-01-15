import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { v4 as uuidv4 } from "uuid";
import { FieldValue } from "firebase-admin/firestore";

export const acceptSkillRequest = onCall<{ requestId: string }>(
  async ({ auth, data }) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { uid } = auth;
    const { requestId } = data;

    if (!requestId) {
      throw new HttpsError("invalid-argument", "Request id not found");
    }

    const requestRef = db.collection("skillRequests").doc(requestId);

    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(requestRef);

      if (!snap.exists) {
        throw new HttpsError("not-found", "Skill request not found");
      }

      const request = snap.data();

      // Authorization
      if (request?.owner.userId !== uid) {
        throw new HttpsError(
          "permission-denied",
          "only owner can accept request"
        );
      }

      // State validation
      if (request.status !== "PENDING") {
        throw new HttpsError(
          "failed-precondition",
          "Request is no longer pending"
        );
      }

      // Prevent duplicate chat creation
      if (request.chatId) {
        return { chatId: request.chatId };
      }

      const chatId = uuidv4();
      const chatRef = db.collection("chats").doc(chatId);

      tx.set(chatRef, {
        chatId,
        participant: [request.owner.userId, request.requester.userId],
        participantMap: {
          [request.owner.userId]: true,
          [request.requester.userId]: true,
        },
        skillId: request.skillId,
        requestId,
        createdAt: FieldValue.serverTimestamp(),
        lastMessageAt: null,
      });

      // Update request status
      tx.update(requestRef, {
        status: "ACCEPTED",
        chatId,
        updatedAt: FieldValue.serverTimestamp(),
        acceptedAt: FieldValue.serverTimestamp(),
      });

      return { chatId };
    });
  }
);
