import type { ProfileStoreState } from "@/types/profile-store.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./useAuthStore";
import { doc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      skills: [],
      coinBalance: 0,
      openEditModal: {
        profile: false,
        skill: false,
      },
      skillModalMode: "add",
      selectedSkill: null,
      skillPendingDelete: null,

      setOpenEditModal: (type, value) => {
        set(state => ({openEditModal: {...state.openEditModal, [type]: value}}));
      },
      openAddSkillModal: () => {
        set(state => ({
          openEditModal: {...state.openEditModal, skill: true},
          skillModalMode: "add",
          selectedSkill: null,
        }));
      },
      openEditSkillModal: (skill) => {
        set(state => ({
          openEditModal: {...state.openEditModal, skill: true},
          skillModalMode: "edit",
          selectedSkill: skill,
        }));
      },
      openDeleteSkillDialog: (skill) => {
        set({skillPendingDelete: skill});
      },
      closeDeleteSkillDialog: () => {
        set({skillPendingDelete: null});
      },
      setSkills: (skills) => {
        set({ skills });
      },

      fetchUserCoinBalance: (coinBalance) => set({coinBalance}),

      onSubmitProfileEdit: async (data) => {
        const {currentUser} = useAuthStore.getState();
        const userId = auth.currentUser?.uid;

        if(!currentUser || !userId) return;

        if (!data) return;

        const docRef = doc(db, "users", userId);
        const updates: Partial<{
          name: string;
          email: string;
          bio: string;
          avatar: string;
        }> = {};
        
        if(data.fullName.trim() !== currentUser.profile.name.trim()) {
          updates.name = data.fullName.trim();
        }

        if(data.email.trim() !== currentUser.profile.email.trim()) {
          updates.email = data.email.trim();
        }

        if(data.bio.trim() !== (currentUser.profile.bio ?? "").trim()) {
          updates.bio = data.bio.trim();
        }

        if(data.avatar !== currentUser.profile.avatar) {
          updates.avatar = data.avatar;
        }

        if(!Object.keys(updates).length) {
          set(state => ({openEditModal: {...state.openEditModal, profile: false}}));
          return;
        }

        try {
          await updateDoc(docRef, updates);
          toast.success("Profile updated");
          set(state => ({openEditModal: {...state.openEditModal, profile: false}}));
        } catch(err) {
          console.error("Profile update failed:", err);
          toast.error("Failed to update profile");
        }
    },

      onSubmitSkill: async (data) => {
        const { currentUser } = useAuthStore.getState();
        const userId = auth.currentUser?.uid;

        if(!currentUser || !userId) return;

        const { selectedSkill, skillModalMode } = useProfileStore.getState();
        const skillId = skillModalMode === "edit" && selectedSkill ? selectedSkill.skillId : uuidv4();
        const skillName = data.skillName.trim();
        const skillDesc = data.skillDesc.trim();

        if(!skillName || !skillDesc) {
          toast.error("Skill name and description are required");
          return;
        }

        const userRef = doc(db, "users", userId);
        const globalSkillRef = doc(db, "skills", skillId);
        const userSkillRef = doc(db, "users", userId, "skills", skillId);
        const batch = writeBatch(db);
        const skillsReview = currentUser.profile.skillsReview ?? [];
        const reviewSkill = { skillId, skillName, skillDesc };
        const matchesSkill = (skill: {id?: string; skillId?: string}) => (skill.skillId ?? skill.id) === skillId;
        const nextSkillsReview = skillModalMode === "edit"
          ? skillsReview.map(skill => matchesSkill(skill) ? reviewSkill : skill)
          : [...skillsReview, reviewSkill];

        if(skillModalMode === "edit") {
          batch.update(globalSkillRef, {
            skillName,
            skillDesc,
            ownerName: currentUser.profile.name,
            ownerRole: currentUser.profile.role,
            ownerAvatar: currentUser.profile.avatar ?? "",
          });
          batch.update(userSkillRef, {
            skillName,
            skillDesc,
            isActive: true,
          });
        } else {
          batch.set(globalSkillRef, {
            skillId,
            skillName,
            skillDesc,
            ownerId: userId,
            ownerName: currentUser.profile.name,
            ownerRole: currentUser.profile.role,
            ownerAvatar: currentUser.profile.avatar ?? "",
            learnersCount: 0,
            isActive: true,
            createdAt: serverTimestamp(),
          });
          batch.set(userSkillRef, {
            skillId,
            skillName,
            skillDesc,
            isActive: true,
            createdAt: serverTimestamp(),
          });
        }

        batch.update(userRef, {
          skillsReview: nextSkillsReview,
        });

        try {
          await batch.commit();
          toast.success(skillModalMode === "edit" ? "Skill updated" : "Skill added");
          set(state => ({
            openEditModal: {...state.openEditModal, skill: false},
            selectedSkill: null,
            skillModalMode: "add",
          }));
        } catch(err) {
          console.error("Skill save failed:", err);
          toast.error("Failed to save skill");
        }
      },

      onDeleteSkill: async () => {
        const { currentUser } = useAuthStore.getState();
        const userId = auth.currentUser?.uid;
        const { skillPendingDelete } = useProfileStore.getState();

        if(!currentUser || !userId || !skillPendingDelete) return;

        const skillId = skillPendingDelete.skillId;
        const userRef = doc(db, "users", userId);
        const globalSkillRef = doc(db, "skills", skillId);
        const userSkillRef = doc(db, "users", userId, "skills", skillId);
        const batch = writeBatch(db);
        const nextSkillsReview = (currentUser.profile.skillsReview ?? []).filter(
          skill => (skill.skillId ?? skill.id) !== skillId
        );

        batch.update(globalSkillRef, {
          isActive: false,
          updatedAt: serverTimestamp(),
        });
        batch.update(userSkillRef, {
          isActive: false,
          updatedAt: serverTimestamp(),
        });
        batch.update(userRef, {
          skillsReview: nextSkillsReview.length ? nextSkillsReview : [],
        });

        try {
          await batch.commit();
          toast.success("Skill deleted");
          set({ skillPendingDelete: null });
        } catch(err) {
          console.error("Skill delete failed:", err);
          toast.error("Failed to delete skill");
        }
      },

    }),
    {
      name: "user-profile-storage",
      partialize: (state) => ({
        skills: state.skills,
        coinBalance: state.coinBalance,
      }),
    }
  )
);

export default useProfileStore;
