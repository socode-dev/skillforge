import { Timestamp } from "firebase/firestore"

export const normalizeDate = (createdAt: any) => {
    if(createdAt instanceof Timestamp) return createdAt.toDate();
    
    if(createdAt instanceof Date) return createdAt;
    
    if(createdAt === "string") return new Date(createdAt)

        return new Date();
}