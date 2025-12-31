import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { collectionRef, queryRef } from "../lib/firestoreRefs";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import type { RequestsStoreState } from "../store/useRequestsStore";

export interface CancelRequestParamsType {
  skillID: string;
  skillOwnerID: string;
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

export const cancelSkillRequest = async (params: CancelRequestParamsType) => {
  const set = params.set;

  // const ownerSkillStoreQuery = query(
  //   collectionRef(params.skillOwnerID, "skillRequests"),
  //   where("skillID", "==", params.skillID)
  // );
  const ownerSkillStoreQuery = queryRef(
    params.skillOwnerID,
    "skillRequests",
    "skillID",
    params.skillID
  );
  // const requesterSkillStoreQuery = query(
  //   collectionRef(params.requesterUserID, "skillRequests"),
  //   where("skillID", "==", params.skillID)
  // );
  const requesterSkillStoreQuery = queryRef(
    params.requesterUserID,
    "skillRequests",
    "skillID",
    params.skillID
  );

  try {
    set((state) => ({
      skillRequests: state.skillRequests.filter(
        (r) => r.skillID !== params.skillID
      ),
    }));

    const ownerSkillDoc = await getDocs(ownerSkillStoreQuery);
    const requesterSkillDoc = await getDocs(requesterSkillStoreQuery);

    if (ownerSkillDoc.empty && requesterSkillDoc.empty) return;
    const ownerSkillDocID = ownerSkillDoc.docs[0].id;
    const requesterSkillDocID = requesterSkillDoc.docs[0].id;

    deleteDoc(
      doc(db, "users", params.skillOwnerID, "skillRequests", ownerSkillDocID)
    );
    deleteDoc(
      doc(
        db,
        "users",
        params.requesterUserID,
        "skillRequests",
        requesterSkillDocID
      )
    );

    toast.success("Skill request withdrawn");
  } catch (err) {
    console.log("Error:", err);
  }
};
