import { useAuthForm } from "@/hooks/useAuthForm";
import { db, functions } from "@/firebase/firebase";
import { chatThreadListener } from "@/firebase/firestore-listener/chatThread"; 
import { chatInputSchema, type ChatInputShema } from "@/schemas/chatInputSchema";
import useAuthStore from "@/store/useAuthStore";
import useChatStore from "@/store/useChatStore";
import type { ChatContextState } from "@/types/chat-context.types";
import type { OutboxMessage } from "@/types/message.types";
import { doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useContext, createContext, type ReactNode, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext<ChatContextState | {}>({});

const sendMessage = httpsCallable(functions, "sendMessage");

export const ChatProvider = ({children}: {children: ReactNode}) => {
    const {slug} = useParams();
    const {currentUser} = useAuthStore();
    const addToOutbox = useChatStore(state => state.addToOutbox);
    const updateOutboxStatus = useChatStore(state => state.updateOutboxStatus);
    const removeFromOutbox = useChatStore(state => state.removeFromOutbox);
    const lastMessages = useChatStore(state => state.lastMessages);
    const setLastMessage = useChatStore(state => state.setLastMessage);
    const {register, reset, handleSubmit, formState} = useAuthForm<ChatInputShema>(chatInputSchema, "onSubmit");
    const inflightClientIdsRef = useRef<Set<string>>(new Set());
    
    const lastMessage = Object.values(lastMessages).find(message => message.slug === slug);
    
    const chatId = lastMessage?.chatId;

    useEffect(() => {        
      if(!chatId || !currentUser?.profile.userId) return;
      
      const unsubscribe = chatThreadListener(currentUser.profile.userId, chatId);

      // Update message delivery state to the current timestamp 
      updateDoc(doc(db, "chats", chatId), {
        [`deliveryState.${currentUser.profile.userId}`]: serverTimestamp(),
      });
        
      return () => {
            unsubscribe();
      }
    }, [slug, chatId, currentUser?.profile.userId]);
    
    const handleSendMessage = handleSubmit(async (data) => {
        if(!data.message || !chatId || !currentUser) return;
        const newMessage = data.message;
        
            const outboxMessage: OutboxMessage = {
                chatId,
                senderId: currentUser.profile.userId, 
                clientId: uuidv4(), 
                messageId: uuidv4(),
                text: data.message,
                status: "PENDING", 
                type: "TEXT",
                createdAt: Timestamp.now(), 
            }

            addToOutbox(chatId, outboxMessage);
            if(slug){
            setLastMessage(chatId, {
              ...lastMessages[chatId],
              messageId: outboxMessage.messageId,
              senderId: currentUser.profile.userId,
              text: outboxMessage.text,
              status: "PENDING",
              type: "TEXT",
              createdAt: outboxMessage.createdAt
            }
          )
        }
            reset();
        
        try {
            await sendMessage({chatId, text: newMessage, clientId: outboxMessage.clientId});
            removeFromOutbox(chatId, outboxMessage.clientId)
            
        } catch (err) {
            console.error("Error:", err);
            updateOutboxStatus(chatId, outboxMessage.messageId, "FAILED");
        }
    })

    useEffect(() => {
      const flushOutbox = async () => {
        const { outboxByChat, removeFromOutbox } = useChatStore.getState();

        for (const chatId in outboxByChat) {
          for (const message of outboxByChat[chatId]) {
            if (inflightClientIdsRef.current.has(message.clientId)) continue;
            inflightClientIdsRef.current.add(message.clientId);

            try {
              await sendMessage({
                chatId,
                text: message.text,
                clientId: message.clientId,
              });
              removeFromOutbox(chatId, message.clientId);
            } catch (err) {
              console.error(err);
            } finally {
              inflightClientIdsRef.current.delete(message.clientId);
            }
          }
        }
      };

      const handleOnline = () => {
        void flushOutbox();
      };

      // If the app mounts while already online, flush immediately.
      if (navigator.onLine) {
        void flushOutbox();
      }

      window.addEventListener("online", handleOnline);
      window.addEventListener("focus", handleOnline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("focus", handleOnline);
      };
    }, []);

    return(
        <ChatContext.Provider value={{ slug, 
        lastMessage, 
        chatId, 
        register, reset, handleSubmit, formState, 
        handleSendMessage}}>
      {children}
    </ChatContext.Provider>
        )
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context || !("slug" in context) || !("lastMessage" in context) || !("chatId" in context) || !("register" in context) || !("reset" in context) || !("handleSubmit" in context) || !("formState" in context)) {
      throw new Error("Value must be used within a Provider");
    }
    return context;
  };
