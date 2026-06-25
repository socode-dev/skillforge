import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { FieldValue } from "firebase-admin/firestore";
import { getChatId } from "@functions/utils/chat";
import { AcceptPayload } from "@functions/types/skillRequest/AcceptPayload";
import { generateChatSlug } from "@functions/utils/generateChatSlug";
import { v4 as uuidv4 } from "uuid";
import {
  getSkillRequestCoinTransferRef,
  SKILL_REQUEST_COIN_AMOUNT,
} from "@functions/coins/skillRequestCoins";

export const acceptSkillRequest = onCall<AcceptPayload>(
  async ({ auth, data }) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { uid } = auth;
    const { requestId } = data;

    if (!requestId) {
      throw new HttpsError("invalid-argument", "Request data not found");
    }

    const requestRef = db.collection("skillRequests").doc(requestId);
    const coinTransferRef = getSkillRequestCoinTransferRef(requestId);

    const chatSlug = generateChatSlug();
    const clientId = uuidv4();

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
      const coinTransfer = coinTransferSnap.data();
      
      if (!coinTransfer) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer data is missing"
        );
      }

      const ownerUserId = req?.owner?.userId;
      const requesterUserId = req?.requester?.userId;
      const skillId = req?.skillId;
      const skillName = req?.skillName;

      if (!ownerUserId || !requesterUserId || !skillId || !skillName) {
        throw new HttpsError(
          "data-loss",
          "Skill request is missing required data"
        );
      }

      if (ownerUserId !== uid) {
        throw new HttpsError(
          "permission-denied",
          "only owner can accept request"
        );
      }

      if (req.status !== "PENDING") {
        throw new HttpsError(
          "failed-precondition",
          "Only pending requests can be accepted"
        );
      }

      if (!["PENDING", "ESCROW"].includes(coinTransfer.status)) {
        throw new HttpsError(
          "failed-precondition",
          "Only escrowed coin transfers can be accepted"
        );
      }

      if (
        coinTransfer.requesterId !== requesterUserId ||
        coinTransfer.receiverId !== ownerUserId
      ) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer participants do not match skill request"
        );
      }

      if (coinTransfer.amount !== SKILL_REQUEST_COIN_AMOUNT) {
        throw new HttpsError(
          "data-loss",
          "Coin transfer amount does not match skill request cost"
        );
      }

      const ownerDocRef = db.collection("users").doc(ownerUserId);
      const requesterDocRef = db.collection("users").doc(requesterUserId);
      const chatId = getChatId(ownerUserId, requesterUserId);
      const chatRef = db.collection("chats").doc(chatId);

      const [ownerDocSnap, requesterDocSnap, chatSnap] = await Promise.all([
        tx.get(ownerDocRef),
        tx.get(requesterDocRef),
        tx.get(chatRef),
      ]);

      if (!ownerDocSnap.exists || !requesterDocSnap.exists) {
        throw new HttpsError("not-found", "Users document does not exist");
      }

      const ownerData = ownerDocSnap.data();
      const requesterData = requesterDocSnap.data();
      const messageRef = chatRef.collection("messages").doc();

      const systemMessage = {
        messageId: messageRef.id,
        clientId,
        chatId,
        text: `"${skillName}" request has been accepted`,
        type: "SYSTEM",
        status: "SENT",
        createdAt: FieldValue.serverTimestamp(),
      };

      const lastMessage = {
        messageId: systemMessage.messageId,
        type: "SYSTEM",
        text: systemMessage.text,
        createdAt: FieldValue.serverTimestamp(),
      };

      if (!chatSnap.exists) {
        tx.set(chatRef, {
          chatId,
          slug: chatSlug,
          participants: [ownerUserId, requesterUserId],
          participantDetails: {
            [ownerUserId]: {
              userId: ownerUserId,
              name: ownerData?.name,
              role: ownerData?.role,
              avatar: ownerData?.avatar,
            },
            [requesterUserId]: {
              userId: requesterUserId,
              name: requesterData?.name,
              role: requesterData?.role,
              avatar: requesterData?.avatar,
            },
          },

          lastMessage,
          deliveryState: {
            [ownerUserId]: null,
            [requesterUserId]: null,
          },
          readState: {
            [ownerUserId]: null,
            [requesterUserId]: null,
          },
          unreadCount: {
            [ownerUserId]: 0,
            [requesterUserId]: 0,
          },
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        });
      } else {
        tx.update(chatRef, {
          lastMessage,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }

      tx.set(messageRef, systemMessage);

      tx.update(coinTransferRef, {
        status: "ESCROW",
        updatedAt: FieldValue.serverTimestamp(),
        escrowedAt: FieldValue.serverTimestamp(),
        acceptedAt: FieldValue.serverTimestamp(),
      });

      tx.update(requestRef, {
        status: "ACCEPTED",
        coinTransferStatus: "ESCROW",
        updatedAt: FieldValue.serverTimestamp(),
        acceptedAt: FieldValue.serverTimestamp(),
        chatId,
      });

      const skillDocRef = db.collection("skills").doc(skillId);

      tx.update(skillDocRef, { learnersCount: FieldValue.increment(1) });
    });
  }
);
