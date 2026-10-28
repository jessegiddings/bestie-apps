# bestie-apps

Three small apps hosted in her voice, sharing one engine.

| App | Folder | Status | Launch target |
| --- | --- | --- | --- |
| Dry tracker (working title "Dry Tracker") | `apps/dry-tracker` | v1 screens built | Jan 1, 2027 |
| Daily pep talks | `apps/pep-talks` | not started | week of Feb 8, 2027 |
| Party game | `apps/party-game` | not started | April 2027 |

`packages/core` (`@bestie/core`) holds what all three share: the voice player (real recordings only, with captions while a clip isn't recorded yet), streak and date math, purchases (RevenueCat, with a mock mode for testing), and device storage.

## Run it

```bash
npm install
npm test            # all unit tests
npm run typecheck
npm run dry         # starts the dry tracker in Expo (press w for web, or scan with Expo Go)
```

Copy `apps/dry-tracker/.env.example` to `.env` and fill in keys when you have them. With no keys:
- Purchases run in **test mode**: "Start Premium" turns Premium on locally and says no money changed hands.
- Buddy pairing shows "isn't set up in this test build yet".

### Buddy pairing (Supabase)
1. Create a Supabase project, enable **Anonymous sign-ins** (Authentication, Providers).
2. Run `apps/dry-tracker/supabase/schema.sql` in the SQL editor.
3. Put the project URL and anon key in `.env`.

## Dry tracker: what's in v1

- Onboarding with a safety note and helpline, start date (today, tomorrow, Jan 1), a 14, 31 or 90 day challenge, usual drinks and cost, check-in time, and "your why".
- Today: day X of N, dry days, run, money and drinks saved, finish date. Log dry, had a drink, or a **pause day** (planned nights like weddings; 1, 2 or 4 passes by challenge length; a pause never breaks the run and moves the finish line one day).
- **Catch-up** card for days you forgot to log, plus a calendar to fix any day.
- Her evening check-in (31 scripts; first 3 free) and a **craving button** with 10 talks (first free), a text-a-friend shortcut and the helpline.
- Patches at 1, 3, 7, 14, 21, 31, 60 and 90 total dry days. A slip never takes one away.
- Buddy pacts with a 6-letter code; you see each other's last 14 days and can nudge.
- Premium: $4.99/month or $39.99/year (`dry_premium_monthly`, `dry_premium_yearly`, entitlement `premium`).

## Adding her recordings

All words live in `apps/dry-tracker/src/content/` (`checkins.ts`, `cravings.ts`, `clips.ts`). Edit them freely; see `docs/her-scripts.md` for the sheet she reads from.

To add a recording: export as `.m4a`, name it after the clip id (for example `checkin-7.m4a`), drop it in `apps/dry-tracker/assets/voice/`, and set `asset: require('../../assets/voice/checkin-7.m4a')` on that entry. No screen changes are needed. Never use a synthetic or cloned voice.

## Rules for every app here
- Her real voice only. No AI voice cloning.
- No New Girl names, lines, logos or clips.
- Keep the health safety note and helpline in the dry tracker.
- No secrets in the repo; keys go in `.env`.
