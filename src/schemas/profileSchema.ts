import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio can't exceed 500 characters").optional(),
  avatar: z.string().optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const profileEditSchema = z.object({
  fullName: z.string().min(2, "Too short"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(500, "Bio can't exceed 500 characters"),
  avatar: z.string()
})

export type ProfileEditSchema = z.infer<typeof profileEditSchema>;


