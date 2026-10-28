import type { Clip } from '@bestie/core';

/**
 * Evening check-ins, one per day of the challenge, about 30 seconds each when read aloud. These are
 * DRAFTS in her voice for her to rewrite freely before recording; say them the way she would.
 * `asset` stays null until the recording exists, and the app shows the words as a caption meanwhile.
 */
export interface CheckIn extends Clip {
  day: number;
  /** Free users hear the first few nights; the rest come with Premium. */
  free: boolean;
}

const LINES: string[] = [
  // 1
  "Day one! Okay, I'm proud of you already, and I mean that. The first night is the weird one. Your hands don't know what to do at six o'clock. So give them something: a fancy glass, sparkling water, a lime. Make it look like a treat, because it is. Tell me how tonight went when you're ready.",
  // 2
  "Day two. Fun fact: yesterday's version of you made a promise, and today's version kept it. That's the whole game. Nobody's asking you to be perfect forever, just tonight. Tonight you're doing great.",
  // 3
  "Three days! This is usually when your brain starts bargaining. 'Just one, it's fine.' Totally normal. You don't have to argue with it. Just say, 'Noted,' and go make a snack. Bargaining is a sign it's working.",
  // 4
  "Day four. Can I tell you something? The night I first tried this, I thought I'd be so boring. Turns out I'm just as annoying sober. Maybe more. Your personality isn't in the glass. It's been you this whole time.",
  // 5
  "Day five, and it's probably close to the weekend. Weekends are the boss level. Here's a trick: plan the first hour of every night out. Order your drink before anyone asks. Have your exit line ready. You're not hiding anything. You're just prepared.",
  // 6
  "Day six. Check in with your sleep tonight. A lot of people notice they wake up less at three a.m. by now. If you haven't yet, give it a few more days. Your body's doing quiet work in the background.",
  // 7
  "One whole week! Stop what you're doing and do a little dance. I'll wait. Seven days is real. That's a patch, and nobody can take it from you, whatever happens next. I'm so happy for you.",
  // 8
  "Day eight. The excitement of week one wears off around now, and it can feel a bit flat. That's okay. Flat is fine. Flat is what normal feels like before it starts feeling good. Stay with me.",
  // 9
  "Day nine. Tonight, think about what you're actually craving. Is it the drink, or is it the pause? The 'I'm off the clock now' feeling? Because you can have the pause without the drink. A bath, a walk, a terrible TV show. You've earned the pause.",
  // 10
  "Ten days. Double digits! Somebody might have asked you this week why you're not drinking. You don't owe anyone a speech. 'I'm doing a thing' is a complete sentence.",
  // 11
  "Day eleven. Quick one tonight: drink a big glass of water, put your phone across the room, and go to bed ten minutes early. Future you says thank you.",
  // 12
  "Day twelve. Have you peeked at the money you've saved? Go look, it's on your home screen. Now pick something small to spend a bit of it on. Not a lecture, a reward. You're allowed to like this.",
  // 13
  "Day thirteen. If today was hard, I want you to know hard days count exactly the same as easy ones. Maybe more. You did it on a hard day. That's the stuff.",
  // 14
  "Two weeks! That's a real stretch of time. You've done a whole fortnight of evenings, dinners, maybe a party or two. Look at you. Another patch for the collection.",
  // 15
  "Day fifteen, halfway through the month. Here's my halfway question: what surprised you? Write one line about it in tonight's check-in. You'll love reading it later.",
  // 16
  "Day sixteen. Let's talk about the friend who says 'Come on, just one.' They usually mean well. They just miss you at the bar. Invite them to something different: a movie, a walk, breakfast. You get your friend, and they get theirs.",
  // 17
  "Day seventeen. Tonight's mission: make yourself the fanciest mocktail you can with whatever's in the fridge. Garnish it like you're on a cooking show. Then take a picture and send it to your buddy.",
  // 18
  "Day eighteen. Your skin might be thanking you about now. Or your mornings. Or your wallet. Pick one good thing and say it out loud. Yes, out loud. It feels silly, and it works.",
  // 19
  "Day nineteen. If you slipped at some point, I'm not going anywhere, and neither is your progress. Every dry day still counts. Tonight is a fresh one. Let's just do tonight.",
  // 20
  "Day twenty. You're getting good at this. Like, actually good. The six o'clock moment is shorter now, isn't it? That's your brain learning a new routine. That's you doing that.",
  // 21
  "Three weeks! They say it takes about this long to break a habit. I don't know if that's science, but it's a nice story, and you're living it. Habit Breaker patch, unlocked.",
  // 22
  "Day twenty-two. Tonight, text someone you love just to say hi. No reason. Evenings feel different when they're full of people instead of pours.",
  // 23
  "Day twenty-three. Fun idea: think about where you want this to go after the month ends. More dry days? Only weekends? Just being more choosy? There's no wrong answer. You get to decide, and that's the point.",
  // 24
  "Day twenty-four. You're in the home stretch. Keep doing the boring stuff: water, sleep, snacks, your buddy. Boring is what's getting you there.",
  // 25
  "Day twenty-five. Can I brag about you for a second? Twenty-five evenings where you made a choice and stuck with it. I know people who can't stick with a show for twenty-five episodes.",
  // 26
  "Day twenty-six. If there's a celebration coming up, plan your drink now. Something with bubbles in a nice glass. You'll toast just as loud. Probably louder.",
  // 27
  "Day twenty-seven. Tonight, look back at your check-in notes from week one. Notice how far you've come. I'm a little teary, honestly.",
  // 28
  "Day twenty-eight. Four whole weeks. A month's worth of Mondays and Fridays. You're not white-knuckling anymore, are you? You're just living.",
  // 29
  "Day twenty-nine. Almost there. Whatever happens on day thirty-one, you've proven you can do something hard for a long time. That's not small. Hold onto that.",
  // 30
  "Day thirty. One more sleep! I want you to plan something nice for tomorrow. Breakfast out, a long walk, a new book. Something your past self would've been too tired for.",
  // 31
  "Day thirty-one. You did it! A whole month. Dry Month patch, yours forever. However you choose to go from here, you know now that you're the one in charge. I am so, so proud of you. Thank you for letting me come along.",
];

export const CHECKINS: CheckIn[] = LINES.map((text, i) => ({ id: `checkin-${i + 1}`, day: i + 1, text, asset: null, free: i < 3 }));

/** After day 31 the nightly notes cycle from the beginning of week two. */
export function checkInForDay(day: number): CheckIn {
  if (day <= CHECKINS.length) return CHECKINS[Math.max(0, day - 1)];
  const loopStart = 7;
  const span = CHECKINS.length - loopStart;
  return CHECKINS[loopStart + ((day - CHECKINS.length - 1) % span)];
}

export const BEFORE_START: Clip = {
  id: 'checkin-before',
  text: "Hi! We haven't started yet, but I'm so glad you're here. Use these last few nights to get ready: stock the fridge with something fizzy, tell one person you trust, and pick your buddy. See you on day one.",
  asset: null,
};
