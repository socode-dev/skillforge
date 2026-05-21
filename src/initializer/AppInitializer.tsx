import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { chatsListener } from "@/firebase/firestore-listener/chat";
import { skillRequestListener } from "@/firebase/firestore-listener/skillRequest";
import { skillsCollectionListener } from "@/firebase/firestore-listener/skillsCollection";
import { getChatsWhereUserIsParticipant } from "@/firebase/firestore-listener/getChatsWhereUserIsParticipant";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

const AppIntializer = () => {
  const { startAuthListener, stopAuthListener, currentUser, authResolved } =
    useAuthStore();

  // Authentication effect
  useEffect(() => {
    startAuthListener();

    return () => {
      stopAuthListener();
    };
  }, []);

  // Real-time listener for skills
  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!authResolved || !userId) return;

    const unsubscribe = skillsCollectionListener(userId);

    return () => {
      unsubscribe();
    };
  }, [currentUser?.profile?.userId, authResolved]);

  // Real-time listener for skill request
  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!authResolved || !userId) return;

    const unsubscribe = skillRequestListener(userId);

    return () => {
      unsubscribe();
    };
  }, [currentUser?.profile?.userId, authResolved]);

  // Real-time listener for all chats
  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!authResolved || !userId) return;

    const unsubscribe = chatsListener(userId);

    return () => {
      unsubscribe();
    };
  }, [currentUser?.profile?.userId, authResolved]);

  // Mark all incoming messages as delivered on app auth change
  const markDelivered = async (userId: string) => {
    const chats = await getChatsWhereUserIsParticipant(userId);

    if(!chats) return;

    for(const chat of chats) {
      await updateDoc(doc(db, "chats", chat.chatId), {
        [`deliveryState.${userId}`]: serverTimestamp(),
      })
    }
  }

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if(!authResolved || !userId) return;
    
    markDelivered(userId);
  }, [currentUser?.profile?.userId, authResolved]);

  return null;
};

export default AppIntializer;
