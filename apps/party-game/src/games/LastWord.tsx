import { play } from '@bestie/core';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import type { PromptCard } from '@/content/decks';
import { TIME_UP } from '@/content/host';
import { fuseSeconds, pick, scoreLastWord } from '@/game/night';
import { BigCard, Body, Button, H2, Label, PlayerPicker } from '@/ui/kit';
import { colors } from '@/ui/theme';
import { useGamePause, useDealtCard, type TurnProps } from './shared';

type Step = 'ready' | 'live' | 'boom';

export function LastWord({ night, player, onDone }: TurnProps) {
  const { paused } = useGamePause();
  const card = useDealtCard<PromptCard>();
  const [step, setStep] = useState<Step>('ready');
  const fuse = useRef(fuseSeconds() * 1000);

  useEffect(() => {
    if (paused || step !== 'live') return;
    const started = Date.now();
    const t = setTimeout(() => {
      play(pick(TIME_UP).id, { interrupt: true });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      setStep('boom');
    }, fuse.current);
    return () => { clearTimeout(t); fuse.current = Math.max(0, fuse.current - (Date.now() - started)); };
  }, [step, paused]);

  if (!card) return <Body muted>Getting your next card ready…</Body>;

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
<Body>Say an answer. Pass left. No tapping needed.</Body>
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
