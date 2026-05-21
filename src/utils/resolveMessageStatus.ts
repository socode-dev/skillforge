import type { UIMessage, UIMessageStatus } from "@/types/message.types";
import type { Timestamp } from "firebase/firestore"; 
import { Check, CheckCheck, Clock } from "lucide-react";

export const resolveMessageStatus = (
    message: UIMessage,
    currentUserId: string,
    participants: string[],
    readState?: Record<string, Timestamp>,
    deliveryState?: Record<string, Timestamp>,
) => {
    if(message.status === "PENDING") return "PENDING";

    if(message.senderId !== currentUserId) return undefined;

    const otherUserId = participants.find(id => id !== currentUserId);
    if(!otherUserId) return "SENT";

    const messageTime = message.createdAt.toMillis();

    const readAt = (readState as Record<string, Timestamp> | undefined)?.[otherUserId]?.toMillis();
    if(readAt && readAt >= messageTime) return "READ"

    const deliveredAt = (deliveryState as Record<string, Timestamp> | undefined)?.[otherUserId]?.toMillis();
    if(deliveredAt && deliveredAt >= messageTime) return "DELIVERED";

    return "SENT";
}

export const renderStatusIcon = (status: UIMessageStatus) => {
    switch(status) {
        case "PENDING":
            return Clock;
        case "SENT":
            return Check;
        case "DELIVERED":
            return CheckCheck;
        case "READ":
            return CheckCheck
        default:
            return null;
    }
}
