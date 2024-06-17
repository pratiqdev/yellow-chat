# YellowChat

A simple chat application using PubNub and React


## Installation

Copy the provided env vars into `.env.local` and install dependancies with
```
$ yarn
```

## Usage

Run the app locally with
```
$ yarn dev
```
or build and serve the app with vites preview `yarn preview`.




## Testing

Run all included tests with 
```
$ yarn test
```

Unit tests are located in `./src/__tests__/...`
Perform unit tests using `vitest` with the command
```
$ yarn test:unit
```

E2E tests are located in `./cypress/e2e/...`
Run e2e tests using `cypress` with
```
$ yarn test:e2e
```

## Build Output

Build the app to run `tsc` and print compiler errors
```
$ yarn build
```


## Key Components

Constants `@/lib/constants.tsx`: Holds relevant config variables
Types `@/lib/types.ts`: Some simple types for context and messages
UI `@/components/ui/...`: Uses `shadcn/ui` components with `cva` + `tailwind` for easy variants 
Hooks `@/lib/hooks.tsx`: Some custom hooks for handling advanced lifecycle methods
Store `@/lib/provider.tsx`: All state is stored and managed by context, using custom methods to update the state  
Setup `@/components/setup-modal.tsx`: A welcome modal with onboarding steps like add username, create channel  
User Modal `@/components/channel-modal.tsx`: Renders a modal with controls to update username  
Channels `@/components/channel-list.tsx`: Renders a list of ChannelItems used to interact with each channel  
Channel Item `@/components/channel-item.tsx`: Renders a channel item with controls to leave, join, delete channel  
Channel Modal `@/components/channel-modal.tsx`: Renders a modal with controls to create channels  
Chat `@/components/chat-window.tsx`: Renders a layout with channel details, inputs and list of ChatBubbles
Bubbles `@/components/chat-bubble.tsx`: Renders each individual chat bubble with username, content and time


## Development 


<details>
<summary>Assumptions</summary>


**State Management**  
Since this will be a simple app (few views, little state) I will use react context
to provide state to all components and implement a centralized store and methods, while > avoiding useReducer (I will likely need async logic for dealing with PubNub).

**Unique Ids**  
Managing any data for a user will depend on a unique id for each user/device/platform so I will run initial experiments in a premade nextjs app integrated with `next-auth` and GitHub as the provider.

**Chicken or Egg?**
Without knowing anything about this platform, I can only assume a channel must exist before posting messages or adding/inviting users.

</details>


<details>
<summary>Initial Research and Testing</summary>

PubNub is a service I have not used in the past, so I dove into the docs/demos to see how/what/why to interact with the API and make some better predictions on how to setup my store. I wanted to find at least:

- How does PN create/store users?
- How does the app fetch and sub to channels?
- Do users need to exist (prior to channel creation)?
- Do channels need to exist (prior to user join)?

Since this will be a simple app (few views, little state) I will use react context
to provide state to all components and implement a centralized store and methods, while avoiding useReducer (I will need async logic for dealing with PubNub).

After browsing for a bit and checking out the demo app, I decided to setup a simple test app using the `@pubnub/chat` SDK, which was mainly challenging due to inconsistent documentation (see "Pitfalls").

The  premade `pubnub-react` components were decent, but offered little to no customization or extension, after a little experimentation - this felt like a poor choice (intuitively - I have no real explanation for the experience).

</details>



<details>
<summary>Making it Work</summary>

So, on to the next step, the `pubnub` javascript SDK - all other abstractions or kits were just a wrapper around the core functions found here, at least I may get a better understanding of underlying methods used here, even if I have to wrap them myself?

</details>



<details>
<summary>Concerns / Performance Improvements</summary>

I took several shortcuts to accomplish this task within the weekend:

| Shortcut | Issue | Resolution |
|--|--|--|
| singleton global context | frequent global updates | split into multiple contexts, fetch, store and render chat data within chat component (only single chat rendered at a time, history fetched and subbed at comp mount) mixed with local state management like zustand
| local storage username | incorrect usage of the pubnub users api - eventual issue collecting memberships by user id | create and fetch users from pubnub based on a unique id (required some sort of auth/user management)
| local storge channels | channels are not deleted, just removed from current users channel list | figure out how to delete channels from pubnub
| no virtualization in chat window | eventual lag/stutter with large list | implement react-virtualized for all long lists
| state reset function has no way of cancelling pubnub `fetchMessages` or `hereNow` | promise eventually resolves (after state reset) and inserts message history or presence into state incorrectly (requires multiple calls to `resetState`) | maybe add a flag for `wasReset` preventing updates until all resolved, then toggle `wasReset` back


</details>




## Pitfalls

- Inconsistent and/or inaccurate documentation for PubNub's **many** SDK's
- Short timeline allows for limited research and experimentation
- Vites hot reload is creating multiple instances of pubnub and emitting presence events, only removing users after connection timeout (notice extra users with `uuids` like `pratiqdev_yellowchat_uuidv4` leaving on timeout action) 
