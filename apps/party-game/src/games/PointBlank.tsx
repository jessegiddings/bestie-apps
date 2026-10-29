import { play } from '@bestie/core';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { FORFEITS, type PromptCard } from '@/content/decks';
import { COUNTDOWN } from '@/content/host';
import { pick, scorePointBlank } from '@/game/night';
import { BigCard, Body, Button, Card, H2, Label, PlayerPicker } from '@/ui/kit';
import { colors, fonts } from '@/ui/theme';
import { useDealtCard, type TurnProps } from './shared';

type Step = 'read' | 'count' | 'who' | 'story' | 'forfeit';
const BEATS = ['3', '2', '1', 'POINT!'];

export function PointBlank({ night, onDone }: TurnProps) {
  const card = useDealtCard<PromptCard>();
  const [step, setStep] = useState<Step>('read');
  const [beat, setBeat] = useState(0);
  const [pointed, setPointed] = useState<string | null>(null);
  const [forfeit] = useState(() => pick(FORFEITS));
  const name = night.players.find((p) => p.id === pointed)?.name ?? '';

  useEffect(() => {
    if (step !== 'count') return;
    if (beat >= BEATS.length - 1) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      const t = setTimeout(() => setStep('who'), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBeat((b) => b + 1), 900);
    return () => clearTimeout(t);
  }, [step, beat]);

  if (!card) return <Body muted>Getting your next card ready…</Body>;

  if (step === 'read' || step === 'count') {
    return (
      <>
        <BigCard label="READ IT OUT LOUD">{card.text}</BigCard>
        {step === 'count' ? (
          <Text accessibilityLiveRegion="assertive" style={{ fontFamily: fonts.bold, fontSize: 64, textAlign: 'center', color: beat === BEATS.length - 1 ? colors.coral : colors.accent }}>
            {BEATS[beat]}
          </Text>
        ) : (
          <Button
            title="Count us in"
            onPress={() => {
              play(COUNTDOWN.id, { interrupt: true });
              setBeat(0);
              setStep('count');
            }}
          />
        )}
      </>
    );
  }

  if (step === 'who') {
    return (
      <>
        <H2>Who got the most fingers?</H2>
        <PlayerPicker players={night.players} onPick={(id) => { setPointed(id); setStep('story'); }} />
        <Button title="Dead even, skip it" kind="ghost" onPress={() => onDone({})} />
      </>
    );
  }

  if (step === 'story') {
    return (
      <>
        <Label color={colors.accent}>{name.toUpperCase()}</Label>
        <H2>{`${name}, tell us why. Or don’t, and take a forfeit.`}</H2>
        <Button title={`${name} told the story (+1)`} kind="good" onPress={() => onDone(scorePointBlank(pointed, true))} />
        <Button title="They’re passing" kind="secondary" onPress={() => setStep('forfeit')} />
      </>
    );
  }

  return (
    <>
      <Card tint={colors.coralSoft}>
        <Label color={colors.coral}>{`FORFEIT FOR ${name.toUpperCase()}`}</Label>
        <Body style={{ marginTop: 8 }}>{forfeit}</Body>
      </Card>
      <Button title="Done, next" onPress={() => onDone(scorePointBlank(pointed, false))} />
    </>
  );
}
