import type { DeckId, GameId } from '@/game/night';

/**
 * Every card in the game. Cards show on screen and are never recorded, so new decks need no
 * studio time. Family is free and fine for all ages; Friends is part of the VIP Pass and is cheeky
 * but still 12+ (no drinking, no sex, no cruelty). All wording is original.
 */
export interface Deck {
  id: DeckId;
  name: string;
  blurb: string;
  vip: boolean;
}

export const DECKS: readonly Deck[] = [
  { id: 'family', name: 'Family', blurb: 'All ages. Grandma can play.', vip: false },
  { id: 'friends', name: 'Friends', blurb: 'Cheekier, more personal, still nothing you can’t say at brunch.', vip: true },
];

export interface PromptCard {
  id: string;
  text: string;
}

export interface WordCard {
  id: string;
  category: string;
  word: string;
}

export interface ChoiceCard {
  id: string;
  question: string;
  options: [string, string, string, string];
}

const prompts = (prefix: string, list: string[]): PromptCard[] => list.map((text, i) => ({ id: `${prefix}-${i + 1}`, text }));

const words = (prefix: string, groups: Record<string, string[]>): WordCard[] =>
  Object.entries(groups).flatMap(([category, list], g) => list.map((word, i) => ({ id: `${prefix}-${g + 1}-${i + 1}`, category, word })));

const choices = (prefix: string, list: [string, string, string, string, string][]): ChoiceCard[] =>
  list.map(([question, a, b, c, d], i) => ({ id: `${prefix}-${i + 1}`, question, options: [a, b, c, d] }));

// ---------- Point Blank: "Who's most likely to…" ----------

const POINT_BLANK: Record<DeckId, PromptCard[]> = {
  family: prompts('pb-fam', [
    'Who’s most likely to cry at a dog food commercial?',
    'Who’s most likely to get lost in their own neighbourhood?',
    'Who’s most likely to win a reality show?',
    'Who’s most likely to talk their way out of a parking ticket?',
    'Who’s most likely to adopt five cats in one weekend?',
    'Who’s most likely to show up to the wrong party?',
    'Who’s most likely to become accidentally famous?',
    'Who’s most likely to start a business that sells one weird thing?',
    'Who’s most likely to fall asleep during their own birthday party?',
    'Who’s most likely to survive a zombie movie?',
    'Who’s most likely to be the first one out in a zombie movie?',
    'Who’s most likely to have a secret talent nobody knows about?',
    'Who’s most likely to spend an hour picking a show and then not watch it?',
    'Who’s most likely to argue with a GPS?',
    'Who’s most likely to wave back at someone who wasn’t waving at them?',
    'Who’s most likely to have 4,000 unread emails?',
    'Who’s most likely to own a costume for every holiday?',
    'Who’s most likely to laugh at the worst possible moment?',
    'Who’s most likely to bake something for no reason at all?',
    'Who’s most likely to know every word to a song they claim to hate?',
    'Who’s most likely to name their car?',
    'Who’s most likely to get a little too competitive at a kids’ game?',
    'Who’s most likely to leave a party without saying goodbye?',
    'Who’s most likely to still be talking when the lights go off?',
    'Who’s most likely to plan a trip down to the minute?',
    'Who’s most likely to be late to their own wedding?',
    'Who’s most likely to befriend the waiter by the end of dinner?',
    'Who’s most likely to keep a plant alive for ten years?',
  ]),
  friends: prompts('pb-fr', [
    'Who’s most likely to text their ex “happy birthday” at 1 a.m.?',
    'Who’s most likely to have a fake name for coffee orders?',
    'Who’s most likely to go on a date just for the free dinner?',
    'Who’s most likely to have a burner account to watch someone’s stories?',
    'Who’s most likely to fake being sick to skip a group dinner?',
    'Who’s most likely to fall for someone in one conversation?',
    'Who’s most likely to have a screenshot of everything?',
    'Who’s most likely to cry in a work meeting and own it?',
    'Who’s most likely to accidentally like a three-year-old photo?',
    'Who’s most likely to be the main character in a group chat drama?',
    'Who’s most likely to get kicked out of a museum?',
    'Who’s most likely to ghost a group chat they started?',
    'Who’s most likely to pretend they’ve read the book?',
    'Who’s most likely to reply-all by accident?',
    'Who’s most likely to have a five-year plan in a notes app?',
    'Who’s most likely to start a rumour by mistake?',
    'Who’s most likely to flirt their way to a free upgrade?',
    'Who’s most likely to fake a phone call to escape a conversation?',
    'Who’s most likely to have a secret celebrity crush they’d never admit?',
    'Who’s most likely to say “I’m five minutes away” from their shower?',
  ]),
};

