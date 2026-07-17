import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import useMultiStepsStore from "./useMultiStepsStore";
import { getAuthErrorMessage } from "../lib/authErrors";
import { FirebaseError } from "firebase/app";
import type { UseFormReset } from "react-hook-form";
import type { AccountSchema } from "../schemas/accountSchema";
import type { LoginSchema } from "../schemas/loginSchema";
import { type NavigateFunction } from "react-router-dom";
import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";
import { markUserOffline } from "@/lib/userPresenceService";

export interface SkillType {
  id?: string;
  skillId?: string;
  skillName: string;
  skillDesc: string;
  learnersCount?: number;
}

export interface CurrentUser {
  profile: {
    userId: string;
    avatar?: string;
    name: string;
    email: string;
    bio?: string;
    role: string;
    signupStepsCompleted: number;
    ratingAvg?: number;
    ratingCount?: number;
    coinBalance?: number;
    skillsReview: Omit<SkillType, "learnersCount">[] | [];
  };
  skills: SkillType[] | [];
}

interface StoreState {
  currentUser: null | CurrentUser;
  loading: boolean;
  authResolved: boolean;
  _authUnsubscribe: (() => void) | null;

  signupErr: string | null;
  loginErr: string | null;

  setCurrentUser: (user: CurrentUser | null) => void;
  startAuthListener: () => void;
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
}

const createInitialUserDoc = httpsCallable(functions, "createInitialUserDoc");

const isE2ESkipAuth = () =>
  typeof window !== "undefined" && window.__SKILLFORGE_E2E_SKIP_AUTH__ === true;

const useAuthStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      signupErr: null,
      loginErr: null,
      loading: true,
      _authUnsubscribe: null,
      authResolved: false,

      setCurrentUser: (user: CurrentUser | null) => set({ currentUser: user }),

      startAuthListener: () => {
        console.log("Auth fired")
        if (get()._authUnsubscribe) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          set({ loading: true });

          if (!user) {
            set({ currentUser: null, loading: false, authResolved: true });
            return;
          }

          const userRef = doc(db, "users", user.uid);

          let userDocSnap

          for(let i = 0; i < 10; i++) {
            userDocSnap = await getDoc(userRef);
            
            if(userDocSnap.exists()) break;

            await new Promise(resolve => setTimeout(resolve, 300));
          }

          if (!userDocSnap?.exists()) {
            set({ loading: false, authResolved: true });
            return;
          }

          const skillsSnap = await getDocs(
            collection(db, "users", user.uid, "skills")
          );

          const profile = userDocSnap.data() as CurrentUser["profile"];
          const skills = skillsSnap.docs.map((doc) => ({
            ...doc.data(),
          })) as CurrentUser["skills"];

          const userData = {
            profile,
            skills,
          };

          set({
            currentUser: userData,
            loading: false,
            authResolved: true,
          });

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
        set({ loading: true });
        try {
          if (isE2ESkipAuth()) {
            const userData = {
              profile: {
                userId: "e2e-test-user",
                name,
                email,
                signupStepsCompleted: 1,
                avatar: "",
                bio: "",
                role: "",
                skillsReview: [],
              },
              skills: [],
            };

            set({ currentUser: userData });
            nextPage();
            return;
          }

          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          await updateProfile(user, {
            displayName: name,
          });

          const userData = {
            profile: {
              userId: user.uid,
              name,
              email,
              signupStepsCompleted: 1,
              avatar: "",
              bio: "",
              role: "",
              skillsReview: [],
            },
            skills: [],
          };

          await createInitialUserDoc(userData["profile"]);

          const userRef = doc(db, "users", user.uid);

          let exists = false;

          for(let i = 0; i < 10; i++) {
            const snap = await getDoc(userRef);

            if(snap.exists()) {
              exists = true;
              break;
            }

            await new Promise(resolve => setTimeout(resolve, 300))
          }

          if(!exists) throw new Error("User document was never created")

          nextPage();

        } catch (err) {
          if (err instanceof FirebaseError) {
            set({ signupErr: getAuthErrorMessage(err) });

            setTimeout(() => set({ signupErr: null }), 5000);
          }
        } finally {
          set({ loading: false });
          window.scrollTo(0, 0);
          reset();
        }
      },

      onLogin: async (email, password, reset, navigate) => {
        set({ loading: true, authResolved: false });

        try {
          const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          // Fetch user document from Firestore to check signup progress
          const userRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userRef);

          if (!userDocSnap.exists()) {
            set({ loading: false, authResolved: true });
            return;
          }

          const skillsSnap = await getDocs(
            collection(db, "users", user.uid, "skills")
          );

          const profile = userDocSnap.data() as CurrentUser["profile"];
          const skills = skillsSnap.docs.map((doc) => ({
            ...doc.data(),
          })) as CurrentUser["skills"];

          const userData = {
            profile,
            skills,
          };

          set({
            currentUser: userData,
            loading: false,
            authResolved: true,
          });

          const step = userData.profile.signupStepsCompleted + 1;
          useMultiStepsStore.getState().setCurrentStep(step);

          if (userData.profile.signupStepsCompleted < 4) {
            navigate(`/signup/step-${step}`, { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (err) {
          if (err instanceof FirebaseError) {
            set({ loginErr: getAuthErrorMessage(err) });

            setTimeout(() => set({ loginErr: null }), 5000);
          }
          set({ loading: false, authResolved: true });
        } finally {
          window.scrollTo(0, 0);
          reset();
        }
      },

      onSignout: () => {
        const userId = auth.currentUser?.uid;

        if (userId) {
          void markUserOffline(userId).finally(() => {
            void signOut(auth);
          });
        } else {
          void signOut(auth);
        }

        set({ currentUser: null });
        useMultiStepsStore.getState().setCurrentStep(1);
      },
    }),
    {
      name: "current-user-storage",
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);

export default useAuthStore;
