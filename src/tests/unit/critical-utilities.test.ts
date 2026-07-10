import { Timestamp } from "firebase/firestore";

import { loginSchema } from "../../schemas/loginSchema";
import { getCallableErrorMessage } from "../../utils/getCallableErrorMessage";
import { formatTime } from "../../utils/formatTime";
import { groupMessagesByDate } from "../../utils/groupMessagesByDate";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "alex@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email and short password", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "12345",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["email"] }),
          expect.objectContaining({ path: ["password"] }),
        ])
      );
    }
  });
});

describe("getCallableErrorMessage", () => {
  it("returns a friendly message for insufficient coins", () => {
    const error = new Error("insufficient coin balance");

    expect(getCallableErrorMessage(error)).toBe(
      "You do not have enough coins to request this skill."
    );
  });

  it("returns the underlying firebase error message when present", () => {
    const error = new Error("permission denied");

    expect(getCallableErrorMessage(error)).toBe("permission denied");
  });

  it("returns the fallback message for unknown errors", () => {
    expect(getCallableErrorMessage("boom")).toBe("Something went wrong. Please try again");
  });
});

describe("formatTime", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-09T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns an empty string for missing values", () => {
    expect(formatTime(undefined as never)).toBe("");
  });

  it("returns the time for today's date", () => {
    expect(formatTime(new Date("2026-07-09T09:15:00Z"))).toBe("09:15");
  });

  it("returns Yesterday for a previous day", () => {
    expect(formatTime(new Date("2026-07-08T09:15:00Z"))).toBe("Yesterday");
  });

  it("returns a short date for older dates", () => {
    expect(formatTime(new Date("2026-07-01T09:15:00Z"))).toBe("01/07/2026");
  });
});

describe("groupMessagesByDate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-09T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("groups messages into Today, Yesterday, and older dates", () => {
    const messages = [
      {
        id: "1",
        content: "today",
        createdAt: new Date("2026-07-09T09:15:00Z"),
      },
      {
        id: "2",
        content: "yesterday",
        createdAt: new Date("2026-07-08T09:15:00Z"),
      },
      {
        id: "3",
        content: "older",
        createdAt: new Date("2026-07-01T09:15:00Z"),
      },
    ];

    const grouped = groupMessagesByDate(messages as never[]);

    expect(Object.keys(grouped)).toEqual(expect.arrayContaining(["Today", "Yesterday", "01/07/2026"]));
    expect(grouped.Today).toHaveLength(1);
    expect(grouped.Yesterday).toHaveLength(1);
    expect(grouped["01/07/2026"]).toHaveLength(1);
  });

  it("handles Firestore timestamps", () => {
    const messages = [
      {
        id: "1",
        content: "timestamp",
        createdAt: Timestamp.fromDate(new Date()),
      },
    ];

    const grouped = groupMessagesByDate(messages as never[]);

    expect(grouped.Today).toBeDefined();
  });
});
