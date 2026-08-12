import type { LastMessage, OutboxMessage, ServerMessage } from "@/types/message.types";
import type { Timestamp } from "firebase/firestore";
import useChatStore from "@/store/useChatStore";

describe("useChatStore", () => {
  const timestamp = { seconds: 0, nanoseconds: 0, toDate: () => new Date(0) } as unknown as Timestamp;

  beforeEach(() => {
    useChatStore.setState({
      lastMessages: {},
      messagesByChat: {},
      outboxByChat: {},
    });
  });

  it("builds a last message map from an array of messages", () => {
    useChatStore.getState().setLastMessages([
      {
        chatId: "chat-1",
        messageId: "m1",
        slug: "m1",
        participantId: "p1",
        senderId: "s1",
        text: "Hi",
        status: "SENT",
        type: "TEXT",
        createdAt: timestamp,
        senderDisplay: { name: "User", role: "student" },
      } as LastMessage,
      {
        chatId: "chat-2",
        messageId: "m2",
        slug: "m2",
        participantId: "p2",
        senderId: "s2",
        text: "Hello",
        status: "SENT",
        type: "TEXT",
        createdAt: timestamp,
        senderDisplay: { name: "Other", role: "mentor" },
      } as LastMessage,
    ]);

    expect(useChatStore.getState().lastMessages).toEqual({
      "chat-1": {
        chatId: "chat-1",
        messageId: "m1",
        slug: "m1",
        participantId: "p1",
        senderId: "s1",
        text: "Hi",
        status: "SENT",
        type: "TEXT",
        createdAt: timestamp,
        senderDisplay: { name: "User", role: "student" },
      },
      "chat-2": {
        chatId: "chat-2",
        messageId: "m2",
        slug: "m2",
        participantId: "p2",
        senderId: "s2",
        text: "Hello",
        status: "SENT",
        type: "TEXT",
        createdAt: timestamp,
        senderDisplay: { name: "Other", role: "mentor" },
      },
    });
  });

  it("merges a single last message into existing state", () => {
    useChatStore.setState({
      lastMessages: {
        "chat-1": {
          chatId: "chat-1",
          messageId: "m1",
          slug: "m1",
          participantId: "p1",
          senderId: "s1",
          text: "First",
          status: "SENT",
          type: "TEXT",
          createdAt: timestamp,
          senderDisplay: { name: "User", role: "student" },
        } as LastMessage,
      },
    });

    useChatStore.getState().setLastMessage(
      "chat-1",
      {
        chatId: "chat-1",
        messageId: "m2",
        slug: "m2",
        participantId: "p1",
        senderId: "s1",
        text: "Updated",
        status: "SENT",
        type: "TEXT",
        createdAt: timestamp,
        senderDisplay: { name: "User", role: "student" },
      } as LastMessage
    );

    expect(useChatStore.getState().lastMessages["chat-1"].messageId).toBe("m2");
  });

  it("adds a new outbox message for a chat", () => {
    useChatStore.getState().addToOutbox(
      "chat-1",
      {
        chatId: "chat-1",
        messageId: "m1",
        clientId: "c1",
        text: "Hi",
        type: "TEXT",
        createdAt: timestamp,
        status: "PENDING",
      } as OutboxMessage
    );

    expect(useChatStore.getState().outboxByChat["chat-1"]).toEqual([
      {
        chatId: "chat-1",
        messageId: "m1",
        clientId: "c1",
        text: "Hi",
        type: "TEXT",
        createdAt: timestamp,
        status: "PENDING",
      },
    ]);
  });

  it("removes an outbox item by clientId", () => {
    useChatStore.setState({
      outboxByChat: {
        "chat-1": [
          {
            chatId: "chat-1",
            messageId: "m1",
            clientId: "c1",
            text: "Hi",
            type: "TEXT",
            createdAt: timestamp,
            status: "PENDING",
          },
          {
            chatId: "chat-1",
            messageId: "m2",
            clientId: "c2",
            text: "Hi",
            type: "TEXT",
            createdAt: timestamp,
            status: "PENDING",
          },
        ],
      },
    });

    useChatStore.getState().removeFromOutbox("chat-1", "c1");

    expect(useChatStore.getState().outboxByChat["chat-1"]).toEqual([
      {
        chatId: "chat-1",
        messageId: "m2",
        clientId: "c2",
        text: "Hi",
        type: "TEXT",
        createdAt: timestamp,
        status: "PENDING",
      },
    ]);
  });

  it("updates outbox message status for the matching messageId", () => {
    useChatStore.setState({
      outboxByChat: {
        "chat-1": [
          {
            chatId: "chat-1",
            messageId: "m1",
            clientId: "c1",
            text: "Hi",
            type: "TEXT",
            createdAt: timestamp,
            status: "PENDING",
          },
        ],
      },
    });

    useChatStore.getState().updateOutboxStatus("chat-1", "m1", "FAILED");

    expect(useChatStore.getState().outboxByChat["chat-1"]![0].status).toBe("FAILED");
  });

  it("synchronizes server messages and removes matching outbox messages", () => {
    useChatStore.setState({
      outboxByChat: {
        "chat-1": [
          {
            chatId: "chat-1",
            messageId: "m1",
            clientId: "c1",
            text: "Pending",
            type: "TEXT",
            createdAt: timestamp,
            status: "PENDING",
          },
          {
            chatId: "chat-1",
            messageId: "m2",
            clientId: "c2",
            text: "Pending 2",
            type: "TEXT",
            createdAt: timestamp,
            status: "PENDING",
          },
        ],
      },
    });

    useChatStore.getState().setServerMessages("chat-1", [
      {
        chatId: "chat-1",
        messageId: "m1",
        clientId: "c1",
        text: "From server",
        type: "TEXT",
        createdAt: timestamp,
        status: "SENT",
      } as ServerMessage,
    ]);

    expect(useChatStore.getState().messagesByChat["chat-1"]).toEqual([
      {
        chatId: "chat-1",
        messageId: "m1",
        clientId: "c1",
        text: "From server",
        type: "TEXT",
        createdAt: timestamp,
        status: "SENT",
      },
    ]);
    expect(useChatStore.getState().outboxByChat["chat-1"]).toEqual([
      {
        chatId: "chat-1",
        messageId: "m2",
        clientId: "c2",
        text: "Pending 2",
        type: "TEXT",
        createdAt: timestamp,
        status: "PENDING",
      },
    ]);
  });
});
