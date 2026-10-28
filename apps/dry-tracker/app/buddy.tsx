import { useCallback, useEffect, useState } from 'react';
import { Share, TextInput, View } from 'react-native';
import { APP_NAME } from '@/content/brand';
import { buddyConfigured, buddyStatus, createPact, joinPact, type BuddyStatus } from '@/services/buddy';
import { today, useDry } from '@/state/store';
import { Body, Button, Card, H1, H2, Label, Row, Screen } from '@/ui/kit';
import { colors, fonts, radius, space } from '@/ui/theme';

export default function Buddy() {
  const pact = useDry((s) => s.pact);
  const setPact = useDry((s) => s.setPact);
  const [name, setName] = useState(pact?.myName ?? '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<BuddyStatus | null>(null);

  const refresh = useCallback(async () => {
    if (!pact || !buddyConfigured) return;
    try {
      const s = await buddyStatus(pact.code, today());
      setStatus(s);
      if (s.name && s.name !== pact.buddyName) setPact({ ...pact, buddyName: s.name });
    } catch (e) {
      setError((e as Error).message);
    }
  }, [pact, setPact]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  if (!buddyConfigured) {
    return (
      <Screen tab="buddy">
        <H1>Do this with someone.</H1>
        <Body muted>Pair with a partner or friend and you'll each see the other's dry days, and you can nudge each other on the hard nights.</Body>
        <Card glow="dusk">
          <Label color={colors.accent}>COMING IN THE NEXT BUILD</Label>
          <Body style={{ marginTop: space.sm }}>Buddy pairing isn't switched on in this test build yet. It will be before launch.</Body>
        </Card>
      </Screen>
    );
  }

  if (!pact) {
    const me = name.trim();
    return (
      <Screen tab="buddy">
        <H1>Do this with someone.</H1>
        <Body muted>Pair with a partner or friend and you'll each see the other's dry days. Nothing else is shared.</Body>
        <Label>YOUR FIRST NAME</Label>
        <TextInput value={name} onChangeText={setName} style={input} accessibilityLabel="Your first name" placeholderTextColor={colors.muted} placeholder="Sam" />
        <Button
          title="Make a code to share"
          disabled={!me || busy}
          onPress={() => void run(async () => setPact({ code: await createPact(me), myName: me, buddyName: null, role: 'owner' }))}
        />
        <Card>
          <H2>Got a code?</H2>
          <TextInput value={code} onChangeText={(v) => setCode(v.toUpperCase())} autoCapitalize="characters" maxLength={6} style={[input, { marginTop: space.md }]} accessibilityLabel="Buddy code" placeholder="ABC234" placeholderTextColor={colors.muted} />
          <Button
            title="Join"
            kind="secondary"
            style={{ marginTop: space.md }}
            disabled={!me || code.length !== 6 || busy}
            onPress={() => void run(async () => setPact({ code, myName: me, buddyName: await joinPact(code, me), role: 'partner' }))}
          />
        </Card>
        {error ? <Body style={{ color: colors.coral }}>{error}</Body> : null}
      </Screen>
    );
  }

  return (
    <Screen tab="buddy">
      <H1>{pact.buddyName ? `You and ${pact.buddyName}` : 'Waiting for your buddy'}</H1>
      {!pact.buddyName && (
        <Card>
          <Label>YOUR CODE</Label>
          <Body style={{ fontFamily: fonts.bold, fontSize: 32, letterSpacing: 4, marginTop: space.sm }}>{pact.code}</Body>
          <Button
            title="Send it"
            style={{ marginTop: space.md }}
            onPress={() => void Share.share({ message: `Do a dry stretch with me on ${APP_NAME}. My buddy code is ${pact.code}` }).catch(() => undefined)}
          />
        </Card>
      )}
      {status?.name && (
        <Card>
          <Body>{`${status.name} has ${status.dryDays} dry ${status.dryDays === 1 ? 'day' : 'days'}. Today: ${status.today === 'kept' ? 'dry' : status.today === 'missed' ? 'had a drink' : 'not logged yet'}.`}</Body>
          <Row gap={6}>
            {status.lastFourteen.map((d) => (
              <View key={d.date} style={{ flex: 1, height: 22, borderRadius: 4, backgroundColor: d.mark === 'kept' ? colors.accent : d.mark === 'missed' ? colors.missed : colors.line }} />
            ))}
          </Row>
          <Label>LAST 14 DAYS</Label>
          <Button
            title={`Nudge ${status.name}`}
            kind="secondary"
            style={{ marginTop: space.md }}
            onPress={() => void Share.share({ message: "Checking in! Did you log today? We've got this." }).catch(() => undefined)}
          />
        </Card>
      )}
      {error ? <Body style={{ color: colors.coral }}>{error}</Body> : null}
      <Button title="Refresh" kind="secondary" onPress={() => void refresh()} />
      <Button title="Leave this pair" kind="ghost" onPress={() => setPact(null)} />
    </Screen>
  );
}

const input = {
  minHeight: 52,
  borderRadius: radius.sm,
  borderWidth: 1,
  borderColor: colors.line,
  backgroundColor: colors.raised,
  paddingHorizontal: space.md,
  fontFamily: fonts.body,
  fontSize: 17,
  color: colors.ink,
} as const;
