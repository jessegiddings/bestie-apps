# The Mess Around — preview revision, November 6, 2026

Review input: “The Mess Around game review and ideas.docx”.

## Shipped in review build 02

- Eight games. New: Take Two (40 acting cards), Who Wrote That? (48 writing prompts), Close Call (32 near-match word pairs).
- Take Two: private direction, public performance and four choices, simultaneous finger votes, individual correct-voter points and performer match points.
- Who Wrote That?: private typed answers, hidden handoffs, shuffled author reveals and group-consensus guessing. Correct identification pays everyone except the author +1; a successful bluff pays the author +2. Written answers are held only in the current round, not persisted.
- Close Call: all players receive a word, with one near-match; extra clue laps, a locked group vote and explicit paired-word reveal.
- Point Blank: reader prediction +2, story +1, tied-player face-off and a no-points option if still tied.
- Hot Seat (formerly Bestie Test): individual voter scoring; hot-seat player earns one point per match.
- Real or Made Up: two prompt choices, 45-second story, 30-second cross-examination, individual votes and one teller point per fooled listener.
- Odd One Out: more turns (up to six), capped escape payout, a caught bluffer's last guess, extra clue laps, randomized non-bluffer first clue. Independent secret-role draws avoid making the final role predictable from earlier reveals.
- Last Word: elimination, accelerating ticking sound, a challenge pause, new categories between eliminations, winner +3 and runner-up +1.
- Saved names with skip option, a three-game Quick Mix, a five-game full night, balanced Team Hannah / Team Lamorne mode, end-of-night awards and score sharing.
- Local custom writing prompts, prioritized on their next play.
- Five new/revised stock-voice introduction files. The voices are not Hannah or Lamorne recordings or clones.

## Preview boundaries

This is a same-room, one-phone preview. Players speak, point and vote physically; a player records the outcome on the phone. It does not use speech recognition or remote multiplayer. Reloading midway through a turn restarts that turn; completed scores remain. The host challenge still uses clearly labelled sample content rather than invented personal host answers.

Host-approved personal answers, actual host recordings, deeper seasonal packs, reaction banks, persistent crew achievements and the further experimental games remain later work. The new three games have 120 original cards combined; existing packs have not all been expanded to 100+ cards each. No purchases are enabled from the review home screen.

## Validation

- Party-game TypeScript check passes.
- 34 automated tests pass, including full-night progression, scoring, final multipliers, team totals, role selection, replay identity and prediction bonuses.
- Production web export passes.
- Browser checks at 390 × 844: new-game private handoffs and reveals; Take Two / Who Wrote That? / Last Word completion and scoreboards; Classic Odd One Out recovery; Hot Seat and Story individual vote flows; Point Blank prediction; balanced-team validation; custom prompt creation and use; crown and replay.
- Browser checks do not substitute for a physical iPhone audio check.
