import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersAndSkillsStore";
// import useRequestsStore from "@/store/useRequestsStore";
import {
  // firestoreCollectionListener,
  // firestoreDocListener,
  // firestoreUsersCollectionListener,
  skillsCollectionListener,
  skillRequestListener,
} from "@/lib/firestoreListener";
import { fetchSkills, fetchUsers } from "@/lib/fetchDiscoverData";

const AppIntializer = () => {
  const { startAuthListener, stopAuthListener, currentUser, setCurrentUser } =
    useAuthStore();
  const { setUsers, setSkills } = useUsersStore();
  // const { setSkillRequests } = useRequestsStore();

  useEffect(() => {
    startAuthListener();

    if (!currentUser) return;

    return () => {
      stopAuthListener();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

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

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeSkillsListener = skillsCollectionListener(
      currentUser.profile.userId
    );

    return () => {
      unsubscribeSkillsListener();
      // unsubscribeSkillRequestListener();
    };
  }, [currentUser?.profile?.userId]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeSkillRequestListener = skillRequestListener(
      currentUser.profile.userId
    );

    return () => {
      unsubscribeSkillRequestListener();
    };
  }, [currentUser?.profile?.userId]);

  return null;
};

export default AppIntializer;
