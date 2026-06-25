import { FirebaseError } from "firebase/app";

export const getCallableErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again"
) => {
  const message =
    err instanceof Error || err instanceof FirebaseError ? err.message : "";

  if (/insufficient coin balance/i.test(message)) {
    return "You do not have enough coins to request this skill.";
  }

  if (err instanceof FirebaseError && err.message) {
    return err.message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
};
