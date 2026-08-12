# Testing Architecture

This is the record for how SkillForge tests its real runtime behavior. It is not a general testing guide. It is the decision behind why this app uses emulators and browser tests instead of relying only on front-end mocks.

## The main idea

This app is built around Firebase behavior, not just React components. That means testing has to match the real runtime boundary.

The app depends on:

- Firebase Auth
- Firestore listeners
- callable backend functions
- transaction logic for coins and requests
- realtime updates and timestamps

A mock React app cannot honestly test all of that.

## Why emulators are required

The app’s business rules live across multiple systems. For example, the request flow does not only change one document. It touches auth, coins, chat, and request status together. In simple terms, the app is a distributed workflow, not a single form with a local save button.

Because of that, the emulator is not optional. It is the place where the real Firebase behavior is recreated on a local machine, so we can test the actual system boundary instead of a fake version of it.

The client setup is in [src/firebase/firebase.ts](../src/firebase/firebase.ts), and the e2e runtime is defined in [playwright.config.ts](../playwright.config.ts).

## Unit tests vs browser tests

The split is clear:

- unit tests cover small logic pieces and helper behavior
- browser tests cover full flows that involve route guards, auth, listeners, and backend actions

We do not try to prove complex cross-system behavior with unit tests alone. That would be pretending the system is simpler than it really is.

This matters most for:

- auth and onboarding flow
- request creation and request completion
- coin escrow and settlement
- unread and delivery updates in chat

## Why Playwright runs in multiple browsers

The app is tested in Chromium, Firefox, and WebKit.

This is to catch browser-specific differences in:

- storage and route behavior
- startup timing
- online/offline transitions
- listener updates and rendering timing

If we only tested one browser, we would miss problems that appear in real usage.

## Test seeds and app setup

The app supports a special testing-only state for auth and route checks. This is not production logic.

It exists so tests can start with a realistic app shell and skip the long onboarding process when they are specifically checking route protection or auth gates.

This keeps tests fast and consistent without changing how the app behaves for real users.

## CI behavior

CI is intentionally strict:

- retries are enabled for flaky browser runs
- workers are limited so emulators do not fight each other
- fresh server startup is used each run
- the app runs in the emulator-backed e2e mode

This matches the real runtime assumptions of the app. The test environment should act like the app behaves in real life, not a softer or simpler version of it.

## Simple summary

- emulators are required because the app depends on real Firebase services
- unit tests cover small logic only
- browser tests cover full app behavior
- multiple browsers reduce compatibility risk
- test seeding is a testing-only boundary, not production behavior
- CI is setup to behave like the real app environment, not a fake one
