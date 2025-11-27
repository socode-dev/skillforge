import z from "zod";

export const searchAndFilterSchema = {
  discoverSearchShcema: z.object({
    searchValue: z.string().optional(),
    filterValue: z.enum(["all", "skills", "people"]).optional(),
  }),
};

export type DiscoverSearchSchema = z.infer<
  typeof searchAndFilterSchema.discoverSearchShcema
>;
