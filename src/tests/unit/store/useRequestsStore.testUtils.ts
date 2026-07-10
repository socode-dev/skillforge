import { TextEncoder, TextDecoder } from "node:util";

Object.defineProperty(globalThis, "TextEncoder", {
  value: TextEncoder,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, "TextDecoder", {
  value: TextDecoder,
  writable: true,
  configurable: true,
});

export const mockSendRequest = jest.fn();
export const mockAcceptRequest = jest.fn();
export const mockCancelRequest = jest.fn();
export const mockDeclineRequest = jest.fn();
export const mockRequestCompletion = jest.fn();
export const mockConfirmCompletion = jest.fn();

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/utils/getCallableErrorMessage", () => ({
  getCallableErrorMessage: jest.fn(() => "Callable error"),
}));

jest.mock("@/firebase/firebase", () => ({
  functions: {},
}));

jest.mock("firebase/functions", () => ({
  httpsCallable: jest.fn((_, name) => {
    switch (name) {
      case "sendSkillRequest":
        return mockSendRequest;
      case "acceptSkillRequest":
        return mockAcceptRequest;
      case "cancelSkillRequest":
        return mockCancelRequest;
      case "declineSkillRequest":
        return mockDeclineRequest;
      case "requestSkillCompletion":
        return mockRequestCompletion;
      case "confirmSkillCompletion":
        return mockConfirmCompletion;
      default:
        return jest.fn();
    }
  }),
}));

import { toast } from "react-toastify";
import useRequestsStore from "../../../store/useRequestsStore";

const initialLoadingState = {
  isRequesting: {},
  isAccepting: {},
  isCancelling: {},
  isDeclining: {},
  isRequestingCompletion: {},
  isConfirmingCompletion: {},
};

export const resetRequestsStore = () => {
  jest.clearAllMocks();

  useRequestsStore.setState({
    skillRequests: [],
    loading: initialLoadingState,
  });
};

export { toast, useRequestsStore };
