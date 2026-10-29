import { useEffect, useRef, useState } from 'react';
import type { AnyCard } from '@/content/decks';
import { useParty } from '@/state/store';
import type { Night, Player, Scores } from '@/game/night';
import { Body, Button, H1, Label } from '@/ui/kit';
import { colors } from '@/ui/theme';

export interface TurnProps {
  night: Night;
  /** Whose turn it is: the storyteller, hot seat, first clue-giver or first holder. */
  player: Player;
  /** Base points for this turn; the round multiplier is applied by the engine. */
  onDone: (awards: Scores) => void;
}

/** A hand-off screen so nobody sees a secret meant for someone else. */
export function PassTo({ name, note, onReady }: { name: string; note?: string; onReady: () => void }) {
  return (
    <>
      <Label color={colors.accent}>PASS THE PHONE</Label>
      <H1>{`Hand it to ${name}.`}</H1>
      <Body muted>{note ?? 'Everyone else, look away for a second.'}</Body>
      <Button title={`I’m ${name}`} onPress={onReady} />
    </>
  );
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

/** Dealing updates shared history; do it after render, once per mounted turn. */
export function useDealtCard<T extends AnyCard>(): T | null {
  const dealt = useRef<T | null>(null);
  const [card, setCard] = useState<T | null>(null);
  useEffect(() => {
    if (!dealt.current) dealt.current = useParty.getState().deal() as T;
    setCard(dealt.current);
  }, []);
  return card;
}
