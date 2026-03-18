import z from "zod";

export const chatInputSchema = z.object({
    message: z.string().min(1),
});

export type ChatInputShema = z.infer<typeof chatInputSchema>