import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import type { PromptCard } from '@/content/decks';
import { scoreRealOrMadeUp, secretFor } from '@/game/night';
import { useParty } from '@/state/store';
import { BigCard, Body, Button, Card, H2, Label } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';
import { PassTo, type TurnProps } from './shared';

type Step = 'pass' | 'secret' | 'story' | 'vote' | 'result';
const STORY_SECONDS = 45;

export function RealOrMadeUp({ night, player, onDone }: TurnProps) {
  const deal = useParty((s) => s.deal);
  const [card] = useState(() => deal() as PromptCard);
  const [secret] = useState(secretFor);
  const [step, setStep] = useState<Step>('pass');
  const [left, setLeft] = useState(STORY_SECONDS);
  const [vote, setVote] = useState<'truth' | 'made-up' | null>(null);

  useEffect(() => {
    if (step !== 'story' || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, left]);

  if (step === 'pass') return <PassTo name={player.name} note={`${player.name} is telling the story. Only they see the secret.`} onReady={() => setStep('secret')} />;

  if (step === 'secret') {
    const truth = secret === 'truth';
    return (
      <>
        <BigCard label="YOUR STORY" >{card.text}</BigCard>
        <Card tint={truth ? colors.goodSoft : colors.coralSoft}>
          <Label color={truth ? colors.good : colors.coral}>YOUR SECRET</Label>
          <H2>{truth ? 'TRUTH. Tell a real one.' : 'MAKE IT UP. Invent the whole thing.'}</H2>
          <Body muted style={{ marginTop: space.xs }}>{truth ? 'If nothing comes to mind, stretch a real memory. It still counts.' : 'Details sell it. Names, smells, what you were wearing.'}</Body>
        </Card>
        <Button title="Hide it, I’m ready" onPress={() => setStep('story')} />
      </>
    );
  }

  if (step === 'story') {
    return (
      <>
        <Label color={colors.accent}>{`${player.name.toUpperCase()} IS TELLING`}</Label>
        <BigCard>{card.text}</BigCard>
        <Text accessibilityLiveRegion="polite" style={{ fontFamily: fonts.bold, fontSize: 56, textAlign: 'center', color: left <= 10 ? colors.coral : colors.accent }}>
          {left > 0 ? `0:${String(left).padStart(2, '0')}` : 'Time!'}
        </Text>
        <Button title={left > 0 ? 'Story’s done' : 'Vote'} onPress={() => setStep('vote')} />
      </>
    );
  }

  if (step === 'vote') {
    return (
      <>
        <H2>{`Everyone except ${player.name}: talk it over. Real, or made up?`}</H2>
        <Button title="Real" kind="good" onPress={() => { setVote('truth'); setStep('result'); }} />
        <Button title="Made up" kind="coral" onPress={() => { setVote('made-up'); setStep('result'); }} />
      </>
    );
  }

  const fooled = vote !== secret;
  return (
    <>
      <Card tint={fooled ? colors.coralSoft : colors.goodSoft}>
        <Label color={fooled ? colors.coral : colors.good}>{fooled ? 'FOOLED YOU' : 'CAUGHT'}</Label>
        <H2>{`It was ${secret === 'truth' ? 'true' : 'made up'}!`}</H2>
        <Body style={{ marginTop: space.xs }}>{fooled ? `${player.name} gets 2 points.` : `Everyone except ${player.name} gets a point.`}</Body>
      </Card>
      <Button title="Next" onPress={() => onDone(scoreRealOrMadeUp(night.players, player.id, fooled))} />
    </>
  );
}
