import { useState } from 'react';
import type { WordCard } from '@/content/decks';
import { pick, scoreOddOneOut } from '@/game/night';
import { HostLine, useHost, BigCard, Body, Button, Card, H1, H2, Label, PlayerPicker } from '@/ui/kit';
import { colors } from '@/ui/theme';
import { useDealtCard, PassTo, type TurnProps } from './shared';

type Step = 'reveal' | 'clues' | 'vote' | 'guess' | 'result';

export function OddOneOut({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<WordCard>();
  const [oddId] = useState(() => pick(night.players).id);
  const [seat, setSeat] = useState(0);
  const [peeking, setPeeking] = useState(false);
  const [step, setStep] = useState<Step>('reveal');
  const [guessed, setGuessed] = useState(false);
  const [votedId, setVotedId] = useState<string | null>(null);

  // Hand the phone round the table starting with this turn's player.
  const start = night.players.findIndex((p) => p.id === player.id);
  const order = night.players.map((_, i) => night.players[(start + i) % night.players.length]);
  const odd = night.players.find((p) => p.id === oddId)!;

  const reaction = step === 'guess' ? 'react-escape-lamorne' : null;
  useHost(reaction);

  if (!card) return <Body muted>Getting your next card ready…</Body>;

  if (step === 'reveal') {
    const who = order[seat];
    if (!peeking) return <PassTo name={who.name} onReady={() => setPeeking(true)} />;
    const isOdd = who.id === oddId;
    return (
      <>
        {isOdd ? (
          <BigCard label={`CATEGORY: ${card.category.toUpperCase()}`} tint={colors.coralSoft} color={colors.coral}>
            You’re the Odd One Out. Blend in.
          </BigCard>
        ) : (
          <BigCard label={`CATEGORY: ${card.category.toUpperCase()} · THE WORD IS`}>{card.word}</BigCard>
        )}
        <Button
          title={seat === order.length - 1 ? 'Hide it, everyone’s seen theirs' : 'Hide it and pass'}
          onPress={() => {
            setPeeking(false);
            if (seat === order.length - 1) setStep('clues');
            else setSeat(seat + 1);
          }}
        />
      </>
    );
  }

  if (step === 'clues') {
    return (
      <>
        <Label color={colors.accent}>{`CATEGORY: ${card.category.toUpperCase()}`}</Label>
        <H1>One-word clues.</H1>
        <Body>{`Go around the table starting with ${player.name}. One word each about the secret word. Not too obvious, or the Odd One will catch on.`}</Body>
        <Button title="Everyone’s given a clue" onPress={() => setStep('vote')} />
      </>
    );
  }

  if (step === 'vote') {
    return (
      <>
        <H2>Talk it over, then vote. Who’s the Odd One?</H2>
        <PlayerPicker players={night.players} onPick={(id) => { setVotedId(id); setStep(id === oddId ? 'result' : 'guess'); }} />
      </>
    );
  }

  if (step === 'guess') return <>
    <Label>THE BLUFFER ESCAPED</Label>{reaction ? <HostLine clipId={reaction} /> : null}<H2>{`${odd.name}, one chance to name the secret word.`}</H2>
    <Body>Say your guess out loud before anyone reveals it. Everyone who saw the word: was that right?</Body>
    <Button title="Correct guess · +3" kind="good" onPress={() => { setGuessed(true); setStep('result'); }} />
    <Button title="Wrong guess · +2" kind="secondary" onPress={() => { setGuessed(false); setStep('result'); }} />
  </>;
  const caught = votedId === oddId;
  return (
    <>
      <Card tint={caught ? colors.goodSoft : colors.coralSoft}>
        <Label color={caught ? colors.good : colors.coral}>{caught ? 'CAUGHT' : 'THEY GOT AWAY WITH IT'}</Label>
        <H2>{`${odd.name} was the Odd One Out. The word was “${card.word}”.`}</H2>
      </Card>
      {caught ? (
        <Button title="Everyone else +1" kind="good" onPress={() => onDone(scoreOddOneOut(night.players, oddId, true, false))} />
      ) : (
        <>
          <Body>{`${odd.name} earns ${guessed ? 3 : 2} points.`}</Body>
          <Button title="Next turn" onPress={() => onDone(scoreOddOneOut(night.players, oddId, false, guessed))} />
        </>
      )}
    </>
  );
}
