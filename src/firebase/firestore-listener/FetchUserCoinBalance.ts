import useProfileStore from "@/store/useProfileStore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserCoinBalance = (userId: string) => {
    if(!userId) throw Error("User not available");

    const {fetchUserCoinBalance} = useProfileStore.getState();
    
    const ref = doc(db, "users", userId);
    
    const unsubscribe = onSnapshot(ref, (snapshot) => {
        console.log("fetching user coins...");
        if(!snapshot.exists()) throw Error("User not found");

        const data = snapshot.data();

        fetchUserCoinBalance(data.coinBalance ?? 0)
    })

    return unsubscribe;
}