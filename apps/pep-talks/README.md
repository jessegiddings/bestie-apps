# Pep talks (working title "Hey Bestie")

A short morning voice note from her, in her real voice, plus "I need you" moments you can tap any time.

```bash
npm install
npm run pep        # press w for web, or scan with Expo Go
npm test
```

## What's in this build

- Onboarding: what you want help with (puts those moments first), morning reminder time, start today or tomorrow.
- Today: her line of the day (shareable), the morning note for your day N (everyone starts on the welcome note; after the last note it loops from note 2), mornings together and in a row, and a friendship bracelet of charms at 1, 3, 7, 14, 30, 50, 100 and 365 mornings. A missed day never takes a charm away.
- "I need you": 10 moments (big day, rough day, anxious, heartbroken, not good enough, lonely, can't sleep, good news, can't get going, out tonight and not drinking), three talks each, rotating so you never hear the same one twice in a row. Heavier moments show the 988 line.
- Saved notes (Premium), mute, reminder time, start over.
- Premium: $5.99/month or $39.99/year (`pep_premium_monthly`, `pep_premium_yearly`, entitlement `premium`). Free keeps the first 7 mornings, the first talk in every moment, the daily line and the bracelet. Without RevenueCat keys it runs in test mode.

## Her content

All words are in `src/content/`: `mornings.ts` (30), `moments.ts` (10 x 3), `lines.ts` (60), `charms.ts` (8). They're drafts for her to rewrite. To add a recording, export `.m4a`, name it after the note id (`morning-7.m4a`, `big-day-2.m4a`), drop it in `assets/voice/` and set `asset: require('../../assets/voice/morning-7.m4a')` on that entry. Never a synthetic or cloned voice.

The notes use `VoiceNote` from `@bestie/core` (`packages/core/src/notes/library.ts`), the same shape the dry tracker's check-ins and craving talks can use, so one recording day can feed both apps.

## Home screen widget (next step, needs a development build)

`src/services/widget.ts` already produces a week of "line of the day" entries. The widget itself is a native iOS extension, so it can't run in Expo Go or on web. Plan for the first EAS development build:
1. Add an iOS widget target with `@bacons/apple-targets` (a small SwiftUI view showing the line and her name).
2. Share an App Group (`group.app.bestie.peptalks`) and write `widgetEntries(today)` there on every app open.
3. Android later with `react-native-android-widget`.
