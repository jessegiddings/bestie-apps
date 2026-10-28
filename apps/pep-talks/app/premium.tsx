import { billingCopy } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { HOST_NAME } from '@/content/brand';
import { PRODUCTS, purchases } from '@/services/purchases';
import { usePep } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

export default function Premium() {
  const setEntitlement = usePep((s) => s.setEntitlement);
  const premium = usePep((s) => s.isPremium());
  const [productId, setProductId] = useState(PRODUCTS[PRODUCTS.length - 1].id);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const product = PRODUCTS.find((p) => p.id === productId)!;

  const buy = async () => {
    setBusy(true);
    setMessage(null);
    const res = await purchases.purchase(productId);
    setBusy(false);
    if (res.ok) {
      setEntitlement(res.entitlement);
      if (res.simulated) setMessage('Test mode: Premium is switched on, and no money changed hands.');
      else router.back();
    } else if (!res.cancelled) setMessage(res.error);
  };

  const restore = async () => {
    setBusy(true);
    const e = await purchases.restore();
    setBusy(false);
    if (!e) return setMessage('Restore works once the app is in the App Store.');
    setEntitlement(e);
    setMessage(e.active ? 'Premium restored.' : 'No purchase found for this account.');
  };

  return (
    <Screen>
      <Label color={colors.accent}>PREMIUM</Label>
      <H1>{`Every morning with ${HOST_NAME}.`}</H1>
      <Card>
        <Body>{`• A new morning voice note from ${HOST_NAME}, every single day`}</Body>
        <Body>• Three talks for every "I need you" moment</Body>
        <Body>• Save the notes you want to hear again</Body>
      </Card>
      <Row wrap>
        {PRODUCTS.map((p) => (
          <Chip key={p.id} label={`${p.label} $${p.usd}`} selected={p.id === productId} onPress={() => setProductId(p.id)} />
        ))}
      </Row>
      <Body muted style={kit.small}>{billingCopy(product)}</Body>
      {premium ? <Body>Premium is on. Thank you!</Body> : <Button title={busy ? 'One sec…' : 'Start Premium'} disabled={busy} onPress={() => void buy()} />}
      {message ? <Body muted>{message}</Body> : null}
      <Button title="Restore purchase" kind="ghost" disabled={busy} onPress={() => void restore()} />
      <Button title="Not now" kind="ghost" onPress={() => router.back()} />
      <Body muted style={[kit.small, { marginTop: space.sm }]}>The daily line, your bracelet and one talk for every moment stay free forever.</Body>
    </Screen>
  );
}
