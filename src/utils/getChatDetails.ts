import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export const getChatDetails = async (slug: string, currentUserId: string) => {
    if(!slug && !currentUserId) return;

    const ref = collection(db, "chats");

    const q = query(ref, where("slug", "==", slug), where("participants", "array-contains", currentUserId))

    const snap = await getDocs(q);

    if(snap.empty) return;

    const data = snap.docs.map(doc => ({...doc.data()}));

    const {participants, deliveryState, readState} = data[0];

    return {participants, deliveryState, readState};
}