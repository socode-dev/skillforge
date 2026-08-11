# Skill-Request Lifecycle

This is the record of how the skill-request flow works in SkillForge. It is not a tutorial. It is the system design behind how requests are created, accepted, completed, and settled.

## The main idea

A skill request is not just a button click. It is a full workflow that touches:

- the request itself
- the user’s coin balance
- the chat between both users
- the skill being requested
- the final settlement when the lesson ends

Because of that, the app does not trust the browser to decide the full lifecycle. The real rules live in backend functions.

## Why we use coins as a gate

We lock a small amount of coins when a request is made. This is not only about payment. It is also a way to reduce request abuse.

If a user can spam requests with no cost, the system gets noisy and unfair. A coin hold acts like a soft economic gate: it makes the request feel real, discourages low-value spam, and gives the platform a clear way to separate serious requests from junk ones. In product terms, it is a simple anti-abuse layer. In system terms, it is a cheap but effective escrow mechanism.

The same coin hold is later released or returned depending on whether the request is accepted, cancelled, or completed.

## Request state

A request moves through a simple state flow:

- `PENDING`: request is opened and waiting for a decision
- `ACCEPTED`: the skill owner accepted it
- `DECLINED`: the owner rejected it
- `CANCELLED`: the requester cancelled it before acceptance
- `COMPLETED`: the lesson is finished and the request is settled

This is not just for display. The backend checks the current state before allowing any change.

The client-side flow is in [src/store/useRequestsStore.ts](../src/store/useRequestsStore.ts), and the actual backend logic is in:

- [functions/src/skillRequest/send.ts](../functions/src/skillRequest/send.ts)
- [functions/src/skillRequest/accept.ts](../functions/src/skillRequest/accept.ts)
- [functions/src/skillRequest/cancel.ts](../functions/src/skillRequest/cancel.ts)
- [functions/src/skillRequest/decline.ts](../functions/src/skillRequest/decline.ts)
- [functions/src/skillRequest/requestCompletion.ts](../functions/src/skillRequest/requestCompletion.ts)
- [functions/src/skillRequest/confirmCompletion.ts](../functions/src/skillRequest/confirmCompletion.ts)

## Why the backend owns the rules

The browser can start the flow, but it cannot safely enforce the full business rules. The backend checks:

- who the user is
- whether they are allowed to act
- whether the request is still in the right state
- whether the coin transfer matches the request
- whether the chat exists
- whether completion and settlement are valid

This is the boundary that keeps the app honest. It stops users from faking request states or changing unrelated records from the front end.

## Coin escrow is its own record

The app keeps coin movement in a separate transfer record instead of mixing it into the request record itself.

That transfer holds:

- who is paying
- who is receiving
- how much
- current status
- timestamps for each change

This makes the system easier to reason about. We can see exactly whether coins are in escrow, released, reversed, or still pending.

The logic lives in:

- [functions/src/coins/skillRequestCoins.ts](../functions/src/coins/skillRequestCoins.ts)

## One transaction, many updates

A change like accepting a request touches more than one thing at once:

- the request status
- the coin transfer status
- the chat record
- the system message
- the skill’s learner count

So the app updates them together in one backend transaction. This avoids half-done states where the request looks accepted but the chat or coin data is missing or wrong.

This is a key design rule: if a workflow changes more than one important part of the system, it must be done as a single backend action.

## Completion is split into two steps

When a lesson is complete, the flow is broken into two clear steps:

1. The requester marks completion.
2. The skill owner confirms it.

This matters because it separates:

- the learner’s request to finish
- the owner’s final check
- the actual release of funds

This prevents early settlement and keeps the lifecycle clear. It also helps with accountability.

The completion rules are checked in:

- [functions/src/skillRequest/helpers/completion.ts](../functions/src/skillRequest/helpers/completion.ts)

## Why this system works

This feature crosses several domains:

- identity
- coins
- chat
- skill data
- lifecycle tracking

Because it crosses all of those, the real rules need to live where they can all be checked together. The browser can start the flow, but the backend owns the final truth.

## Simple summary

- requests are real records with real states
- coins are held to reduce spam and fake requests
- the backend enforces the lifecycle
- escrow is tracked separately
- multiple updates happen together in one transaction
- completion is confirmed in stages before funds are released
- the UI is just the front door; the backend is the source of truth
