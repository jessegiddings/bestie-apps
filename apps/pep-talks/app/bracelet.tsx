import { router } from 'expo-router';
import { View } from 'react-native';
import { CHARM_DAYS, CHARM_NAMES, HOST_NAME } from '@/content/brand';
import { usePep } from '@/state/store';
import { Body, Button, Charm, H1, Label, Screen } from '@/ui/kit';
import { space } from '@/ui/theme';

export default function BraceletScreen() {
  const total = usePep((s) => s.listened.length);
  return (
    <Screen>
      <Label>SMALL MOMENTS ADD UP</Label><H1>Your morning keepsakes.</H1>
      <Body muted>{`A charm for every milestone of mornings with ${HOST_NAME}. Missing a day never takes one away.`}</Body>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md, justifyContent: 'center' }}>
        {CHARM_DAYS.map((d) => (
          <Charm key={d} days={d} name={CHARM_NAMES[d]} earned={total >= d} />
        ))}
      </View>
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
