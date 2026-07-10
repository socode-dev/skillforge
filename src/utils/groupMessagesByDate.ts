import type { UIMessage } from "@/types/message.types";
import { Timestamp } from "firebase/firestore";

export const isSameDay = (d1: Date, d2: Date) => {
    return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
    );
}

export const getCreatedAtDate = (createdAt: unknown): Date => {
    if (createdAt instanceof Timestamp) {
        return createdAt.toDate();
    }

    if (createdAt instanceof Date) {
        return createdAt;
    }

    if (typeof createdAt === "number") {
        return Timestamp.fromMillis(createdAt).toDate();
    }

    if (
        createdAt &&
        typeof createdAt === "object" &&
        "seconds" in createdAt &&
        "nanoseconds" in createdAt
    ) {
        const { seconds, nanoseconds } = createdAt as { seconds: number; nanoseconds: number };
        return new Timestamp(seconds, nanoseconds).toDate();
    }

    return new Date();
};

export const groupMessagesByDate = (messages: UIMessage[]) => {
    const groups: Record<string, UIMessage[]> = {};
    
    messages.forEach(message => {
        const date = getCreatedAtDate(message.createdAt as unknown);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setUTCDate(today.getUTCDate() - 1);

        let key: string;

        if(isSameDay(date, today)) {
            key = "Today";
        } else if (isSameDay(date, yesterday)) {
            key = "Yesterday";
        } else {
            key = date.toLocaleDateString("en-GB", { timeZone: "UTC" });
        }

        if(!groups[key]) groups[key] = [];
        groups[key].push(message)
    });

    return groups;
}