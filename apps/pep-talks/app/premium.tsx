import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { PRODUCTS, purchases } from '@/services/purchases';
import { usePep } from '@/state/store';
import { Body, Button, Card, Chip, H1, Label, Row, Screen, styles as kit } from '@/ui/kit';
import { colors } from '@/ui/theme';

export default function Premium() {
  const premium = usePep(s => s.isPremium());
  const [productId, setProductId] = useState(PRODUCTS[1].id);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { purchases.prices().then(setPrices).catch(() => setMessage('Could not load store prices. Please try again later.')); }, []);
  const run = async (restore: boolean) => {
    if (lock.current) return;
    lock.current = true; setBusy(true); setMessage(null);
    try {
      if (restore) {
        const e = await purchases.restore();
        if (!e) setMessage('There are no store purchases to restore in this preview.');
        else { usePep.getState().setEntitlement(e); setMessage(e.active ? 'Premium restored.' : 'No active purchase found.'); }
      } else {
        const res = await purchases.purchase(productId);
        if (res.ok) {
          if (res.simulated) usePep.getState().setEntitlement(res.entitlement);
          // Real entitlement updates arrive through the root CustomerInfo listener.
          setMessage(res.simulated ? 'Preview unlocked. No payment was taken.' : res.entitlement.active ? 'Premium is ready.' : 'The store has not granted Premium yet. Try Restore purchase.');
        } else if (!res.cancelled) setMessage(res.error);
      }
    } catch { setMessage('We couldn’t reach the store. Please try again.'); }
    finally { lock.current = false; setBusy(false); }
  };
  const product = PRODUCTS.find(p => p.id === productId)!;
  const available = purchases.simulated || Boolean(prices[productId]);
  return <Screen>
    <Label color={colors.accent}>{purchases.simulated ? 'PREMIUM PREVIEW · NO CHARGES' : 'PREMIUM'}</Label>
    <H1>{'A little more\nroom for you.'}</H1>
    <Body muted>More morning notes. More moments that meet you where you are.</Body>
    <Card><Body>The full morning collection, three talks per moment, and a place to keep your favorites.</Body><Body muted style={kit.small}>This build includes draft scripts. Hannah’s recordings will be added separately.</Body></Card>
    <Row wrap>{PRODUCTS.map(p => <Chip key={p.id} label={`${p.label} · ${purchases.simulated ? `$${p.usd} example` : prices[p.id] ?? 'Unavailable'}`} selected={p.id === productId} onPress={() => !busy && setProductId(p.id)} />)}</Row>
    <Body muted style={kit.small}>{purchases.simulated ? 'Preview prices only. This button does not start a subscription.' : prices[productId] ? `${prices[productId]} billed ${product.period === 'lifetime' ? 'once, for lifetime access' : product.period === 'year' ? 'once a year' : 'every month'}. ${product.period === 'lifetime' ? 'No subscription.' : 'Renews automatically unless cancelled in your Apple account settings.'}` : 'Billing is not available in this build.'}</Body>
    {premium ? <Body>Premium is on.</Body> : <Button title={busy ? 'One moment…' : purchases.simulated ? 'Try Premium preview' : 'Start Premium'} disabled={busy || !available} onPress={() => void run(false)} />}
    {message ? <Body>{message}</Body> : null}
    <Button title="Restore purchase" kind="ghost" disabled={busy || !purchases.enabled} onPress={() => void run(true)} />
    <Button title="Back" kind="ghost" onPress={() => router.back()} />
    <Body muted style={kit.small}>The daily line, keepsakes and one note per moment stay free.</Body>
  </Screen>;
}
