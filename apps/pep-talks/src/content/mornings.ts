import type { VoiceNote } from '@bestie/core';
import { FREE_MORNINGS } from './brand';

/**
 * Morning notes, 30 to 45 seconds each read aloud, played in order from the day someone joins.
 * DRAFTS in her voice for her to rewrite freely before recording; say them the way she would.
 * `asset` stays null until the recording exists, and the app shows the words meanwhile.
 * Notes marked [STORY PROMPT] are hers to fill with a real story of her own (no show quotes or
 * character names). After the last one, the cycle restarts at day 2 so nobody hears the welcome twice.
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
  {
    title: "Hype yourself up",
    text: "Morning, bestie! Today I need you to be your own hype girl. Before you leave the house, look in the mirror and say, out loud, 'Let's go!' Like you're about to walk out to a stadium. Arms up if you want. Your neighbors might hear. Good. Let them wonder what you're about to do, because it's going to be great.",
  },
  {
    title: "Story time: my first big day",
    text: "[STORY PROMPT, her real story: a time she was terrified walking into something big, an audition, a first day on set, a table read, and what got her through it. 30 to 45 seconds. End with:] So if you've got a big day coming, remember, I was shaking too. You go in anyway.",
  },
  {
    title: "Weird is good",
    text: "Hi! Okay, today's reminder: your weird is your best thing. The laugh that's too loud. The thing you collect. The songs you know every word to that nobody else has heard of. The people who love you, love you because of the weird, not in spite of it. So don't sand yourself down today. Be a little bit extra. It suits you.",
  },
  {
    title: "Unfollow day",
    text: "Morning, bestie. Quick spring clean. Open your phone and unfollow three accounts that make you feel bad about yourself. You know the ones. The perfect kitchens, the perfect abs, the perfect everything. You don't owe them your attention. Fill your feed with people who make you laugh and feel good. Your brain will thank you by lunchtime.",
  },
  {
    title: "Call your person",
    text: "Hey you. Today, instead of texting, call someone. An actual phone call. I know, terrifying. But hearing a voice you love does something a text never will. Ask them how they really are, and then actually listen. Ten minutes. You'll both hang up feeling better, I promise.",
  },
  {
    title: "Celebrate someone else",
    text: "Morning! Today, celebrate someone else's win. Your friend got the job? Send her flowers, or a voice note screaming. Your coworker crushed the presentation? Tell them, and tell their boss. Being genuinely happy for other people is a superpower, and it makes the world feel a lot less like a competition. There's enough good stuff for everyone.",
  },
  {
    title: "Six weeks",
    text: "Six weeks of mornings! Do you realize you've been doing this longer than most New Year's resolutions last? I'm serious. Most of those are gone by February. And here you are, still pressing play. That's who you are now. Someone who keeps her promises to herself. I'm really proud of you, bestie.",
  },
  {
    title: "Feel your feelings",
    text: "Hi, bestie. If something's bugging you today, don't push it down. Feelings are like beach balls. You can hold them under the water for a while, but eventually they pop up and smack you in the face. So feel it. Cry in the car if you need to. Then wipe your face, put on your sunglasses, and carry on. Very glamorous.",
  },
  {
    title: "Plan something fun",
    text: "Morning! When's the last time you had something fun on the calendar? Something just for you? Not a work thing, not an obligation. Today, plan one thing to look forward to. Dinner with a friend, a movie, a hike, a day trip. Having something to look forward to is half the fun. Put it in your calendar right now.",
  },
  {
    title: "The apology",
    text: "Hey you. Is there someone you owe an apology to? Or someone you're waiting on an apology from? Here's a thought: you can go first. Not because you were wrong, necessarily, but because the friendship matters more than being right. A simple 'I'm sorry, I miss you' fixes more than you'd think.",
  },
  {
    title: "Main character energy",
    text: "Good morning, bestie! Today you're the main character. Put on your headphones, pick a soundtrack, and walk to wherever you're going like you're in the opening scene of a movie. Slow motion optional. Hair flip encouraged. Life is a lot more fun when you treat it like the good part of the film.",
  },
  {
    title: "Your body is not a project",
    text: "Morning, you. A little reminder: your body is not a before picture. It's not a project you have to finish before you're allowed to enjoy your life. It carries you around, it hugs the people you love, it dances badly in the kitchen. Be nice to it today. Feed it something good, move it a little, and say thank you.",
  },
  {
    title: "Boundaries are love",
    text: "Hi, bestie. Today let's talk boundaries. A boundary isn't a wall to keep people out. It's a gate that tells people how to come in. 'I don't answer work emails after seven.' 'I need a heads-up before you come over.' People who love you will respect them. And the ones who don't? Well, that's useful information too.",
  },
  {
    title: "Story time: a friend who showed up",
    text: "[STORY PROMPT, her real story: a friend who showed up for her when she needed it, on set or off, and what they did. 30 to 45 seconds. End with:] Be that friend for someone this week. And let someone be that friend for you.",
  },
  {
    title: "Fifty mornings soon",
    text: "Morning! We're getting close to fifty mornings together, and honestly, I'm a little emotional about it. You know what I've noticed? You're the kind of person who keeps going. Even when it's boring, even when life gets loud. That's a rare thing, and I hope you know how much it counts.",
  },
  {
    title: "Try something new",
    text: "Hey bestie! Today, try one new thing. A new coffee order, a new route to work, a new recipe, a new song. Tiny new things wake your brain up. We get so stuck in the same loop that the days blur together. So break the loop a little. Report back on the coffee.",
  },
  {
    title: "Let it be easy",
    text: "Hi, you. What if today was easy? What if you didn't have to make it hard? Sometimes we make things complicated because we think hard means worthy. It doesn't. Take the shortcut. Ask for help. Order the takeout. Let something be easy today. You don't get extra points for suffering.",
  },
  {
    title: "Fifty and fabulous",
    text: "Fifty mornings! Fifty! Okay, I'm officially throwing you a party. In my head. There's cake. Seriously though, fifty mornings is a real thing, and you did it one ordinary day at a time. There's a new charm on your bracelet, and I hope you're as proud of yourself as I am of you.",
  },
  {
    title: "Nobody's thinking about it",
    text: "Morning, bestie. That embarrassing thing you said last week? The one you replayed in the shower? Nobody's thinking about it. Truly. Everyone's way too busy replaying their own embarrassing thing. So you can let it go. You're free. Go be gloriously awkward today.",
  },
  {
    title: "Help someone",
    text: "Hey you. Today, help someone with no reason. Hold the door, carry the bag, let someone go ahead in line, leave a nice note. Helping someone else is the fastest way out of your own head. And it's sneaky: they feel good, you feel good, and the whole day gets a little bit kinder.",
  },
  {
    title: "Story time: the worst day on set",
    text: "[STORY PROMPT, her real story: a day at work that went completely wrong, a blooper, a mistake, a disaster, and how she laughed about it later. 30 to 45 seconds. End with:] So if today goes sideways, give it a few weeks. It'll be your favorite story.",
  },
  {
    title: "You're a good friend",
    text: "Morning! I want to tell you something you probably don't hear enough: you're a good friend. You remember things. You show up. You care, even when you're tired. The people in your life are lucky to have you. And today, I hope someone tells you that. If not, I just did.",
  },
  {
    title: "Phone-free hour",
    text: "Hi, bestie! Challenge for today: one hour with no phone. Put it in a drawer, in another room, anywhere you can't reach it. Read, cook, walk, stare at a wall. At first it'll feel weird, like you've lost an arm. Then it feels like a vacation. One hour. You can do it.",
  },
  {
    title: "You're allowed to want more",
    text: "Hey you. It's okay to want more. More money, more love, more adventure, more rest. Wanting more doesn't make you ungrateful. You can love your life and still want to grow. So today, write down one thing you want more of. Just name it. Wants you name are wants you can chase.",
  },
  {
    title: "Breakfast is a love language",
    text: "Morning! Did you eat breakfast? Real breakfast, not three sips of coffee in the car? Go eat something. Eggs, toast, fruit, cereal, leftover pizza, I'm not the breakfast police. You can't pour from an empty cup, and you definitely can't pour from an empty stomach. I'll wait.",
  },
  {
    title: "Be the friend you need",
    text: "Hi, bestie. Think about what you needed to hear last time you were having a hard time. Got it? Now find someone in your life who might need to hear that today, and tell them. The things we needed most are usually the things someone else needs right now too.",
  },
  {
    title: "Story time: what friendship taught me",
    text: "[STORY PROMPT, her real story: something a long friendship taught her, about forgiveness, showing up, growing apart and back together. 30 to 45 seconds. End with:] Your people are the whole point. Go tell one of them.",
  },
  {
    title: "Joy is productive",
    text: "Morning, bestie! Today, do something just because it's fun. Not because it's good for you, or productive, or for your goals. Just fun. Color, swing on a swing, watch cartoons, bake cookies, sing badly. Joy isn't a waste of time. It's the reason we're doing all the rest of it.",
  },
  {
    title: "Almost two months",
    text: "Hey you. Almost two months of mornings together. I want you to look back at the first week. Remember how new this felt? Now it's just part of your day. That's how change actually happens, not with a big dramatic moment, but with lots of small mornings like this one. You're doing it.",
  },
  {
    title: "Two months of us",
    text: "Two months! Sixty mornings with me. I'm genuinely so grateful you let me be part of your days. Every single morning, you chose to start with a little kindness, and that adds up. Here's to the next sixty. I'll be right here, every morning, cheering you on like always. Love you, bestie.",
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
