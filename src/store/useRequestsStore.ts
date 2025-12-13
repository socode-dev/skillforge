import { addDoc, collection } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";

export interface SkillRequests {
  receiverID: string;
  requesterID: string;
  skillID: string;
  skillName: string;
  requesterRole: string;
  requesterName: string;
  requesterAvatar: string;
  status: "pending" | "accepted" | "declined";
  type: "outgoing" | "incoming";
}

export type InvitationData = Omit<SkillRequests, "skillID" | "skillName">;

interface RequestsStoreState {
  skillRequests: SkillRequests[] | [];
  invitations: InvitationData[] | [];
  handleSendSkillRequest: (skillData: SkillRequests) => Promise<void>;
  handleSendInvitation: (userData: InvitationData) => Promise<void>;
}

const useRequestsStore = create<RequestsStoreState>()(
  persist(
    (set, get) => ({
      skillRequests: [],
      invitations: [],

      handleSendSkillRequest: async (skillData: SkillRequests) => {
        const receiverDocRef = collection(
          db,
          "users",
          skillData.receiverID,
          "skillRequests"
        );

        const requesterDocRef = collection(
          db,
          "users",
          skillData.requesterID,
          "skillRequests"
        );

        const receiverSkillData: SkillRequests = {
          ...skillData,
          type: "incoming",
        };
        const requesterSkillData: SkillRequests = {
          ...skillData,
          type: "outgoing",
        };
        try {
          set({
            skillRequests: [...get().skillRequests, requesterSkillData],
          });

          await addDoc(receiverDocRef, receiverSkillData);
          await addDoc(requesterDocRef, requesterSkillData);

          toast.success("Skill request sent.");
        } catch (err) {
          console.error("Error:", err);
          toast.error("Something went wrong. Please try again");
        }
      },

      handleSendInvitation: async (userData) => {
        const receiverInviteData: InvitationData = {
          ...userData,
          type: "incoming",
        };
        const requesterInviteData: InvitationData = {
          ...userData,
          type: "outgoing",
        };

        const receiverDocRef = collection(
          db,
          "users",
          userData.receiverID,
          "invitation"
        );
        const requesterDocRef = collection(
          db,
          "users",
          userData.requesterID,
          "invitation"
        );

        try {
          set({
            invitations: [...get().invitations, requesterInviteData],
          });
          await addDoc(receiverDocRef, receiverInviteData);
          await addDoc(requesterDocRef, requesterInviteData);

          toast.success("Invitation sent");
        } catch (err) {
          console.log("Error:", err);
        }
      },
    }),
    {
      name: "request-store",
    }
  )
);

export default useRequestsStore;
