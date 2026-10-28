import { shortLabel } from '@bestie/core';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Share, Text, TextInput, View } from 'react-native';
import { APP_NAME, HOST_NAME } from '@/content/brand';
import { BEFORE_START, checkInForDay } from '@/content/checkins';
import { PAUSE_NOTE } from '@/content/clips';
import { mocktailForDay } from '@/content/mocktails';
import { MOODS } from '@/content/moods';
import { questForDay } from '@/content/quests';
import { buddyConfigured, shareDay } from '@/services/buddy';
import { badgeById, earnedBadges } from '@/state/badges';
import { computeStats, type DayEntry } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { BadgeArt, Body, Button, Card, H2, Icon, Label, Ring, Row, Screen, Stat, TIER_LABEL, VoiceNote, styles as kit, type IconName } from '@/ui/kit';
import { colors, fonts, radius, space } from '@/ui/theme';


export default function Tonight() {
  const st = useDry();
  const { plan, days, pact, celebrated, heard, quests, cravingsBeaten } = st;
  const premium = st.isPremium();
  const [date] = useState(today);

  const stats = useMemo(() => (plan ? computeStats(plan, days, date) : null), [plan, days, date]);
  const earned = useMemo(
    () => (stats ? earnedBadges({ dryDays: stats.dryDays, days, cravingsBeaten, questsDone: Object.keys(quests).length, heard, paired: Boolean(pact?.buddyName) }) : []),
    [stats, days, cravingsBeaten, quests, heard, pact],
  );
  const fresh = earned.filter((id) => !celebrated.includes(id));

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
  const quest = questForDay(plan.startDate, date);
  const questDone = quests[date] === quest.id;
  const newBadge = fresh.length ? badgeById(fresh[fresh.length - 1]) : undefined;

  return (
    <Screen tab="today">
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.accent}>{APP_NAME.toUpperCase()}</Label>
          <Text style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14, marginTop: 2 }}>{`Tonight, ${shortLabel(date)}`}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => router.push('/settings')} hitSlop={12} style={{ padding: 6 }}>
          <Icon name="gear" color={colors.muted} />
        </Pressable>
      </Row>

      <Ring progress={stats.started ? stats.dryDays / stats.challenge.days : 0}>
        <Text style={{ fontFamily: fonts.display, fontSize: 64, lineHeight: 70, color: colors.ink }}>{stats.started ? stats.dryDays : stats.daysUntilStart}</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1.2, color: colors.muted }}>
          {stats.started ? (stats.dryDays === 1 ? 'DRY DAY' : 'DRY DAYS') : stats.daysUntilStart === 1 ? 'DAY TO GO' : 'DAYS TO GO'}
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.faint, marginTop: 6 }}>
          {stats.started ? `Day ${stats.dayNumber} of ${stats.challenge.days} · ${stats.challenge.name}` : `Starts ${shortLabel(plan.startDate)}`}
        </Text>
      </Ring>

      {stats.started && (
        <Row gap={space.sm}>
          <MiniStat value={String(stats.run)} label="in a row" color={colors.mint} />
          <MiniStat value={`$${stats.moneySaved}`} label="saved" color={colors.gold} />
          <MiniStat value={String(stats.drinksSkipped)} label="skipped" color={colors.lilac} />
        </Row>
      )}

      {newBadge && (
        <Card glow="gold">
          <Label color={colors.gold}>{`NEW BADGE · ${TIER_LABEL[newBadge.tier].toUpperCase()}`}</Label>
          <Row gap={space.lg} style={{ marginTop: space.md }}>
            <BadgeArt badge={newBadge} earned size={92} />
            <View style={{ flex: 1, gap: space.sm }}>
              <H2>{newBadge.name}</H2>
              <Body muted style={kit.small}>{`${newBadge.how}. Yours forever.`}</Body>
            </View>
          </Row>
          <Row style={{ marginTop: space.md }}>
            <Button
              title="Share"
              icon="share"
              kind="secondary"
              style={{ flex: 1 }}
              onPress={() => void Share.share({ message: `I just earned "${newBadge.name}" on ${APP_NAME}. ${stats.dryDays} dry days and counting.` }).catch(() => undefined)}
            />
            <Button title="Love it" style={{ flex: 1 }} onPress={() => st.markCelebrated(fresh)} />
          </Row>
        </Card>
      )}

      {stats.started && <LogCard date={date} entry={entry} passesLeft={stats.passesLeft} />}

      {stats.unlogged.length > 0 && (
        <Card glow="dusk">
          <Label color={colors.lilac}>CATCH UP</Label>
          <Body style={{ marginTop: space.sm }}>
            {stats.unlogged.length === 1 ? `You didn't log ${shortLabel(stats.unlogged[0])}.` : `${stats.unlogged.length} days aren't logged yet.`}
          </Body>
          <Button title="Fill them in" kind="secondary" style={{ marginTop: space.md }} onPress={() => router.navigate('/journey')} />
        </Card>
      )}

      {entry?.mark === 'paused' ? (
        <VoiceNote clipId={PAUSE_NOTE.id} title="Pause day" onPlayed={() => st.markHeard(PAUSE_NOTE.id)} />
      ) : checkIn ? (
        <VoiceNote clipId={checkIn.id} title="Tonight" locked={locked} onLocked={() => router.push('/premium')} onPlayed={() => st.markHeard(checkIn.id)} />
      ) : (
        <VoiceNote clipId={BEFORE_START.id} title="Before we start" onPlayed={() => st.markHeard(BEFORE_START.id)} />
      )}

      <Button title="I'm craving a drink" icon="wave" kind="coral" onPress={() => router.push('/craving')} />

      {stats.started && (
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: questDone }} onPress={() => st.toggleQuest(date, quest.id)}>
          <Card glow={questDone ? 'mint' : undefined}>
            <Row gap={space.md}>
              <View style={{ flex: 1 }}>
                <Label color={colors.mint}>TONIGHT'S SIDE QUEST</Label>
                <Body style={{ marginTop: space.sm }}>{quest.text}</Body>
              </View>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: questDone ? colors.mint : colors.line,
                  backgroundColor: questDone ? colors.mint : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {questDone ? <Icon name="check" size={20} color={colors.ground} strokeWidth={3} /> : null}
              </View>
            </Row>
          </Card>
        </Pressable>
      )}

      <Card>
        <Label color={colors.accent}>{`TONIGHT'S DRINK · ${drink.name.toUpperCase()}`}</Label>
        <Body style={{ marginTop: space.sm }}>{drink.recipe}</Body>
      </Card>

      {plan.why ? (
        <Card>
          <Label>YOUR WHY</Label>
          <Text style={{ fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.ink, marginTop: space.sm }}>{`“${plan.why}”`}</Text>
        </Card>
      ) : null}

      {!premium && <Body muted style={[kit.small, { textAlign: 'center' }]}>{`Free includes 3 nights of ${HOST_NAME}'s check-ins and one craving talk.`}</Body>}
    </Screen>
  );
}

function MiniStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, padding: space.md }}>
      <Stat value={value} label={label} color={color} />
    </View>
  );
}

const CHOICES: { mark: DayEntry['mark']; label: string; icon: IconName; color: string }[] = [
  { mark: 'kept', label: 'Stayed dry', icon: 'drop', color: colors.mint },
  { mark: 'missed', label: 'Had a drink', icon: 'heart', color: colors.coral },
  { mark: 'paused', label: 'Pause day', icon: 'calendar', color: colors.lilac },
];

function LogCard({ date, entry, passesLeft }: { date: string; entry: DayEntry | undefined; passesLeft: number }) {
  const logDay = useDry((s) => s.logDay);
  const noteDay = useDry((s) => s.noteDay);
  const [note, setNote] = useState(entry?.note ?? '');
  return (
    <Card>
      <H2>{entry ? 'Tonight is logged.' : 'How did today go?'}</H2>
      {entry ? (
        <Body muted style={kit.small}>
          {entry.mark === 'kept' ? 'Dry day. Look at you.' : entry.mark === 'paused' ? 'Pause day, planned ahead. Your run is safe.' : 'You had a drink. Every dry day still counts.'}
        </Body>
      ) : null}
      <Row gap={space.sm} style={{ marginTop: space.md }}>
        {CHOICES.map((c) => {
          const on = entry?.mark === c.mark;
          const disabled = c.mark === 'paused' && passesLeft === 0 && !on;
          return (
            <Pressable
              key={c.mark}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled }}
              disabled={disabled}
              onPress={() => logDay(date, c.mark, c.mark === 'missed' ? { drinks: 1 } : {})}
              style={{
                flex: 1,
                minHeight: 92,
                borderRadius: radius.sm,
                borderWidth: on ? 2 : 1,
                borderColor: on ? c.color : colors.line,
                backgroundColor: on ? colors.raised : colors.ground,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                opacity: disabled ? 0.4 : 1,
              }}
            >
              <Icon name={c.icon} color={c.color} size={26} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' }}>{c.label}</Text>
              {c.mark === 'paused' ? <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{`${passesLeft} left`}</Text> : null}
            </Pressable>
          );
        })}
      </Row>
      {entry ? (
        <View style={{ marginTop: space.lg, gap: space.sm }}>
          <Label>HOW DO YOU FEEL?</Label>
          <Row gap={space.sm}>
            {MOODS.map((m) => {
              const on = entry.mood === m.mood;
              return (
                <Pressable
                  key={m.mood}
                  accessibilityRole="button"
                  accessibilityLabel={m.label}
                  accessibilityState={{ selected: on }}
                  onPress={() => noteDay(date, { mood: m.mood })}
                  style={{ flex: 1, minHeight: 60, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.accentSoft : 'transparent', borderWidth: 1, borderColor: on ? colors.accent : colors.line }}
                >
                  <Text style={{ fontSize: 22 }}>{m.emoji}</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: on ? colors.accent : colors.muted }}>{m.label}</Text>
                </Pressable>
              );
            })}
          </Row>
          <TextInput
            value={note}
            onChangeText={setNote}
            onBlur={() => noteDay(date, { note: note.trim() })}
            placeholder="A line about today (optional)"
            placeholderTextColor={colors.faint}
            multiline
            accessibilityLabel="Note about today"
            style={{ minHeight: 52, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.ground, padding: space.md, fontFamily: fonts.body, fontSize: 15, color: colors.ink }}
          />
        </View>
      ) : null}
    </Card>
  );
}
