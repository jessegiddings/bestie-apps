import { useState } from 'react';
import { View } from 'react-native';
import { toYou, type ChoiceCard } from '@/content/decks';
import { scoreBestieTest } from '@/game/night';
import { BigCard, Body, Button, Card, Chip, H2, Label } from '@/ui/kit';
import { colors, space } from '@/ui/theme';
import { useDealtCard, PassTo, type TurnProps } from './shared';

type Step = 'pass' | 'secret' | 'group' | 'result';

export function BestieTest({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<ChoiceCard>();
  const [step, setStep] = useState<Step>('pass');
  const [answer, setAnswer] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);

  if (!card) return <Body muted>Getting your next card ready…</Body>;

  if (step === 'pass') return <PassTo name={player.name} note={`${player.name} is in the hot seat. Everyone else, no peeking.`} onReady={() => setStep('secret')} />;

  const options = (selected: number | null, onPick: (i: number) => void) => (
    <View style={{ gap: space.sm }}>
      {card.options.map((o, i) => (
        <Chip key={o} label={o} selected={selected === i} onPress={() => onPick(i)} />
      ))}
    </View>
  );

  if (step === 'secret') {
    return (
      <>
        <BigCard label={`${player.name.toUpperCase()}, ANSWER HONESTLY`}>{toYou(card.question)}</BigCard>
        {options(answer, setAnswer)}
        <Button title="Lock it in and pass it back" disabled={answer == null} onPress={() => setStep('group')} />
      </>
    );
  }

  if (step === 'group') {
    return (
      <>
        <Label color={colors.accent}>{`ABOUT ${player.name.toUpperCase()}`}</Label>
        <BigCard>{card.question}</BigCard>
        <Body muted>{`Everyone except ${player.name}: agree on one guess.`}</Body>
        {options(guess, setGuess)}
        <Button title="Reveal" disabled={guess == null} onPress={() => setStep('result')} />
      </>
    );
  }

  const match = answer === guess;
  return (
    <>
      <Card tint={match ? colors.goodSoft : colors.coralSoft}>
        <Label color={match ? colors.good : colors.coral}>{match ? 'BESTIES CONFIRMED' : 'DO YOU EVEN KNOW THEM?'}</Label>
        <H2>{`${player.name} picked “${card.options[answer!]}”.`}</H2>
        {!match ? <Body style={{ marginTop: space.xs }}>{`You guessed “${card.options[guess!]}”.`}</Body> : null}
      </Card>
      <Button title={match ? 'Everyone +1' : 'No points, next'} kind={match ? 'good' : 'primary'} onPress={() => onDone(scoreBestieTest(night.players, match))} />
    </>
  );
}
