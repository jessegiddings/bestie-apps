import { addDays, daysBetween, shortLabel, type LocalDate } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { computeStats } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { Body, Button, Card, H1, H2, Label, Row, Screen } from '@/ui/kit';
import { colors, fonts, radius, space } from '@/ui/theme';

const MARK_COLOR = { kept: colors.accent, missed: colors.missed, paused: colors.pause } as const;

/** Every day from the start, oldest first, for catching up on missed logs and fixing mistakes. */
export default function History() {
  const plan = useDry((s) => s.plan);
  const days = useDry((s) => s.days);
  const logDay = useDry((s) => s.logDay);
  const clearDay = useDry((s) => s.clearDay);
  const now = today();
  const [picked, setPicked] = useState<LocalDate | null>(null);
  if (!plan) return null;

  const stats = computeStats(plan, days, now);
  const count = Math.max(0, daysBetween(plan.startDate, now) + 1);
  const dates = Array.from({ length: count }, (_, i) => addDays(plan.startDate, i));
  const sel = picked ? days[picked] : undefined;

  return (
    <Screen>
      <H1>Calendar</H1>
      {count === 0 ? <Body muted>{`Your first day is ${shortLabel(plan.startDate)}.`}</Body> : <Body muted>Tap a day to log it or change it.</Body>}
      <Row wrap gap={8}>
        {dates.map((d, i) => {
          const mark = days[d]?.mark;
          const on = d === picked;
          return (
            <Pressable
              key={d}
              accessibilityRole="button"
              accessibilityLabel={`${shortLabel(d)}, ${mark ?? 'not logged'}`}
              onPress={() => setPicked(d)}
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: mark ? MARK_COLOR[mark] : colors.surface,
                borderWidth: on ? 3 : 1,
                borderColor: on ? colors.ink : colors.line,
              }}
            >
              <Text style={{ fontFamily: fonts.bold, color: mark && mark !== 'missed' ? '#FFFFFF' : colors.ink }}>{i + 1}</Text>
            </Pressable>
          );
        })}
      </Row>
      <Row gap={space.lg}>
        <Legend color={colors.accent} label="Dry" />
        <Legend color={colors.missed} label="Had a drink" />
        <Legend color={colors.pause} label="Pause" />
      </Row>
      {picked && (
        <Card>
          <H2>{shortLabel(picked)}</H2>
          <Body muted>{sel ? `Logged as ${sel.mark === 'kept' ? 'dry' : sel.mark === 'paused' ? 'a pause day' : 'a drink'}.` : 'Not logged yet.'}</Body>
          <View style={{ gap: space.sm, marginTop: space.md }}>
            <Button title="Dry" onPress={() => logDay(picked, 'kept')} />
            <Button title="Had a drink" kind="secondary" onPress={() => logDay(picked, 'missed', { drinks: 1 })} />
            <Button title="Pause day" kind="secondary" disabled={stats.passesLeft === 0 && sel?.mark !== 'paused'} onPress={() => logDay(picked, 'paused')} />
            {sel ? <Button title="Clear this day" kind="ghost" onPress={() => clearDay(picked)} /> : null}
          </View>
        </Card>
      )}
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Row gap={6}>
      <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: color }} />
      <Label>{label.toUpperCase()}</Label>
    </Row>
  );
}
