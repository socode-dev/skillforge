import z from "zod";

export const settingsSchema = {
  passwordSchema: z
    .object({
      currentPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
    }),
  deleteAccount: z.object({
    password: z.string(),
  }),
};

export type PasswordSchema = z.infer<typeof settingsSchema.passwordSchema>;
export type DeleteAccountSchema = z.infer<typeof settingsSchema.deleteAccount>;
