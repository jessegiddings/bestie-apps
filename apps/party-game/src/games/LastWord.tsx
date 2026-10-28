import { play } from '@bestie/core';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import type { PromptCard } from '@/content/decks';
import { TIME_UP } from '@/content/host';
import { fuseSeconds, pick, scoreLastWord } from '@/game/night';
import { useParty } from '@/state/store';
import { BigCard, Body, Button, H2, Label, PlayerPicker } from '@/ui/kit';
import { colors } from '@/ui/theme';
import type { TurnProps } from './shared';

type Step = 'ready' | 'live' | 'boom';

export function LastWord({ night, player, onDone }: TurnProps) {
  const deal = useParty((s) => s.deal);
  const [card] = useState(() => deal() as PromptCard);
  const [step, setStep] = useState<Step>('ready');
  const [passes, setPasses] = useState(0);
  const fuse = useRef(fuseSeconds());

  useEffect(() => {
    if (step !== 'live') return;
    const t = setTimeout(() => {
      play(pick(TIME_UP).id, { interrupt: true });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      setStep('boom');
    }, fuse.current * 1000);
    return () => clearTimeout(t);
  }, [step]);

  if (step === 'ready') {
    return (
      <>
        <BigCard label="CATEGORY">{card.text}</BigCard>
        <Body>{`${player.name} starts. Say one thing that fits, then pass the phone left. No repeats. The timer is hidden.`}</Body>
        <Button title="Start the clock" onPress={() => setStep('live')} />
      </>
    );
  }

  if (step === 'live') {
    return (
      <>
        <Label color={colors.coral}>SAY ONE, THEN PASS</Label>
        <BigCard tint={colors.coralSoft}>{card.text}</BigCard>
        <Button title={passes === 0 ? 'Passed it' : `Passed it (${passes})`} kind="coral" onPress={() => setPasses((n) => n + 1)} />
        <Body muted>Tapping is optional. It just feels good.</Body>
      </>
    );
  }

  return (
    <>
      <Label color={colors.coral}>TIME!</Label>
      <H2>Who was holding the phone?</H2>
      <PlayerPicker players={night.players} onPick={(id) => onDone(scoreLastWord(night.players, id))} />
    </>
  );
}
