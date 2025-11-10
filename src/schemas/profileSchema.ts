import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio can't exceed 500 characters").optional(),
  avatar: z.string(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
