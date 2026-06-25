import { FieldValue, Transaction } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

export const addSystemMessageToTransaction = (
  tx: Transaction,
  chatRef: FirebaseFirestore.DocumentReference,
  chatId: string,
  text: string,
  unreadUserId?: string
) => {
  const messageRef = chatRef.collection("messages").doc();

  const systemMessage = {
    messageId: messageRef.id,
    clientId: uuidv4(),
    chatId,
    text,
    type: "SYSTEM",
    status: "SENT",
    createdAt: FieldValue.serverTimestamp(),
  };

  tx.set(messageRef, systemMessage);

  tx.update(chatRef, {
    lastMessage: {
      messageId: systemMessage.messageId,
      type: "SYSTEM",
      text: systemMessage.text,
      createdAt: FieldValue.serverTimestamp(),
      status: "SENT",
    },
    updatedAt: FieldValue.serverTimestamp(),
    ...(unreadUserId ? {[`unreadCount.${unreadUserId}`]: FieldValue.increment(1)} : {}),
  });
};
