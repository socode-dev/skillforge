jest.mock("firebase/auth", () => ({
  EmailAuthProvider: {
    credential: jest.fn(() => "credential"),
  },
  reauthenticateWithCredential: jest.fn(),
  updatePassword: jest.fn(),
}));

const mockDeleteAccount = jest.fn();

jest.mock("firebase/functions", () => ({
  httpsCallable: jest.fn(() => mockDeleteAccount),
}));

jest.mock("../../../firebase/firebase", () => ({
  auth: {
    currentUser: { email: "alex@example.com" },
  },
  functions: {},
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { FirebaseError } from "firebase/app";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import useSettingsStore from "@/store/useSettingsStore";
import { auth } from "@/firebase/firebase";
import { toast } from "react-toastify";

describe("useSettingsStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({
      isNotificationAllowed: false,
      isEditModalOpen: { password: false, multiFactor: false },
      isDialogOpen: { password: false, multiFactor: false, deleteAccount: false },
    });
  });

  it("toggles notification state", () => {
    useSettingsStore.getState().setNotificationAllowed(true);

    expect(useSettingsStore.getState().isNotificationAllowed).toBe(true);
  });

  it("opens and closes edit modals", () => {
    useSettingsStore.getState().setIsEditModalOpen("password", true);
    expect(useSettingsStore.getState().isEditModalOpen.password).toBe(true);

    useSettingsStore.getState().closeModal("password", false);
    expect(useSettingsStore.getState().isEditModalOpen.password).toBe(false);
  });

  it("closes a dialog and runs sign out callback", () => {
    const onSignout = jest.fn();

    useSettingsStore.getState().setIsDialogOpen("deleteAccount", true);
    useSettingsStore.getState().closeDialog("deleteAccount", onSignout);

    expect(useSettingsStore.getState().isDialogOpen.deleteAccount).toBe(false);
    expect(onSignout).toHaveBeenCalled();
  });

  it("handles successful password change", async () => {
    (reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);
    (updatePassword as jest.Mock).mockResolvedValue(undefined);

    const reset = jest.fn();
    const setError = jest.fn();

    await useSettingsStore.getState().handlePasswordChange(
      "password",
      "current",
      "newpass",
      setError,
      reset
    );

    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      auth.currentUser,
      "credential"
    );
    expect(updatePassword).toHaveBeenCalledWith(auth.currentUser, "newpass");
    expect(useSettingsStore.getState().isDialogOpen.password).toBe(true);
  });

  it("handles invalid password during password change", async () => {
    const invalidError = new FirebaseError("auth/invalid-credential", "bad");
    (reauthenticateWithCredential as jest.Mock).mockRejectedValue(invalidError);

    const reset = jest.fn();
    const setError = jest.fn();

    await useSettingsStore.getState().handlePasswordChange(
      "password",
      "wrong",
      "newpass",
      setError,
      reset
    );

    expect(setError).toHaveBeenCalledWith("currentPassword", {
      message: "Incorrect password",
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again"
    );
  });
});
