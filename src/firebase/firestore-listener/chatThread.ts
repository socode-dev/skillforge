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
        console.warn("Chats document does not exist");
      }
  
      const chatLevelQuery = doc(db, "chats", chatId);
  
      const chatDetails = await getDoc(chatLevelQuery);
  
      if(!chatDetails.exists()) return;
  
      const chatDocData = chatDetails.data();
      
      const serverMessages = snap.docs.map(doc => {
        const data = doc.data();
  
        const status = deriveMessageStatus(currentUserId, data.senderId, chatDocData.deliveryState, chatDocData.readState, data.status, data.createdAt);
  
        return {...data, createdAt: data.createdAt, status: status ?? "SENT" }
      }) as ServerMessage[];
      
      setServerMessages(chatId, serverMessages);
  
    });
  
    return unsubscribe
  };