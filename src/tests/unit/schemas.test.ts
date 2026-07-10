import { accountSchema } from "../../schemas/accountSchema";
import { chatInputSchema } from "../../schemas/chatInputSchema";
import { loginSchema } from "../../schemas/loginSchema";
import { profileEditSchema, profileSchema } from "../../schemas/profileSchema";
import { settingsSchema } from "../../schemas/settingsSchema";
import { skillSchema } from "../../schemas/skillSchema";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "alex@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["email"] })])
      );
    }
  });
});

describe("accountSchema", () => {
  it("accepts matching passwords", () => {
    const result = accountSchema.safeParse({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = accountSchema.safeParse({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      password: "password123",
      confirmPassword: "different",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["confirmPassword"] })])
      );
    }
  });
});

describe("profile schemas", () => {
  it("accepts optional profile fields", () => {
    const result = profileSchema.safeParse({
      bio: "Hello world",
      avatar: "https://example.com/avatar.png",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a bio longer than 500 characters", () => {
    const longBio = "a".repeat(501);
    const result = profileEditSchema.safeParse({
      fullName: "Alex",
      email: "alex@example.com",
      bio: longBio,
      avatar: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["bio"] })])
      );
    }
  });
});

describe("settingsSchema", () => {
  it("accepts valid password change data", () => {
    const result = settingsSchema.passwordSchema.safeParse({
      currentPassword: "oldpass123",
      newPassword: "newpass123",
      confirmNewPassword: "newpass123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a password change with mismatched confirmation", () => {
    const result = settingsSchema.passwordSchema.safeParse({
      currentPassword: "oldpass123",
      newPassword: "newpass123",
      confirmNewPassword: "wrong",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["confirmNewPassword"] })])
      );
    }
  });

  it("requires a password for delete-account payload", () => {
    const result = settingsSchema.deleteAccount.safeParse({
      password: "secret",
    });

    expect(result.success).toBe(true);
  });
});

describe("skillSchema", () => {
  it("accepts nested skill entries", () => {
    const result = skillSchema.safeParse({
      role: "Frontend",
      skills: [{ skillName: "React", skillDesc: "Build interfaces" }],
    });

    expect(result.success).toBe(true);
  });
});

describe("chatInputSchema", () => {
  it("rejects an empty message", () => {
    const result = chatInputSchema.safeParse({ message: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["message"] })])
      );
    }
  });
});
