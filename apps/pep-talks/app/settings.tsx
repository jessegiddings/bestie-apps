import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';
import { CRISIS_LINE, FOCUS_AREAS, SUPPORT_NOTE, type FocusId } from '@/content/brand';
import { scheduleMorning } from '@/services/notifications';
import { usePep } from '@/state/store';
import { Body, Button, Card, Chip, H1, H2, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

const HOURS = [6, 7, 8, 9, 10];

export default function Settings() {
  const profile = usePep((s) => s.profile);
  const updateProfile = usePep((s) => s.updateProfile);
  const reset = usePep((s) => s.reset);
  const muted = useVoice((s) => s.muted);
  const [confirm, setConfirm] = useState(false);
  const focus = profile?.focus ?? [];
  const toggle = (id: FocusId) => updateProfile({ focus: focus.includes(id) ? focus.filter((x) => x !== id) : [...focus, id] });

  return (
    <Screen>
      <H1>Settings</H1>
      <Card>
        <H2>Morning note</H2>
        <Row wrap>
          {HOURS.map((h) => (
            <Chip
              key={h}
              label={`${h} am`}
              selected={profile?.morningHour === h}
              onPress={() => {
                updateProfile({ morningHour: h });
                void scheduleMorning(h).catch(() => undefined);
              }}
            />
          ))}
        </Row>
      </Card>
      <Card>
        <H2>What you want help with</H2>
        <Row wrap>
          {FOCUS_AREAS.map((f) => (
            <Chip key={f.id} label={f.label} selected={focus.includes(f.id)} onPress={() => toggle(f.id)} />
          ))}
        </Row>
      </Card>
      <Card>
        <H2>Sound</H2>
        <Button title={muted ? 'Turn her voice on' : 'Mute her voice (show words only)'} kind="secondary" style={{ marginTop: space.md }} onPress={() => setMuted(!muted)} />
      </Card>
      <Card tint={colors.skySoft}>
        <H2>Support</H2>
        <Body style={{ marginTop: space.sm }}>{SUPPORT_NOTE}</Body>
        <Body muted style={kit.small}>{`${CRISIS_LINE.name}: ${CRISIS_LINE.note}`}</Body>
        <Button title="Call or text 988" kind="secondary" style={{ marginTop: space.md }} onPress={() => void Linking.openURL('tel:988').catch(() => undefined)} />
      </Card>
      <Button title="Premium" kind="secondary" onPress={() => router.push('/premium')} />
      {confirm ? (
        <Card>
          <Body>This erases your mornings, charms and saved notes on this phone. It can't be undone.</Body>
          <Button
            title="Yes, start over"
            style={{ marginTop: space.md }}
            onPress={() => {
              reset();
              router.replace('/onboarding');
            }}
          />
          <Button title="Keep everything" kind="ghost" onPress={() => setConfirm(false)} />
        </Card>
      ) : (
        <Button title="Start over" kind="ghost" onPress={() => setConfirm(true)} />
      )}
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
