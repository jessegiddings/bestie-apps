import type { GameId } from '@/game/night';
import { BestieTest } from './BestieTest';
import { LastWord } from './LastWord';
import { OddOneOut } from './OddOneOut';
import { PointBlank } from './PointBlank';
import { RealOrMadeUp } from './RealOrMadeUp';
import type { TurnProps } from './shared';

export const TURN_SCREENS: Record<GameId, (p: TurnProps) => React.JSX.Element> = {
  'point-blank': PointBlank,
  'odd-one-out': OddOneOut,
  'bestie-test': BestieTest,
  'real-or-made-up': RealOrMadeUp,
  'last-word': LastWord,
};
