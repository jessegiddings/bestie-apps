import { addDays, shortLabel } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { APP_NAME, HELPLINE, HOST_NAME, SAFETY_NOTE } from '@/content/brand';
import { scheduleCheckIn } from '@/services/notifications';
import { CHALLENGES, type ChallengeDays } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, fonts, radius, space } from '@/ui/theme';

const JAN_1 = '2027-01-01';
const HOURS = [17, 18, 19, 20, 21];

function hourLabel(h: number): string {
  return `${h > 12 ? h - 12 : h} pm`;
}

export default function Onboarding() {
  const setPlan = useDry((s) => s.setPlan);
  const now = today();
  const [step, setStep] = useState(0);
  const [start, setStart] = useState<string>(now < JAN_1 ? JAN_1 : now);
  const [challengeDays, setChallengeDays] = useState<ChallengeDays>(31);
  const [perWeek, setPerWeek] = useState('10');
  const [cost, setCost] = useState('8');
  const [hour, setHour] = useState(18);
  const [why, setWhy] = useState('');

  const finish = async () => {
    setPlan({
      startDate: start,
      challengeDays,
      drinksPerWeek: Math.max(0, Number(perWeek) || 0),
      costPerDrink: Math.max(0, Number(cost) || 0),
      checkInHour: hour,
      why: why.trim(),
    });
    await scheduleCheckIn(hour).catch(() => 'denied');
    router.replace('/');
  };

  const startOptions = [
    { date: now, label: 'Today' },
    { date: addDays(now, 1), label: 'Tomorrow' },
    ...(now < JAN_1 ? [{ date: JAN_1, label: 'Jan 1' }] : []),
  ];

  return (
    <Screen>
      {step === 0 && (
        <>
          <Label color={colors.accent}>{APP_NAME.toUpperCase()}</Label>
          <H1>Let's take a break from drinking, together.</H1>
          <Body>
            Every evening {HOST_NAME} checks in with a short voice note. When a craving hits, she's one tap away. Pair up with a friend or partner and you'll see each other's
            days.
          </Body>
          <Card tint={colors.coralSoft}>
            <Label color={colors.coral}>BEFORE YOU START</Label>
            <Body style={{ marginTop: space.sm }}>{SAFETY_NOTE}</Body>
            <Body muted style={kit.small}>
              {HELPLINE.name}: {HELPLINE.phone}. {HELPLINE.note}
            </Body>
          </Card>
          <Button title="Sounds good" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <H1>When do you start?</H1>
          <Row wrap>
            {startOptions.map((o) => (
              <Chip key={o.date} label={o.label} selected={start === o.date} onPress={() => setStart(o.date)} />
            ))}
          </Row>
          <H1>How long?</H1>
          <View style={{ gap: space.sm }}>
            {CHALLENGES.map((c) => (
              <Chip key={c.days} label={`${c.name}: ${c.days} days`} selected={challengeDays === c.days} onPress={() => setChallengeDays(c.days)} />
            ))}
          </View>
          <Body muted>
            You finish on {shortLabel(addDays(start, challengeDays - 1))}. Finish early and you roll straight into the next one. You also get pause passes for planned nights like a
            wedding, and those never break your run.
          </Body>
          <Button title="Next" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <H1>What does a usual week look like?</H1>
          <Body muted>This stays on your phone. It's only used to show the drinks and money you save.</Body>
          <Field label="Drinks in a usual week" value={perWeek} onChange={setPerWeek} />
          <Field label="What one drink costs, in dollars" value={cost} onChange={setCost} />
          <Button title="Next" onPress={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <H1>When should {HOST_NAME} check in?</H1>
          <Body muted>Pick the time drinks usually start. You'll get one reminder a day, and you can change it any time.</Body>
          <Row wrap>
            {HOURS.map((h) => (
              <Chip key={h} label={hourLabel(h)} selected={hour === h} onPress={() => setHour(h)} />
            ))}
          </Row>
          <H1>Why are you doing this?</H1>
          <Body muted>Optional. She'll remind you on the hard nights.</Body>
          <TextInput
            value={why}
            onChangeText={setWhy}
            placeholder="Better sleep, saving money, feeling clear…"
            placeholderTextColor={colors.muted}
            multiline
            style={inputStyle(96)}
            accessibilityLabel="Why are you doing this"
          />
          <Button title="Start" onPress={() => void finish()} />
        </>
      )}

      {step > 0 && <Button title="Back" kind="ghost" onPress={() => setStep(step - 1)} />}
    </Screen>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ gap: space.xs }}>
      <Label>{label.toUpperCase()}</Label>
      <TextInput value={value} onChangeText={(v) => onChange(v.replace(/[^0-9.]/g, ''))} keyboardType="decimal-pad" style={inputStyle()} accessibilityLabel={label} />
    </View>
  );
}

function inputStyle(minHeight = 52) {
  return {
    minHeight,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
  } as const;
}
