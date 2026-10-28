import type { Clip } from '@bestie/core';

/**
 * The craving button: a 60-second talk from her when the urge hits. DRAFTS for her to rewrite.
 * The first one is free so everyone can feel how the button works.
 */
export interface CravingTalk extends Clip {
  free: boolean;
}

const TALKS: string[] = [
  "Hey. Okay, you pressed the button, which means you're doing exactly the right thing. Let's just breathe for a sec. In through your nose, slowly, and out through your mouth. One more. A craving is like a wave. It can build and ease. There isn’t a fixed timetable. You don't have to fight it. You just have to wait it out with me. Go get a glass of something cold and fizzy, and hold it. I'll still be here.",
  "Hi, you. So it's one of those moments. Can I tell you what I do? I give myself ten minutes. Not forever, just ten. Set a timer. In ten minutes, if you still want it, we'll talk again. Most of the time, by the time it goes off, I'm onto something else. Ten minutes. You can do ten minutes standing on your head.",
  "Okay, real talk. What's going on right now? Are you stressed? Bored? Celebrating? Lonely? Name it out loud. Seriously, say the word. Once you name it, it gets smaller. And then you can give yourself what you actually need, which probably isn't a drink. It's a hug, a snack, a nap, or a good cry. All allowed.",
  "You know what helps me? Changing rooms. Literally. Get up and go to a different room, or step outside for two minutes. Cravings love it when you stay put. Move your body and it loses its grip. Go on, I'll come with you.",
  "Hey, I'm proud of you for pressing this instead of pouring. That's a big deal. Let's play the tape forward. Picture tomorrow morning if you have the drink. Now picture tomorrow morning if you don't. Which morning do you want? Yeah. Me too.",
  "This is your sign to text your buddy. Right now. Just send 'button.' They'll know. You don't have to explain anything. Doing this with someone is the whole secret. Go on, send it, then come back and tell me how they replied.",
  "Okay, snack emergency. A lot of the time a craving is just being hungry or tired wearing a disguise. Eat something with protein, drink a big glass of water, and check in with yourself in fifteen minutes. I bet the disguise falls right off.",
  "Can I remind you of something? You've already done the hardest part, which is starting. Every single dry day you've had still counts, no matter what. Nobody can take those days away. Let's add tonight to the pile.",
  "Let's make something. Grab your nicest glass, put ice in it, and pour in whatever fizzy thing you've got. Add some fruit, a squeeze of lemon, anything. Make it pretty. Now sip it slowly, like you're at the best bar in town. Because honestly? You kind of are.",
  "Hey. If tonight feels like a lot more than a normal craving, if you're really struggling, please reach out to someone. A friend, your doctor, or the free helpline in this app, any time, day or night. Asking for help is the bravest thing in the world. I mean that. And I'm always here when you press the button.",
];

export const CRAVING_TALKS: CravingTalk[] = TALKS.map((text, i) => ({ id: `craving-${i + 1}`, text, asset: null, priority: 3, free: i === 0 }));

/** Next talk to play, rotating so the same one never plays twice in a row. */
export function nextCravingTalk(lastIndex: number | null, premium: boolean): { talk: CravingTalk; index: number } {
  const pool = premium ? CRAVING_TALKS : CRAVING_TALKS.filter((t) => t.free);
  const index = lastIndex == null ? 0 : (lastIndex + 1) % pool.length;
  return { talk: pool[index], index };
}
