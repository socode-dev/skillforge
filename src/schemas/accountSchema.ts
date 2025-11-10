import { z } from "zod";

export const accountSchema = z
  .object({
    fullName: z.string().min(3, "Too short"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AccountSchema = z.infer<typeof accountSchema>;
