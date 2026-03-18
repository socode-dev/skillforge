import type { UIMessageStatus } from "@/types/message.types";
import type { Timestamp } from "firebase/firestore";
import { Check, CheckCheck, Clock, OctagonX } from "lucide-react";

export const deriveMessageStatus = (currentUserId: string, senderId: string, deliveryState: Record<string, Timestamp | undefined>, readState: Record<string, Timestamp | undefined>, status: UIMessageStatus, createdAt: Timestamp):UIMessageStatus => {

    if(status === "PENDING") return "PENDING"

    if(senderId !== currentUserId) return "SENT";
    
    const recipentId = Object.keys(deliveryState).find(id => id !== currentUserId);
    
    if(!recipentId) return "SENT";
    
    
    const deliveredAt = deliveryState[recipentId];
    const readAt = readState[recipentId];
    
    if(readAt && readAt.toMillis() >= createdAt.toMillis()) return "READ";
    
    if(deliveredAt && deliveredAt.toMillis()  >= createdAt.toMillis()) return "DELIVERED"

    return "SENT";
}  

export const getMessageStatusIcon = (status: UIMessageStatus) => {
    switch(status) {
        case "PENDING":
            return Clock;
        case "FAILED":
            return OctagonX;
        case "SENT":
            return Check;
        case "DELIVERED":
            return CheckCheck;
        case "READ": 
            return CheckCheck;
        default:
            return Check;
    }
}