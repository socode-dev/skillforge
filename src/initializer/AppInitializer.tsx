import { useEffect, useEffectEvent } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  buildDiscoverFeeds,
  type FetchedUserDataType,
} from "../lib/buildDiscoverFeeds";
import useUsersStore from "../store/useUsersStore";
import {
  firestoreCollectionListener,
  firestoreDocListener,
  firestoreUsersCollectionListener,
} from "../lib/firestoreListener";
import useRequestsStore from "../store/useRequestsStore";

const AppIntializer = () => {
  const navigate = useNavigate();
  const { startAuthListener, stopAuthListener, currentUser, setCurrentUser } =
    useAuthStore();
  const { setUsers, setSkills } = useUsersStore();
  const { setSkillRequests } = useRequestsStore();

  useEffect(() => {
    startAuthListener(navigate);

    if (!currentUser) return;

    return () => {
      stopAuthListener();
    };
  }, []);

  const handleUsersUpdate = useEffectEvent(
    (otherUsers: FetchedUserDataType[]) => {
      const { usersFeed, skillsFeed } = buildDiscoverFeeds(
        otherUsers as FetchedUserDataType[]
      );

      setUsers(usersFeed);
      setSkills(skillsFeed);
    }
  );

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribeUsersListener = firestoreUsersCollectionListener(
      currentUser.uid,
      handleUsersUpdate
    );

    return () => {
      unsubscribeUsersListener();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribeSkillRequestListener = firestoreCollectionListener(
      currentUser.uid,
      "skillRequests",
      setSkillRequests
    );

    const unsubscribeUserDocListener = firestoreDocListener(
      currentUser.uid,
      setCurrentUser
    );

    return () => {
      unsubscribeSkillRequestListener();
      unsubscribeUserDocListener();
    };
  }, [currentUser?.uid, setSkillRequests, setCurrentUser]);

  return null;
};

export default AppIntializer;
