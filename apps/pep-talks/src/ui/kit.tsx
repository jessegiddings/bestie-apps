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
        <Circle cx="38" cy="40" r="7" fill="#FFFFFF" opacity={earned ? 0.7 : 0.3} />
        <SvgText x="50" y="66" fontSize="28" fontWeight="700" textAnchor="middle" fill={earned ? colors.ink : colors.faint}>
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
    <Card tint={tint}>
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
      {showing ? <Body style={{ marginTop: space.sm }}>{caption.text}</Body> : null}
      {showing && captionOnly ? <Body muted style={styles.small}>Her recording is on its way. For now, here are her words.</Body> : null}
      {showing && status === 'failed' ? <Body muted style={styles.small}>That didn't play. Tap to try again.</Body> : null}
      <View style={{ marginTop: space.md }}>
        {locked ? (
          <Button title="Unlock every note" kind="secondary" onPress={() => onLocked?.()} />
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
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg, borderWidth: 1, borderColor: colors.line, gap: space.xs },
  chip: { minHeight: TOUCH_MIN, paddingHorizontal: space.lg, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.accent, justifyContent: 'center', backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.accent },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.accent },
  stat: { flex: 1, gap: 2 },
  statValue: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  charmName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  bracelet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, paddingHorizontal: space.xs },
  braceletCord: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: colors.line, top: '50%' },
  bead: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface },
  momentTile: { flexBasis: '47%', flexGrow: 1, minHeight: 88, borderRadius: radius.md, padding: space.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, gap: 4 },
  momentLabel: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  momentHint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
});
