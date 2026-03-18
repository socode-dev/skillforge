import { useEffect } from "react";
import useAuthStore, { type CurrentUser } from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersAndSkillsStore";
// import useRequestsStore from "@/store/useRequestsStore";
import {
  skillsCollectionListener,
  skillRequestListener,
  chatsListener
} from "@/lib/firestoreListener";
import { fetchSkills, fetchUsers } from "@/lib/fetchDiscoverData";
import { getChatsWhereUserIsParticipant } from "@/firebase/firestore/getChatsWhereUserIsParticipant";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
// import type { ChatType } from "@/types/ChatStoreState";
import useChatStore from "@/store/useChatStore";

const AppIntializer = () => {
  const { startAuthListener, stopAuthListener, currentUser, authResolved } =
    useAuthStore();
  const { setUsers, setSkills } = useUsersStore();
  // const { setSkillRequests } = useRequestsStore();

  // Authentication effect
  useEffect(() => {
    startAuthListener();

    if (!currentUser) return;

    return () => {
      stopAuthListener();
    };
  }, []);

  // Fetch all skills and users
  useEffect(() => {
    if (!currentUser || !authResolved) return;

    const fetch = async () => {
      const skills = await fetchSkills(currentUser.profile.userId);
      const users = await fetchUsers(currentUser.profile.userId);

      if (!users) return null;

      // setSkills(skills);
      setUsers(users);
    };

    const timeout = setTimeout(async () => {
      try {
        await fetch();
      } catch (err) {
        console.error(err);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentUser?.profile?.userId]);

  // Real-time listener for skills
  useEffect(() => {
    if (!currentUser || !authResolved) return;

    const unsubscribeSkillsListener = skillsCollectionListener(
      currentUser.profile.userId
    );

    return () => {
      unsubscribeSkillsListener();
    };
  }, [currentUser?.profile?.userId]);

  // Real-time listener for skill request
  useEffect(() => {
    if (!currentUser || !authResolved) return;

    const unsubscribeSkillRequestListener = skillRequestListener(
      currentUser.profile.userId
    );

    return () => {
      unsubscribeSkillRequestListener();
    };
  }, [currentUser?.profile?.userId, authResolved]);

  // Real-time listener for all chats
  useEffect(() => {
    if (!currentUser || !authResolved) return;

    const unsubscribeChatsListener = chatsListener(
      currentUser.profile.userId
    );

    return () => {
      unsubscribeChatsListener();
    };
  }, [currentUser?.profile?.userId, authResolved]);

  // Mark all incoming messages as delivered on app auth change
  const markDelivered = async (currentUser: CurrentUser) => {
    const chats = await getChatsWhereUserIsParticipant(currentUser.profile.userId);

    if(!chats) return;

    for(const chat of chats) {
      await updateDoc(doc(db, "chats", chat.chatId), {
        [`deliveryState.${currentUser.profile.userId}`]: serverTimestamp(),
      })
    }
  }

  useEffect(() => {
    if(!currentUser || !authResolved) return;
    
    markDelivered(currentUser);
  }, [currentUser]);

  return null;
};

export default AppIntializer;
