import { addDays } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { APP_NAME, FOCUS_AREAS, HOST_NAME, type FocusId } from '@/content/brand';
import { scheduleMorning } from '@/services/notifications';
import { today, usePep } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

const HOURS = [6, 7, 8, 9, 10];

export default function Onboarding() {
  const setProfile = usePep((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState<FocusId[]>([]);
  const [hour, setHour] = useState(7);
  const [startTomorrow, setStartTomorrow] = useState(false);

  const toggle = (id: FocusId) => setFocus((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const finish = async () => {
    const now = today();
    setProfile({ startDate: startTomorrow ? addDays(now, 1) : now, focus, morningHour: hour });
    await scheduleMorning(hour).catch(() => 'denied');
    router.replace('/');
  };

  return (
    <Screen>
      {step === 0 && (
        <>
          <Label color={colors.accent}>{APP_NAME.toUpperCase()}</Label>
          <H1>Every morning, a voice note from your best friend.</H1>
          <Body>
            {`One minute from ${HOST_NAME}, in her own voice, to start your day. And when you need her, for a big day, a bad day or a 2 a.m. spiral, she's one tap away.`}
          </Body>
          <Card tint={colors.accentSoft}>
            <Body>Real recordings only. No AI voices, ever.</Body>
          </Card>
          <Button title="Hi! Let's do this" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <H1>What could you use a little help with?</H1>
          <Body muted>Pick as many as you like. She'll put those first.</Body>
          <Row wrap>
            {FOCUS_AREAS.map((f) => (
              <Chip key={f.id} label={f.label} selected={focus.includes(f.id)} onPress={() => toggle(f.id)} />
            ))}
          </Row>
          <Button title="Next" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <H1>When should your morning note arrive?</H1>
          <Body muted>One reminder a day. You can change it any time.</Body>
          <Row wrap>
            {HOURS.map((h) => (
              <Chip key={h} label={`${h} am`} selected={hour === h} onPress={() => setHour(h)} />
            ))}
          </Row>
          <H1>Start today?</H1>
          <Row wrap>
            <Chip label="Today" selected={!startTomorrow} onPress={() => setStartTomorrow(false)} />
            <Chip label="Tomorrow morning" selected={startTomorrow} onPress={() => setStartTomorrow(true)} />
          </Row>
          <Button title="Start" style={{ marginTop: space.md }} onPress={() => void finish()} />
        </>
      )}

      {step > 0 && <Button title="Back" kind="ghost" onPress={() => setStep(step - 1)} />}
    </Screen>
  );
}
