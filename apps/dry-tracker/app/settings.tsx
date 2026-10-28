import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';
import { HELPLINE, SAFETY_NOTE } from '@/content/brand';
import { scheduleCheckIn } from '@/services/notifications';
import { useDry } from '@/state/store';
import { Body, Button, Card, Chip, H1, H2, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

const HOURS = [17, 18, 19, 20, 21];

export default function Settings() {
  const plan = useDry((s) => s.plan);
  const updatePlan = useDry((s) => s.updatePlan);
  const reset = useDry((s) => s.reset);
  const muted = useVoice((s) => s.muted);
  const [confirm, setConfirm] = useState(false);

  return (
    <Screen>
      <H1>Settings</H1>
      <Card>
        <H2>Evening check-in</H2>
        <Row wrap>
          {HOURS.map((h) => (
            <Chip
              key={h}
              label={`${h - 12} pm`}
              selected={plan?.checkInHour === h}
              onPress={() => {
                updatePlan({ checkInHour: h });
                void scheduleCheckIn(h).catch(() => undefined);
              }}
            />
          ))}
        </Row>
      </Card>
      <Card>
        <H2>Sound</H2>
        <Button title={muted ? 'Turn her voice on' : 'Mute her voice (show words only)'} kind="secondary" style={{ marginTop: space.md }} onPress={() => setMuted(!muted)} />
      </Card>
      <Card tint={colors.coralSoft}>
        <H2>Help</H2>
        <Body style={{ marginTop: space.sm }}>{SAFETY_NOTE}</Body>
        <Body muted style={kit.small}>{`${HELPLINE.name}: ${HELPLINE.phone}. ${HELPLINE.note}`}</Body>
        <Button title="Call the helpline" kind="coral" style={{ marginTop: space.md }} onPress={() => void Linking.openURL(`tel:${HELPLINE.phone.replace(/-/g, '')}`).catch(() => undefined)} />
      </Card>
      <Button title="Premium" kind="secondary" onPress={() => router.push('/premium')} />
      {confirm ? (
        <Card>
          <Body>This erases every logged day and your plan on this phone. It can't be undone.</Body>
          <Button
            title="Yes, start over"
            kind="coral"
            style={{ marginTop: space.md }}
            onPress={() => {
              reset();
              router.replace('/onboarding');
            }}
          />
          <Button title="Keep my data" kind="ghost" onPress={() => setConfirm(false)} />
        </Card>
      ) : (
        <Button title="Start over" kind="ghost" onPress={() => setConfirm(true)} />
      )}
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
