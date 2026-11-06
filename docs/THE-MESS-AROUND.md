# The Mess Around

November 4, 2026. Working app redesign, formerly Bestie Night.

## Product direction
Hannah and Lamorne host a collection of five social games on one phone. Original vector game pieces, warm cream, ink, purple, and distinct game colors replace the numbered utility-card layout. Big prompts and one clear action per game step take priority. Heads Up is a reference for quick entry and readable prompts, not copied artwork or mechanics.

Quick Play defaults to Point Blank. Select 3–10 players; no names required. Existing names are retained, additional players get numbered names. Each game tile also starts directly with one rules screen. The full five-game mode is secondary. Family is the free default; Friends remains entitlement-gated. Bundle identifier, deep-link scheme, storage keys, and product IDs remain stable to preserve existing installs and data.

## Hosts and recording
The home page names Hannah + Lamorne. Host captions attribute individual lines. `speakerFor` defines recording assignments: countdown and variant 2 lines belong to Lamorne, other variants to Hannah. Each existing clip ID remains stable for asset mapping. All recordings are currently missing; script preview remains explicit. These are proposed scripts, not quotations or generated celebrity audio.

Record each assigned line as a separate clean take, with an alternate delivery. Keep game rules and timer beats precise; reactions can be freer. Add recorded files via the existing clip asset field. Before launch, review each line with both hosts, balance the assignments, record a joint welcome, and audition timer playback on device.

## Gameplay fixes
- Odd One Out locks the bonus guess before revealing the word.
- Hot-seat/story games give every player a turn, including groups above four.
- Pause uses a modal, preserving the mounted turn and freezing timers. Ending the game explicitly discards scores.
- Completion callbacks reject repeat taps for a given turn. Engine rejects awards outside the turn phase and ignores invalid/negative points.

## Validation
23 automated rules/content tests pass, including all five games, full-night progression, repeated single games, final-round multiplier, tie handling, ten-player storytelling, duplicate completed-round awards, and invalid points. TypeScript check passes. iOS and web production exports pass.

Browser smoke-tested a complete turn in each game: Point Blank vote/story; Bestie Test matching secret answer; Odd One Out escaped-player bonus before reveal; Real or Made Up fooled-group outcome; Last Word timer expiry and holder selection. Verified pause/resume preserves the story timer at 45 seconds. Reviewed the home layout at 390px width. This is not physical iPhone validation.

## Remaining limits
An app reload/termination still restarts the current turn; round scores persist. Host recordings, native haptics/audio, app-background behavior, and real payments need device testing. Playtest content and scoring with a real group: Bestie Test awards the whole group, so it functions as a cooperative breather, not a ranking differentiator. App icon/splash artwork and store listing assets are still a separate release task.
