import { z } from "zod";

export const skillSchema = z.object({
  skills: z.array(
    z.string().min(1, { message: "You must add at least one skill." })
  ),
});

export type SkillSchema = z.infer<typeof skillSchema>;

export const skillInputSchema = z.object({
  skillInput: z.string().min(2, "Too short to be a skill").optional(),
});

export type SkillInputSchema = z.infer<typeof skillInputSchema>;
