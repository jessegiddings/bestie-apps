import { addDays, daysBetween, shortLabel, type LocalDate } from '@bestie/core';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MOODS, TREATS } from '@/content/moods';
import { weekday } from '@/state/badges';
import { CHALLENGES, computeStats } from '@/state/stats';
import { useToday } from '@/state/lifecycle';
import { today, useDry } from '@/state/store';
import { Body, Button, Card, H1, H2, Label, Row, Screen, Stat } from '@/ui/kit';
import { colors, fonts, radius, space } from '@/ui/theme';

const MARK_COLOR = { kept: colors.mint, missed: colors.missed, paused: colors.lilac } as const;
const DAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Progress over time, mood, money, and the calendar for catching up or fixing a day. */
export default function Journey() {
  const plan = useDry((s) => s.plan);
  const days = useDry((s) => s.days);
  const logDay = useDry((s) => s.logDay);
  const clearDay = useDry((s) => s.clearDay);
  const now = useToday();
  const [picked, setPicked] = useState<LocalDate | null>(null);
  if (!plan) return <Redirect href="/onboarding" />;

  const stats = computeStats(plan, days, now);
  const count = Math.max(0, daysBetween(plan.startDate, now) + 1);
  const dates = Array.from({ length: count }, (_, i) => addDays(plan.startDate, i));
  const week = Array.from({ length: 7 }, (_, i) => addDays(now, i - 6));
  const logged = Object.values(days).filter((d) => d.date >= plan.startDate && d.date <= now);
  const moodCounts = MOODS.map((m) => ({ ...m, n: logged.filter((d) => d.mood === m.mood).length }));
  const moodMax = Math.max(1, ...moodCounts.map((m) => m.n));
  const notes = logged.filter((d) => d.note).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const treat = [...TREATS].reverse().find((t) => stats.moneySaved >= t.usd) ?? TREATS[0];
  const sel = picked ? days[picked] : undefined;
  const pct = Math.min(1, stats.dryDays / stats.challenge.days);

  return (
    <Screen tab="journey">
      <H1>Your journey</H1>

      <Card glow="dusk">
        <Label color={colors.accent}>{stats.challenge.name.toUpperCase()}</Label>
        <Row style={{ marginTop: space.md }}>
          <Stat value={`${stats.dryDays}/${stats.challenge.days}`} label="dry days" />
          <Stat value={String(stats.longest)} label="longest run" />
          <Stat value={String(stats.passesLeft)} label={stats.passesLeft === 1 ? 'pass left' : 'passes left'} />
        </Row>
        <View style={{ height: 10, borderRadius: 5, backgroundColor: colors.raised, marginTop: space.lg, overflow: 'hidden' }}>
          <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 5, backgroundColor: colors.accent }} />
        </View>
        <Body muted style={{ fontSize: 13, marginTop: space.sm }}>
          {stats.started ? `Earliest finish: ${shortLabel(stats.finishDate)}.` : `Starts ${shortLabel(plan.startDate)}.`}
          {stats.finished.length ? ` Finished: ${stats.finished.map((d) => CHALLENGES.find((c) => c.days === d)?.name).join(', ')}.` : ''}
        </Body>
      </Card>

      <Card>
        <Label>LAST 7 DAYS</Label>
        <Row style={{ marginTop: space.md, justifyContent: 'space-between' }}>
          {week.map((d) => {
            const mark = d >= plan.startDate ? days[d]?.mark : undefined;
            return (
              <View key={d} style={{ alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: mark ? MARK_COLOR[mark] : 'transparent',
                    borderWidth: d === now ? 2 : 1,
                    borderColor: d === now ? colors.accent : colors.line,
                  }}
                />
                <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: d === now ? colors.accent : colors.muted }}>{DAY_LETTER[weekday(d)]}</Text>
              </View>
            );
          })}
        </Row>
      </Card>

      <Card glow="gold">
        <Label color={colors.gold}>MONEY SAVED</Label>
        <Text style={{ fontFamily: fonts.display, fontSize: 44, color: colors.ink, marginTop: space.sm }}>{`$${stats.moneySaved}`}</Text>
        <Body muted>
          {stats.moneySaved >= treat.usd
            ? `That's ${Math.floor(stats.moneySaved / treat.usd)} ${Math.floor(stats.moneySaved / treat.usd) === 1 ? treat.one : treat.many}. Treat yourself.`
            : `${stats.drinksSkipped} ${stats.drinksSkipped === 1 ? 'drink' : 'drinks'} skipped so far.`}
        </Body>
      </Card>

      <Card>
        <Label>HOW YOU'VE FELT</Label>
        {logged.some((d) => d.mood) ? (
          <View style={{ gap: space.sm, marginTop: space.md }}>
            {moodCounts.map((m) => (
              <Row key={m.mood} gap={space.md}>
                <Text style={{ fontSize: 18, width: 26 }}>{m.emoji}</Text>
                <View style={{ flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.raised, overflow: 'hidden' }}>
                  <View style={{ width: `${(m.n / moodMax) * 100}%`, height: '100%', backgroundColor: colors.lilac, borderRadius: 6 }} />
                </View>
                <Text style={{ fontFamily: fonts.bold, color: colors.muted, width: 24, textAlign: 'right' }}>{m.n}</Text>
              </Row>
            ))}
          </View>
        ) : (
          <Body muted style={{ marginTop: space.sm }}>Pick a mood after you log a day and you'll see the pattern here.</Body>
        )}
      </Card>

      {notes.length > 0 && (
        <Card>
          <Label>YOUR NOTES</Label>
          {notes.map((n) => (
            <View key={n.date} style={{ marginTop: space.md }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.muted }}>{shortLabel(n.date)}</Text>
              <Body>{n.note}</Body>
            </View>
          ))}
        </Card>
      )}

      <Card>
        <H2>Calendar</H2>
        <Body muted style={{ fontSize: 14 }}>{count === 0 ? `Your first day is ${shortLabel(plan.startDate)}.` : 'Tap a day to log it or change it.'}</Body>
        <Row wrap gap={8} style={{ marginTop: space.md }}>
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
                  width: 40,
                  height: 40,
                  borderRadius: radius.sm - 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: mark ? MARK_COLOR[mark] : colors.raised,
                  borderWidth: on ? 2 : 0,
                  borderColor: colors.ink,
                }}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: mark && mark !== 'missed' ? colors.ground : colors.ink }}>{i + 1}</Text>
              </Pressable>
            );
          })}
        </Row>
        <Row gap={space.lg} style={{ marginTop: space.md }}>
          <Legend color={colors.mint} label="Dry" />
          <Legend color={colors.missed} label="Drink" />
          <Legend color={colors.lilac} label="Pause" />
        </Row>
        {picked && (
          <View style={{ gap: space.sm, marginTop: space.lg }}>
            <Body>{`${shortLabel(picked)}: ${sel ? (sel.mark === 'kept' ? 'dry' : sel.mark === 'paused' ? 'pause day' : 'had a drink') : 'not logged yet'}`}</Body>
            <Row>
              <Button title="Dry" style={{ flex: 1 }} onPress={() => logDay(picked, 'kept')} />
              <Button title="Drink" kind="secondary" style={{ flex: 1 }} onPress={() => logDay(picked, 'missed', { drinks: 1 })} />
              <Button title="Pause" kind="secondary" style={{ flex: 1 }} disabled={stats.passesLeft === 0 && sel?.mark !== 'paused'} onPress={() => logDay(picked, 'paused')} />
            </Row>
            {sel ? <Button title="Clear this day" kind="ghost" onPress={() => clearDay(picked)} /> : null}
          </View>
        )}
      </Card>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Row gap={6}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color }} />
      <Label>{label.toUpperCase()}</Label>
    </Row>
  );
}
