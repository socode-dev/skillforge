import type { LastMessage, OutboxMessage, OutboxMessageStatus, ServerMessage } from "@/types/message.types";


export interface ChatStoreState {
    messagesByChat: Record<string, ServerMessage[]>;
    outboxByChat: Record<string, OutboxMessage[]>;
    lastMessages: Record<string, LastMessage>;
    setLastMessages: (message: LastMessage[]) => void;
    setLastMessage: (chatId: string, message: LastMessage) => void;
    setServerMessages: (chatId: string, serverMessages: ServerMessage[]) => void;
    updateOutboxStatus: (chatId: string, messageId: string, status: OutboxMessageStatus) => void;
    addToOutbox: (chatId: string, message: OutboxMessage) => void;
    removeFromOutbox: (chatId: string, clientId: string) => void;
}
