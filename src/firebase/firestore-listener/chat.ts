import useChatStore from "@/store/useChatStore";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { LastMessage } from "@/types/message.types";
import { deriveMessageStatus } from "@/utils/deriveMessageStatus";

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
        const participants: string[] = data.participants;
        const recipentId = participants.find(id => id !== currentUserId);

        if(!last || !recipentId) return [];
  
        const createdAt = last?.createdAt ?? data.updatedAt;
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
          messageId: last.messageId,
          senderId: last.type === "SYSTEM" ? "" : last.senderId,
          text: last.text,
          type: last.type,
          createdAt,
          status,
          senderDisplay: {
            name: data.participantDetails[recipentId].name,
            role: data.participantDetails[recipentId].role,
            avatar: data.participantDetails[recipentId].avatar ?? ""
          },
          unreadCount: data.unreadCount
        } as LastMessage
  
      });
  
      setLastMessages(lastMessages);
       
      },
      (error) => console.error("Chats listener failed:", error)
    );
  
    return unsubscribe;
  }
