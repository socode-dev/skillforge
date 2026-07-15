import z from "zod";

export const searchSchema = {
  discoverSearchShcema: z.object({
    searchValue: z.string().optional(),
  }),
};

export type DiscoverSearchSchema = z.infer<
  typeof searchSchema.discoverSearchShcema
>;
