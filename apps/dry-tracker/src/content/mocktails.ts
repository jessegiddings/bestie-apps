/** Simple mocktails made from things most kitchens have. One is suggested each night. */
export interface Mocktail {
  name: string;
  recipe: string;
}

export const MOCKTAILS: Mocktail[] = [
  { name: 'Lime fizz', recipe: 'Sparkling water, the juice of half a lime, a little honey, lots of ice.' },
  { name: 'Cranberry spritz', recipe: 'Cranberry juice, sparkling water, a squeeze of orange, a rosemary sprig.' },
  { name: 'Ginger mule', recipe: 'Ginger beer, lime juice and mint, in your fanciest mug.' },
  { name: 'Grapefruit tonic', recipe: 'Tonic water, grapefruit juice, a pinch of salt on the rim.' },
  { name: 'Cucumber cooler', recipe: 'Sparkling water, cucumber slices, lime, and a few basil leaves.' },
  { name: 'Faux-jito', recipe: 'Muddled mint and lime, a spoon of sugar, topped with soda water.' },
  { name: 'Apple cider sparkler', recipe: 'Apple cider, sparkling water, a cinnamon stick.' },
  { name: 'Pomegranate punch', recipe: 'Pomegranate juice, lemon, sparkling water, frozen berries as ice.' },
  { name: 'Virgin paloma', recipe: 'Grapefruit soda, lime, a salted rim.' },
  { name: 'Iced hibiscus', recipe: 'Cold hibiscus tea, a little honey, lemon slices.' },
  { name: 'Shirley, all grown up', recipe: 'Ginger ale, a splash of pomegranate, lime and a cherry.' },
  { name: 'Orange blossom', recipe: 'Orange juice and sparkling water, half and half, in a wine glass.' },
  { name: 'Spicy pineapple', recipe: 'Pineapple juice, soda water, lime, and one thin slice of jalapeño.' },
  { name: 'Lemon lavender', recipe: 'Lemonade, sparkling water, and a pinch of dried lavender or a sprig of thyme.' },
  { name: 'Hot apple toddy', recipe: 'Warm apple juice, lemon, honey and a cinnamon stick, for cold nights.' },
];

export function mocktailForDay(day: number): Mocktail {
  return MOCKTAILS[(Math.max(1, day) - 1) % MOCKTAILS.length];
}
