import { play, replay, useVoice } from '@bestie/core';
import { useEffect, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST_NAME } from '@/content/brand';
import { colors, fonts, radius, space, TOUCH_MIN } from './theme';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const body = <View style={styles.screenInner}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
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

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'coral' | 'good';

export function Button({ title, onPress, kind = 'primary', disabled, style }: { title: string; onPress: () => void; kind?: ButtonKind; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const bg = { primary: colors.accent, secondary: colors.surface, ghost: 'transparent', coral: colors.coral, good: colors.good }[kind];
  const fg = kind === 'primary' || kind === 'coral' || kind === 'good' ? '#FFFFFF' : colors.accent;
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

/**
 * What the host just said, shown as a caption with a replay button. Until a line is recorded the
 * words show with a note that her recording is on its way, never a synthetic voice.
 */
export function HostLine({ clipId }: { clipId: string }) {
  const caption = useVoice((s) => s.caption);
  const status = useVoice((s) => s.status);
  const captionOnly = useVoice((s) => s.captionOnly);
  if (!caption || caption.id !== clipId) return null;
  return (
    <Card tint={colors.accentSoft}>
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.accent}>{HOST_NAME.toUpperCase()}</Label>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Play that line again" hitSlop={12} onPress={() => (status === 'playing' ? undefined : replay())}>
          <Text style={styles.replay}>{status === 'playing' ? 'Playing…' : 'Replay'}</Text>
        </Pressable>
      </Row>
      <Body style={{ marginTop: space.xs }}>{caption.text}</Body>
      {captionOnly ? <Body muted style={styles.small}>Host script preview · Hannah’s recordings aren’t in this build yet.</Body> : null}
      {status === 'failed' ? <Body muted style={styles.small}>That didn’t play. Tap Replay to try again.</Body> : null}
    </Card>
  );
}

/** Says a host line once when a screen shows it. */
export function useHost(clipId: string | null) {
  useEffect(() => {
    if (clipId) play(clipId, { interrupt: true });
  }, [clipId]);
}

/** A big card face for prompts and words. */
export function BigCard({ label, children, tint = colors.surface, color = colors.ink }: { label?: string; children: ReactNode; tint?: string; color?: string }) {
  return (
    <View style={[styles.bigCard, { backgroundColor: tint }]}>
      {label ? <Label color={color === colors.ink ? colors.muted : color}>{label}</Label> : null}
      <Text style={[styles.bigText, { color }]}>{children}</Text>
    </View>
  );
}

/** Pick one player; used for votes, "who got the most fingers" and "who's holding the phone". */
export function PlayerPicker({ players, onPick, exclude = [], selected }: { players: { id: string; name: string }[]; onPick: (id: string) => void; exclude?: string[]; selected?: string | null }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
      {players
        .filter((p) => !exclude.includes(p.id))
        .map((p) => (
          <Chip key={p.id} label={p.name} selected={selected === p.id} onPress={() => onPick(p.id)} />
        ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  scroll: { flexGrow: 1 },
  screenInner: { paddingHorizontal: 24, paddingVertical: 24, gap: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  h1: { fontFamily: fonts.bold, fontSize: 38, lineHeight: 42, letterSpacing: -1.8, color: colors.ink },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, marginTop: space.xs },
  label: { fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.7, color: colors.muted },
  button: { minHeight: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  buttonOutline: { borderWidth: 1, borderColor: colors.line },
  buttonText: { fontFamily: fonts.bold, fontSize: 17 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg, borderWidth: 1, borderColor: colors.line },
  chip: { minHeight: TOUCH_MIN, paddingHorizontal: space.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, justifyContent: 'center', backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accent },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
  stat: { flex: 1, gap: 2 },
  statValue: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  replay: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
  bigCard: { borderRadius: radius.lg, padding: space.xl, minHeight: 220, justifyContent: 'center', gap: space.md, borderWidth: 1, borderColor: colors.line },
  bigText: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 40, letterSpacing: -1, color: colors.ink },
});
