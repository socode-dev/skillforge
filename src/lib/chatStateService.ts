import { db } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const COMMIT_CHUNK_SIZE = 450;

export const markChatDelivered = async (chatId: string, userId: string) => {
  if (!chatId || !userId) return;

  await updateDoc(doc(db, "chats", chatId), {
    [`deliveryState.${userId}`]: serverTimestamp(),
  });
};

export const markChatRead = async (chatId: string, userId: string) => {
  if (!chatId || !userId) return;

  await updateDoc(doc(db, "chats", chatId), {
    [`readState.${userId}`]: serverTimestamp(),
    [`unreadCount.${userId}`]: 0,
  });
};

export const markAllChatsDelivered = async (userId: string) => {
  if (!userId) return;

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  const snapshot = await getDocs(q);
  let batch = writeBatch(db);
  let writeCount = 0;

  for (const chatDoc of snapshot.docs) {
    batch.update(chatDoc.ref, {
      [`deliveryState.${userId}`]: serverTimestamp(),
    });
    writeCount += 1;

    if (writeCount === COMMIT_CHUNK_SIZE) {
      await batch.commit();
      batch = writeBatch(db);
      writeCount = 0;
    }
  }

  if (writeCount > 0) {
    await batch.commit();
  }
};
