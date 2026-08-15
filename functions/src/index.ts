import { initializeApp } from "firebase-admin/app";

initializeApp();

export { finalizeSignup } from "@functions/auth/finalizeSignup";
export { createInitialUserDoc } from "@functions/auth/createInitialUserDoc";
export { deleteAccount } from "@functions/auth/deleteAccount";
export { sendSkillRequest } from "@functions/skillRequest/send";
export { cancelSkillRequest } from "@functions/skillRequest/cancel";
export { declineSkillRequest } from "@functions/skillRequest/decline";
export { acceptSkillRequest } from "@functions/skillRequest/accept";
export { requestSkillCompletion } from "@functions/skillRequest/requestCompletion";
export { confirmSkillCompletion } from "@functions/skillRequest/confirmCompletion";
export {sendMessage} from "@functions/chat/sendMessage";
