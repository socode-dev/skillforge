import { SendMessagePayload } from "@functions/types/SendMessagePayload";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db } from "@functions/db";
import { FieldValue } from "firebase-admin/firestore";

export const sendMessage = onCall<SendMessagePayload>(
  {
    cors: ["http://localhost:5173", "http://172.20.10.8:5173"],
    invoker: "public",
  },
  async ({ auth, data }) => {
    if(!auth) throw new HttpsError("unauthenticated", "User not logged in");

    const {chatId, clientId, text} = data;
    const senderId = auth.uid;

    const chatRef = db.collection("chats").doc(chatId);
    const messageRef = chatRef.collection("messages").doc();

    const chatSnap = await chatRef.get();

    if(!chatSnap.exists) {
        throw new HttpsError("not-found", "Chat not found");
    }

    const chatParticipants: string[] = chatSnap.data()?.participants;
    const recipentId = chatParticipants?.find(id => id !== senderId);

    const batch = db.batch();

    batch.set(messageRef, {
        messageId: messageRef.id,
        chatId,
        senderId,
        clientId,
        type: "TEXT",
        status: "SENT",
        text,
        createdAt: FieldValue.serverTimestamp(),
    });

    batch.update(chatRef, {
        lastMessage: {
            messageId: messageRef.id,
            text,
            createdAt: FieldValue.serverTimestamp(),
            senderId,
            type: "TEXT",
            status: "SENT"
        },
        updatedAt: FieldValue.serverTimestamp(),
        [`unreadCount.${recipentId}`]: FieldValue.increment(1)
    });

    await batch.commit();

    return {success: true};
  }
);