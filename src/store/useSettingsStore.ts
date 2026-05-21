import { create } from "zustand";
import { auth, db } from "../firebase/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import type { UseFormReset, UseFormSetError } from "react-hook-form";

interface IsModalOpen {
  password: boolean;
  multiFactor: boolean;
  deleteAccount?: boolean;
}

type SetPasswordError = UseFormSetError<{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>;

type PasswordReset = UseFormReset<{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}>;

type ModalType =
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
    password: false,
    multiFactor: false,
  },

  isDialogOpen: {
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
