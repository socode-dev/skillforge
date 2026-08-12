# Frontend Performance and Architecture Decisions

This is the record of how the frontend is structured for speed, clarity, and stable state. It is not a tutorial. It is the design behind how the app keeps itself responsive without becoming messy.

## The main idea

SkillForge treats performance as part of the architecture, not as a later cleanup step.

The app is built to:

- load only what is needed when it is needed
- keep state close to the part of the app that actually uses it
- stop listeners when they are no longer useful
- avoid making every screen depend on the same giant global state

## Lazy routes

The app uses lazy loading in [src/routes/AppRoutes.tsx](../src/routes/AppRoutes.tsx). It does not load every feature page at startup.

This keeps the first load smaller and puts the heavier code where it is actually needed. That matters because the app includes dashboard, discover, requests, messages, profile, and settings.

Skeleton screens are part of this decision too. They keep the interface stable while the route loads, so the app does not feel jumpy or broken while data is still coming in.

## Listener cleanup

Realtime listeners are started with clear lifetime rules.

- [src/initializer/AppInitializer.tsx](../src/initializer/AppInitializer.tsx) starts the main global listeners only after auth is ready.
- route-based listeners are created when a feature opens and cleaned up when it closes.

This prevents stale listeners from staying alive after the user leaves a page. It also reduces unnecessary updates and memory use.

## State ownership

The app separates state by what it is for.

### Zustand stores

These store shared, long-lived, app-level data like:

- auth in [src/store/useAuthStore.ts](../src/store/useAuthStore.ts)
- chat summary and outbox in [src/store/useChatStore.ts](../src/store/useChatStore.ts)
- request data in [src/store/useRequestsStore.ts](../src/store/useRequestsStore.ts)

Zustand is for data that:

- is used across pages
- is tied to Firebase or auth state
- is updated by realtime listeners
- needs to stay stable while the user navigates

### React Context

Context is used for state that is local to a subtree or route, such as:

- sidebar state in [src/context/useSidebarContext.tsx](../src/context/useSidebarContext.tsx)
- skills form state in [src/context/useSkillsContext.tsx](../src/context/useSkillsContext.tsx)
- active thread state in [src/context/useChatContext.tsx](../src/context/useChatContext.tsx)

This keeps route-local UI state close to the feature that owns it instead of spreading it across the whole app.

## Why Zustand and Context are split this way

The rule is simple:

- If the state is shared and important across screens, it belongs in Zustand.
- If it is only needed for a local form or active route, it belongs in Context.

This is why chat summaries sit in Zustand while the active input and thread logic stay in the chat context. The summary is app-wide; the form is local to the route.

## Performance principles

These are the rules the app follows:

- load features only when they are needed
- clean up listeners when their route is gone
- avoid putting local UI state in global state
- do not duplicate the same backend-driven data in many places
- build smaller derived state instead of many overlapping sources of truth

In technical terms, this is a layered state model with scoped subscriptions and bounded reactivity. In plain English, it keeps the app fast and stable without turning every screen into one giant shared mess.

This keeps the app fast and easier to reason about without turning state management into a global mess.

## Simple summary

- route loading is lazy
- skeletons keep the UI stable during navigation
- listeners are created and removed with a clear lifecycle
- shared app data goes in Zustand
- local form and route state stays in Context
- performance is designed into the app instead of added later
