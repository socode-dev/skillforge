import { create } from "zustand";
import type { FieldValue, Timestamp } from "firebase/firestore";
import type { RequestStatus } from "./useRequestsStore";

export interface SkillDataType {
  skillId: string;
  skillName: string;
  skillDesc: string;

  ownerId: string;
  ownerName: string;
  ownerRole: string;
  ownerAvatar?: string;

  learnersCount: number;
  isActive: boolean;
  createdAt: FieldValue;
}

export interface UserDataType {
  userId: string;
  avatar?: string;
  createdAt: Timestamp;
  name: string;
  ratingAvg: number;
  role: string;
  skillsReview: { skillId: string; skillName: string; skillDesc: string }[];
}

interface UsersStoreState {
  users: UserDataType[];
  skills: SkillDataType[];
  setUsers: (users: UserDataType[]) => void;
  setSkills: (skills: SkillDataType[]) => void;
  disablebutton: (status: RequestStatus | undefined) => boolean;
}

const useUsersAndSkillsStore = create<UsersStoreState>()((set) => ({
  users: [],
  skills: [],

  setUsers: (users) => set({ users }),
  setSkills: (skills) => set({ skills }),

  disablebutton: (status) => {
    if (!status) return false;

    switch (status) {
      case "PENDING":
        return true;
      case "ACCEPTED":
        return true;
      default:
        return false;
    }
  },
}));

export default useUsersAndSkillsStore;
