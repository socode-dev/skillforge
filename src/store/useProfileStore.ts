import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  fullName: string;
  email: string;
  skills: string[];
  avatarURL: string;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setSkills: (skills: string[]) => void;
  setAvatarURL: (url: string) => void;
}

const useProfileStore = create<UserState>()(
  persist(
    (set) => ({
      fullName: "",
      email: "",
      skills: [],
      avatarURL: "",

      setFullName: (name: string) => {
        set({ fullName: name });
      },
      setEmail: (email: string) => {
        set({ email });
      },
      setAvatarURL: (url: string) => {
        set({ avatarURL: url });
      },
      setSkills: (skills: string[]) => {
        set({ skills });
      },
    }),
    {
      name: "user-profile-storage",
    }
  )
);

export default useProfileStore;
