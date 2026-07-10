import { functions } from "@/firebase/firebase";
import type { Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  CheckCircle2,
  Clock,
  Hourglass,
  RotateCcw,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCallableErrorMessage } from "@/utils/getCallableErrorMessage";

export type RequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED"
  | "CANCELLED";
type RequestButtonText =
  | "Request"
  | "Requested"
  | "Request Again"
  | "In Progress"
  | "Completed";

export interface SkillRequest {
  requestId: string;
  skillId: string;
  skillName: string;
  skillDesc: string;

  owner: {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
  };

  requester: {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
  };

  status: RequestStatus;
  completionStatus?: "NONE" | "REQUESTED" | "CONFIRMED";
  coinTransferStatus?: "PENDING" | "ESCROW" | "REVERSED" | "RELEASED";

  createdAt: Timestamp;
  updatedAt: Timestamp;

  acceptedAt?: Timestamp;
  declinedAt?: Timestamp;
  completedAt?: Timestamp;
  completionRequestedAt?: Timestamp;
  completionConfirmedAt?: Timestamp;

  chatId?: string;
}

interface LoadingState {
  isRequesting: Record<string, boolean>;
  isAccepting: Record<string, boolean>;
  isCancelling: Record<string, boolean>;
  isDeclining: Record<string, boolean>;
  isRequestingCompletion: Record<string, boolean>;
  isConfirmingCompletion: Record<string, boolean>;
}

type RequestDataType = Pick<
  SkillRequest,
  "skillId" | "skillName" | "skillDesc" | "owner" | "requester"
>;

export interface RequestsStoreState {
  skillRequests: SkillRequest[] | [];
  loading: LoadingState;

  setSkillRequests: (requests: SkillRequest[] | []) => void;
  setLoading: (
    loadingType: keyof LoadingState,
    value: boolean,
    requestId?: string
  ) => void;
  getSkillRequestButtonChildren: (status?: RequestStatus) => {
    text: RequestButtonText;
    icon: LucideIcon;
  };
  onSendRequest: (requestData: RequestDataType) => Promise<void>;
  onAcceptRequest: (requestData: {requestId: string, ownerUserId: string; requesterUserId: string; skillId: string; skillName: string;}) => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onDeclineRequest: (requestId: string) => Promise<void>;
  onRequestCompletion: (requestId: string) => Promise<void>;
  onConfirmCompletion: (requestId: string) => Promise<void>;
}

const sendRequest = httpsCallable(functions, "sendSkillRequest");
const acceptRequest = httpsCallable(functions, "acceptSkillRequest");
const cancelRequest = httpsCallable(functions, "cancelSkillRequest");
const declineRequest = httpsCallable(functions, "declineSkillRequest");
const requestCompletion = httpsCallable(functions, "requestSkillCompletion");
const confirmCompletion = httpsCallable(functions, "confirmSkillCompletion");

const initialLoadingState: LoadingState = {
  isRequesting: {},
  isAccepting: {},
  isCancelling: {},
  isDeclining: {},
  isRequestingCompletion: {},
  isConfirmingCompletion: {},
};

const useRequestsStore = create<RequestsStoreState>()(
  persist(
    (set, get) => ({
      skillRequests: [],
      loading: initialLoadingState,

      setSkillRequests: (requests) => set({ skillRequests: requests }),

      setLoading: (type, value, id) => {
        set((state) => {
          if (!id) return state;

          return {
            loading: {
              ...initialLoadingState,
              ...state.loading,
              [type]: {
                ...(state.loading[type] ?? {}),
                [id]: value,
              },
            },
          };
        });
      },

      onSendRequest: async (requestData) => {
        const { setLoading } = get();

        if (!requestData) {
          toast.error("Error. Please try again");
          return;
        }

        setLoading("isRequesting", true, requestData.skillId);

        try {
          await sendRequest(requestData);
          toast.success("Request Sent");
        } catch (err) {
          console.error(err);
          toast.error(getCallableErrorMessage(err, "Unable to send request"));
        } finally {
          setLoading("isRequesting", false, requestData.skillId);
        }
      },

      onAcceptRequest: async (requestData) => {
        const { setLoading } = get();

        if (!Object.keys(requestData).length) {
          toast.error("Request data not found");
          return;
        }

        const {requestId} = requestData;

        setLoading("isAccepting", true, requestId);

        try {
          await acceptRequest(requestData);
          toast.success("Request Accepted");
        } catch (err) {
          console.error("Error:", err);
          toast.error(getCallableErrorMessage(err, "Unable to accept request"));
        } finally {
          setLoading("isAccepting", false, requestId);
        }
      },

      onCancelRequest: async (requestId) => {
        const { setLoading } = get();

        if (!requestId) {
          toast.error("Request Id not found");
          return;
        }

        setLoading("isCancelling", true, requestId);

        try {
          await cancelRequest({ requestId });
          toast.success("Request Cancelled");
        } catch (err) {
          console.error("Error:", err);
          toast.error(getCallableErrorMessage(err, "Unable to cancel request"));
        } finally {
          setLoading("isCancelling", false, requestId);
        }
      },

      onDeclineRequest: async (requestId) => {
        const { setLoading } = get();

        if (!requestId) {
          toast.error("Request Id not found");
          return;
        }

        setLoading("isDeclining", true, requestId);

        try {
          await declineRequest({ requestId });
          toast.success("Request Declined");
        } catch (err) {
          console.error("Error:", err);
          toast.error(getCallableErrorMessage(err, "Unable to decline request"));
        } finally {
          setLoading("isDeclining", false, requestId);
        }
      },

      onRequestCompletion: async (requestId) => {
        const { setLoading } = get();

        if (!requestId) {
          toast.error("Request Id not found");
          return;
        }

        setLoading("isRequestingCompletion", true, requestId);

        try {
          await requestCompletion({ requestId });
          toast.success("Completion requested");
        } catch (err) {
          console.error("Error:", err);
          toast.error(getCallableErrorMessage(err, "Unable to request completion"));
        } finally {
          setLoading("isRequestingCompletion", false, requestId);
        }
      },

      onConfirmCompletion: async (requestId) => {
        const { setLoading } = get();

        if (!requestId) {
          toast.error("Request Id not found");
          return;
        }

        setLoading("isConfirmingCompletion", true, requestId);

        try {
          await confirmCompletion({ requestId });
          toast.success("Skill completed. Coins released");
        } catch (err) {
          console.error("Error:", err);
          toast.error(getCallableErrorMessage(err, "Unable to confirm completion"));
        } finally {
          setLoading("isConfirmingCompletion", false, requestId);
        }
      },

      getSkillRequestButtonChildren: (status) => {
        let text: RequestButtonText;
        let icon: LucideIcon;

        if (!status) {
          text = "Request";
          icon = Send;

          return { text, icon };
        }

        switch (status) {
          case "PENDING":
            text = "Requested";
            icon = Clock;
            return { text, icon };
          case "ACCEPTED":
            text = "In Progress";
            icon = Hourglass;
            return { text, icon };
          case "COMPLETED":
            text = "Completed";
            icon = CheckCircle2;
            return { text, icon };
          case "DECLINED":
            text = "Request Again";
            icon = RotateCcw;
            return { text, icon };
          case "CANCELLED":
            text = "Request Again";
            icon = RotateCcw;
            return { text, icon };
          default:
            text = "Request";
            icon = Send;
            return { text, icon };
        }
      },
    }),
    {
      name: "request-store",
      partialize: (state) => ({
        skillRequests: state.skillRequests,
      }),
    }
  )
);

export default useRequestsStore;