// ---------- Odd One Out: secret word, one player only sees the category ----------

const ODD_ONE_OUT: Record<DeckId, WordCard[]> = {
  family: words('oo-fam', {
    'At the beach': ['Sunscreen', 'Lifeguard', 'Sandcastle', 'Seagull', 'Flip-flops', 'Cooler'],
    'In the kitchen': ['Toaster', 'Spatula', 'Fridge magnet', 'Oven mitt', 'Blender', 'Cutting board'],
    Animals: ['Penguin', 'Giraffe', 'Octopus', 'Hedgehog', 'Flamingo', 'Kangaroo'],
    'Things at a wedding': ['Bouquet', 'Cake', 'Speech', 'Dance floor', 'Ring', 'Veil'],
    'Jobs': ['Dentist', 'Pilot', 'Chef', 'Firefighter', 'Librarian', 'Magician'],
    'At the airport': ['Passport', 'Security line', 'Luggage', 'Boarding pass', 'Gate', 'Neck pillow'],
    'Foods': ['Pancakes', 'Tacos', 'Sushi', 'Popcorn', 'Lasagna', 'Watermelon'],
    'Sports': ['Tennis', 'Bowling', 'Surfing', 'Hockey', 'Golf', 'Ballet'],
    'Around the house': ['Couch', 'Doorbell', 'Laundry basket', 'Bathtub', 'Lamp', 'Bookshelf'],
    'Weather': ['Thunder', 'Rainbow', 'Fog', 'Snowflake', 'Heat wave', 'Hail'],
  }),
  friends: words('oo-fr', {
    'First dates': ['Awkward hug', 'Splitting the bill', 'Mini golf', 'Small talk', 'Nervous laugh', 'Goodnight text'],
    'Group chats': ['Voice note', 'Typing bubble', 'Muted', 'Inside joke', 'Left on read', 'Poll'],
    'Bad habits': ['Snoozing', 'Nail biting', 'Doomscrolling', 'Overpacking', 'Late replies', 'Online shopping'],
    'At a sleepover': ['Face mask', 'Prank call', 'Pillow fort', 'Truth or dare', 'Popcorn fight', 'Ghost story'],
    'Things in a bag': ['Lip balm', 'Receipts', 'Hair tie', 'Charger', 'Gum', 'Sunglasses'],
    'Road trip': ['Playlist', 'Gas station snacks', 'Wrong turn', 'Car nap', 'Toll booth', 'Motel'],
  }),
};

// ---------- Bestie Test: four options about the player in the hot seat ----------

