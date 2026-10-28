import type { VoiceNote } from '@bestie/core';
import type { FocusId } from './brand';

/**
 * "I need you" moments: tap one and she talks you through it, 30 to 60 seconds. Each moment has
 * three talks that rotate so the same one never plays twice in a row; the first is free.
 * DRAFTS for her to rewrite.
 */
export interface Moment {
  id: string;
  label: string;
  /** One line under the button. */
  hint: string;
  focus: FocusId[];
  talks: string[];
}

export const MOMENTS: Moment[] = [
  {
    id: 'big-day',
    label: 'Big day today',
    hint: 'Interview, audition, first date, presentation',
    focus: ['confidence'],
    talks: [
      "Okay, it's the big day! First, breathe. In for four, hold for four, out for four. Good. Now listen to me. You are not walking in there to beg for anything. You're walking in there to show them what they get if they're lucky. You've prepared, you know your stuff, and even the bits you don't know, you'll figure out. Shoulders back. Smile at the first person you see. Go get it.",
      "Hey, superstar. Nervous? Good. That means you care, and caring is your secret weapon. Here's a trick: your body can't tell the difference between nerves and excitement. Same racing heart, same butterflies. So tell yourself, 'I'm excited.' Say it out loud. Now go in there and be excited. I'll be cheering from right here.",
      "Before you go in, I want you to remember three things you're really good at. Go on, name them. See? Those don't disappear because you're nervous. They come in the room with you. Whatever happens today, you showed up, and that's the part most people never manage. Call me after. I want every detail.",
    ],
  },
  {
    id: 'bad-day',
    label: 'Rough day',
    hint: 'When everything is going sideways',
    focus: ['self-love', 'calm'],
    talks: [
      "Oh, bestie. Come here. Rough days are rough, and I'm not going to tell you to look on the bright side. Sometimes it's just a bad day, and that's allowed. So here's the plan: get through the next hour. Just the next hour. Something warm to drink, something comfy to wear, and permission to do the bare minimum tonight. Tomorrow's a new one. I promise.",
      "Hey. I know today's been a lot. Can I ask you to do one thing? Put your hand on your chest and take three slow breaths. Feel that? That's you, still here, still going, even on a terrible day. That's pretty amazing actually. You don't have to fix everything tonight. You just have to be kind to yourself until bedtime.",
      "Okay, rough day protocol. One: eat something. Real food, not just crackers over the sink. Two: text one person and tell them it's been a bad day. You don't need to explain. Three: early night, no doom-scrolling. Bad days end. This one will too. And I'll be here in the morning with a fresh one.",
    ],
  },
  {
    id: 'anxious',
    label: 'I feel anxious',
    hint: 'Racing thoughts, tight chest, can’t settle',
    focus: ['calm'],
    talks: [
      "Hey, I'm here. Let's slow down together. Find five things you can see. Say them out loud. Now four things you can touch. Three things you can hear. Two things you can smell. One thing you can taste. Okay. You're here, in this room, and you're safe right now. Anxiety tells big stories. You don't have to believe all of them.",
      "Hi, bestie. Breathe with me. In through your nose, slowly, two, three, four. Hold it, two, three, four. And out through your mouth, really slowly, all the way out. Again. Your body thinks there's a lion in the room, and we're just showing it there isn't. One more. There you go. Feeling a little bit better? Stay with me.",
      "Okay, can I tell you what I do when my brain won't stop? I write it all down. Every single worry, as messy as it comes out. Then I look at the list and circle the ones I can actually do something about today. Usually it's one or two. The rest can wait outside. Try it. Paper's better than the inside of your head. And if this feeling sticks around for days, please talk to a doctor or someone you trust. You don't have to carry it alone.",
    ],
  },
  {
    id: 'heartbreak',
    label: 'Heartbroken',
    hint: 'Breakups, ghosting, missing someone',
    focus: ['heartbreak'],
    talks: [
      "Oh, honey. Heartbreak is the worst. It physically hurts, and anyone who says 'just get over it' has clearly never been through it. So you don't have to be over it. Not today. Today you're allowed to be sad, eat the ice cream, and listen to the sad songs. But I want you to remember: the way they treated you is about them. It is not a measure of what you're worth.",
      "Hey you. Do not text them. I mean it. Put the phone down. If you need to write the message, write it in your notes app and don't send it. Then text me, I mean, press this button again. Every day you don't text them is a day you're choosing yourself. And one day, sooner than you think, you'll realize you haven't thought about them since lunch.",
      "Bestie, I know it doesn't feel like it right now, but you're going to be okay. Better than okay. You're going to look back at this and see it as the moment things changed. Make a list of everything you're going to do now that you don't have to compromise. The trip, the haircut, the hobby they thought was weird. Start one this week.",
    ],
  },
  {
    id: 'not-enough',
    label: 'I don’t feel good enough',
    hint: 'Imposter feelings, comparing yourself',
    focus: ['confidence', 'self-love'],
    talks: [
      "Hey. I'm going to stop you right there. You are enough. Not when you lose the weight, not when you get the job, not when you finally have it all figured out. Right now, as you are, today, you are enough. You were enough the day you were born, and nothing you've done since has changed that. Say it with me: I am enough. Again. Good.",
      "Do you know who feels like an imposter? Everyone good. The people who don't worry about being good enough are usually the ones who should. Feeling like a fraud just means you're growing into something bigger than you used to be. That's not a warning sign. That's a growth spurt.",
      "Okay, here's your homework. Find a message or an email where someone said something nice about you. A thank you, a compliment, anything. Screenshot it. Make a folder called 'Proof.' Every time you feel like you're not good enough, open the folder. The evidence is on your side, bestie. It always has been.",
    ],
  },
  {
    id: 'lonely',
    label: 'Feeling lonely',
    hint: 'When nobody seems to get it',
    focus: ['self-love'],
    talks: [
      "Hey, I'm here. Lonely is such a heavy feeling, and it lies to you. It tells you nobody cares, and that's just not true. So let's prove it wrong. Think of one person who'd be happy to hear from you. Send them a message right now. Even just a heart. Connection starts small.",
      "Hi, bestie. Can I tell you something? Some of my loneliest moments were in a room full of people. Lonely isn't about how many people are around you. It's about feeling seen. So today, let someone see you. Tell one person how you're really doing. Not 'fine.' The real answer.",
      "Okay, lonely night plan. Get out of the house if you can, even just to a coffee shop or a library. Being around people, even strangers, helps more than you'd think. And if you can't go out, call someone instead of texting. Voices matter. That's why I'm doing this in voice notes, you know.",
    ],
  },
  {
    id: 'cant-sleep',
    label: 'Can’t sleep',
    hint: 'Wide awake at 2 a.m.',
    focus: ['calm'],
    talks: [
      "Hey, sleepyhead. Or not-so-sleepy head. Let's get you settled. Put the phone face down after this. Close your eyes. Starting at your toes, I want you to squeeze them tight, and let go. Now your calves, squeeze, and let go. Keep going up, all the way to your shoulders, your face. Everything heavy, everything soft. You don't have to sleep. Just rest. Sleep will find you.",
      "Hi, you. Middle of the night thoughts are the worst, aren't they? Everything feels bigger at two a.m. Here's the thing: nothing you're worrying about can be solved right now. It'll all still be there at nine o'clock, smaller and more manageable. So let's park it. Picture putting it all in a box by the door. You can pick it up in the morning.",
      "Okay, try this. Pick a category, like fruit, and go through the alphabet. Apple, banana, cherry. Your brain can't worry and play the alphabet game at the same time. If you get to Z, start again with dog breeds. I've never made it past M. Goodnight, bestie. I'll see you in the morning.",
    ],
  },
  {
    id: 'celebrate',
    label: 'Something good happened!',
    hint: 'Wins big and small, tell me everything',
    focus: ['confidence', 'motivation'],
    talks: [
      "Wait, what? Something good happened? Tell me everything! Okay, I can't actually hear you, but I'm screaming anyway. I am so proud of you. Now, do me a favor: don't rush past this. Don't go 'oh, it was nothing' and move on. Sit in it. Tell someone. Do a little celebration. You earned this.",
      "Yes, bestie! This is what I'm talking about! You know what I love? You worked for this. Maybe nobody else saw all the effort, but I know it was there. So tonight, celebrate. Fancy dinner, dance party, a really good bath, whatever feels like a party to you. Wins deserve a moment.",
      "Okay, I'm so happy for you. Here's a little tradition I want you to start: write this down. The date and what happened. Keep a list of good things. On a rough day, you'll read it and remember that good things happen to you. They just did.",
    ],
  },
  {
    id: 'motivation',
    label: 'I can’t get going',
    hint: 'Stuck on the couch, no energy to start',
    focus: ['motivation'],
    talks: [
      "Okay, bestie, I see you on that couch. No judgment, I've been there. Here's the deal: we're not doing the whole thing. We're doing two minutes. Stand up, put on your shoes, open the laptop, whatever the first tiny step is. Just two minutes. If you want to stop after that, you can. But I bet you won't.",
      "Hey. Motivation is a liar. It says it'll show up first, and then you'll start. Nope. It's the other way around. You start, and then motivation shows up, like five minutes late with a coffee. So don't wait for it. Start badly. Start messy. Just start.",
      "Okay, I'm counting you down. Five, four, three, two, one, up! Go! You're up? Good. Now drink a glass of water and do the very first thing. Not the whole list, the first thing. I'll be right here when you're done, cheering, like always.",
    ],
  },
  {
    id: 'out-dry',
    label: 'Out tonight, not drinking',
    hint: 'Parties, dinners and nights out, alcohol-free',
    focus: ['dry'],
    talks: [
      "Okay, you're heading out and you're not drinking. I love that for you. Here's the plan: get to the bar first and order your own drink, something with lime in a nice glass, so nobody hands you one. If anyone asks, 'I'm doing a thing' is a full answer. And you get to remember every single funny moment tonight. Have fun, bestie.",
      "Hey you! Quick pep talk before you walk in. Remember why you're doing this. Say it in your head right now. Good. Now, give yourself an exit time. If it stops being fun, you're allowed to leave. Nobody remembers who left at ten. But you'll remember waking up feeling amazing tomorrow.",
      "Psst, are you at the party? Go stand near the snacks. Trust me, that's where the good conversations happen anyway. And if you get that moment where everyone's ordering another round and you feel the pull, step outside for a minute, breathe some cold air, and come back in. You've got this. And if you're tracking your dry days, that's another one for the pile.",
    ],
  },
];

/** Every moment talk as a playable note. The first talk of each moment is free. */
export const MOMENT_NOTES: VoiceNote[] = MOMENTS.flatMap((m) =>
  m.talks.map((text, i) => ({ id: `${m.id}-${i + 1}`, title: m.label, text, asset: null, moments: [m.id], free: i === 0, priority: 3 as const })),
);

/** Moments ordered so the ones matching what the user picked in onboarding come first. */
export function momentsFor(focus: readonly string[]): Moment[] {
  const score = (m: Moment) => (m.focus.some((f) => focus.includes(f)) ? 0 : 1);
  return [...MOMENTS].sort((a, b) => score(a) - score(b));
}
