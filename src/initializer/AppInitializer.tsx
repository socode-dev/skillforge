import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import { chatsListener } from "@/firebase/firestore-listener/chat";
import { skillRequestListener } from "@/firebase/firestore-listener/skillRequest";
import { skillsCollectionListener } from "@/firebase/firestore-listener/skillsCollection";
import { auth } from "@/firebase/firebase";
import { markAllChatsDelivered } from "@/lib/chatStateService";
import { startUserPresence } from "@/lib/userPresenceService";

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

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if(!authResolved || !userId) return;
    
    markAllChatsDelivered(userId).catch((err) =>
      console.error("Failed to mark chats delivered:", err)
    );
  }, [currentUser?.profile?.userId, authResolved]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!authResolved || !userId) return;

    return startUserPresence(userId);
  }, [currentUser?.profile?.userId, authResolved]);

  return null;
};

export default AppIntializer;
