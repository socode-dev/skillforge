import { doc, getDocs, updateDoc } from "firebase/firestore";
import { queryRef } from "../lib/firestoreRefs";
import type { RequestsStoreState } from "../store/useRequestsStore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";

interface AcceptSkillRequest {
  skillID: string;
  skillOwnerUserID: string;
  requesterUserID: string;
  set: (
    partial:
      | RequestsStoreState
      | Partial<RequestsStoreState>
      | ((
          state: RequestsStoreState
        ) => RequestsStoreState | Partial<RequestsStoreState>),
    replace?: false | undefined
  ) => unknown;
}

export const acceptSkillRequest = async (params: AcceptSkillRequest) => {
  const set = params.set;

  const skillOwnerStoreQuery = queryRef(
    params.skillOwnerUserID,
    "skillRequests",
    "skillID",
    params.skillID
  );

  const skillRequesterStoreQuery = queryRef(
    params.requesterUserID,
    "skillRequests",
    "skillID",
    params.skillID
  );

  try {
    set((state) => {
      const updatedSkillRequests = state.skillRequests.map((request) => ({
        ...request,
        status:
          request.skillID === params.skillID ? "accepted" : request.status,
      }));

      return { skillRequests: updatedSkillRequests };
    });

    const skillOwnerDoc = await getDocs(skillOwnerStoreQuery);
    const skillRequesterDoc = await getDocs(skillRequesterStoreQuery);

    const skillOwnerDocID = skillOwnerDoc.docs[0].id;
    const skillRequestDocID = skillRequesterDoc.docs[0].id;

    updateDoc(
      doc(
        db,
        "users",
        params.skillOwnerUserID,
        "skillRequests",
        skillOwnerDocID
      ),
      { status: "accepted", time: Date.now() }
    );

    updateDoc(
      doc(
        db,
        "users",
        params.requesterUserID,
        "skillRequests",
        skillRequestDocID
      ),
      { status: "accepted", time: Date.now() }
    );

    toast.success("Skill request accepted");
  } catch (err) {
    console.error("Error:", err);
  }
};
