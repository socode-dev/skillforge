import { db } from "@/lib/firebase";
import type { CurrentUser } from "@/store/useAuthStore";
import type { UIMessage } from "@/types/message.types";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

export const useMarkAsRead = ({chatId, currentUser, messages}: {chatId: string; currentUser: CurrentUser | null, messages: UIMessage[]}) => {
    
    useEffect(() => {
        if(!chatId || !currentUser) return;

        const markAsRead = async () => {
            await updateDoc(doc(db, "chats", chatId), {
                [`readState.${currentUser.profile.userId}`]: serverTimestamp(),
                [`unreadCount.${currentUser.profile.userId}`]: 0
            })
        };

        markAsRead();
    }, [chatId]);

    useEffect(() => {
        if(!chatId || !currentUser || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        if(lastMessage.senderId !== currentUser.profile.userId) {
            updateDoc(doc(db, "chats", chatId), {
                [`readState.${currentUser.profile.userId}`]: serverTimestamp()
            })
        }
    }, [messages]);

    return null;
}