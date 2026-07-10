import { Timestamp } from "firebase/firestore";

import { deriveMessageStatus, getMessageStatusIcon } from "../../utils/deriveMessageStatus";
import { normalizeDate } from "../../utils/normalizeDate";
import { normalizedMessages } from "../../utils/normalizeMessages";
import { shuffleArray } from "../../utils/shuffleArray";

describe("normalizeDate", () => {
  it("returns a Date for a Firestore timestamp", () => {
    const timestamp = new Timestamp(1_700_000_000, 0);

    expect(normalizeDate(timestamp)).toBeInstanceOf(Date);
  });

  it("returns a Date for native Date input", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");

    expect(normalizeDate(date)).toBe(date);
  });
});

describe("shuffleArray", () => {
  it("returns a shuffled copy without mutating the original array", () => {
    const original = [1, 2, 3, 4];
    const result = shuffleArray(original);

    expect(result).not.toBe(original);
    expect(result).toHaveLength(original.length);
    expect(original).toEqual([1, 2, 3, 4]);
  });

  it("throws if the input is not an array", () => {
    expect(() => shuffleArray("abc" as unknown as any[])).toThrow(TypeError);
  });
});

describe("deriveMessageStatus", () => {
  it("returns PENDING for pending messages", () => {
    const createdAt = new Timestamp(1_700_000_000, 0);

    expect(
      deriveMessageStatus(
        "user-1",
        "user-2",
        {},
        {},
        "PENDING",
        createdAt
      )
    ).toBe("PENDING");
  });

  it("returns SENT when there is no recipient state", () => {
    const createdAt = new Timestamp(1_700_000_000, 0);

    expect(
      deriveMessageStatus(
        "user-1",
        "user-1",
        {},
        {},
        "SENT",
        createdAt
      )
    ).toBe("SENT");
  });
});

describe("getMessageStatusIcon", () => {
  it("returns a component for each status", () => {
    expect(getMessageStatusIcon("PENDING")).toBeDefined();
    expect(getMessageStatusIcon("FAILED")).toBeDefined();
    expect(getMessageStatusIcon("SENT")).toBeDefined();
    expect(getMessageStatusIcon("DELIVERED")).toBeDefined();
    expect(getMessageStatusIcon("READ")).toBeDefined();
  });
});

describe("normalizedMessages", () => {
  it("combines and sorts server and outbox messages", () => {
    const result = normalizedMessages(
      [
        {
          messageId: "server-2",
          chatId: "chat-1",
          clientId: "client-2",
          senderId: "u2",
          text: "Second",
          status: "SENT",
          type: "TEXT",
          createdAt: new Timestamp(1_700_000_002, 0),
        },
      ],
      [
        {
            messageId: "server-3",
          clientId: "client-1",
          chatId: "chat-1",
          senderId: "u1",
          text: "First",
          status: "PENDING",
          type: "TEXT",
          createdAt: new Timestamp(1_700_000_001, 0),
        },
      ]
    );

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("First");
    expect(result[1].text).toBe("Second");
  });
});
