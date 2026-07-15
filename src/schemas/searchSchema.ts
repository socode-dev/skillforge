import z from "zod";

export const searchSchema = {
  discoverSearchSchema: z.object({
    searchValue: z.string().optional(),
  }),
};

export type DiscoverSearchSchema = z.infer<
  typeof searchSchema.discoverSearchSchema
>;
