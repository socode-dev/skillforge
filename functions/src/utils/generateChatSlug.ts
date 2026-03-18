import { randomBytes } from "crypto";

export const generateChatSlug = () => {
    return randomBytes(8).toString("hex");
}