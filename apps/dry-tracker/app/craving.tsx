import { cancel, play } from '@bestie/core';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Share } from 'react-native';
import { HELPLINE } from '@/content/brand';
import { nextCravingTalk } from '@/content/cravings';
import { useDry } from '@/state/store';
import { Body, Button, Card, H1, Label, Screen, VoiceNote, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

/** The craving button. Picks the next talk once per visit and starts playing straight away. */
export default function Craving() {
  const premium = useDry((s) => s.isPremium());
  const pact = useDry((s) => s.pact);
  const [{ talk, index }] = useState(() => nextCravingTalk(useDry.getState().lastCravingIndex, premium));

  useEffect(() => {
    useDry.getState().setCravingIndex(index);
    play(talk.id, { interrupt: true });
    return () => cancel();
  }, [talk.id, index]);

  return (
    <Screen>
      <Label color={colors.coral}>RIGHT NOW</Label>
      <H1>Breathe. This wave passes in about 15 minutes.</H1>
      <VoiceNote clipId={talk.id} title="Craving talk" />
      {!premium && (
        <Card>
          <Body>Premium has ten different craving talks, so you'll hear something new each time.</Body>
          <Button title="See Premium" kind="secondary" style={{ marginTop: space.md }} onPress={() => router.push('/premium')} />
        </Card>
      )}
      <Button
        title={pact?.buddyName ? `Text ${pact.buddyName}` : 'Text a friend'}
        kind="secondary"
        onPress={() => void Share.share({ message: "Craving hit. Talk me out of it? (Pressed the button.)" }).catch(() => undefined)}
      />
      <Card tint={colors.coralSoft}>
        <Body>If this feels like more than a craving, you don't have to handle it alone.</Body>
        <Body muted style={kit.small}>{`${HELPLINE.name}: ${HELPLINE.phone}. ${HELPLINE.note}`}</Body>
        <Button title="Call the helpline" kind="coral" style={{ marginTop: space.md }} onPress={() => void Linking.openURL(`tel:${HELPLINE.phone.replace(/-/g, '')}`).catch(() => undefined)} />
      </Card>
      <Button
        title="I rode it out"
        onPress={() => {
          useDry.getState().beatCraving();
          router.back();
        }}
      />
      <Button title="Close" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
