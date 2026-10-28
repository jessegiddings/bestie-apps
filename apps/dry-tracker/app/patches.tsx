import { router } from 'expo-router';
import { PATCH_DAYS, PATCH_NAMES } from '@/content/brand';
import { computeStats } from '@/state/stats';
import { today, useDry } from '@/state/store';
import { Body, Button, H1, Patch, Row, Screen } from '@/ui/kit';

export default function Patches() {
  const plan = useDry((s) => s.plan);
  const days = useDry((s) => s.days);
  const stats = plan ? computeStats(plan, days, today()) : null;
  const dry = stats?.dryDays ?? 0;
  return (
    <Screen>
      <H1>Your patches</H1>
      <Body muted>
        {stats?.nextPatch ? `${stats.nextPatch - dry} more dry ${stats.nextPatch - dry === 1 ? 'day' : 'days'} to the next one.` : 'You have every patch. Wow.'} Patches count total
        dry days, so a slip never takes one away.
      </Body>
      <Row wrap gap={12}>
        {PATCH_DAYS.map((d) => (
          <Patch key={d} days={d} name={PATCH_NAMES[d]} earned={dry >= d} />
        ))}
      </Row>
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
