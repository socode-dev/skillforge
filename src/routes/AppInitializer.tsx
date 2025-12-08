import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { fetchOtherUsers } from "../lib/fetchOtherUsers";
import {
  buildDiscoverFeeds,
  type FetchedUserDataType,
} from "../lib/buildDiscoverFeeds";
import useUsersStore from "../store/useUsersStore";

const AppIntializer = () => {
  const navigate = useNavigate();
  const { startAuthListener, stopAuthListener } = useAuthStore();
  const setUsers = useUsersStore((state) => state.setUsers);
  const setSkills = useUsersStore((state) => state.setSkills);

  useEffect(() => {
    startAuthListener(navigate);

    return () => {
      stopAuthListener();
    };
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const otherUsers = await fetchOtherUsers();
      const { usersFeed, skillsFeed } = buildDiscoverFeeds(
        otherUsers as FetchedUserDataType[]
      );

      setUsers(usersFeed);
      setSkills(skillsFeed);
    };

    loadUsers();
  }, []);

  return null;
};

export default AppIntializer;
