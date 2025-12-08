import { create } from "zustand";
import type {
  SkillsFeedDataType,
  UsersFeedDataType,
} from "../lib/buildDiscoverFeeds";

interface UsersStoreState {
  users: UsersFeedDataType[];
  skills: SkillsFeedDataType[];
  setUsers: (users: UsersFeedDataType[]) => void;
  setSkills: (skills: SkillsFeedDataType[]) => void;
}

const useUsersStore = create<UsersStoreState>()((set) => ({
  users: [],
  skills: [],

  setUsers: (users) => set({ users }),
  setSkills: (skills) => set({ skills }),
}));

export default useUsersStore;
