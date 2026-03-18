import { useChatContext } from "@/context/useChatContext";
import useAuthStore from "@/store/useAuthStore";
import useChatStore from "@/store/useChatStore";
import { normalizeDate } from "@/utils/normalizeDate";
import MessageBubble from "@/pages/messages/components/MessageBubble";
import { useMarkAsRead } from "@/hooks/useMarkAsRead";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import { normalizedMessages } from "@/utils/normalizeMessages";
import { useEffect, useMemo, useRef } from "react";

const ThreadConversation = () => {
    const {lastMessage} = useChatContext();
    const currentUser = useAuthStore(state => state.currentUser);
    const messagesByChat = useChatStore(state => state.messagesByChat);
    const outboxByChat = useChatStore(state => state.outboxByChat);
    
    if(!lastMessage || !lastMessage.senderDisplay || !currentUser) return null;
    
    const {senderDisplay, chatId} = lastMessage;

    const serverMessages = messagesByChat[chatId] ?? [];
    const outboxMessages = outboxByChat[chatId] ?? [];

    const messages = useMemo(
        () => normalizedMessages(serverMessages, outboxMessages),
        [serverMessages, outboxMessages]
    );
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastAutoScrolledMessageIdRef = useRef<string | null>(null);

    useMarkAsRead({chatId, currentUser, messages});
    const groupedMessages = groupMessagesByDate(messages);

    const scrollToBottom = (behavior: ScrollBehavior) => {
        const el = scrollContainerRef.current;
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior });
            return;
        }
        // Fallback
        bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    };

    // When opening a thread (chatId changes), jump to the bottom.
    useEffect(() => {
        lastAutoScrolledMessageIdRef.current = null;
        
        requestAnimationFrame(() => scrollToBottom("smooth"));
    }, [chatId]);

    // Scroll down When the current user sends a message.
    useEffect(() => {
        const last = messages[messages.length - 1];
        if (!last) return;

        const isMine = last.senderId === currentUser.profile.userId;
        if (!isMine) return;

        if (lastAutoScrolledMessageIdRef.current === last.messageId) return;
        lastAutoScrolledMessageIdRef.current = last.messageId;

        requestAnimationFrame(() => scrollToBottom("smooth"));

    }, [messages.length, chatId, currentUser.profile.userId]);
    
    return(
        <article
            ref={scrollContainerRef as unknown as React.RefObject<HTMLElement>}
            className="w-full h-full pt-14 pb-26 flex flex-col gap-4 px-4 md:px-6 lg:px-8 overflow-y-auto scrollbar-hide"
        >

            {Object.entries(groupedMessages).map(([date, msgs]) => (
                <section key={date} className="w-full flex flex-col gap-3">
                    <p className="w-fit px-2 py-1 mx-auto bg-muted text-muted-foreground rounded-full text-xs">{date}</p>

                    {msgs.map(message => {
                        const isMine = message.senderId === currentUser?.profile.userId;
                        const date = normalizeDate(message.createdAt);
                        
                        const time = date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                        
                        return message.type === "SYSTEM" ? (
                            <p key={message.messageId} className="text-sm text-center text-muted-foreground">{message.text}</p>
                        ) : (
                            <MessageBubble key={message.messageId} message={message} isMine={isMine} senderName={senderDisplay.name} senderAvatar={senderDisplay.avatar} time={time} />
                        )
                    })}
                </section>
            ))}

            <div ref={bottomRef} />
        </article>
    )
}

export default ThreadConversation;