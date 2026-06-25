import type { ChatStoreState } from "@/types/chat-store.types";
import type { LastMessage } from "@/types/message.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create<ChatStoreState>()(
    persist(
        (set) => ({
        lastMessages: {},
        optimisticLastMessage: {},
        messagesByChat: {},
        outboxByChat: {},

        setLastMessages: (message) => {
            const map: Record<string, LastMessage> = {};
                
                for(const msg of message) {
                    map[msg.chatId] = msg
                }

            set({lastMessages: map})
        },

        setLastMessage: (chatId, message) => {
            set(state => ({
                lastMessages: {
                    ...state.lastMessages,
                    [chatId]: message
                }
            }))
        },

        updateOutboxStatus: (chatId, messageId, status) => {
            set(state => ({
                outboxByChat: {
                    ...state.outboxByChat,
                    [chatId]: (state.outboxByChat[chatId] ?? []).map(outbox => outbox.messageId === messageId ? {...outbox, status} : outbox),
                }
            }));
        },
        
        addToOutbox: (chatId, message) => {
            set(state => ({
                outboxByChat: {
                    ...state.outboxByChat,
                    [chatId]: [
                        ...(state.outboxByChat[chatId] ?? []),
                        message
                    ]
                }
            }));
        },

        removeFromOutbox: (chatId, clientId) => {
            set(state => ({
                outboxByChat: {
                    ...state.outboxByChat,
                    [chatId]: state.outboxByChat[chatId]?.filter(
                        m => m.clientId !==clientId
                    ) ?? []
                }
            }))
        },

        setServerMessages: (chatId, serverMessages) => {
            set((state) => {
                const outbox = state.outboxByChat[chatId] ?? [];

                const filteredOutbox = outbox.filter(local => !serverMessages.some(server => server.clientId === local.clientId
                    )
                )

                return {
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: serverMessages
                    },
                    outboxByChat: {
                        ...state.outboxByChat,
                        [chatId]: filteredOutbox
                    }
                }
            })
        },

    }),
    {
        name: "chat-store",
        partialize: (state) => ({
            lastMessages: state.lastMessages,
            outboxByChat: state.outboxByChat
        })
    }
)
)

export default useChatStore;
