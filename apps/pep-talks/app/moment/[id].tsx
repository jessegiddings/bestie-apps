import { cancel, play } from '@bestie/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Share } from 'react-native';
import { CRISIS_LINE, HOST_NAME } from '@/content/brand';
import { MOMENTS } from '@/content/moments';
import { usePep } from '@/state/store';
import { talkFor } from '@/state/today';
import { Body, Button, Card, H1, Label, Screen, VoiceNoteCard, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

/** Moments where a pointer to real help belongs next to her talk. */
const HEAVY = new Set(['anxious', 'lonely', 'bad-day', 'cant-sleep', 'heartbreak']);

/** "I need you": picks the next talk for this moment once per visit and starts it straight away. */
export default function MomentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moment = MOMENTS.find((m) => m.id === id);
  const premium = usePep((s) => s.isPremium());
  const saved = usePep((s) => s.saved);
  const toggleSaved = usePep((s) => s.toggleSaved);
  const [talk] = useState(() => (moment ? talkFor(moment.id, usePep.getState().heard, premium) : null));

  useEffect(() => {
    if (!talk) return;
    usePep.getState().markHeard(talk.id);
    play(talk.id, { interrupt: true });
    return () => cancel();
  }, [talk]);

  if (!moment || !talk) {
    return (
      <Screen>
        <H1>That one's not here.</H1>
        <Button title="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Label color={colors.accent}>I NEED YOU</Label>
      <H1>{moment.label}</H1>
      <VoiceNoteCard
        clipId={talk.id}
        title="Her take"
        saved={saved.includes(talk.id)}
        onToggleSave={premium ? () => toggleSaved(talk.id) : () => router.push('/premium')}
      />
      {!premium && (
        <Card>
          <Body>{`Premium has three talks for every moment, so ${HOST_NAME} has something new to say next time.`}</Body>
          <Button title="See Premium" kind="secondary" style={{ marginTop: space.md }} onPress={() => router.push('/premium')} />
        </Card>
      )}
      <Button
        title="Text a friend"
        kind="secondary"
        onPress={() => void Share.share({ message: `Having a "${moment.label.toLowerCase()}" moment. Got a minute?` }).catch(() => undefined)}
      />
      {HEAVY.has(moment.id) && (
        <Card tint={colors.skySoft}>
          <Body>If it feels like more than a moment, you don't have to handle it alone.</Body>
          <Body muted style={kit.small}>{`${CRISIS_LINE.name}: ${CRISIS_LINE.note}`}</Body>
          <Button title="Call or text 988" kind="secondary" style={{ marginTop: space.md }} onPress={() => void Linking.openURL('tel:988').catch(() => undefined)} />
        </Card>
      )}
      <Button title="Thanks, bestie" onPress={() => router.back()} />
    </Screen>
  );
}
