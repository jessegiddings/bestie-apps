import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { momentsFor } from '@/content/moments';
import { usePep } from '@/state/store';
import { Body, Card, H1, Label, Row, Screen } from '@/ui/kit';
import { colors, fonts } from '@/ui/theme';
export default function Moments() {
  const focus = usePep(s => s.profile?.focus);
  const [query, setQuery] = useState('');
  const moments = momentsFor(focus ?? []).filter(m => `${m.label} ${m.hint}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <Screen tab="moments"><Label>THE MOMENT LIBRARY</Label><H1>{'Whatever today\nfeels like.'}</H1><Body muted>Find a little perspective, a gentle reset, or the nudge you need.</Body>
    <TextInput value={query} onChangeText={setQuery} accessibilityLabel="Search moments" placeholder="What’s on your mind?" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, fontFamily: fonts.body, fontSize: 15, color: colors.ink }} />
    <Label>{query ? `${moments.length} ${moments.length === 1 ? 'MOMENT' : 'MOMENTS'} FOUND` : 'CHOSEN AROUND YOUR FOCUS'}</Label>
    {moments.length === 0 ? <Body muted>No matching moments. Try “day”, “sleep” or “confidence”.</Body> : moments.map((m, i) => <Pressable key={m.id} accessibilityRole="button" onPress={() => router.push(`/moment/${m.id}`)}><Card tint={[colors.skySoft, colors.accentSoft, colors.goldSoft][i % 3]}><Row><View style={{ flex: 1, gap: 8 }}><Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink }}>{m.label}</Text><Body muted style={{ fontSize: 13 }}>{m.hint}</Body></View><Text style={{ color: colors.accent, fontSize: 24 }}>↗</Text></Row></Card></Pressable>)}
  </Screen>;
}
