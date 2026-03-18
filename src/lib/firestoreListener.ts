import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth } from "./firebase";
import type { SkillDataType } from "@/store/useUsersAndSkillsStore";
import useUsersAndSkillsStore from "@/store/useUsersAndSkillsStore";
import useRequestsStore, { type SkillRequest } from "@/store/useRequestsStore";
import useChatStore from "@/store/useChatStore";
import type { LastMessage, ServerMessage } from "@/types/message.types";
import { deriveMessageStatus } from "@/utils/deriveMessageStatus";

export const firestoreDocListener = <T>(
  uid: string,
  setter: (user: T) => void
) => {
  if (!uid) {
    console.warn("firestoreDocListener: uid is undefined");
    return () => {};
  }

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.warn(
        `firestoreDocListener: Document at users/${uid} does not exist`
      );
      return;
    }

    const data = snapshot.data();

    setter({ ...data, uid: snapshot.id } as T);
  });

  return unsubscribe;
};

export const skillsCollectionListener = (
  currentUserId: string | null | undefined
) => {
  const { setSkills } = useUsersAndSkillsStore.getState();

  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const collectionRef = collection(db, "skills");

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    if (snapshot.empty) {
      console.warn(`firestoreListener: Document at skills/ does not exist`);
      return;
    }

    const allSkills = snapshot.docs.map((doc) => ({
      ...(doc.data() as SkillDataType),
    }));

    const otherSkills = allSkills.filter(
      (skill) =>
        skill.ownerId !== currentUserId &&
        skill.ownerId !== auth.currentUser?.uid
    );

    setSkills(otherSkills);
  });

  return unsubscribe;
};

export const skillRequestListener = (currentUserId: string) => {
  const { setSkillRequests } = useRequestsStore.getState();

  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const collectionRef = collection(db, "skillRequests");

  const q = query(
    collectionRef,
    where("participants", "array-contains", currentUserId),
    orderBy("updatedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      console.warn(
        `firestoreListener: Document at skillRequests/ does not exist`
      );
      setSkillRequests([]);
      return;
    }

    const skillRequests = snapshot.docs.map((request) => {
      const { participants, ...rest } = request.data();

      return { ...rest } as SkillRequest;
    });
    console.log(skillRequests)
    setSkillRequests(skillRequests);
  });

  return unsubscribe;
};

export const chatsListener = (currentUserId: string) => {
  const {setLastMessages} = useChatStore.getState();
  
  if (!currentUserId) {
    console.warn(
      "firestoreUsersCollectionListener: currentUserId is undefined"
    );
    return () => {};
  }

  const chatQuery = query(collection(db, "chats"), where("participants", "array-contains", currentUserId), orderBy("updatedAt", "desc"));
  
  const unsubscribe = onSnapshot(chatQuery, snapshot => {
    if(snapshot.empty) {
      console.warn(
        `firestoreListener: Document at skillRequests/ does not exist`
      );
      setLastMessages([]);
      return;
    }

    const lastMessages: LastMessage[] = snapshot.docs.map(snap => {
      const data = snap.data();

      const last = data.lastMessage;
      const deliveryState = data.deliveryState ?? {};
      const readState = data.readState ?? {};
      const participants: string[] = data.participants;
      const recipentId = participants.find(id => id !== currentUserId)!!;

      const createdAt = last?.createdAt ?? data.updatedAt;
      const status = deriveMessageStatus(
        currentUserId,
        last.senderId,
        deliveryState,
        readState,
        last.status,
        createdAt
      );

      return {
        slug: data.slug,
        chatId: snap.id,
        messageId: last.messageId,
        senderId: last.type === "SYSTEM" ? "" : last.senderId,
        text: last.text,
        type: last.type,
        createdAt,
        status,
        senderDisplay: {
          name: data.participantDetails[recipentId].name,
          role: data.participantDetails[recipentId].role,
          avatar: data.participantDetails[recipentId].avatar ?? ""
        },
        unreadCount: data.unreadCount
      } as LastMessage

    });

    setLastMessages(lastMessages);
     
  });

  return unsubscribe;
}

export const chatThreadListener = (currentUserId: string, chatId: string) => {
  const {setServerMessages} = useChatStore.getState();

  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, where("chatId", "==", chatId), orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(q, async (snap) => {
    if(snap.empty) {
      console.warn("Chats document does not exist");
    }

    const chatLevelQuery = doc(db, "chats", chatId);

    const chatDetails = await getDoc(chatLevelQuery);

    if(!chatDetails.exists()) return;

    const chatDocData = chatDetails.data();
    
    const serverMessages = snap.docs.map(doc => {
      const data = doc.data();

      const status = deriveMessageStatus(currentUserId, data.senderId, chatDocData.deliveryState, chatDocData.readState, data.status, data.createdAt);

      return {...data, createdAt: data.createdAt, status: status ?? "SENT" }
    }) as ServerMessage[];
    
    setServerMessages(chatId, serverMessages);

  });

  return unsubscribe
};