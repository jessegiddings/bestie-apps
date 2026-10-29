# Two apps, two clear reasons to open them

## Morning Bestie: a small daily ritual

The product promise is a short, welcoming pause before the day begins. The home screen leads with the morning note, then one thought to carry away. Support for a particular feeling lives in a searchable Moments library. Saved notes are a quiet collection to return to. Keepsakes remain available without putting a streak or performance score at the center of the experience.

The visual language uses warm paper, espresso type, butter yellow for the daily note and washed blue for supporting moments. Fraunces headlines give it a personal, editorial feel; practical sans-serif text carries controls and longer captions. A simple sun is the recurring motif. Generous spacing and a three-destination navigation bar replace the previous long menu of competing features.

The proposed voice is warm, brief and grounded. Draft scripts still need Hannah’s review; the design does not imply that she is responding live. Missing audio is labelled as a draft and cannot earn listening credit. Premium describes the existing collection instead of promising an unbounded stream of new recordings.

## Bestie Night: the living room edition

The product promise is an easy way to get a room of friends playing from one phone. The first action gets everyone into a full game night. A guest list and crowd/deck choice sit together; numbered game cards make the five alternatives easy to scan. Choosing a game before adding names now carries that choice through setup. An active session gets a prominent Continue action, with an explicit warning before replacement.

The visual language uses cobalt, citron and a pale neutral ground. Bold, compact sans-serif headings and graphic numbered cards create a more social identity than the other apps. Buttons are substantial, prompt cards use large type, and the scoreboard emphasizes points. Color has a job: cobalt for primary actions, citron for the headline invitation, coral for urgency and green for a positive result.

Keep round instructions short enough to read aloud. Host lines remain captions until approved audio exists. The VIP screen sells the available Friends deck; it does not promise a monthly podcast deck that has not been built.

## Scope and testing

This branch brings the existing Morning Bestie and Bestie Night app directories from their original feature branches into the workspace that contains the Dry & Mighty fixes. It adds Morning Bestie’s shared note-library module without replacing the corrected purchase or voice player. The redesign changes app layouts and components, adds searchable moments, adjusts setup navigation, and makes development purchase previews explicit.

It is a design/test preview, not a completed release audit. Native purchases, recordings, notification permissions, accessibility text scaling and a full multiplayer playthrough on physical devices still need testing. Existing in-turn game state is local to its mounted screen: leaving/reloading mid-turn can restart that turn. The render-time dealing warning is fixed, but persistent in-turn resume is a separate gameplay task.

Verified: TypeScript for all workspaces; 71 tests across core and the three apps; platform exports; browser walkthrough of onboarding, moment search/detail, guest entry, night opening and a playable prompt. Neither app has been submitted to Apple.

Start previews from the repository root:

```sh
EXPO_PUBLIC_PREVIEW_MODE=true npm run morning -- --lan --port 8082
EXPO_PUBLIC_PREVIEW_MODE=true npm run night -- --lan --port 8083
```

Use the Mac’s local Wi-Fi IP in Safari on the phones. The Mac must remain awake. Native Expo Go requires a compatible SDK 58 client; real subscriptions need a signed native build and configured products. The explicit preview flag is ignored in production.