const BESTIE_TEST: Record<DeckId, ChoiceCard[]> = {
  family: choices('bt-fam', [
    ['Their perfect Sunday?', 'Sleeping in', 'Big brunch', 'Outdoors all day', 'Couch and a series'],
    ['Their go-to pizza?', 'Plain cheese', 'Pepperoni', 'Everything on it', 'Pineapple, proudly'],
    ['If they won a free trip, where to?', 'A beach', 'A big city', 'The mountains', 'Somewhere they’ve never heard of'],
    ['Their superpower of choice?', 'Flying', 'Invisibility', 'Reading minds', 'Never needing sleep'],
    ['What would they grab in a fire (people and pets are safe)?', 'Phone', 'Photo albums', 'A favourite outfit', 'The snacks'],
    ['Their morning drink?', 'Coffee', 'Tea', 'Juice or a smoothie', 'Water, they’re a saint'],
    ['How do they pack for a trip?', 'A list, a week early', 'The night before', 'Twenty minutes before leaving', 'Somebody else packs'],
    ['Their dream pet?', 'A big dog', 'A cat', 'Something with scales', 'No pets, thank you'],
    ['What’s their karaoke move?', 'A power ballad', 'A rap', 'A duet', 'They hide in the bathroom'],
    ['What would they be famous for?', 'Acting', 'Cooking', 'Sports', 'Something very strange'],
    ['Their favourite season?', 'Spring', 'Summer', 'Fall', 'Winter'],
    ['At a buffet, they go straight for…', 'The salad', 'The meat', 'The pasta', 'Dessert first'],
    ['What scares them most?', 'Spiders', 'Heights', 'Public speaking', 'The dark'],
    ['Their ideal movie night?', 'Comedy', 'Scary movie', 'Big action', 'A cry-fest'],
    ['How do they answer an unknown number?', 'Pick up straight away', 'Let it ring out', 'Google it first', 'Phone? Who calls?'],
    ['Which chore do they hate most?', 'Dishes', 'Laundry', 'Vacuuming', 'Taking out the trash'],
  ]),
  friends: choices('bt-fr', [
    ['Their texting style?', 'Paragraphs', 'One word at a time', 'All emoji', 'Voice notes only'],
    ['How do they act on a first date?', 'Asks all the questions', 'Tells all the stories', 'Overthinks every word', 'Totally at ease'],
    ['What do they do when they’re upset?', 'Talk it out right away', 'Go quiet', 'Clean everything', 'Call their best friend'],
    ['Their biggest weakness?', 'Online shopping', 'Saying yes to everything', 'Being late', 'Holding a grudge'],
    ['What would their autobiography be called?', 'I Can Explain', 'Running Late', 'Main Character', 'Plot Twist'],
    ['Their red flag?', 'Never replies', 'Replies too fast', 'Always “fine”', 'Knows their horoscope too well'],
    ['How do they handle an awkward silence?', 'Fill it with a story', 'Ask a question', 'Check their phone', 'Enjoy it, honestly'],
    ['At a party they are…', 'The DJ', 'In the kitchen', 'Talking to the pet', 'The first to leave'],
    ['What do they secretly love?', 'Reality TV', 'Musicals', 'True crime', 'Celebrity gossip'],
    ['Their love language?', 'Gifts', 'Quality time', 'Words', 'Doing chores for you'],
    ['How long to get ready for a night out?', '10 minutes', '30 minutes', 'An hour', 'Start yesterday'],
    ['If they had to go on a reality show, which kind?', 'Dating', 'Cooking', 'Survival', 'Home makeover'],
  ]),
};

// ---------- Real or Made Up: storytelling prompts ----------

const REAL_OR_MADE_UP: Record<DeckId, PromptCard[]> = {
  family: prompts('rm-fam', [
    'The worst gift you ever got.',
    'A time you got completely lost.',
    'The strangest thing you ate on a trip.',
    'A time you got in trouble at school.',
    'Your most embarrassing moment in public.',
    'A time you met someone famous, or almost did.',
    'The best thing you ever found on the ground.',
    'A time an animal got the better of you.',
    'The weirdest job you ever had.',
    'A time you laughed when you really shouldn’t have.',
    'A holiday that went completely wrong.',
    'The biggest mess you ever made in a kitchen.',
    'A time you were mistaken for someone else.',
    'Your proudest moment as a kid.',
    'A time technology completely betrayed you.',
    'The most dramatic haircut of your life.',
  ]),
  friends: prompts('rm-fr', [
    'Your worst date ever.',
    'A time you got caught in a lie.',
    'The most awkward text you ever sent to the wrong person.',
    'A time you pretended to be someone you’re not.',
    'The pettiest thing you’ve ever done.',
    'A time you had a crush on someone totally wrong for you.',
    'Your most chaotic night out.',
    'A time you got out of something with a ridiculous excuse.',
    'The weirdest thing a stranger has said to you.',
    'A time you were way too confident.',
    'A secret you kept from your parents.',
    'The most embarrassing thing in your search history (that you’ll admit).',
  ]),
};

// ---------- Last Word: categories for hot potato ----------

