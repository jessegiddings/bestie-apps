/**
 * Dry & Mighty look: "after dark". A deep dusk-violet night, warm cream type, an apricot-to-lilac
 * glow for progress, mint for dry days and coral for cravings. Evenings are when the app gets used,
 * so it is dark by design.
 */
export const colors = {
  ground: '#100E1A',
  surface: '#1A1727',
  raised: '#231F34',
  line: '#302A45',
  ink: '#F6F1EA',
  muted: '#A8A1BE',
  faint: '#6E6787',
  accent: '#F7B58F',
  accentInk: '#22140C',
  accentSoft: '#2E2230',
  lilac: '#B9A5FF',
  lilacSoft: '#262040',
  mint: '#7FE3C4',
  mintSoft: '#173029',
  gold: '#F3C969',
  goldSoft: '#30281A',
  coral: '#FF7C6B',
  coralSoft: '#34201F',
  missed: '#4B4562',
  pause: '#B9A5FF',
  pauseSoft: '#262040',
} as const;

/** Two-stop glows, drawn with react-native-svg gradients. */
export const glows = {
  dusk: [colors.accent, colors.lilac],
  mint: ['#9BF0D6', '#4FB8C9'],
  coral: ['#FF9A7A', '#FF5E7E'],
  gold: ['#FFE29A', '#E8A33D'],
} as const;

export const fonts = {
  body: 'PlusJakartaSans_500Medium',
  bold: 'PlusJakartaSans_700Bold',
  display: 'Fraunces_600SemiBold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 14, md: 22, lg: 30, pill: 999 } as const;
export const TOUCH_MIN = 44;
