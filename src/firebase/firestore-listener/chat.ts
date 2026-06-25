import useChatStore from "@/store/useChatStore";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { LastMessage } from "@/types/message.types";
import { deriveMessageStatus } from "@/utils/deriveMessageStatus";
import { markChatDelivered } from "@/lib/chatStateService";

const shouldMarkDelivered = (
  currentUserId: string,
  senderId: string | undefined,
  createdAt: LastMessage["createdAt"] | undefined,
  deliveryState: Record<string, LastMessage["createdAt"] | undefined>
) => {
  if (!createdAt || senderId === currentUserId) return false;
  if (!navigator.onLine) return false;

  const messageCreatedAt = createdAt.toMillis?.();
  const deliveredAt = deliveryState[currentUserId]?.toMillis?.();

  return typeof messageCreatedAt === "number" && (!deliveredAt || deliveredAt < messageCreatedAt);
};

export const chatsListener = (currentUserId: string) => {
    const {setLastMessages} = useChatStore.getState();
    
    if (!currentUserId) {
      throw Error(
        "firestoreUsersCollectionListener: currentUserId is undefined"
      );
      return () => {};
    }
  
    const chatQuery = query(collection(db, "chats"), where("participants", "array-contains", currentUserId), orderBy("updatedAt", "desc"));
    
    const unsubscribe = onSnapshot(
      chatQuery,
      snapshot => {
        if(snapshot.empty) {
          setLastMessages([]);
          return;
        }
  
      const lastMessages: LastMessage[] = snapshot.docs.flatMap(snap => {
        const data = snap.data();
  
        const last = data.lastMessage;
        const deliveryState = data.deliveryState ?? {};
        const readState = data.readState ?? {};
        const participants: string[] = Array.isArray(data.participants)
          ? data.participants
          : [];
        const recipentId = participants.find(id => id !== currentUserId);

        if(!last || !recipentId) return [];
        const recipientDetails = data.participantDetails?.[recipentId];

        if (!recipientDetails) return [];
  
        const createdAt = last?.createdAt ?? data.updatedAt;

        if (shouldMarkDelivered(currentUserId, last?.senderId, createdAt, deliveryState)) {
          void markChatDelivered(snap.id, currentUserId).catch((err) =>
            console.error("Failed to update delivery state:", err)
          );
        }

        const status = deriveMessageStatus(
          currentUserId,
          last.senderId,
          deliveryState,
          readState,
          last.status,
          createdAt
        );
  
        return {
          slug: data.slug,
          chatId: snap.id,
          participantId: recipentId,
          messageId: last.messageId,
          senderId: last.type === "SYSTEM" ? "" : last.senderId,
          text: last.text,
          type: last.type,
          createdAt,
          status,
          senderDisplay: {
            name: recipientDetails.name ?? "Unknown user",
            role: recipientDetails.role ?? "",
            avatar: recipientDetails.avatar ?? ""
          },
          unreadCount: data.unreadCount ?? {}
        } as LastMessage
  
      });
  
      setLastMessages(lastMessages);
       
      },
      (error) => console.error("Chats listener failed:", error)
    );
  
    return unsubscribe;
  }
