# Messaging Architecture

This is the system record for how chat works in SkillForge. It is not a tutorial. It is the design behind how messages stay fast, reliable, and easy to manage.

## The main idea

Chat is treated as a live feature, not just a list of messages. It has to work well when the user is online, when they come back later, and when they switch between chat threads.

The system is split like this:

- Firestore holds the real message data and chat metadata.
- backend functions handle the authenticated write path.
- Zustand holds the summary state and the local outbox.
- the active chat route owns the thread form and thread listeners.

This keeps the app responsive without pretending the browser is the final source of truth.

## How the state is split

The app keeps messages in two layers:

- `chats/{chatId}`: chat info, participants, unread counts, delivery/read time, and the latest message
- `chats/{chatId}/messages`: the full message history

The client mirrors that split:

- [src/store/useChatStore.ts](../src/store/useChatStore.ts): stores last-message summaries and the outbox
- [src/context/useChatContext.tsx](../src/context/useChatContext.tsx): owns the active thread form and sending flow
- [src/firebase/firestore-listener/chat.ts](../src/firebase/firestore-listener/chat.ts): listens to the user’s chat list
- [src/firebase/firestore-listener/chatThread.ts](../src/firebase/firestore-listener/chatThread.ts): listens to the active thread

This is intentional. We do not keep every message for every chat in a global store. That would be heavy and messy. We keep summaries lightweight and load the detailed thread only when needed.

## Listener scope

There are two separate listener scopes:

1. Global chat summary listener
   - mounted in [src/initializer/AppInitializer.tsx](../src/initializer/AppInitializer.tsx)
   - watches the user’s chats
   - updates unread counts, last message preview, and list order

2. Thread listener
   - created inside [src/context/useChatContext.tsx](../src/context/useChatContext.tsx)
   - watches the active thread and its messages only
   - runs only when the user is on that chat

This is deliberate. We do not leave all thread listeners running in the background. They are created only when needed and removed when the route is no longer active.

## Optimistic sending and outbox

The app shows a message immediately when the user sends it, then reconciles it with the server later.

When a message is sent, the flow is:

1. create a local message with a stable client ID
2. add it to the outbox in Zustand
3. update the chat preview as pending
4. send it through the backend callable function
5. remove it from the outbox once the server confirms it

The actual sending logic is in [src/context/useChatContext.tsx](../src/context/useChatContext.tsx), and the backend write is in [functions/src/chat/sendMessage.ts](../functions/src/chat/sendMessage.ts).

The important point is that the outbox is not the real source of truth. It is only a local backup and retry layer. The backend message record is the real answer once it is accepted.

The app also retries pending messages when the browser reconnects or when the tab regains focus. This is a resilience decision. In plain terms, a short network issue should not silently destroy the user’s message intent. In system terms, the outbox acts as a retry queue for optimistic writes until the server acknowledges them.

## Delivery and read state

Delivery and read state are stored on the chat document, not on each message row.

The fields are:

- `deliveryState.{userId}`: when the other user received the newest chat state
- `readState.{userId}`: when the user opened the chat
- `unreadCount.{userId}`: how many messages are still unread for that user

This is handled in [src/lib/chatStateService.ts](../src/lib/chatStateService.ts) and observed by the summary listener in [src/firebase/firestore-listener/chat.ts](../src/firebase/firestore-listener/chat.ts).

This model is used because it is simpler and cheaper:

- fewer writes per message
- fits the way chat summaries work
- keeps unread and delivery state consistent at the thread level

The UI derives status from these timestamp values instead of storing a separate state on each message.

## Why this design

Chat is not a static list. It is a live, shared conversation with timing issues, reconnects, and delayed reads.

This design protects three things:

1. quick response for the user
2. stable chat state when the connection drops
3. tighter control over listener lifetime and memory use

We do not keep all chat logic in one component or one giant global state. We split it by purpose and by lifetime.

## Simple summary

- summaries are kept light and global
- thread detail is local to the active chat
- sending is optimistic, then corrected by the server
- the outbox is for retry, not truth
- delivery and read state live at the chat level
- listener cleanup is part of the design, not an afterthought
