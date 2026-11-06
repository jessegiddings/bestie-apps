import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import type { GameId } from '@/game/night';
export const GAME_LOOK: Record<GameId, { color: string; label: string; short: string }> = {
  'take-two': {color:'#FFBCAA',label:'ACT NATURAL. OR DON’T.',short:'Take Two'},
  'who-wrote-that': {color:'#DCD0FF',label:'YOUR WORDS. THEIR GUESSES.',short:'Who Wrote\nThat?'},
  'close-call': {color:'#FFE2B7',label:'SOMETHING IS A LITTLE OFF.',short:'Close Call'},
  'point-blank': { color: '#FFC2AE', label: 'POINT. LAUGH. EXPLAIN.', short: 'Point\nBlank' },
  'bestie-test': { color: '#DCD0FF', label: 'KNOW YOUR PEOPLE?', short: 'Hot Seat' },
  'odd-one-out': { color: '#C8E8D4', label: 'ONE OF YOU IS BLUFFING.', short: 'Odd\nOne Out' },
  'real-or-made-up': { color: '#FFD85B', label: 'SELL YOUR STORY.', short: 'Real or\nMade Up' },
  'last-word': { color: '#BBDFF4', label: 'THINK FAST. PASS FASTER.', short: 'Last\nWord' },
};
/** Original vector game pieces: crisp at any phone size, no remote assets. */
export function GameArt({ game, size = 100 }: { game: GameId; size?: number }) {
 const ink='#23201F';
 return <Svg width={size} height={size} viewBox="0 0 120 120">
  {game === 'take-two' ? <G transform="rotate(-8 60 60)"><Rect x={15} y={35} width={90} height={65} rx={8} fill={ink}/><Path d="M15 35L100 15L106 35L19 55Z" fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Path d="M30 31L43 48M55 25L68 42M80 19L93 36" stroke={ink} strokeWidth={8}/><Path d="M48 64L75 78L48 90Z" fill="#FFD85B"/></G>:null}
  {game === 'who-wrote-that' ? <G transform="rotate(8 60 60)"><Rect x={23} y={15} width={74} height={90} rx={10} fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Path d="M37 40H77M37 55H67M37 70H60" stroke={ink} strokeWidth={5}/><Path d="M67 87L77 60L90 67L76 91Z" fill="#FFD85B" stroke={ink} strokeWidth={4}/></G>:null}
  {game === 'close-call' ? <G><Rect x={12} y={20} width={45} height={76} rx={10} fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Rect x={63} y={25} width={45} height={76} rx={10} fill="#FFD85B" stroke={ink} strokeWidth={4}/><Circle cx={34} cy={57} r={12} fill={ink}/><Path d="M86 46L100 72H72Z" fill={ink}/></G>:null}
  {game === 'point-blank'  ? <G transform="rotate(-12 60 60)"><Path d="M30 96V61Q30 48 40 54V24Q40 11 50 19L53 53V41Q64 31 68 44Q79 37 83 49Q95 45 96 59V78Q96 101 74 103H43Z" fill="#FFF8E9" stroke={ink} strokeWidth={5}/><Path d="M19 22L10 15M75 16L83 7M26 40H12" stroke={ink} strokeWidth={5} strokeLinecap="round"/></G> : null}
  {game === 'bestie-test' ? <G><Circle cx={43} cy={55} r={30} fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Circle cx={80} cy={67} r={30} fill="#B39AEE" stroke={ink} strokeWidth={4}/><Path d="M28 58Q42 76 55 58M65 70Q79 88 93 70" fill="none" stroke={ink} strokeWidth={4}/><Circle cx={34} cy={46} r={3}/><Circle cx={49} cy={46} r={3}/><Circle cx={72} cy={58} r={3}/><Circle cx={87} cy={58} r={3}/></G> : null}
  {game === 'odd-one-out' ? <G transform="rotate(8 60 60)"><Path d="M12 46Q60 24 108 46L97 76Q77 91 60 67Q43 91 23 76Z" fill={ink}/><Path d="M26 52Q38 43 49 53Q37 66 26 52M71 53Q84 43 95 52Q83 66 71 53" fill="#FFF8E9"/><Path d="M30 19L36 29M91 18L83 29M60 8V23" stroke={ink} strokeWidth={4} strokeLinecap="round"/></G> : null}
  {game === 'real-or-made-up' ? <G><Rect x={14} y={15} width={72} height={66} rx={18} fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Path d="M33 80L29 101L53 81" fill="#FFF8E9" stroke={ink} strokeWidth={4}/><Path d="M46 35Q60 22 65 37Q69 46 56 51V56" fill="none" stroke={ink} strokeWidth={5}/><Circle cx={56} cy={65} r={3}/><Circle cx={91} cy={87} r={20} fill={ink}/><Path d="M91 76V88" stroke="#FFD85B" strokeWidth={4}/><Circle cx={91} cy={96} r={2} fill="#FFD85B"/></G> : null}
  {game === 'last-word' ? <G transform="rotate(12 60 60)"><Circle cx={59} cy={70} r={35} fill={ink}/><Path d="M60 35V21Q60 9 78 15" fill="none" stroke={ink} strokeWidth={5}/><Path d="M87 4L84 18L99 15L88 25L99 32L84 29L79 40L78 25L66 24L78 19Z" fill="#E36943"/><Path d="M48 50L38 73H56L51 91L76 64H59L65 50Z" fill="#FFD85B"/></G> : null}
 </Svg>;
}
