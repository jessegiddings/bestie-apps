import { shortLabel } from '@bestie/core';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Pressable, Share, Text, View } from 'react-native';
import { APP_NAME, CHARM_DAYS } from '@/content/brand';
import { momentsFor } from '@/content/moments';
import { lineOfTheDay } from '@/services/widget';
import { today, usePep } from '@/state/store';
import { todayView } from '@/state/today';
import { Body, Bracelet, Button, Card, H1, H2, Label, Row, Screen, SunMark, VoiceNoteCard } from '@/ui/kit';
import { colors, fonts } from '@/ui/theme';

export default function Today() {
  const st = usePep();
  const [date, setDate] = useState(today);
  useEffect(() => {
    const update = () => setDate(today());
    const timer = setInterval(update, 30000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') update(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  const { profile, listened, saved } = st;
  const premium = st.isPremium();
  if (!profile) return <Redirect href="/onboarding" />;
  const view = todayView({ startDate: profile.startDate, listened, premium, today: date });
  const line = lineOfTheDay(date);
  const moments = momentsFor(profile.focus).slice(0, 2);
  return <Screen tab="today">
    <Row><View style={{ flex: 1 }}><Label>MORNING BESTIE</Label><Body muted style={{ fontSize: 12 }}>{shortLabel(date)} · A moment for you</Body></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => router.push('/settings')} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.muted, fontSize: 13 }}>Settings</Text></Pressable>
    </Row>
    <Row><View style={{ flex: 1 }}><H1>{'Start softer.\nFeel lighter.'}</H1></View><SunMark size={60} /></Row>
    <Body muted>No catching up. No perfect mornings. Just a little encouragement before the day begins.</Body>
    {profile.startDate > date ? <Card tint={colors.goldSoft}><H2>Your first note arrives tomorrow.</H2><Body>For now, find a moment that meets you where you are.</Body><Button title="Explore moments" onPress={() => router.navigate('/moments')} /></Card> :
      <VoiceNoteCard clipId={view.morning.id} title={`MORNING ${String(view.day).padStart(2, '0')}`} subtitle={view.morning.title} tint={colors.goldSoft} locked={view.morningLocked} onLocked={() => router.push('/premium')} saved={saved.includes(view.morning.id)} onToggleSave={() => premium ? st.toggleSaved(view.morning.id) : router.push('/premium')} onPlayed={() => { st.markListened(date); st.markHeard(view.morning.id); }} />}
    <View style={{ gap: 12, paddingVertical: 4 }}>
      <Label>A THOUGHT TO TAKE WITH YOU</Label><Text style={{ fontFamily: fonts.display, fontSize: 25, lineHeight: 33, color: colors.ink }}>{`“${line}”`}</Text>
      <Pressable accessibilityRole="button" onPress={() => void Share.share({ message: `“${line}” — ${APP_NAME}` }).catch(() => undefined)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ fontFamily: fonts.bold, color: colors.accent, fontSize: 12 }}>Pass it on ↗</Text></Pressable>
    </View>
    <Row><View style={{ flex: 1 }}><H2>For the moment you’re in.</H2></View></Row>
    {moments.map((m, i) => <Pressable key={m.id} accessibilityRole="button" onPress={() => router.push(`/moment/${m.id}`)}><Card tint={i ? colors.accentSoft : colors.skySoft}><Row><View style={{ flex: 1, gap: 6 }}><Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.ink }}>{m.label}</Text><Body muted style={{ fontSize: 13 }}>{m.hint}</Body></View><Text style={{ color: colors.accent, fontSize: 22 }}>↗</Text></Row></Card></Pressable>)}
    <Button title="Explore all moments" kind="secondary" onPress={() => router.navigate('/moments')} />
    <Pressable accessibilityRole="button" onPress={() => router.push('/bracelet')}><Card><Label>YOUR LITTLE RITUAL</Label><H2>{`${view.totalMornings} mornings made for you.`}</H2><Bracelet thresholds={CHARM_DAYS} earned={view.charms} /><Body muted style={{ fontSize: 13 }}>Collect a charm as you listen. There’s no streak to protect.</Body></Card></Pressable>
  </Screen>;
}
