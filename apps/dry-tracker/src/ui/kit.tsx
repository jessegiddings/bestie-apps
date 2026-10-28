import { play, replay, useVoice } from '@bestie/core';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { HOST_NAME } from '@/content/brand';
import { colors, fonts, radius, space, TOUCH_MIN } from './theme';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const body = <View style={styles.screenInner}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
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

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'coral';

export function Button({ title, onPress, kind = 'primary', disabled, style }: { title: string; onPress: () => void; kind?: ButtonKind; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const bg = { primary: colors.accent, secondary: colors.surface, ghost: 'transparent', coral: colors.coral }[kind];
  const fg = kind === 'primary' || kind === 'coral' ? '#FFFFFF' : colors.accent;
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

/** A milestone patch: a stitched round badge with the day count. Locked patches are drawn faint. */
export function Patch({ days, name, earned, size = 92 }: { days: number; name: string; earned: boolean; size?: number }) {
  const fill = earned ? colors.goldSoft : colors.surface;
  const ring = earned ? colors.gold : colors.line;
  return (
    <View style={{ width: size + 16, alignItems: 'center', gap: 6 }} accessibilityLabel={`${name}, ${days} dry days, ${earned ? 'earned' : 'not earned yet'}`}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="46" fill={fill} stroke={ring} strokeWidth="4" />
        <Circle cx="50" cy="50" r="38" fill="none" stroke={ring} strokeWidth="1.5" strokeDasharray="4 4" />
        <SvgText x="50" y="56" fontSize="30" fontWeight="700" textAnchor="middle" fill={earned ? colors.ink : colors.missed}>
          {String(days)}
        </SvgText>
        <Path d="M30 72 Q50 80 70 72" stroke={ring} strokeWidth="2" fill="none" />
      </Svg>
      <Text style={[styles.patchName, !earned && { color: colors.muted }]} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

/**
 * Plays one of her clips and shows the words. Until a clip is recorded, the words show with a note
 * that the recording is on its way, never a synthetic voice.
 */
export function VoiceNote({ clipId, title, locked, onLocked, onPlayed }: { clipId: string; title: string; locked?: boolean; onLocked?: () => void; onPlayed?: () => void }) {
  const caption = useVoice((s) => s.caption);
  const status = useVoice((s) => s.status);
  const captionOnly = useVoice((s) => s.captionOnly);
  const showing = caption?.id === clipId;
  const playing = showing && status === 'playing';
  return (
    <Card tint={colors.accentSoft}>
      <Label color={colors.accent}>{`${title.toUpperCase()} · ${HOST_NAME.toUpperCase()}`}</Label>
      {showing ? <Body style={{ marginTop: space.sm }}>{caption.text}</Body> : null}
      {showing && captionOnly ? <Body muted style={styles.small}>Her recording is on its way. For now, here are her words.</Body> : null}
      {showing && status === 'failed' ? <Body muted style={styles.small}>That didn't play. Tap to try again.</Body> : null}
      <View style={{ marginTop: space.md }}>
        {locked ? (
          <Button title="Unlock her voice notes" kind="secondary" onPress={() => onLocked?.()} />
        ) : (
          <Button
            title={playing ? 'Playing…' : showing ? 'Play again' : 'Play'}
            kind={showing ? 'secondary' : 'primary'}
            onPress={() => {
              if (showing) replay();
              else play(clipId, { interrupt: true });
              onPlayed?.();
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
  screenInner: { paddingHorizontal: space.lg, paddingVertical: space.xl, gap: space.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
  h1: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, color: colors.ink },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 25, color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, marginTop: space.xs },
  label: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.muted },
  button: { minHeight: TOUCH_MIN + 8, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  buttonOutline: { borderWidth: 1.5, borderColor: colors.accent },
  buttonText: { fontFamily: fonts.bold, fontSize: 17 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg, borderWidth: 1, borderColor: colors.line },
  chip: { minHeight: TOUCH_MIN, paddingHorizontal: space.lg, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.accent, justifyContent: 'center', backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accent },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
  stat: { flex: 1, gap: 2 },
  statValue: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  patchName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
});
