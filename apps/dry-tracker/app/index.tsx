import { shortLabel } from '@bestie/core';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BEFORE_START, checkInForDay } from '@/content/checkins';
import { PAUSE_NOTE } from '@/content/clips';
import { HOST_NAME, PATCH_NAMES } from '@/content/brand';
import { mocktailForDay } from '@/content/mocktails';
import { buddyConfigured, shareDay } from '@/services/buddy';
import { computeStats } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { Body, Button, Card, H1, H2, Label, Patch, Row, Screen, Stat, VoiceNote, styles as kit } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';

export default function Today() {
  const plan = useDry((s) => s.plan);
  const days = useDry((s) => s.days);
  const pact = useDry((s) => s.pact);
  const celebrated = useDry((s) => s.celebrated);
  const logDay = useDry((s) => s.logDay);
  const markHeard = useDry((s) => s.markHeard);
  const markCelebrated = useDry((s) => s.markCelebrated);
  const premium = useDry((s) => s.isPremium());
  const [date] = useState(today);

  const stats = useMemo(() => (plan ? computeStats(plan, days, date) : null), [plan, days, date]);
  const fresh = stats ? stats.patches.filter((p) => !celebrated.includes(p)) : [];

  useEffect(() => {
    if (!pact || !buddyConfigured) return;
    const entry = days[date];
    if (entry && entry.mark !== 'paused') void shareDay(pact.code, date, entry.mark).catch(() => undefined);
  }, [pact, days, date]);

  if (!plan || !stats) return <Redirect href="/onboarding" />;

  const entry = days[date];
  const checkIn = stats.started ? checkInForDay(stats.dayNumber) : null;
  const locked = checkIn ? !checkIn.free && !premium : false;
  const drink = mocktailForDay(stats.dayNumber || 1);
  const newestPatch = fresh.length ? Math.max(...fresh) : null;

  return (
    <Screen>
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.accent}>{shortLabel(date).toUpperCase()}</Label>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/settings')} hitSlop={12}>
          <Text style={{ fontFamily: fonts.bold, color: colors.accent }}>Settings</Text>
        </Pressable>
      </Row>

      {stats.started ? (
        <H1>{`Day ${stats.dayNumber} of ${stats.challenge.days}`}</H1>
      ) : (
        <H1>{stats.daysUntilStart === 1 ? 'You start tomorrow.' : `You start in ${stats.daysUntilStart} days.`}</H1>
      )}

      {stats.started && (
        <Card>
          <Row gap={space.lg}>
            <Stat value={String(stats.dryDays)} label="dry days" />
            <Stat value={String(stats.run)} label="in a row" />
            <Stat value={`$${stats.moneySaved}`} label="saved" />
          </Row>
          <Body muted style={kit.small}>
            {`${stats.drinksSkipped} ${stats.drinksSkipped === 1 ? 'drink' : 'drinks'} skipped · ${stats.daysLeft} days to go, finishing ${shortLabel(stats.finishDate)}`}
          </Body>
        </Card>
      )}

      {newestPatch != null && (
        <Card tint={colors.goldSoft}>
          <Label color={colors.gold}>NEW PATCH</Label>
          <Row gap={space.lg}>
            <Patch days={newestPatch} name={PATCH_NAMES[newestPatch as keyof typeof PATCH_NAMES]} earned size={72} />
            <View style={{ flex: 1, gap: space.sm }}>
              <Body>{`${newestPatch} dry ${newestPatch === 1 ? 'day' : 'days'}. That's yours forever.`}</Body>
              <Button title="Love it" kind="secondary" onPress={() => markCelebrated(fresh)} />
            </View>
          </Row>
        </Card>
      )}

      {stats.started && (
        <Card>
          <H2>{entry ? 'Tonight is logged.' : 'How did today go?'}</H2>
          {entry ? (
            <Body muted style={kit.small}>
              {entry.mark === 'kept' ? 'Dry day. Nice work.' : entry.mark === 'paused' ? 'Pause day, planned ahead. Your run is safe.' : 'You had a drink. Every dry day still counts.'}
            </Body>
          ) : null}
          <View style={{ gap: space.sm, marginTop: space.md }}>
            <Button title="I stayed dry" kind={entry?.mark === 'kept' ? 'primary' : entry ? 'secondary' : 'primary'} onPress={() => logDay(date, 'kept')} />
            <Button title="I had a drink" kind="secondary" onPress={() => logDay(date, 'missed', { drinks: 1 })} />
            <Button
              title={`Pause day (${stats.passesLeft} ${stats.passesLeft === 1 ? 'pass' : 'passes'} left)`}
              kind="ghost"
              disabled={stats.passesLeft === 0 && entry?.mark !== 'paused'}
              onPress={() => logDay(date, 'paused')}
            />
          </View>
        </Card>
      )}

      {stats.unlogged.length > 0 && (
        <Card tint={colors.pauseSoft}>
          <Label color={colors.pause}>CATCH UP</Label>
          <Body style={{ marginTop: space.sm }}>
            {stats.unlogged.length === 1 ? `You didn't log ${shortLabel(stats.unlogged[0])}.` : `${stats.unlogged.length} days aren't logged yet.`}
          </Body>
          <View style={{ marginTop: space.md }}>
            <Button title="Fill them in" kind="secondary" onPress={() => router.push('/history')} />
          </View>
        </Card>
      )}

      {entry?.mark === 'paused' ? (
        <VoiceNote clipId={PAUSE_NOTE.id} title="Pause day" onPlayed={() => markHeard(PAUSE_NOTE.id)} />
      ) : checkIn ? (
        <VoiceNote clipId={checkIn.id} title="Tonight" locked={locked} onLocked={() => router.push('/premium')} onPlayed={() => markHeard(checkIn.id)} />
      ) : (
        <VoiceNote clipId={BEFORE_START.id} title="Before we start" onPlayed={() => markHeard(BEFORE_START.id)} />
      )}

      <Button title="I'm craving a drink" kind="coral" onPress={() => router.push('/craving')} />

      {plan.why ? (
        <Card>
          <Label>YOUR WHY</Label>
          <Body style={{ marginTop: space.sm }}>{plan.why}</Body>
        </Card>
      ) : null}

      <Card>
        <Label>{`TONIGHT'S DRINK · ${drink.name.toUpperCase()}`}</Label>
        <Body style={{ marginTop: space.sm }}>{drink.recipe}</Body>
      </Card>

      <Row>
        <Button title={pact ? `Buddy${pact.buddyName ? `: ${pact.buddyName}` : ''}` : 'Add a buddy'} kind="secondary" style={{ flex: 1 }} onPress={() => router.push('/buddy')} />
        <Button title="Patches" kind="secondary" style={{ flex: 1 }} onPress={() => router.push('/patches')} />
      </Row>
      <Button title="Calendar" kind="ghost" onPress={() => router.push('/history')} />
      {!premium && <Body muted style={[kit.small, { textAlign: 'center' }]}>{`Free includes 3 nights of ${HOST_NAME}'s check-ins and one craving talk.`}</Body>}
    </Screen>
  );
}
