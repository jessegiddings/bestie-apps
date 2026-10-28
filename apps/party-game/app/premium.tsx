import { billingCopy } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { HOST_NAME } from '@/content/brand';
import { PRODUCTS, purchases } from '@/services/purchases';
import { useParty } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, space } from '@/ui/theme';

export default function Premium() {
  const setEntitlement = useParty((s) => s.setEntitlement);
  const setDeck = useParty((s) => s.setDeck);
  const vip = useParty((s) => s.isVip());
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
      setDeck('friends');
      if (res.simulated) setMessage('Test mode: the VIP Pass is switched on, and no money changed hands.');
      else router.back();
    } else if (!res.cancelled) setMessage(res.error);
  };

  const restore = async () => {
    setBusy(true);
    const e = await purchases.restore();
    setBusy(false);
    if (!e) return setMessage('Restore works once the app is in the App Store.');
    setEntitlement(e);
    setMessage(e.active ? 'VIP Pass restored.' : 'No purchase found for this account.');
  };

  return (
    <Screen>
      <Label color={colors.accent}>VIP PASS</Label>
      <H1>Every deck, every game night.</H1>
      <Card>
        <Body>• The Friends deck: cheekier questions, stories and words</Body>
        <Body>{`• A new Podcast Deck each month, built from ${HOST_NAME}’s listeners`}</Body>
        <Body>• Every deck we add after this one</Body>
      </Card>
      <Row wrap>
        {PRODUCTS.map((p) => (
          <Chip key={p.id} label={`${p.label} $${p.usd}`} selected={p.id === productId} onPress={() => setProductId(p.id)} />
        ))}
      </Row>
      <Body muted style={kit.small}>{billingCopy(product)}</Body>
      {vip ? <Body>Your VIP Pass is on. Thank you!</Body> : <Button title={busy ? 'One sec…' : 'Get the VIP Pass'} disabled={busy} onPress={() => void buy()} />}
      {message ? <Body muted>{message}</Body> : null}
      <Button title="Restore purchase" kind="ghost" disabled={busy} onPress={() => void restore()} />
      <Button title="Not now" kind="ghost" onPress={() => router.back()} />
      <Body muted style={[kit.small, { marginTop: space.sm }]}>All five games with the Family deck stay free forever.</Body>
    </Screen>
  );
}
