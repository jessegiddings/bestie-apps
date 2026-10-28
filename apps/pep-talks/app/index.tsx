import { shortLabel } from '@bestie/core';
import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import { APP_NAME, CHARM_DAYS, CHARM_NAMES, HOST_NAME, type CharmDay } from '@/content/brand';
import { charmNote } from '@/content/charms';
import { momentsFor } from '@/content/moments';
import { lineOfTheDay } from '@/services/widget';
import { today, usePep } from '@/state/store';
import { todayView } from '@/state/today';
import { Body, Bracelet, Button, Card, Charm, H1, H2, Label, Row, Screen, Stat, VoiceNoteCard, styles as kit } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function Today() {
  const profile = usePep((s) => s.profile);
  const listened = usePep((s) => s.listened);
  const saved = usePep((s) => s.saved);
  const celebrated = usePep((s) => s.celebrated);
  const markListened = usePep((s) => s.markListened);
  const markHeard = usePep((s) => s.markHeard);
  const toggleSaved = usePep((s) => s.toggleSaved);
  const markCelebrated = usePep((s) => s.markCelebrated);
  const premium = usePep((s) => s.isPremium());
  const [date] = useState(today);

  const view = useMemo(() => (profile ? todayView({ startDate: profile.startDate, listened, premium, today: date }) : null), [profile, listened, premium, date]);
  if (!profile || !view) return <Redirect href="/onboarding" />;

  const notStarted = profile.startDate > date;
  const line = lineOfTheDay(date);
  const fresh = view.charms.filter((c) => !celebrated.includes(c));
  const newest = fresh.length ? (Math.max(...fresh) as CharmDay) : null;
  const moments = momentsFor(profile.focus);

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
      <H1>{`${greeting()}, bestie.`}</H1>

      <Card tint={colors.skySoft}>
        <Label color={colors.sky}>{`TODAY'S LINE · ${HOST_NAME.toUpperCase()}`}</Label>
        <H2>{line}</H2>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => void Share.share({ message: `“${line}” — ${HOST_NAME}, ${APP_NAME}` }).catch(() => undefined)}
        >
          <Text style={{ fontFamily: fonts.bold, color: colors.sky, marginTop: space.xs }}>Send to a friend</Text>
        </Pressable>
      </Card>

      {notStarted ? (
        <Card>
          <H2>Your first morning note arrives tomorrow.</H2>
          <Body muted style={kit.small}>{`Until then, ${HOST_NAME} is here whenever you need her below.`}</Body>
        </Card>
      ) : (
        <VoiceNoteCard
          clipId={view.morning.id}
          title={`Morning ${view.day}`}
          subtitle={view.morning.title}
          locked={view.morningLocked}
          onLocked={() => router.push('/premium')}
          saved={saved.includes(view.morning.id)}
          onToggleSave={premium ? () => toggleSaved(view.morning.id) : () => router.push('/premium')}
          onPlayed={() => {
            markListened(date);
            markHeard(view.morning.id);
          }}
        />
      )}

      {newest != null && (
        <Card tint={colors.goldSoft}>
          <Label color={colors.gold}>NEW CHARM</Label>
          <Row gap={space.lg}>
            <Charm days={newest} name={CHARM_NAMES[newest]} earned size={68} />
            <View style={{ flex: 1, gap: space.sm }}>
              <Body>{`${newest} ${newest === 1 ? 'morning' : 'mornings'} with ${HOST_NAME}. That's yours forever.`}</Body>
              <Button title="Love it" kind="secondary" onPress={() => markCelebrated(fresh)} />
            </View>
          </Row>
          {charmNote(newest) ? <VoiceNoteCard clipId={charmNote(newest)!.id} title="A note for you" tint={colors.surface} /> : null}
        </Card>
      )}

      <Card>
        <Row gap={space.lg}>
          <Stat value={String(view.totalMornings)} label="mornings together" />
          <Stat value={String(view.run)} label="in a row" />
        </Row>
        <Bracelet thresholds={CHARM_DAYS} earned={view.charms} />
        <Body muted style={kit.small}>
          {view.nextCharm ? `Next charm at ${view.nextCharm} mornings. Missing a day never takes one away.` : 'Every charm earned. You legend.'}
        </Body>
      </Card>

      <H2>I need you</H2>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {moments.map((m) => (
          <Pressable key={m.id} accessibilityRole="button" style={({ pressed }) => [kit.momentTile, pressed && { opacity: 0.85 }]} onPress={() => router.push(`/moment/${m.id}`)}>
            <Text style={kit.momentLabel}>{m.label}</Text>
            <Text style={kit.momentHint}>{m.hint}</Text>
          </Pressable>
        ))}
      </View>

      <Row>
        <Button title="Bracelet" kind="secondary" style={{ flex: 1 }} onPress={() => router.push('/bracelet')} />
        <Button title="Saved" kind="secondary" style={{ flex: 1 }} onPress={() => router.push('/saved')} />
      </Row>
      {!premium && (
        <Body muted style={[kit.small, { textAlign: 'center' }]}>{`Free includes your first week of mornings, one talk for every moment and the daily line.`}</Body>
      )}
    </Screen>
  );
}
