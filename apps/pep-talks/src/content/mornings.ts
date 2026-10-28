import type { VoiceNote } from '@bestie/core';
import { FREE_MORNINGS } from './brand';

/**
 * Morning notes, 30 to 45 seconds each read aloud, played in order from the day someone joins.
 * DRAFTS in her voice for her to rewrite freely before recording; say them the way she would.
 * `asset` stays null until the recording exists, and the app shows the words meanwhile.
 * After the last one, the cycle restarts at day 2 so nobody hears the welcome twice.
 */
const MORNINGS: { title: string; text: string }[] = [
  {
    title: 'Hi, it’s me',
    text: "Hey bestie! Okay, so this is how it works. Every morning, I'm going to leave you a little voice note, like a friend who's already had her coffee and is way too excited about your day. No homework, no pressure. You just press play while you brush your teeth or wait for the coffee. Today, I only want one thing from you: notice one good thing before lunch. That's it. A nice cloud, a decent parking spot, a dog. Tell me tomorrow. I'm so glad you're here.",
  },
  {
    title: 'You came back',
    text: "You came back! Honestly, that's my favorite part. Day two is where most people drift off, and here you are. So, did you find your good thing yesterday? I hope it was a dog. Today, I want you to say one nice thing to yourself in the mirror. Out loud. I know, I know. It feels silly. Do it anyway. 'You look nice today' counts. 'You're doing your best' counts. Silly is fine. Silly is how good habits start.",
  },
  {
    title: 'The to-do list',
    text: "Morning! Quick question: how long is your to-do list today? Okay, here's my trick. Pick the one thing that would make today feel like a win if it was the only thing you did. Just one. Do that first, before your phone eats your brain. Everything else is a bonus. You are not a machine, you're a person, and people get to have one big thing a day. Go get yours.",
  },
  {
    title: 'Drink some water',
    text: "Hi, bestie. This is your friendly reminder that you are basically a houseplant with feelings. Drink some water. Get some light on your face. Move a little bit. Half the time when I feel like everything's falling apart, I'm just thirsty and I haven't been outside. So before you decide your life is a mess, try the houseplant check first. Water, sunlight, stretch. Then we'll talk.",
  },
  {
    title: 'Comparison',
    text: "Okay, real talk this morning. If you're going to scroll today, and you are, because we all do, remember that everyone is posting their highlight reel. Nobody posts the bit where they cried in the car. So if you start feeling like everyone else has it figured out, they don't. I promise you, they don't. You're comparing your behind-the-scenes to their best take. Be nice to your behind-the-scenes. It's where all the good stuff gets made.",
  },
  {
    title: 'Ask for it',
    text: "Morning, you. Today's challenge: ask for something. A favor, a raise, help with the dishes, a better table, an extra pickle. It doesn't matter what. Most people never ask, so they never get. And the worst thing that happens is someone says no, and then you're exactly where you started, except braver. I want to hear about it. Go ask.",
  },
  {
    title: 'One whole week',
    text: "One whole week of mornings together! Can I just say, I'm proud of you. Seven days of showing up for yourself, even on the days you didn't feel like it. That's not nothing. That's actually the whole thing. You just earned a charm on your bracelet, and nobody can take it away. Now, go have a great day, and maybe treat yourself to a fancy coffee. You've earned it. I'll see you tomorrow.",
  },
  {
    title: 'The hard thing',
    text: "Hey, bestie. Is there something you've been putting off? A phone call, an email, a doctor's appointment? I know there is, because there always is. Here's the deal. Do it before ten a.m. today. Set a timer for ten minutes and just start. Usually the thing takes five minutes, and we've spent three weeks dreading it. Get it off your plate, and feel about ten pounds lighter by lunch.",
  },
  {
    title: 'Your people',
    text: "Morning! Today I want you to text someone you love and haven't talked to in a while. Not a big thing. Just 'thought of you today.' That's it. You'd be amazed what that does for someone. And you know what? It does just as much for you. We all think we're too busy for our people, but our people are kind of the whole point. Go send it. I'll wait.",
  },
  {
    title: 'Messy is fine',
    text: "Hi! Can I tell you a secret? I am not a perfectly put-together person. I lose my keys. I forget birthdays. I have, on more than one occasion, worn my shirt inside out all day. And I still think I'm pretty great. So if today gets messy, that's fine. Messy is normal. Messy is human. You don't need to be perfect to be wonderful. You already are.",
  },
  {
    title: 'Say no',
    text: "Good morning, bestie. Today's word is 'no.' Practice it. 'No, I can't make it.' 'No, that doesn't work for me.' 'No, thank you.' Full sentences, no essay needed. Every time you say yes to something you don't want, you're saying no to yourself. So today, protect your energy. You are allowed to be a little bit selfish with your time. It's yours.",
  },
  {
    title: 'Ten minutes outside',
    text: "Morning! Here's your mission: ten minutes outside today, no phone. Just walk. Around the block, to the corner store, around the parking lot, wherever. Look at the trees. Listen to whatever's going on. I know it sounds too simple to work, but it's basically magic for your brain. Ten minutes. You can do ten minutes. Report back.",
  },
  {
    title: 'You’re allowed to rest',
    text: "Hey, you. If you're tired today, I want you to hear this: rest is not lazy. Rest is not something you have to earn. You don't need to finish everything before you're allowed to sit down. Your body is not a phone you only charge at one percent. So if you need a slow day, have a slow day. The world will still be there after your nap.",
  },
  {
    title: 'Two weeks',
    text: "Two weeks! Two weeks of you and me, every morning. Okay, I'm getting a bit emotional. Seriously though, look at you. Two weeks ago this was a new thing, and now it's just something you do. That's how every good habit starts, one boring little morning at a time. You got another charm. I'm doing a little dance in my kitchen right now. You can't see it. It's very good.",
  },
  {
    title: 'Compliments',
    text: "Morning! Today, give out three compliments. Real ones. Tell the barista you love her earrings. Tell your coworker that was a great idea. Tell your mom her lasagna is the best. It costs nothing, it takes two seconds, and it makes someone's whole day. And here's the sneaky part: when you're busy noticing good things in other people, you start noticing them in yourself too.",
  },
  {
    title: 'The inner critic',
    text: "Hey bestie. That voice in your head that says you're not good enough? Let's give her a name. Something ridiculous. Like Brenda. So when she pipes up today, you can just go, 'Thanks, Brenda, not now.' She's not the boss of you. She's just loud. And you don't have to argue with her. Just let her talk, and carry on being brilliant anyway.",
  },
  {
    title: 'Dress up a bit',
    text: "Morning! Okay, small thing today. Wear something that makes you feel good. The good socks, the nice earrings, the jacket you're saving for a special occasion. Today is the special occasion. Why are we saving our favorite stuff for some day that might never come? Light the candle. Use the fancy plate. Today counts.",
  },
  {
    title: 'Little wins',
    text: "Hi, bestie. Tonight, before you go to sleep, I want you to write down three things you did today. Not big things. 'Made the bed.' 'Replied to that email.' 'Didn't yell at the printer.' We're so quick to list everything we didn't do, and we never give ourselves credit for what we did. So today, keep score of the wins. I bet it's a longer list than you think.",
  },
  {
    title: 'Scared is fine',
    text: "Morning, you. If there's something scary on your plate today, I want you to know: being scared doesn't mean you're not ready. It just means it matters. Everyone you admire was scared doing the thing that made them who they are. Every single one. So be scared, and do it anyway. That's what brave actually is. You've got this.",
  },
  {
    title: 'Forgive yesterday',
    text: "Hey. If yesterday didn't go great, let's leave it there. You don't have to drag it into today. Whatever you said, whatever you didn't do, whatever went sideways, it's done. Today is a whole fresh one. Brand new. Nobody's touched it yet. So take a breath, forgive yesterday's version of you, she was doing her best, and let's start over.",
  },
  {
    title: 'Move your body',
    text: "Morning, bestie! Put on one song you love. One. And dance to it. In the kitchen, in the shower, in the car at a red light. I don't care if you look ridiculous. Actually, I hope you do. Three minutes of moving like nobody's watching will do more for your mood than an hour of scrolling. Go on. Pick your song. Mine's on right now.",
  },
  {
    title: 'Your own best friend',
    text: "Morning! Here's a thought for today. Talk to yourself the way you'd talk to me. If I called you upset because I messed something up, you wouldn't say, 'Wow, you're useless.' You'd say, 'Oh, honey, that happens to everyone.' So say that to yourself today. You deserve a best friend on the inside too.",
  },
  {
    title: 'Look up',
    text: "Hi! Today, I want you to look up. Literally. Look up from your phone on the train, in line, at the lights. Look at the people, the buildings, the sky. We spend so much of our lives looking down. There's a whole world happening at eye level, and you're in it. Look up and notice one thing you've never noticed before.",
  },
  {
    title: 'Money worries',
    text: "Hey bestie. If money's on your mind this morning, you're not alone. Almost everyone worries about it, and almost nobody talks about it. So here's one small step: today, look at one number. Just one. Your balance, a bill, a subscription you forgot about. Looking is the hardest part. Once you've looked, it's a problem you can solve, not a cloud hanging over you.",
  },
  {
    title: 'Good enough',
    text: "Morning! Today's motto is 'good enough is good enough.' The email doesn't need a fourth draft. The dinner doesn't need to be from a cookbook. The workout doesn't need to be an hour. Done is better than perfect, and perfect is mostly a way to never finish anything. So do it good enough, and go enjoy the rest of your day.",
  },
  {
    title: 'Laugh today',
    text: "Hey you! Your only job today is to laugh properly at least once. Like, a real one, a snort if possible. Call the funniest person you know. Watch the video that always gets you. Remember that thing that happened at that wedding. Laughter is the fastest way back to yourself. And if all else fails, picture me trying to parallel park. That should do it.",
  },
  {
    title: 'Be proud',
    text: "Morning, bestie. Think about where you were a year ago. What were you worried about? What did you not know how to do yet? Now look at you. You've survived every hard day you've ever had. That's a perfect record. So today, I want you to be a little bit proud of yourself. Not for anything specific. Just for being you, still here, still trying.",
  },
  {
    title: 'Sleep tonight',
    text: "Hi! This morning, I'm actually thinking about tonight. Try going to bed thirty minutes earlier. Phone across the room, a book or a podcast instead, lights low. I know, revenge bedtime procrastination is real, and the quiet hours feel like the only ones that are yours. But you deserve to wake up tomorrow feeling like a human. Future you is begging.",
  },
  {
    title: 'Dream a little',
    text: "Morning! Okay, let's dream for a second. If nothing could go wrong, what would you do? Start the business, take the trip, learn the thing, move to the place. Say it out loud. Now, what's the tiniest first step? Not the whole plan. Just one step. Google it, email someone, save five dollars. Big dreams are just a lot of tiny steps in a row.",
  },
  {
    title: 'A month together',
    text: "One month! A whole month of mornings with me. I'm honestly so happy. Do you know how rare it is for someone to keep a promise to themselves for thirty days? You did that. Whatever else happened this month, the good days and the lousy ones, you kept showing up. That's a charm for your bracelet, and it's a big one. Thank you for letting me be part of your mornings. Let's keep going.",
  },
];

export const MORNING_NOTES: VoiceNote[] = MORNINGS.map((m, i) => ({
  id: `morning-${i + 1}`,
  title: m.title,
  text: m.text,
  asset: null,
  moments: ['morning'],
  free: i < FREE_MORNINGS,
}));
