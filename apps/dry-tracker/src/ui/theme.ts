/** Warm paper, forest ink, and quiet botanical accents. */
export const colors = {
  ground: '#F7F7F0', surface: '#FFFFFF', raised: '#EEF1E9', line: '#DDE3D8',
  ink: '#233D32', muted: '#657268', faint: '#768276',
  accent: '#315C46', accentInk: '#FFFFFF', accentSoft: '#E6EDE2',
  lilac: '#6B7187', lilacSoft: '#EDEEF3', mint: '#416D53', mintSoft: '#E8F0E4',
  gold: '#876A36', goldSoft: '#F5EFDf', coral: '#A65B49', coralSoft: '#F7EDE7',
  missed: '#C09C8E', pause: '#777A8B', pauseSoft: '#EDEEF3',
} as const;
export const glows = {
  dusk: ['#E6EDE2', '#F7F7F0'], mint: ['#E8F0E4', '#F7F7F0'],
  coral: ['#F7EDE7', '#FFFFFF'], gold: ['#F5EFDF', '#FFFFFF'],
} as const;
export const fonts = { body: 'PlusJakartaSans_500Medium', bold: 'PlusJakartaSans_700Bold', display: 'Fraunces_600SemiBold' } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 12, md: 20, lg: 28, pill: 999 } as const;
export const TOUCH_MIN = 44;
