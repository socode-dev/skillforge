import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export { finalizeSignup } from "@functions/auth/finalizeSignup";
export { createInitialUserDoc } from "@functions/auth/createInitialUserDoc";
export { sendSkillRequest } from "@functions/skillRequest/send";
export { cancelSkillRequest } from "@functions/skillRequest/cancel";
export { declineSkillRequest } from "@functions/skillRequest/decline";
export { acceptSkillRequest } from "@functions/skillRequest/accept";
export {sendMessage} from "@functions/chat/sendMessage";

export const db = getFirestore();
