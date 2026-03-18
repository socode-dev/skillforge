import type { UIMessage } from "@/types/message.types";
import { Timestamp } from "firebase/firestore";

export const isSameDay = (d1: Date, d2: Date) => {
    return (
        d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
    )
}

export const getCreatedAtDate = (createdAt: unknown): Date => {
    if (createdAt instanceof Timestamp) {
        return createdAt.toDate();
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
        yesterday.setDate(today.getDate() - 1);

        let key: string;

        if(isSameDay(date, today)) {
            key = "Today";
        } else if (isSameDay(date, yesterday)) {
            key = "Yesterday";
        } else {
            key = date.toLocaleDateString("en-GB");
        }

        if(!groups[key]) groups[key] = [];
        groups[key].push(message)
    });

    return groups;
}