const LAST_WORD: Record<DeckId, PromptCard[]> = {
  family: prompts('lw-fam', [
    'Things that are yellow',
    'Ice cream flavours',
    'Animals with four legs',
    'Things you find in a park',
    'Words that rhyme with “cat”',
    'Breakfast foods',
    'Things with wheels',
    'Countries',
    'Things that make a noise',
    'Cartoon characters',
    'Things in a toolbox',
    'Fruits',
    'Board games',
    'Things that are cold',
    'Musical instruments',
    'Things you do at a sleepover',
    'Pizza toppings',
    'Superheroes',
    'Things you wear on your head',
    'Sports',
    'Things in the sky',
    'Desserts',
    'Things you’d take camping',
    'Holidays',
  ]),
  friends: prompts('lw-fr', [
    'Excuses for being late',
    'Things you say on a first date',
    'Apps on your phone',
    'Reasons to cancel plans',
    'Things you’d find in an ex’s box',
    'Celebrity first names',
    'Things people post on social media',
    'Pickup lines (clean ones)',
    'Things you do when you can’t sleep',
    'Reality TV moments',
    'Things that are overrated',
    'Words people use way too much',
  ]),
};

export const FORFEITS: readonly string[] = [
  'Talk like a news anchor until your next turn.',
  'Do your best runway walk across the room.',
  'Give the player on your left a sincere compliment, with eye contact.',
  'Sing the next thing you say.',
  'Do ten seconds of your most dramatic slow-motion.',
  'Speak only in questions until your next turn.',
  'Do your best impression of someone in the room. They get to pick who.',
  'Show the group the last photo you took. No explanations allowed.',
  'Invent a handshake with the player on your right.',
  'Narrate everything you do in a nature-documentary voice for one minute.',
  'Tell the group your most-played song this week.',
  'Hold a statue pose until someone laughs.',
];

export const RULES: Record<GameId, { name: string; tagline: string; rules: [string, string] }> = {
  'point-blank': {
    name: 'Point Blank',
    tagline: 'Who’s most likely to…',
    rules: ['Read the question, then 3, 2, 1, everyone points at once.', 'Most fingers tells the story for a point, or takes a forfeit.'],
  },
  'odd-one-out': {
    name: 'Odd One Out',
    tagline: 'One of you doesn’t know the word.',
    rules: ['Pass the phone. Everyone sees the secret word except the Odd One, who only sees the category.', 'One-word clues each, then vote. Catch them, or they score big.'],
  },
  'bestie-test': {
    name: 'Bestie Test',
    tagline: 'How well do you really know them?',
    rules: ['The player in the hot seat secretly picks their answer.', 'Everyone else agrees on a guess. Match it and you all score.'],
  },
  'real-or-made-up': {
    name: 'Real or Made Up',
    tagline: 'Tell it like you mean it.',
    rules: ['The storyteller secretly sees TRUTH or MAKE IT UP, then tells a 45 second story.', 'The group votes. Fool them for 2 points.'],
  },
  'last-word': {
    name: 'Last Word',
    tagline: 'Hot potato, with words.',
    rules: ['Name one thing in the category, then pass the phone.', 'A hidden timer runs out. Whoever’s holding it misses the point.'],
  },
};

export type AnyCard = PromptCard | WordCard | ChoiceCard;

export function cardsFor(game: GameId, deck: DeckId): AnyCard[] {
  switch (game) {
    case 'point-blank':
      return POINT_BLANK[deck];
    case 'odd-one-out':
      return ODD_ONE_OUT[deck];
    case 'bestie-test':
      return BESTIE_TEST[deck];
    case 'real-or-made-up':
      return REAL_OR_MADE_UP[deck];
    case 'last-word':
      return LAST_WORD[deck];
  }
}


/** Bestie Test questions are written about the hot seat ("their"); this turns one to "you" for the hot seat's own screen. */
export function toYou(question: string): string {
  return question
    .replace(/\b(T|t)hey[’']re\b/g, (_, t: string) => (t === 'T' ? 'You’re' : 'you’re'))
    .replace(/\bTheir\b/g, 'Your')
    .replace(/\btheir\b/g, 'your')
    .replace(/\bThey\b/g, 'You')
    .replace(/\bthey\b/g, 'you')
    .replace(/\bthem\b/g, 'you');
}
