# Play against Hannah & Lamorne — first pack

## Format built
One phone, one group team, five questions. Choose → lock → reveal → score. Correct answers give the group one point; mistakes give the hosts one. Five questions guarantee a winner. No accounts, names, microphone, or live connection needed. Main party-game scores remain separate.

The sample uses generic puzzles, explicitly not the hosts’ answers or words. The recorded pack requires five unique, valid, approved questions with audio references. Replay currently repeats the same five questions.

## First real pack: three preferences, two stories
These are interview prompts, not claims about either host. They choose the real answers and can revise the options.

1. Hannah: At a party, which would you actually do? A: Arrive early and help. B: Find one person and talk all night. C: Get everyone playing something. D: Leave without saying goodbye.
2. Lamorne: What annoys you most on a trip? A: No plan. B: Too much planning. C: Someone always late. D: Someone choosing all the music.
3. Hannah: What is your game-night role? A: Competitive rule reader. B: Chaos creator. C: Quiet strategist. D: Snack coordinator.
4. Lamorne: Supply a 15–25-second anecdote that is either true or completely invented. Players choose “Real” or “Made up.” Record the answer separately.
5. Hannah: Same story format, using her own anecdote and separate reveal.

Never invent autobiographical answers for them. Both should be comfortable publishing the content.

## Recording session
Record two preferences and one story per host (six cards); choose the strongest five. Allow approximately 15–20 minutes including pickups.

For each card record:
- Prompt: question or story without revealing the answer.
- Reveal: “I picked [option]. [One or two sentences explaining why.]” Or “That was [real/made up]. [Explanation.]”
- Two natural takes. Two seconds of silence before and after. Separate prompt and reveal files.

Keep a content sheet: unique ID, host, question, options, correct option, exact reveal transcript, audio filename, approval status.

Proposed reusable opening: “It’s your room against us. Five questions. Get it right, you score. Get it wrong, we do. Agree on an answer before you lock it in.”

Proposed paired ending: Hannah: “They know us a little too well.” Lamorne: “I’m changing my answers next time.” These are drafts for approval, not existing quotations.

## Integration
Populate RECORDED_QUESTIONS in apps/party-game/src/content/hostChallenge.ts. Add bundled require() audio references, exact captions, and approved answers. Validation checks answer bounds, unique options and IDs, approval, and audio presence; it does not verify facts or recording quality.

Implemented: text questions, locked guesses, recorded reveal playback, captions/replay, team scoring, results and replay. Recorded prompt and paired-ending playback are not yet implemented; capture those assets for the next iteration. Keep story transcripts available for sound-off play.

## Test and limits
Run a group session without explaining the UI. Test both wins/losses and actual iPhone audio after recordings arrive. This is a recorded challenge, not live interaction. No synthetic voice is used. Leaving/reloading resets this challenge; its Exit control warns first. Existing party-game progress is separate.
