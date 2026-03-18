import type { OutboxMessage, ServerMessage, UIMessage } from "@/types/message.types";
import { Timestamp } from "firebase/firestore";

const getCreatedAtMillis = (createdAt: unknown): number => {
    if (createdAt instanceof Timestamp) {
        return createdAt.toMillis();
    }

    if (typeof createdAt === "number") {
        return createdAt;
    }

    if (
        createdAt &&
        typeof createdAt === "object" &&
        "seconds" in createdAt &&
        "nanoseconds" in createdAt
    ) {
        const { seconds, nanoseconds } = createdAt as { seconds: number; nanoseconds: number };
        return seconds * 1000 + nanoseconds / 1e6;
    }

    return 0;
};

export const normalizedMessages = (serverMessages: ServerMessage[], outboxMessages: OutboxMessage[]): UIMessage[] => {
    const normalizedServer: UIMessage[] = serverMessages.map(message => ({
        messageId: message.messageId,
        chatId: message.chatId,
        clientId: message.clientId,
        senderId: message.senderId,
        text: message.text,
        status: message.status,
        type: message.type,
        createdAt: message.createdAt,
        isOptimistic: false
    }));

    const normalizedOutbox: UIMessage[] = outboxMessages.map(message => ({
        messageId: message.clientId,
        chatId: message.chatId,
        clientId: message.clientId,
        senderId: message.senderId,
        text: message.text,
        status: message.status,
        type: message.type,
        createdAt: message.createdAt,
        isOptimistic: true
    }));

    const combined = [...normalizedServer, ...normalizedOutbox].sort(
        (a, b) => getCreatedAtMillis(a.createdAt as unknown) - getCreatedAtMillis(b.createdAt as unknown)
    );

    return combined;
}