# Dry & Mighty — iPhone test build

## Quick design and journal test

From the repository root, install dependencies with `npm ci`, then run:

```sh
EXPO_PUBLIC_PREVIEW_MODE=true npm run dry -- --lan
```

Keep the Mac awake and both iPhones on the same Wi-Fi. For Safari testing, open the local network URL printed by Expo (use the Mac’s LAN address, not localhost). Tracking is saved separately in each browser/phone. Clearing browser data removes that journal. Safari is a functional preview, not an installed native app; it does not support the native local reminder or real billing.

For the native preview, install Expo Go from the App Store and scan Expo’s QR with the iPhone camera. Use the current Expo Go supporting SDK 58. If Expo asks you to sign in, create a free Expo account and use the same account in Expo Go and the CLI (`npx expo login`). No Apple Developer membership is needed for Expo Go. In Expo Go or with the explicit development preview flag, the paywall offers a no-charge Premium preview. Missing real billing keys never silently create an entitlement in a release build.

## What to try on both phones

1. Start today; choose a challenge and your baseline. Check readability with larger iPhone text settings.
2. Log a dry day, choose a mood, write a note, then navigate away and reopen the app. Verify your data remains.
3. Change that day to “Had a drink”, then clear it in Journey. Counts should change while the earned badge stays.
4. Choose a pause: it preserves the **challenge run**, but never adds a dry day. The earliest finish moves forward after missed/unlogged days.
5. Tap a voice note: it should show a draft script and a missing-recording label. No listening badge is awarded without completed recorded playback.
6. In Settings → Premium, try the preview. Confirm the no-charge message. In a production export without store keys, purchasing must be unavailable.
7. In a native preview, grant/deny notifications, change the reminder time, turn it off, then return after midnight. Confirm the new date appears.
8. Once Buddy is configured, pair two phones; edit an older day, pause a day, clear a day, go offline/reconnect, and leave a pair. Confirm both phones converge and shared history is removed on leaving.

## Buddy setup still required

Connect a Supabase project using the public URL and anonymous key from `.env.example`; enable anonymous authentication. On a new database, apply `supabase/schema.sql`, then `supabase/002_reliable_sync.sql`. On an existing database, apply only the second file. The migration supports pauses, atomic history replacement, and member-scoped deletion. Never put a service-role key in the app.

Only name, date, and day status are shared. Notes and moods remain local. Leaving ends the pair for both members and cascades deletion of its shared rows. Reset stops rather than erasing local data if remote deletion fails. This migration has not yet been exercised against a connected Supabase database; two-account RLS, deletion, and reconnection tests are required before enabling Buddy for external testers.

## Native store testing after account setup

An Expo account and Apple Developer membership are needed for signed internal iPhone builds / TestFlight. From this app folder, use `npx eas-cli build:configure` to connect the app to your own EAS project. Register the test devices, then `npx eas-cli build --platform ios --profile preview`. This profile is an internal release build, with simulated billing disabled. The empty project ID must be replaced by EAS setup; no account or signing identity has been invented.

Configure the two subscription product IDs and the `premium` entitlement in RevenueCat and App Store Connect, then provide the public iOS SDK key. Real prices come from the current offering. Test purchase, cancellation, restore, expiry, offline entitlement access, and account changes on physical iPhones. Production also needs final privacy/terms/support links, approved recordings, app icons/store metadata, and a review of the draft wellness copy. No TestFlight build has been uploaded by this change.

## Verification in this revision

TypeScript checks and regression tests cover tracking, permanent badges, explicit purchase preview/fail-closed behavior, revoked entitlements, and success-only audio credit. Expo exports all three platforms. Browser walkthrough covers onboarding, check-in correction, badge retention, draft captions, safe Premium preview and persistence after navigation/reload. Physical iPhone behavior, reminders and real purchases remain device tests.
