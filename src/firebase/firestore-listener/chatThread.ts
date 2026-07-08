import useChatStore from "@/store/useChatStore";
import { collection, doc, onSnapshot, orderBy, query, where, type DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { deriveMessageStatus } from "@/utils/deriveMessageStatus";
import type { ServerMessage } from "@/types/message.types";

export const chatThreadListener = (currentUserId: string, chatId: string) => {
    const {setServerMessages} = useChatStore.getState();
    let chatDocData: DocumentData | null = null;
    let messageDocs: DocumentData[] = [];

    const syncMessages = () => {
      if (!messageDocs.length) {
        setServerMessages(chatId, []);
        return;
      }

      const serverMessages = messageDocs.flatMap(data => {
        if (!data.messageId || !data.chatId || !data.clientId || !data.type) {
          return [];
        }

        const status = chatDocData
          ? deriveMessageStatus(
              currentUserId,
              data.senderId,
              chatDocData.deliveryState,
              chatDocData.readState,
              data.status,
              data.createdAt
            )
          : data.status;

        return [{...data, createdAt: data.createdAt, status: status ?? "SENT" }];
      }) as ServerMessage[];

      setServerMessages(chatId, serverMessages);
    };
  
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, where("chatId", "==", chatId), orderBy("createdAt", "asc"));
    const chatRef = doc(db, "chats", chatId);
  
    const unsubscribeChat = onSnapshot(
      chatRef,
      (snapshot) => {
        chatDocData = snapshot.exists() ? snapshot.data() : null;
        syncMessages();
      },
      (error) => console.error("Chat document listener failed:", error)
    );

    const unsubscribeMessages = onSnapshot(q, (snap) => {
      if (snap.empty) {
        messageDocs = [];
        syncMessages();
        return;
      }

      messageDocs = snap.docs.map(messageDoc => messageDoc.data());
      syncMessages();
  
    }, (error) => console.error("Chat thread listener failed:", error));
  
    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  };
