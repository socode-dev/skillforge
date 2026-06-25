import { HttpsError } from "firebase-functions/v2/https";

export interface CompletionContext {
  ownerUserId: string;
  requesterUserId: string;
  chatId: string;
  skillName: string;
}

export const getCompletionContext = (
  req: FirebaseFirestore.DocumentData | undefined
): CompletionContext => {
  const ownerUserId = req?.owner?.userId;
  const requesterUserId = req?.requester?.userId;
  const chatId = req?.chatId;
  const skillName = req?.skillName;

  if (!ownerUserId || !requesterUserId || !chatId || !skillName) {
    throw new HttpsError(
      "data-loss",
      "Skill request is missing required completion data"
    );
  }

  return { ownerUserId, requesterUserId, chatId, skillName };
};

export const assertAcceptedRequest = (
  status: unknown,
  message = "Only accepted requests can be completed"
) => {
  if (status !== "ACCEPTED") {
    throw new HttpsError("failed-precondition", message);
  }
};

export const assertEscrowTransfer = (
  coinTransfer: FirebaseFirestore.DocumentData | undefined
) => {
  if (coinTransfer?.status !== "ESCROW") {
    throw new HttpsError(
      "failed-precondition",
      "Only escrowed coin transfers can be completed"
    );
  }
};

export const assertTransferParticipants = (
  coinTransfer: FirebaseFirestore.DocumentData | undefined,
  context: CompletionContext
) => {
  if (
    coinTransfer?.requesterId !== context.requesterUserId ||
    coinTransfer?.receiverId !== context.ownerUserId
  ) {
    throw new HttpsError(
      "data-loss",
      "Coin transfer participants do not match skill request"
    );
  }
};

export const getReleaseAmount = (
  coinTransfer: FirebaseFirestore.DocumentData | undefined
) => {
  const amount = coinTransfer?.amount;

  if (typeof amount !== "number" || amount <= 0) {
    throw new HttpsError("data-loss", "Coin transfer amount is invalid");
  }

  return amount;
};
