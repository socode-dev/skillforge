import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useMultiStepsStore from "./useMultiStepsStore";
import { getAuthErrorMessage } from "../lib/authErrors";
import { FirebaseError } from "firebase/app";
import type { UseFormReset } from "react-hook-form";
import type { AccountSchema } from "../schemas/accountSchema";
import type { LoginSchema } from "../schemas/loginSchema";
import type { NavigateFunction } from "react-router-dom";

export type CurrentUser = {
  uid: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  signupStepsCompleted: number;
  avatar: string;
  bio?: string;
  skills: string[];
};

interface StoreState {
  currentUser: null | CurrentUser;
  signupErr: string | null;
  loginErr: string | null;
  isLoggingIn: boolean;
  loading: boolean;
  setCurrentUser: (user: CurrentUser | null) => void;
  startAuthListener: (navigate: NavigateFunction) => void;
  stopAuthListener: () => void;
  onSignup: (
    email: string,
    password: string,
    name: string,
    reset: UseFormReset<AccountSchema>
  ) => Promise<void>;
  onLogin: (
    email: string,
    password: string,
    reset: UseFormReset<LoginSchema>,
    navigate: NavigateFunction
  ) => Promise<void>;
  onSignout: () => void;
  _authUnsubscribe: null | (() => void);
}

// const navigate = useNavigate();

const useAuthStore = create<StoreState>()((set, get) => ({
  currentUser: null,
  signupErr: null,
  loginErr: null,
  isLoggingIn: false,
  loading: true,

  _authUnsubscribe: null,

  setCurrentUser: (user: CurrentUser | null) => set({ currentUser: user }),

  startAuthListener: (navigate) => {
    if (get()._authUnsubscribe) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is signed out
        set({ currentUser: null, loading: false });
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(docRef);

      if (!userDocSnap.exists()) {
        set({ currentUser: null, loading: false });
        return;
      }

      const userData = {
        ...(userDocSnap.data() as CurrentUser),
        uid: user.uid,
      };

      set({
        currentUser: userData,
        loading: false,
      });

      if (userData.signupStepsCompleted < 4) {
        const { currentStep, setCurrentStep } = useMultiStepsStore.getState();
        setCurrentStep(userData.signupStepsCompleted + 1);

        navigate(`/signup/step-${currentStep}`, {
          replace: true,
        });
      } else {
        navigate("/home", { replace: true });
      }
    });

    set({ _authUnsubscribe: unsubscribe });
  },

  stopAuthListener: () => {
    const unsubscribe = get()._authUnsubscribe;
    if (unsubscribe) {
      unsubscribe();
      set({ _authUnsubscribe: null });
    }
  },

  onSignup: async (email, password, name, reset) => {
    const { nextPage } = useMultiStepsStore.getState();
    set({ isLoggingIn: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user) return;

      updateProfile(user, {
        displayName: name,
      });

      set({
        currentUser: {
          uid: user.uid,
          name,
          email,
          isEmailVerified: user.emailVerified as boolean,
          signupStepsCompleted: 1,
          avatar: "",
          bio: "",
          skills: [""],
        },
      });

      const docRef = doc(db, "users", user.uid);

      setDoc(docRef, {
        email,
        name: name,
        isEmailVerified: user.emailVerified,
        signupStepsCompleted: 1,
        createdAt: new Date(),
      });

      nextPage();
    } catch (err) {
      if (err instanceof FirebaseError) {
        set({ signupErr: getAuthErrorMessage(err) });

        setTimeout(() => set({ signupErr: null }), 5000);
      } else {
        console.log(err);
      }
    } finally {
      set({ isLoggingIn: false });
      window.scrollTo(0, 0);
      reset();
    }
  },

  onLogin: async (email, password, reset, navigate) => {
    set({ isLoggingIn: true });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(docRef);
      if (!userDocSnap.exists()) return;

      const userData = {
        ...(userDocSnap.data() as CurrentUser),
        uid: user.uid,
      };

      set({
        currentUser: userData,
      });

      if (userData.signupStepsCompleted < 4) {
        const { currentStep, setCurrentStep } = useMultiStepsStore.getState();
        setCurrentStep(userData.signupStepsCompleted + 1);

        navigate(`/signup/step-${currentStep}`, {
          replace: true,
        });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        set({ loginErr: getAuthErrorMessage(err) });

        setTimeout(() => set({ loginErr: null }), 5000);
      }
    } finally {
      set({ isLoggingIn: false });
      window.scrollTo(0, 0);
      reset();
    }
  },

  onSignout: () => {
    signOut(auth);

    set({ currentUser: null });
  },
}));

export default useAuthStore;
