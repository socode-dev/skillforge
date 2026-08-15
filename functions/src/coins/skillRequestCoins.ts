import { db } from "@functions/db";

export const SKILL_REQUEST_COIN_AMOUNT = 10;
export const COIN_TRANSFERS_COLLECTION = "coinTransfers";

export const getSkillRequestCoinTransferRef = (requestId: string) =>
  db.collection(COIN_TRANSFERS_COLLECTION).doc(requestId);
