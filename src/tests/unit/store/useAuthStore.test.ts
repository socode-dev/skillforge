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

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

const mockCreateInitialUserDoc = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("firebase/functions", () => ({
  httpsCallable: jest.fn(() => mockCreateInitialUserDoc),
}));

jest.mock("../../../firebase/firebase", () => ({
  auth: {},
  db: {},
  functions: {},
}));

jest.mock("../../../lib/userPresenceService", () => ({
  markUserOffline: jest.fn(),
}));

const mockNextPage = jest.fn();
const mockSetCurrentStep = jest.fn();

jest.mock("../../../store/useMultiStepsStore", () => ({
  __esModule: true,
  default: {
    getState: () => ({
      nextPage: mockNextPage,
      setCurrentStep: mockSetCurrentStep,
    }),
  },
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDoc, getDocs, collection, doc } from "firebase/firestore";
import { auth } from "@/firebase/firebase";
import useAuthStore from "@/store/useAuthStore";
import { markUserOffline } from "@/lib/userPresenceService";

describe("useAuthStore", () => {
  const resetForm = jest.fn();
  const navigate = jest.fn();
  const fakeUser = { uid: "u1", displayName: "Alex" };
  const userDocSnap = {
    exists: () => true,
    data: () => ({
      userId: "u1",
      name: "Alex",
      email: "alex@example.com",
      signupStepsCompleted: 4,
      role: "student",
      skillsReview: [],
    }),
  };
  const skillsSnap = { docs: [{ data: () => ({ skillId: "skill-1" }) }] };

  beforeEach(() => {
    jest.clearAllMocks();

    (markUserOffline as jest.Mock).mockResolvedValue(undefined);
    (signOut as jest.Mock).mockResolvedValue(undefined);
    (resetForm as jest.Mock).mockClear();
    (navigate as jest.Mock).mockClear();

    window.scrollTo = jest.fn();

    useAuthStore.setState({
      currentUser: null,
      loading: true,
      authResolved: false,
      signupErr: null,
      loginErr: null,
      _authUnsubscribe: null,
    });
  });

  it("sets the current user", () => {
    const user = {
      profile: {
        userId: "u1",
        name: "Alex",
        email: "alex@example.com",
        signupStepsCompleted: 4,
        role: "student",
        skillsReview: [],
      },
      skills: [],
    };

    useAuthStore.getState().setCurrentUser(user);

    expect(useAuthStore.getState().currentUser).toEqual(user);
  });

  it("clears the current user on sign out", async () => {
    useAuthStore.setState({
      currentUser: {
        profile: {
          userId: "u1",
          name: "Alex",
          email: "alex@example.com",
          signupStepsCompleted: 4,
          role: "student",
          skillsReview: [],
        },
        skills: [],
      },
      _authUnsubscribe: null,
    });

    Object.assign(auth, { currentUser: { uid: "u1" } });

    useAuthStore.getState().onSignout();
    await Promise.resolve();
    await Promise.resolve();

    expect(markUserOffline).toHaveBeenCalledWith("u1");
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it("creates an account and advances signup flow on signup", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: fakeUser });
    (mockCreateInitialUserDoc as jest.Mock).mockResolvedValue({ data: {} });
    
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => true });

    await useAuthStore.getState().onSignup(
      "alex@example.com",
      "password",
      "Alex",
      resetForm
    );

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "alex@example.com",
      "password"
    );
    expect(mockCreateInitialUserDoc).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", name: "Alex", email: "alex@example.com" })
    );
    expect(mockNextPage).toHaveBeenCalled();
    
    expect(useAuthStore.getState().loading).toBe(false);
    expect(resetForm).toHaveBeenCalled();
  });

  it("loads authenticated user state from auth listener", async () => {
    const unsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockImplementation(
      (_auth, callback) => {
        void callback(fakeUser);
        return unsubscribe;
      }
    );
    (doc as jest.Mock).mockReturnValue("user-ref");
    (getDoc as jest.Mock).mockResolvedValue(userDocSnap);
    (collection as jest.Mock).mockReturnValue("skills-collection");
    (getDocs as jest.Mock).mockResolvedValue(skillsSnap);

    useAuthStore.getState().startAuthListener();
    await Promise.resolve();
    await Promise.resolve();

    expect(useAuthStore.getState().currentUser).toEqual({
      profile: userDocSnap.data(),
      skills: [{ skillId: "skill-1" }],
    });
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().authResolved).toBe(true);
    expect(useAuthStore.getState()._authUnsubscribe).toBe(unsubscribe);
  });

  it("stops the auth listener when active", () => {
    const unsubscribe = jest.fn();
    useAuthStore.setState({ _authUnsubscribe: unsubscribe });

    useAuthStore.getState().stopAuthListener();

    expect(unsubscribe).toHaveBeenCalled();
    expect(useAuthStore.getState()._authUnsubscribe).toBeNull();
  });

  it("hydrates persisted user as resolved auth state", async () => {
    const persistedUser = {
      profile: {
        userId: "u1",
        name: "Alex",
        email: "alex@example.com",
        signupStepsCompleted: 4,
        role: "student",
        skillsReview: [],
      },
      skills: [],
    };

    useAuthStore.setState({ currentUser: persistedUser, loading: false, authResolved: true });

    expect(useAuthStore.getState().currentUser).toEqual(persistedUser);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().authResolved).toBe(true);
  });

  it("logs in a user and navigates to home when signup complete", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: fakeUser });
    (doc as jest.Mock).mockReturnValue("user-ref");
    (getDoc as jest.Mock).mockResolvedValue(userDocSnap);
    (collection as jest.Mock).mockReturnValue("skills-collection");
    (getDocs as jest.Mock).mockResolvedValue(skillsSnap);

    await useAuthStore.getState().onLogin(
      "alex@example.com",
      "password",
      resetForm,
      navigate
    );

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "alex@example.com",
      "password"
    );
    expect(useAuthStore.getState().currentUser).toEqual({
      profile: userDocSnap.data(),
      skills: [{ skillId: "skill-1" }],
    });
    expect(navigate).toHaveBeenCalledWith("/home", { replace: true });
    expect(resetForm).toHaveBeenCalled();
  });
});
