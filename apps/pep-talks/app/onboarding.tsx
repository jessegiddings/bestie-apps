import { addDays } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { APP_NAME, FOCUS_AREAS, HOST_NAME, type FocusId } from '@/content/brand';
import { scheduleMorning } from '@/services/notifications';
import { today, usePep } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen, SunMark } from '@/ui/kit';
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
      <Label>{`YOUR MORNING, YOUR WAY · ${step + 1} / 3`}</Label>
      {step === 0 && (
        <>
          <Label color={colors.accent}>{APP_NAME.toUpperCase()}</Label>
          <SunMark size={112} />
          <H1>{'A softer start.\nA stronger you.'}</H1>
          <Body>
            A small daily ritual with Hannah: a morning note, a thought to carry with you, and encouragement for the moments in between.
          </Body>
          <Card tint={colors.accentSoft}>
            <Body>A note. A breath. Back to your day. This preview includes draft scripts; Hannah’s recordings will follow.</Body>
          </Card>
          <Button title="Find your morning" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <H1>What would feel good right now?</H1>
          <Body muted>Choose what’s on your mind. We’ll bring those moments to the front.</Body>
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
