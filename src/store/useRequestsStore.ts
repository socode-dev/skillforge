import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { cancelSkillRequest } from "@/functions/cancelSkillRequest";
import { declineSkillRequest } from "@/functions/declineSkillRequest";
import { acceptSkillRequest } from "@/functions/acceptSkillRequest";
import type { CurrentUser } from "@/store/useAuthStore";
import { v4 as uuidV4 } from "uuid";

export interface SkillRequests {
  docID: string;
  skillID: string;
  skillName: string;
  incomingUserID: string;
  incomingUserName: string;
  incomingUserAvatar: string;
  incomingUserRole: string;
  outgoingUserID: string;
  outgoingUserRole: string;
  outgoingUserName: string;
  outgoingUserAvatar: string;
  status: "pending" | "accepted" | "declined" | "completed";
  type: "outgoing" | "incoming";
  time: number;
}

export type InvitationData = Omit<
  SkillRequests,
  | "skillID"
  | "skillName"
  | "outgoingUserName"
  | "outgoingUserRole"
  | "outgoingUserAvatar"
  | "docID"
>;

export interface RequestsStoreState {
  skillRequests: SkillRequests[] | [];
  setSkillRequests: (requests: SkillRequests[] | []) => void;
  invitations: InvitationData[] | [];
  handleSendSkillRequest: (skillData: SkillRequests) => Promise<void>;
  handleSendInvitation: (userData: InvitationData) => Promise<void>;
  handleAcceptSkillRequest: (
    skillID: string,
    skillName: string,
    requesterUserID: string
  ) => Promise<void>;
  handleCancelRequest: (skillID: string, ownerUserID: string) => Promise<void>;
  handleDeclineRequest: (
    skillID: string,
    requesterUserID: string
  ) => Promise<void>;
}

const useRequestsStore = create<RequestsStoreState>()(
  persist(
    (set, get) => ({
      skillRequests: [],
      invitations: [],

      setSkillRequests: (requests) => set({ skillRequests: requests }),

      handleSendSkillRequest: async (skillData: SkillRequests) => {
        const modifiedSkillData = {
          ...skillData,
          skillID: uuidV4(),
        };

        const incomingDocRef = collection(
          db,
          "users",
          modifiedSkillData.incomingUserID,
          "skillRequests"
        );

        const outgoingDocRef = collection(
          db,
          "users",
          modifiedSkillData.outgoingUserID,
          "skillRequests"
        );

        const incomingSkillData: SkillRequests = {
          ...modifiedSkillData,
          type: "incoming",
        };
        const outgoingSkillData: SkillRequests = {
          ...modifiedSkillData,
          type: "outgoing",
        };
        try {
          set({
            skillRequests: [...get().skillRequests, outgoingSkillData],
          });

          await addDoc(incomingDocRef, incomingSkillData);
          await addDoc(outgoingDocRef, outgoingSkillData);

          const getIncomingDocs = await getDocs(incomingDocRef);
          const getoutgoingDocs = await getDocs(outgoingDocRef);

          getIncomingDocs.docs.map((docSnapshot) => {
            const updatedSkillDoc = {
              ...docSnapshot.data(),
              docID: docSnapshot.id,
            };

            updateDoc(
              doc(
                db,
                "users",
                skillData.incomingUserID,
                "skillRequests",
                docSnapshot.id
              ),
              updatedSkillDoc
            );

            return updatedSkillDoc as SkillRequests;
          });

          const updatedOutgoingDocs = getoutgoingDocs.docs.map(
            (docSnapshot) => {
              const updatedSkillDoc = {
                ...docSnapshot.data(),
                docID: docSnapshot.id,
              };

              updateDoc(
                doc(
                  db,
                  "users",
                  skillData.outgoingUserID,
                  "skillRequests",
                  docSnapshot.id
                ),
                updatedSkillDoc
              );

              return updatedSkillDoc as SkillRequests;
            }
          );

          set({ skillRequests: updatedOutgoingDocs });

          toast.success("Skill request sent.");
        } catch (err) {
          console.error("Error:", err);
          toast.error("Something went wrong. Please try again");
        }
      },

      handleSendInvitation: async (userData) => {
        const incomingDocRef = collection(
          db,
          "users",
          userData.incomingUserID,
          "invitation"
        );
        const outgoingDocRef = collection(
          db,
          "users",
          userData.outgoingUserID,
          "invitation"
        );

        const incomingInviteData: InvitationData = {
          ...userData,
          type: "incoming",
        };
        const outgoingInviteData: InvitationData = {
          ...userData,
          type: "outgoing",
        };

        try {
          set({
            invitations: [...get().invitations, outgoingInviteData],
          });
          await addDoc(incomingDocRef, incomingInviteData);
          await addDoc(outgoingDocRef, outgoingInviteData);

          toast.success("Invitation sent");
        } catch (err) {
          console.log("Error:", err);
        }
      },

      handleAcceptSkillRequest: async (skillID, skillName, requesterUserID) => {
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        await acceptSkillRequest({
          skillID,
          skillOwnerUserID: currentUser.uid,
          requesterUserID,
          set: set,
        });

        const skillOwnerDocRef = doc(db, "users", currentUser.uid);
        const skillOwnerDoc = await getDoc(skillOwnerDocRef);

        // Add 1 to the number of skill learners
        if (skillOwnerDoc.exists()) {
          const data = skillOwnerDoc.data() as CurrentUser;

          const updatedUserDoc = {
            ...data,
            skills: data.skills.map((skill) => ({
              ...skill,
              skillLearners:
                skill.skillName == skillName
                  ? skill.skillLearners + 1
                  : skill.skillLearners,
            })),
          };
          await updateDoc(skillOwnerDocRef, updatedUserDoc);
        }
      },

      handleCancelRequest: async (skillID, ownerUserID) => {
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        await cancelSkillRequest({
          skillID,
          skillOwnerID: ownerUserID,
          requesterUserID: currentUser.uid,
          set: set,
        });
      },

      handleDeclineRequest: async (skillID, requesterUserID) => {
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        await declineSkillRequest({
          skillID,
          skillOwnerUserID: currentUser.uid,
          requesterUserID,
          set: set,
        });
      },
    }),
    {
      name: "request-store",
    }
  )
);

export default useRequestsStore;
