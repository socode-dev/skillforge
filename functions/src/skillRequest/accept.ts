import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/index";
import { FieldValue } from "firebase-admin/firestore";
import { getChatId } from "@functions/utils/chat";
import {AcceptPayload} from "@functions/types/skillRequest/AcceptPayload";
import { generateChatSlug } from "@functions/utils/generateChatSlug";
import { v4 as uuidv4 } from "uuid";

export const acceptSkillRequest = onCall<AcceptPayload>(
  async ({ auth, data }) => {
    if (!auth) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const { uid } = auth;
    const { requestId, ownerUserId, requesterUserId, skillId, skillName } = data;

    if (!requestId || !ownerUserId || !requesterUserId) {
      throw new HttpsError("invalid-argument", "Request data not found");
    }

    const ownerDocSnap = await db.collection("users").doc(ownerUserId).get();
    const requesterDocSnap = await db.collection("users").doc(requesterUserId).get();

    if(!ownerDocSnap.exists && !requesterDocSnap.exists) {
      throw new HttpsError("not-found", "Users document does not exist")
    }
    
    const ownerData = ownerDocSnap.data();
    const requesterData = requesterDocSnap.data();
    
    
    if (ownerData?.userId !== uid) {
      throw new HttpsError(
        "permission-denied",
        "only owner can accept request"
      );
    }
    
    const chatId = getChatId(ownerData?.userId, requesterData?.userId);
    const chatSlug = generateChatSlug();
    
    const chatRef = db.collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();
    
    const batch = db.batch();

    if(!chatSnap.exists) {
      const chatDoc = {
        chatId,
        slug: chatSlug,
        participants: [ownerData?.userId, requesterData?.userId],
        participantDetails: {
          [ownerData?.userId]: {
            userId: ownerData?.userId,
            name: ownerData?.name,
            role: ownerData?.role,
            avatar: ownerData?.avatar
          },
          [requesterData?.userId]: {
            name: requesterData?.name,
            role: requesterData?.role,
            avatar: requesterData?.avatar
          }
        },

        lastMessage: null,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      }
      
      // Create chat
      batch.set(chatRef, chatDoc);
    }
    
        const messageRef = chatRef.collection("messages").doc();
    
        const systemMessage = {
          messageId: messageRef.id,
          clientId: uuidv4(),
          chatId,
          text: `"${skillName}" request has been accepted`,
          type: "SYSTEM",
          status: "SENT",
          createdAt: FieldValue.serverTimestamp()
        }
    
    // Create system message
    batch.set(messageRef, systemMessage);

    // Update chat last message
    batch.update(chatRef, {
      lastMessage: {
        messageId: systemMessage.messageId,
        type: "SYSTEM",
        text: systemMessage.text,
        createdAt: FieldValue.serverTimestamp()
      },
      updatedAt: FieldValue.serverTimestamp()
    });
    
    const requestRef = db.collection("skillRequests").doc(requestId)

    const skillRequestUpdate =  {
      status: "ACCEPTED",
      updatedAt: FieldValue.serverTimestamp(),
      acceptedAt: FieldValue.serverTimestamp(),
      chatId
    }

    // Update skill request status and chat id
    batch.update(requestRef, skillRequestUpdate)

    const skillDocRef = db.collection("skills").doc(skillId);
    // Increase skill leaners count
    batch.update(skillDocRef, {learnersCount: FieldValue.increment(1) });

    await batch.commit();
  }
);
