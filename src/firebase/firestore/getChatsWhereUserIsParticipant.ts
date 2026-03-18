import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getChatsWhereUserIsParticipant = async (userId: string) => {
    const q = query(collection(db, "chats"), where("participants", "array-contains", userId));

    try{
        const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({chatId: doc.id, ...doc.data()}))
    } catch(err) {
        console.error("Error", err);
    }
}