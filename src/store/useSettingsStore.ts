import { create } from "zustand";
import useAuthStore, { type CurrentUser } from "./useAuthStore";
import { auth, db } from "../lib/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import type { UseFormReset, UseFormSetError } from "react-hook-form";

interface IsModalOpen {
  name: boolean;
  email: boolean;
  password: boolean;
  multiFactor: boolean;
  deleteAccount?: boolean;
}

type SetEmailError = UseFormSetError<{
  currentEmail: string;
  newEmail: string;
  confirmPassword: string;
}>;

type SetPasswordError = UseFormSetError<{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>;

type EmailReset = UseFormReset<{
  currentEmail: string;
  newEmail: string;
  confirmPassword: string;
}>;

type PasswordReset = UseFormReset<{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>;

type ModalType =
  | "name"
  | "email"
  | "password"
  | "multiFactor"
  | "deleteAccount";

interface SettingsStoreState {
  isNotificationAllowed: boolean;
  isDialogOpen: IsModalOpen;
  isEditModalOpen: IsModalOpen;
  setNotificationAllowed: (value: boolean) => void;
  setIsEditModalOpen: (type: ModalType, value: boolean) => void;
  setIsDialogOpen: (type: ModalType, value: boolean) => void;
  closeModal: (type: ModalType, value: boolean) => void;
  closeDialog: (type: ModalType, onSignout?: () => void) => void;
  handleNameEdit: (name: string, reset: UseFormReset<{ name: string }>) => void;
  handleEmailChange: (
    type: ModalType,
    currentEmail: string,
    newEmail: string,
    password: string,
    reset: EmailReset,
    setError: SetEmailError
  ) => Promise<void>;
  handlePasswordChange: (
    type: ModalType,
    currentPassword: string,
    newPassword: string,
    setError: SetPasswordError,
    reset: PasswordReset
  ) => Promise<void>;
  deleteUserAccount: (
    password: string,
    reset: UseFormReset<{ password: string }>,
    setError: UseFormSetError<{ password: string }>
  ) => Promise<void>;
}

const useSettingsStore = create<SettingsStoreState>()((set, get) => ({
  isNotificationAllowed: false,
  isEditModalOpen: {
    name: false,
    email: false,
    password: false,
    multiFactor: false,
  },

  isDialogOpen: {
    name: false,
    email: false,
    password: false,
    multiFactor: false,
    deleteAccount: false,
  },

  setNotificationAllowed: (value) => set({ isNotificationAllowed: value }),
  setIsEditModalOpen: (type, value) => {
    set((state) => ({
      isEditModalOpen: { ...state.isEditModalOpen, [type]: value },
    }));
  },

  setIsDialogOpen: (type, value) => {
    set((state) => ({
      isDialogOpen: { ...state.isDialogOpen, [type]: value },
    }));
  },

  closeModal: (type, value) => {
    set((state) => ({
      isEditModalOpen: { ...state.isEditModalOpen, [type]: value },
    }));
  },

  // Close dialog
  closeDialog: (type, onSignout) => {
    set((state) => ({
      isDialogOpen: {
        ...state.isDialogOpen,
        [type]: false,
      },
    }));

    if (onSignout) {
      onSignout();
    }
  },

  //   Edit user's full name
  handleNameEdit: async (name, reset) => {
    const user = auth.currentUser;
    const { currentUser, setCurrentUser } = useAuthStore.getState();

    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    if (!name) return;

    updateProfile(user, { displayName: name });

    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return;

    await setDoc(userDocRef, { ...userDocSnap.data(), name });

    setCurrentUser({ ...currentUser, name } as CurrentUser);

    get().closeModal("name", false);
    toast.success("Name has been updated successfully");
    reset();
  },

  //   Change and Update email address
  handleEmailChange: async (
    type,
    currentEmail,
    newEmail,
    confirmPassword,
    reset,
    setError
  ) => {
    const user = auth.currentUser;

    if (!user || !currentEmail || !newEmail || !confirmPassword) return;

    const credential = EmailAuthProvider.credential(
      currentEmail,
      confirmPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);

      get().closeModal("email", false);
      set((state) => ({
        isDialogOpen: {
          ...state.isDialogOpen,
          [type]: true,
        },
      }));
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/wrong-password")
          setError("confirmPassword", {
            message: "Incorrect password",
          });
        if (err.code === "auth/email-already-in-use")
          setError("newEmail", { message: "This email is already taken" });
        if (err.code === "auth/invalid-credential")
          setError("currentEmail", { message: "Invalid email" });
      }

      toast.error("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => reset(), 20000);
    }
  },

  //   Handle password change
  handlePasswordChange: async (
    type,
    currentPassword,
    newPassword,
    setError,
    reset
  ) => {
    const user = auth.currentUser;

    if (!user || !user.email || !currentPassword || !newPassword) return;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      get().closeModal("password", false);
      set((state) => ({
        isDialogOpen: {
          ...state.isDialogOpen,
          [type]: true,
        },
      }));
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential")
          setError("currentPassword", { message: "Incorrect password" });
      }

      toast.error("Something went wrong. Please try again");
    } finally {
      setTimeout(() => reset(), 20000);
    }
  },

  //   Delete user account and data
  deleteUserAccount: async (password, reset, setError) => {
    const user = auth.currentUser;

    if (!user || !user.email) return;

    const userDocRef = doc(db, "users", user.uid);

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);

      await deleteUser(user);

      await deleteDoc(userDocRef);

      get().closeDialog("deleteAccount");
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          setError("password", { message: "Incorrect password" });
        }
      }

      toast.error("Something went wrong. Please try again");
    } finally {
      setTimeout(() => reset(), 20000);
    }
  },
}));

export default useSettingsStore;
