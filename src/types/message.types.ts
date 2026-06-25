import type { Timestamp } from "firebase/firestore";

export type ServerMessageStatus = "SENT" | "DELIVERED" | "READ";
export type OutboxMessageStatus = "PENDING" | "FAILED";
export type UIMessageStatus = ServerMessageStatus | OutboxMessageStatus;

export interface LastMessage {
    slug: string;
    chatId: string;
    participantId: string;
    messageId: string;
    senderId: string;
    text: string;
    status: UIMessageStatus;
    type: "TEXT" | "SYSTEM"
    createdAt: Timestamp;
    senderDisplay: {
        name: string;
        role: string;
        avatar?: string;
    },
    unreadCount?: Record<string, number>
}

export interface UserPresence {
    isOnline: boolean;
    lastSeenAt?: Timestamp;
}

interface Message {
    chatId: string;
    messageId: string
    senderId?: string;
    clientId: string;
    text: string;
    type: "SYSTEM" | "TEXT";
    createdAt: Timestamp;
}

export interface ServerMessage extends Message {
    status: ServerMessageStatus;
}

export interface OutboxMessage extends Message {
    status: OutboxMessageStatus;
}

export interface UIMessage extends Message {
    status: UIMessageStatus;
    isOptimistic: boolean; 
}
