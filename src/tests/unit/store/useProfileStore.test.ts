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

jest.mock("react-router-dom", () => ({}));
jest.mock("react-router", () => ({}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  updateDoc: jest.fn(),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    set: jest.fn(),
    commit: jest.fn(),
  })),
  collection: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "uuid-1"),
}));

import useProfileStore from "../../../store/useProfileStore";
import type { Timestamp } from "firebase/firestore";

describe("useProfileStore", () => {
  const sampleSkill = {
    skillId: "skill-1",
    skillName: "Test Skill",
    skillDesc: "Test Desc",
    isActive: true,
    createdAt: {} as Timestamp,
  };

  beforeEach(() => {
    useProfileStore.setState({
      skills: [],
      coinBalance: 0,
      openEditModal: { profile: false, skill: false },
      skillModalMode: "add",
      selectedSkill: null,
      skillPendingDelete: null,
    });
  });

  it("opens and closes the profile edit modal", () => {
    useProfileStore.getState().setOpenEditModal("profile", true);
    expect(useProfileStore.getState().openEditModal.profile).toBe(true);

    useProfileStore.getState().setOpenEditModal("profile", false);
    expect(useProfileStore.getState().openEditModal.profile).toBe(false);
  });

  it("opens the add skill modal and resets selection", () => {
    useProfileStore.getState().openAddSkillModal();

    expect(useProfileStore.getState().openEditModal.skill).toBe(true);
    expect(useProfileStore.getState().skillModalMode).toBe("add");
    expect(useProfileStore.getState().selectedSkill).toBeNull();
  });

  it("opens the edit skill modal with a selected skill", () => {
    useProfileStore.getState().openEditSkillModal(sampleSkill);

    expect(useProfileStore.getState().openEditModal.skill).toBe(true);
    expect(useProfileStore.getState().skillModalMode).toBe("edit");
    expect(useProfileStore.getState().selectedSkill).toEqual(sampleSkill);
  });

  it("opens and closes the delete confirmation dialog", () => {
    useProfileStore.getState().openDeleteSkillDialog(sampleSkill);
    expect(useProfileStore.getState().skillPendingDelete).toEqual(sampleSkill);

    useProfileStore.getState().closeDeleteSkillDialog();
    expect(useProfileStore.getState().skillPendingDelete).toBeNull();
  });

  it("updates skills and coin balance state", () => {
    useProfileStore.getState().setSkills([sampleSkill]);
    useProfileStore.getState().fetchUserCoinBalance(42);

    expect(useProfileStore.getState().skills).toEqual([sampleSkill]);
    expect(useProfileStore.getState().coinBalance).toBe(42);
  });
});
