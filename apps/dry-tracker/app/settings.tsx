import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';
import { HELPLINE, SAFETY_NOTE } from '@/content/brand';
import { leavePact } from '@/services/buddy';
import { cancelCheckIn, scheduleCheckIn } from '@/services/notifications';
import { useDry } from '@/state/store';
import { Body, Button, Card, Chip, H1, H2, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

const HOURS = [17, 18, 19, 20, 21];

export default function Settings() {
  const plan = useDry((s) => s.plan);
  const updatePlan = useDry((s) => s.updatePlan);
  const reset = useDry((s) => s.reset);
  const muted = useVoice((s) => s.muted);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
                void scheduleCheckIn(h).then(result => { updatePlan({ remindersEnabled: result === 'scheduled' }); setMessage(result === 'scheduled' ? 'Reminder set.' : 'Notifications are unavailable or permission was denied. You can enable them in iPhone Settings.'); }).catch(() => setMessage('Could not set the reminder. Please try again.'));
              }}
            />
          ))}
        </Row>
        <Button title="Turn reminders off" kind="ghost" onPress={() => void cancelCheckIn().then(() => { updatePlan({ remindersEnabled: false }); setMessage('Reminders are off.'); }).catch(() => setMessage('Could not turn off reminders. Please try again.'))} />
      </Card>
      {message ? <Body>{message}</Body> : null}
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
          <Body>This erases your journal and plan, turns off reminders, and ends your buddy pair, removing its shared history for both people. It can’t be undone. Store subscriptions are not cancelled.</Body>
          <Button
            title="Yes, start over"
            kind="coral"
            style={{ marginTop: space.md }}
            disabled={busy}
            onPress={() => void (async () => {
              setBusy(true); setMessage(null);
              try {
                const pact = useDry.getState().pact;
                if (pact) await leavePact(pact.code);
                await cancelCheckIn();
                const entitlement = useDry.getState().entitlement;
                reset(); useDry.getState().setEntitlement(entitlement);
                router.replace('/onboarding');
              } catch { setMessage('Could not remove shared data. Reconnect and try again; your journal has been kept.'); }
              finally { setBusy(false); }
            })()}
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
