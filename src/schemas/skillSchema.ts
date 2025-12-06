import { z } from "zod";

export const skillInputSchema = z.object({
  skillName: z.string(),
  skillDesc: z.string(),
});

export const skillSchema = z.object({
  role: z.string(),
  skills: z.array(skillInputSchema),
});

export type SkillSchema = z.infer<typeof skillSchema>;
export type SkillInputSchema = z.infer<typeof skillInputSchema>;
