import useChatStore from "@/store/useChatStore";
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { deriveMessageStatus } from "@/utils/deriveMessageStatus";
import type { ServerMessage } from "@/types/message.types";

export const chatThreadListener = (currentUserId: string, chatId: string) => {
    const {setServerMessages} = useChatStore.getState();
  
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, where("chatId", "==", chatId), orderBy("createdAt", "asc"));
  
    const unsubscribe = onSnapshot(q, async (snap) => {
      if(snap.empty) {
        setServerMessages(chatId, []);
        return;
      }
  
      const chatLevelQuery = doc(db, "chats", chatId);
  
      const chatDetails = await getDoc(chatLevelQuery);
  
      if(!chatDetails.exists()) return;
  
      const chatDocData = chatDetails.data();
      
      const serverMessages = snap.docs.flatMap(doc => {
        const data = doc.data();

        if (!data.messageId || !data.chatId || !data.clientId || !data.type) {
          return [];
        }
  
        const status = deriveMessageStatus(currentUserId, data.senderId, chatDocData.deliveryState, chatDocData.readState, data.status, data.createdAt);
  
        return [{...data, createdAt: data.createdAt, status: status ?? "SENT" }]
      }) as ServerMessage[];
      
      setServerMessages(chatId, serverMessages);
  
    }, (error) => console.error("Chat thread listener failed:", error));
  
    return unsubscribe
  };
