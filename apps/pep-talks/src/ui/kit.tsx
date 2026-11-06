import { play, cancel, hasRecording, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { HOST_NAME } from '@/content/brand';
import { colors, fonts, radius, space, TOUCH_MIN } from './theme';

export function Screen({ children, scroll = true, tab }: { children: ReactNode; scroll?: boolean; tab?: string }) {
  const body = <View style={[styles.screenInner, tab ? { paddingBottom: 110 } : null]}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
      {tab ? <Navigation active={tab} /> : null}
    </SafeAreaView>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={styles.h1} accessibilityRole="header">{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  return <Text style={styles.h2} accessibilityRole="header">{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, muted && { color: colors.muted }, style]}>{children}</Text>;
}

export function Label({ children, color }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.label, color ? { color } : null]}>{children}</Text>;
}

type ButtonKind = 'primary' | 'secondary' | 'ghost';

export function Button({ title, onPress, kind = 'primary', disabled, style }: { title: string; onPress: () => void; kind?: ButtonKind; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const bg = { primary: colors.accent, secondary: colors.surface, ghost: 'transparent' }[kind];
  const fg = kind === 'primary' ? '#FFFFFF' : colors.accent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 }, kind === 'secondary' && styles.buttonOutline, style]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, tint, style }: { children: ReactNode; tint?: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, tint ? { backgroundColor: tint, borderColor: tint } : null, style]}>{children}</View>;
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipOn]}>
      <Text style={[styles.chipText, selected && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, gap = space.sm, wrap }: { children: ReactNode; gap?: number; wrap?: boolean }) {
  return <View style={{ flexDirection: 'row', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'center' }}>{children}</View>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** A bracelet charm: a round bead with the morning count. Charms not earned yet are drawn faint. */
export function Charm({ days, name, earned, size = 84 }: { days: number; name: string; earned: boolean; size?: number }) {
  const fill = earned ? colors.goldSoft : colors.surface;
  const ring = earned ? colors.gold : colors.line;
  return (
    <View style={{ width: size + 16, alignItems: 'center', gap: 6 }} accessibilityLabel={`${name}, ${days} mornings, ${earned ? 'earned' : 'not earned yet'}`}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M50 4 L50 12" stroke={ring} strokeWidth="3" />
        <Circle cx="50" cy="56" r="40" fill={fill} stroke={ring} strokeWidth="4" />
        <Circle cx="50" cy="56" r="32" fill="none" stroke={ring} strokeWidth="0.6" />
        <SvgText x="50" y="66" fontSize="28" fontWeight="700" fontFamily={fonts.bold} textAnchor="middle" fill={earned ? colors.ink : colors.faint}>
          {String(days)}
        </SvgText>
      </Svg>
      <Text style={[styles.charmName, !earned && { color: colors.muted }]} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

/** The bracelet strip on Today: one bead per charm, gold when earned. */
export function Bracelet({ thresholds, earned }: { thresholds: readonly number[]; earned: readonly number[] }) {
  return (
    <View style={styles.bracelet} accessibilityLabel={`${earned.length} of ${thresholds.length} charms earned`}>
      <View style={styles.braceletCord} />
      {thresholds.map((t) => {
        const on = earned.includes(t);
        return <View key={t} style={[styles.bead, on ? { backgroundColor: colors.gold, borderColor: colors.gold } : null]} />;
      })}
    </View>
  );
}

/** Story notes hold a prompt for her, in brackets, until she records her own story. */
function isPrompt(text: string): boolean {
  return text.startsWith('[');
}

/**
 * Plays one of her notes and shows the words. Until a note is recorded, the words show with a note
 * that the recording is on its way, never a synthetic voice.
 */
export function VoiceNoteCard({
  clipId,
  title,
  subtitle,
  locked,
  onLocked,
  onPlayed,
  saved,
  onToggleSave,
  tint = colors.accentSoft,
}: {
  clipId: string;
  title: string;
  subtitle?: string;
  locked?: boolean;
  onLocked?: () => void;
  onPlayed?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  tint?: string;
}) {
  const caption = useVoice((s) => s.caption);
  const status = useVoice((s) => s.status);
  const captionOnly = useVoice((s) => s.captionOnly);
  const showing = caption?.id === clipId;
  const playing = showing && status === 'playing';
  return (
    <Card tint={tint} style={{ padding: 24, gap: 12 }}>
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.accent}>{`${title.toUpperCase()} · ${HOST_NAME.toUpperCase()}`}</Label>
        </View>
        {onToggleSave && !locked ? (
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Remove from saved' : 'Save this note'} hitSlop={12} onPress={onToggleSave}>
            <Text style={{ fontFamily: fonts.bold, color: colors.accent }}>{saved ? 'Saved ♥' : 'Save ♡'}</Text>
          </Pressable>
        ) : null}
      </Row>
      {subtitle ? <H2>{subtitle}</H2> : null}
      {showing && !isPrompt(caption.text) ? <Body style={{ marginTop: space.sm }}>{caption.text}</Body> : null}
      {showing && captionOnly && isPrompt(caption.text) ? <Body style={{ marginTop: space.sm }}>A personal story is planned for this note. Hannah’s recording hasn’t been added yet.</Body> : null}
      {showing && captionOnly && !isPrompt(caption.text) ? <Body muted style={styles.small}>Draft script preview · recording coming later.</Body> : null}
      {showing && status === 'failed' ? <Body muted style={styles.small}>That didn't play. Tap to try again.</Body> : null}
      <View style={{ marginTop: space.md }}>
        {locked ? (
          <Button title="Unlock every note" kind="secondary" onPress={() => onLocked?.()} />
        ) : (
          <Button
            title={playing ? 'Stop playback' : hasRecording(clipId) ? showing ? 'Listen again' : 'Take a minute · Play' : showing ? 'Read again' : 'Read this note'}
            kind={showing ? 'secondary' : 'primary'}
            onPress={() => {
              if (playing) cancel();
              else play(clipId, { interrupt: true, onComplete: onPlayed });
            }}
          />
        )}
      </View>
    </Card>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  scroll: { flexGrow: 1 },
  screenInner: { paddingHorizontal: 24, paddingVertical: 24, gap: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  h1: { fontFamily: fonts.display, fontSize: 38, lineHeight: 43, color: colors.ink },
  h2: { fontFamily: fonts.display, fontSize: 25, lineHeight: 31, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, marginTop: space.xs },
  label: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.7, color: colors.muted },
  button: { minHeight: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  buttonOutline: { borderWidth: 1, borderColor: colors.line },
  buttonText: { fontFamily: fonts.bold, fontSize: 17 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg, borderWidth: 1, borderColor: colors.line, gap: space.xs },
  chip: { minHeight: TOUCH_MIN, paddingHorizontal: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, justifyContent: 'center', backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accent },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
  stat: { flex: 1, gap: 2 },
  statValue: { fontFamily: fonts.display, fontSize: 26, color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  charmName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  bracelet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, paddingHorizontal: space.xs },
  braceletCord: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: colors.line, top: '50%' },
  bead: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface },
  momentTile: { flexBasis: '47%', flexGrow: 1, minHeight: 88, borderRadius: radius.md, padding: space.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 4 },
  momentLabel: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  momentHint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
});

export function SunMark({ size = 80 }: { size?: number }) {
  return <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel="Morning sun">
    <Circle cx="50" cy="50" r="24" fill="#E9C976" />
    {Array.from({ length: 12 }, (_, i) => <Path key={i} d="M50 10v9" stroke="#B78F44" strokeWidth="1.5" transform={`rotate(${i * 30} 50 50)`} />)}
    <Path d="M42 50q8 8 16 0" fill="none" stroke="#80602D" strokeWidth="1.5" />
  </Svg>;
}
function Navigation({ active }: { active: string }) {
  const inset = useSafeAreaInsets();
  return <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.ground, borderTopWidth: 1, borderColor: colors.line, paddingBottom: Math.max(12, inset.bottom), paddingTop: 10 }}>
    <View style={{ flexDirection: 'row', maxWidth: 560, width: '100%', alignSelf: 'center' }}>
      {[['today', 'Today', '/', '☀'], ['moments', 'Moments', '/moments', '✧'], ['saved', 'Saved', '/saved', '♡']].map(([id, label, href, symbol]) => <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: active === id }} onPress={() => router.navigate(href as never)} style={{ flex: 1, alignItems: 'center', minHeight: 50, gap: 2 }}>
        <Text style={{ fontSize: 23, color: active === id ? colors.accent : colors.muted }}>{symbol}</Text>
        <Text style={{ fontFamily: active === id ? fonts.bold : fonts.body, fontSize: 11, color: active === id ? colors.accent : colors.muted }}>{label}</Text>
      </Pressable>)}
    </View>
  </View>;
}
