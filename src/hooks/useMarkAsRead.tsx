import { markChatRead } from "@/lib/chatStateService";
import type { CurrentUser } from "@/store/useAuthStore";
import type { UIMessage } from "@/types/message.types";
import { useEffect } from "react";

export const useMarkAsRead = ({chatId, currentUser, messages}: {chatId: string; currentUser: CurrentUser | null, messages: UIMessage[]}) => {
    
    useEffect(() => {
        if(!chatId || !currentUser) return;

        const markAsRead = async () => {
            await markChatRead(chatId, currentUser.profile.userId)
                .catch((err) => console.error("Failed to mark chat as read:", err));
        };

        markAsRead();
    }, [chatId]);

    useEffect(() => {
        if(!chatId || !currentUser || messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];

        if(lastMessage.senderId !== currentUser.profile.userId) {
            markChatRead(chatId, currentUser.profile.userId)
                .catch((err) => console.error("Failed to update read state:", err));
        }
    }, [messages]);

    return null;
}
