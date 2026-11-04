# The Mess Around — game and host direction

The games are workable party formats. Passing software tests does not establish that a room finds them funny. The opportunity is stronger host chemistry, sharper pacing, and balanced scoring—not more games.

| Game | Assessment | Next direction |
|---|---|---|
| Point Blank | Strongest icebreaker. Story/forfeit steps can drag. | Keep as the default. Encourage brief explanations; consider a free pass and optional no-score mode. Avoid forfeits involving private phone content. |
| Bestie Test | Personal and easy, but loud players can dominate the consensus. Everyone scoring equally never changes standings. | Clearly cooperative for now. Prototype simultaneous A/B/C/D finger votes and points for each correct guesser. |
| Odd One Out | Strong tension and replay value; most setup friction. | Use a concrete example. Test with 4–8 people first; agree one suspect when votes tie. |
| Real or Made Up | Funny with confident storytellers; harder for strangers. Some truth prompts do not fit a player’s experience. | Allow a no-pressure skip. Later try real host-recorded stories as a warm-up. |
| Last Word | Clearest action loop and strongest physical energy. | Remove pass-button busywork. Invalid/repeated answer means keep holding until a valid answer. |

## Implemented
The supplied square podcast cover replaces the text masthead, preserving the full title and both hosts. Cream and blue echo the art. No additional splash screen or tap before play.

Introductions now include examples and scoring. Six outcome-specific host reactions are wired into public moments, with honest draft-caption fallback. Last Word no longer has meaningless pass taps. Real or Made Up has a skip and no longer suggests stretching a true memory. A misattributed welcome is corrected.

## How the hosts become part of the game
- Short reactions to actual outcomes: a wrong answer, a successful bluff, a comeback. Do not interrupt secrets, discussion, or the active timer.
- Occasional paired exchanges between rounds. Avoid repeating the same banter every turn.
- Best proposed signature feature: “Play against the hosts.” Hannah and Lamorne privately record preference answers and true/false stories. Players guess before hearing the authentic answer. This requires new content and implementation; never invent autobiographical answers for them.
- Record reusable reactions first. Prompt-by-prompt narration can follow if playtests justify it.

## Recording addendum
New proposed lines, not actual quotations. About two minutes for two takes each. The previous 30-minute script remains usable.

- Hannah — `react-story-hannah`: “There is clearly a story here. We’re listening.”
- Lamorne — `react-match-lamorne`: “Okay, you actually know each other. I respect it.”
- Hannah — `react-miss-hannah`: “You were so confident. That’s what makes this special.”
- Lamorne — `react-fooled-lamorne`: “You bought that? Every word? Incredible.”
- Hannah — `react-caught-hannah`: “Caught. The details were doing a little too much.”
- Lamorne — `react-escape-lamorne`: “You got away with it. Now, do you actually know the word?”

## Playtest
Test with 3, 5, and 8 people, including newcomers. Give no coaching initially. Measure time to first play, questions about rules, stalled handoffs, accidental reveals, skipped prompts, and requests for another round. Ask which game they would choose again. Test family and friends groups separately.

The five-game competition needs balancing: cooperative Bestie Test does not alter score gaps, whereas bluffing can. Individual voting and the host-answer pack are proposals, not implemented features. Recordings and physical-phone audio/background testing remain outstanding. Reloading restarts the current turn.
