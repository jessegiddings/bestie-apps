import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { Share, Text, View } from 'react-native';
import { APP_NAME } from '@/content/brand';
import { ALL_BADGES, MILESTONES, MOMENTS, earnedBadges, type Badge } from '@/state/badges';
import { computeStats } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { BadgeArt, BadgeTile, Body, Button, Card, H1, H2, Label, Row, Screen, TIER_LABEL } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';

export default function Badges() {
  const st = useDry();
  const { plan, days, cravingsBeaten, quests, heard, pact } = st;
  const stats = plan ? computeStats(plan, days, today()) : null;
  const earned = useMemo(
    () => new Set(stats ? earnedBadges({ dryDays: stats.dryDays, days, cravingsBeaten, questsDone: Object.keys(quests).length, heard, paired: Boolean(pact?.buddyName) }) : []),
    [stats, days, cravingsBeaten, quests, heard, pact],
  );
  const [selected, setSelected] = useState<Badge | null>(null);
  if (!plan || !stats) return <Redirect href="/onboarding" />;

  const next = MILESTONES.find((b) => !earned.has(b.id));
  const toNext = next?.days ? next.days - stats.dryDays : 0;
  const prevDays = [...MILESTONES].reverse().find((b) => earned.has(b.id))?.days ?? 0;
  const pct = next?.days ? (stats.dryDays - prevDays) / (next.days - prevDays) : 1;

  return (
    <Screen tab="badges">
      <H1>Badges</H1>
      <Body muted>{`${earned.size} of ${ALL_BADGES.length} collected. Badges are never taken away, whatever happens.`}</Body>

      {selected ? (
        <Card glow={earned.has(selected.id) ? 'gold' : undefined}>
          <Row gap={space.lg}>
            <BadgeArt badge={selected} earned={earned.has(selected.id)} size={110} />
            <View style={{ flex: 1, gap: 4 }}>
              <Label color={colors.gold}>{TIER_LABEL[selected.tier].toUpperCase()}</Label>
              <H2>{selected.name}</H2>
              <Body muted style={{ fontSize: 14 }}>{earned.has(selected.id) ? `Earned. ${selected.how}.` : `To earn: ${selected.how.toLowerCase()}.`}</Body>
            </View>
          </Row>
          {earned.has(selected.id) ? (
            <Button
              title="Share it"
              icon="share"
              kind="secondary"
              style={{ marginTop: space.md }}
              onPress={() => void Share.share({ message: `I earned "${selected.name}" on ${APP_NAME}.` }).catch(() => undefined)}
            />
          ) : null}
        </Card>
      ) : next ? (
        <Card glow="dusk">
          <Label color={colors.accent}>NEXT MILESTONE</Label>
          <Row gap={space.lg} style={{ marginTop: space.md }}>
            <BadgeArt badge={next} earned={false} size={72} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>{next.name}</Text>
              <Body muted style={{ fontSize: 14 }}>{`${toNext} more dry ${toNext === 1 ? 'day' : 'days'}`}</Body>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.raised, overflow: 'hidden' }}>
                <View style={{ width: `${Math.max(0.04, pct) * 100}%`, height: '100%', backgroundColor: colors.accent, borderRadius: 4 }} />
              </View>
            </View>
          </Row>
        </Card>
      ) : null}

      <Label>MILESTONES</Label>
      <Row wrap gap={0} style={{ justifyContent: 'space-between' }}>
        {MILESTONES.map((b) => (
          <BadgeTile key={b.id} badge={b} earned={earned.has(b.id)} onPress={() => setSelected(b)} />
        ))}
        <View style={{ width: '31%' }} />
      </Row>

      <Label>MOMENTS</Label>
      <Row wrap gap={0} style={{ justifyContent: 'space-between' }}>
        {MOMENTS.map((b) => (
          <BadgeTile key={b.id} badge={b} earned={earned.has(b.id)} onPress={() => setSelected(b)} />
        ))}
        <View style={{ width: '31%' }} />
        <View style={{ width: '31%' }} />
      </Row>
    </Screen>
  );
}
