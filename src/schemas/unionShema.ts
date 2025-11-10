import { z } from "zod";
import { accountSchema } from "./accountSchema";
import { skillSchema } from "./skillSchema";
import { profileSchema } from "./profileSchema";

export const unionSchema = z.union([accountSchema, skillSchema, profileSchema]);

export type UnionSchema = z.infer<typeof unionSchema>;
