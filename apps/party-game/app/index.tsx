import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { DECKS, RULES } from '@/content/decks';
import { MIN_PLAYERS, NIGHT_ORDER, type GameId } from '@/game/night';
import { useParty } from '@/state/store';
import { Body, Button, Card, Chip, H2, Label, Row, Screen } from '@/ui/kit';
import { colors, fonts } from '@/ui/theme';

const GAME_TAGS = ['POINT & VOTE', 'HOW WELL DO YOU KNOW THEM?', 'SPOT THE BLUFFER', 'FACT OR FICTION?', 'THINK FAST'];
export default function Home() {
  const { width } = useWindowDimensions();
  const st = useParty();
  const { players, deck, night } = st;
  const vip = st.isVip();
  const muted = useVoice(s => s.muted);
  const ready = players.length >= MIN_PLAYERS;
  const [replacement, setReplacement] = useState<{ single?: GameId } | null>(null);
  const active = night && night.phase !== 'crowned';
  const begin = (single?: GameId) => {
    if (!ready) return router.push(single ? `/players?game=${single}` : '/players?game=night');
    if (DECKS.find(d => d.id === deck)?.vip && !vip) st.setDeck('family');
    st.start(single); setReplacement(null); router.push('/night');
  };
  const go = (single?: GameId) => active ? setReplacement({ single }) : begin(single);
  return <Screen>
    <Row><View style={{ flex: 1 }}><Label>BESTIE NIGHT</Label></View><Pressable accessibilityRole="switch" accessibilityLabel="Host sound" accessibilityState={{ checked: !muted }} onPress={() => setMuted(!muted)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.accent, fontFamily: fonts.bold, fontSize: 11 }}>{muted ? 'SOUND OFF' : 'SOUND ON'}</Text></Pressable></Row>
    <Card tint={colors.accent} style={{ padding: 26, gap: 20 }}>
      <Row><View style={{ flex: 1 }}><Label color="#D4DDFF">YOUR PEOPLE. ONE PHONE.</Label></View><Text style={{ fontSize: 28, color: colors.lime }}>✳</Text></Row>
      <Text accessibilityRole="header" style={{ fontFamily: fonts.bold, fontSize: width < 360 ? 32 : 38, lineHeight: width < 360 ? 35 : 40, letterSpacing: -1.8, color: '#FFFFFF' }}>{'Good friends.\nBad guesses.\nGreat night.'}</Text>
      <Text style={{ fontFamily: fonts.body, color: '#E3E9FF', fontSize: 14, lineHeight: 22 }}>Five quick games. A little friendly competition. Hosted by Hannah.</Text>
      <Pressable accessibilityRole="button" onPress={() => active ? router.push('/night') : go()} style={{ minHeight: 56, borderRadius: 12, padding: 16, backgroundColor: colors.lime, justifyContent: 'center' }}><Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.night }}>{active ? 'Continue your night  ↗' : ready ? 'Start the night  ↗' : 'Get everyone in  ↗'}</Text></Pressable>
      <Text style={{ fontFamily: fonts.body, color: '#E3E9FF', fontSize: 11 }}>3–10 PLAYERS   ·   ONE PHONE   ·   FIVE GAMES</Text>
    </Card>
    {replacement ? <Card tint={colors.goldSoft}><H2>Start something new?</H2><Body>Your current night’s scores will be replaced.</Body><Button title="Start a fresh game" onPress={() => begin(replacement.single)} /><Button title="Keep this night" kind="ghost" onPress={() => setReplacement(null)} /></Card> : null}
    <Pressable accessibilityRole="button" onPress={() => router.push('/players')}><Row><View style={{ flex: 1, gap: 4 }}><Label>THE GUEST LIST</Label><Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.ink }}>{players.length ? players.map(p => p.name).join(', ') : 'Who’s coming to the table?'}</Text></View><Text style={{ color: colors.accent, fontFamily: fonts.bold }}>Edit ↗</Text></Row></Pressable>
    <View style={{ gap: 12 }}><Label>PICK YOUR CROWD</Label><Row wrap>{DECKS.map(d => <Chip key={d.id} label={d.vip && !vip ? `${d.name} · VIP` : d.name} selected={deck === d.id && (!d.vip || vip)} onPress={() => d.vip && !vip ? router.push('/premium') : st.setDeck(d.id)} />)}</Row><Body muted style={{ fontSize: 13 }}>{DECKS.find(d => d.id === deck)?.blurb}</Body></View>
    <View style={{ borderTopWidth: 1, borderColor: colors.line, paddingTop: 24, gap: 6 }}><Label>JUST ONE MORE ROUND?</Label><H2>Pick your game.</H2><Body muted>A full night mixes all five. Or jump straight into a favorite.</Body></View>
    {NIGHT_ORDER.map((g, i) => <Pressable key={g} accessibilityRole="button" onPress={() => go(g)}><Card style={{ padding: 20 }}><Row><View style={{ width: 44, height: 52, borderRadius: 8, backgroundColor: i % 2 ? colors.goldSoft : colors.accentSoft, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: i % 2 ? '5deg' : '-5deg' }] }}><Text style={{ fontFamily: fonts.bold, fontSize: 24, color: colors.accent }}>{String(i + 1).padStart(2, '0')}</Text></View><View style={{ flex: 1, gap: 4, paddingLeft: 8 }}><Label>{GAME_TAGS[i]}</Label><Text style={{ fontFamily: fonts.bold, fontSize: 21, color: colors.ink, letterSpacing: -0.5 }}>{RULES[g].name}</Text><Body muted style={{ fontSize: 12, lineHeight: 18 }}>{RULES[g].tagline}</Body></View><Text style={{ fontSize: 22, color: colors.accent }}>↗</Text></Row></Card></Pressable>)}
    {!vip ? <Button title="More mischief · Explore VIP" kind="secondary" onPress={() => router.push('/premium')} /> : null}
    <Body muted style={{ fontSize: 11, textAlign: 'center' }}>PREVIEW EDITION · HOST AUDIO CURRENTLY SHOWN AS SCRIPTS</Body>
  </Screen>;
}
