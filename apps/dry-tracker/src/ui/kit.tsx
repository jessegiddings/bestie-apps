import { play, cancel, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useId, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { HOST_NAME } from '@/content/brand';
import type { Badge, BadgeIcon, Tier } from '@/state/badges';
import { colors, fonts, glows, radius, space, TOUCH_MIN } from './theme';

export type Tab = 'today' | 'journey' | 'badges' | 'buddy';

/** react-native-svg needs gradient ids that are safe inside url(#…). */
function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

export function Screen({ children, scroll = true, tab }: { children: ReactNode; scroll?: boolean; tab?: Tab }) {
  const body = <View style={[styles.screenInner, tab ? { paddingBottom: 120 } : null]}>{children}</View>;
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
      {tab ? <TabBar active={tab} /> : null}
    </SafeAreaView>
  );
}

const TABS: { tab: Tab; label: string; href: string; icon: IconName }[] = [
  { tab: 'today', label: 'Today', href: '/', icon: 'sun' },
  { tab: 'journey', label: 'Journey', href: '/journey', icon: 'chart' },
  { tab: 'badges', label: 'Badges', href: '/badges', icon: 'star' },
  { tab: 'buddy', label: 'Buddy', href: '/buddy', icon: 'people' },
];

export function TabBar({ active }: { active: Tab }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabWrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const on = t.tab === active;
          return (
            <Pressable
              key={t.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={t.label}
              onPress={() => !on && router.navigate(t.href as never)}
              style={[styles.tabItem, on && styles.tabItemOn]}
            >
              <Icon name={t.icon} size={20} color={on ? colors.accent : colors.muted} />
              <Text style={[styles.tabLabel, { color: on ? colors.accent : colors.muted }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return (
    <Text style={styles.h1} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <Text style={styles.h2} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body, muted && { color: colors.muted }, style]}>{children}</Text>;
}

export function Label({ children, color }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.label, color ? { color } : null]}>{children}</Text>;
}

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'coral';

export function Button({
  title,
  onPress,
  kind = 'primary',
  disabled,
  style,
  icon,
}: {
  title: string;
  onPress: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  const bg = { primary: colors.accent, secondary: colors.raised, ghost: 'transparent', coral: colors.coral }[kind];
  const fg = kind === 'primary' ? colors.accentInk : kind === 'coral' ? '#FFFFFF' : kind === 'ghost' ? colors.accent : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        kind === 'secondary' && styles.buttonOutline,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, tint, style, glow }: { children: ReactNode; tint?: string; style?: StyleProp<ViewStyle>; glow?: keyof typeof glows }) {
  return (
    <View style={[styles.card, glow ? { backgroundColor: glows[glow][0] } : null, tint ? { backgroundColor: tint, borderColor: tint } : null, style]}>
      {children}
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipOn]}>
      <Text style={[styles.chipText, selected && { color: colors.accentInk }]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, gap = space.sm, wrap, style }: { children: ReactNode; gap?: number; wrap?: boolean; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'center' }, style]}>{children}</View>;
}

export function Stat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** A quiet progress ring. */
export function Ring({ progress, size = 200, stroke = 5, children }: { progress: number; size?: number; stroke?: number; children?: ReactNode }) {
  const id = useSvgId('r');
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={glows.dusk[0]} />
            <Stop offset="1" stopColor={glows.dusk[1]} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.raised} strokeWidth={stroke} fill="none" />
        {p > 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${c * p} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

export type IconName = BadgeIcon | 'sun' | 'chart' | 'people' | 'play' | 'pause' | 'check' | 'lock' | 'gear' | 'drop' | 'phone' | 'share';

const ICONS: Record<IconName, { d: string; fill?: boolean }> = {
  sprout: { d: 'M12 21v-8 M12 13c0-4-3-6-7-6 0 4 3 6 7 6z M12 11c0-4 3-6 7-6 0 4-3 6-7 6z' },
  flame: { d: 'M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4z' },
  moon: { d: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z' },
  star: { d: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z' },
  crown: { d: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z' },
  mountain: { d: 'M2 20l7-12 4 6 3-4 6 10z' },
  wave: { d: 'M2 10c3 0 3-3 6-3s3 3 6 3 3-3 6-3 M2 16c3 0 3-3 6-3s3 3 6 3 3-3 6-3' },
  shield: { d: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z' },
  heart: { d: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z' },
  calendar: { d: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5' },
  compass: { d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M15.5 8.5l-2 5-5 2 2-5z' },
  headphones: { d: 'M4 15v-3a8 8 0 0 1 16 0v3 M4 15h3v5H4z M17 15h3v5h-3z' },
  pen: { d: 'M4 20l4-1 11-11-3-3L5 16z M14 7l3 3' },
  sunrise: { d: 'M3 18h18 M6 18a6 6 0 0 1 12 0 M12 4v4 M4.9 9.9l2 2 M19.1 9.9l-2 2' },
  sun: { d: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4' },
  chart: { d: 'M5 20V11 M12 20V5 M19 20v-6' },
  people: { d: 'M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7z M2 20c0-4 3-6 7-6s7 2 7 6 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14c2.5.5 4 2.5 4 6' },
  play: { d: 'M8 5v14l11-7z', fill: true },
  pause: { d: 'M7 5h4v14H7z M13 5h4v14h-4z', fill: true },
  check: { d: 'M5 12l5 5 9-10' },
  lock: { d: 'M6 11h12v9H6z M8 11V8a4 4 0 0 1 8 0v3' },
  gear: { d: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1' },
  drop: { d: 'M12 3c3 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-6.5 6-11z' },
  phone: { d: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' },
  share: { d: 'M12 3v12 M7 8l5-5 5 5 M5 13v7h14v-7' },
};

export function Icon({ name, size = 22, color = colors.ink, strokeWidth = 2 }: { name: IconName; size?: number; color?: string; strokeWidth?: number }) {
  const icon = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icon.d} stroke={icon.fill ? 'none' : color} fill={icon.fill ? color : 'none'} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const TIER_LABEL: Record<Tier, string> = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', holo: 'Holo' };

export function BadgeArt({ badge, earned, size = 96 }: { badge: Badge; earned: boolean; size?: number }) {
  const tone = earned ? colors.accent : colors.faint;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill={earned ? colors.accentSoft : colors.ground} stroke={earned ? colors.accent : colors.line} strokeWidth="1" />
      <Circle cx="50" cy="50" r="38" fill="none" stroke={earned ? '#C0CDBB' : colors.line} strokeWidth="1" />
      <G transform={badge.days ? 'translate(35 22) scale(1.25)' : 'translate(29 29) scale(1.75)'}>
        <Path d={ICONS[earned ? badge.icon : 'lock'].d} stroke={tone} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      {badge.days ? <SvgText x="50" y="78" fontSize="22" textAnchor="middle" fill={tone}>{String(badge.days)}</SvgText> : null}
    </Svg>
  );
}

/** A tile on the Badges screen: the art, the name, and how to earn it. */
export function BadgeTile({ badge, earned, onPress }: { badge: Badge; earned: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}, ${TIER_LABEL[badge.tier]}, ${earned ? 'earned' : `locked. ${badge.how}`}`}
      style={styles.badgeTile}
    >
      <BadgeArt badge={badge} earned={earned} size={84} />
      <Text style={[styles.badgeName, !earned && { color: colors.muted }]} numberOfLines={2}>
        {badge.name}
      </Text>
      <Text style={styles.badgeHow} numberOfLines={2}>
        {earned ? TIER_LABEL[badge.tier] : badge.how}
      </Text>
    </Pressable>
  );
}

const BARS = [8, 14, 22, 12, 26, 18, 10, 20, 28, 16, 9, 18, 24, 12, 8, 16, 22, 14, 10, 6];

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
  const press = () => {
    if (locked) return onLocked?.();
    if (playing) cancel();
    else play(clipId, { interrupt: true, onComplete: onPlayed });
  };
  return (
    <Card glow="dusk">
      <Label color={colors.accent}>{`${title.toUpperCase()} · VOICE NOTE FROM ${HOST_NAME.toUpperCase()}`}</Label>
      <Row gap={space.md} style={{ marginTop: space.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={locked ? 'Unlock her voice notes' : playing ? 'Stop playback' : showing ? 'Play again' : 'Play'}
          onPress={press}
          style={styles.playBtn}
        >
          <Icon name={locked ? 'lock' : playing ? 'pause' : 'play'} size={24} color={colors.accentInk} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 3, height: 32 }}>
          {BARS.map((h, i) => (
            <View key={i} style={{ flex: 1, height: h, borderRadius: 2, backgroundColor: showing ? colors.accent : colors.line, opacity: playing ? 1 : 0.8 }} />
          ))}
        </View>
      </Row>
      {locked ? (
        <Body muted style={styles.small}>
          Tonight's note comes with Premium. Tap to unlock.
        </Body>
      ) : null}
      {showing ? <Body style={{ marginTop: space.md }}>{caption.text}</Body> : null}
      {showing && captionOnly ? (
        <Body muted style={styles.small}>
          Script preview · Hannah’s recording hasn’t been added yet.
        </Body>
      ) : null}
      {showing && status === 'failed' ? (
        <Body muted style={styles.small}>
          That didn't play. Tap to try again.
        </Body>
      ) : null}
    </Card>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  scroll: { flexGrow: 1 },
  screenInner: { paddingHorizontal: space.lg + 4, paddingVertical: space.xl, gap: space.xl, maxWidth: 560, width: '100%', alignSelf: 'center' },
  h1: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.ink, letterSpacing: -0.5 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, marginTop: space.xs },
  label: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.4, color: colors.muted },
  button: {
    minHeight: TOUCH_MIN + 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    gap: space.sm,
  },
  buttonOutline: { borderWidth: 1, borderColor: colors.line },
  buttonText: { fontFamily: fonts.bold, fontSize: 16 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg + 4, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  chip: {
    minHeight: TOUCH_MIN,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    backgroundColor: colors.raised,
  },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  stat: { flex: 1, gap: 2 },
  statValue: { fontFamily: fonts.display, fontSize: 28, color: colors.ink, fontVariant: ['tabular-nums'] },
  statLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  tabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', backgroundColor: colors.ground, borderTopWidth: 1, borderColor: colors.line, paddingTop: 8 },
  tabBar: {
    flexDirection: 'row',
    width: '100%', maxWidth: 520,
    gap: 4,
    padding: 6,
    borderRadius: 0,
    backgroundColor: colors.ground,
    borderWidth: 0,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  tabItem: { minHeight: 52, flex: 1, minWidth: 0, paddingHorizontal: 8, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabItemOn: { backgroundColor: colors.accentSoft },
  tabLabel: { fontFamily: fonts.bold, fontSize: 11 },
  badgeTile: { width: '31%', alignItems: 'center', gap: 4, paddingVertical: space.sm },
  badgeName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  badgeHow: { fontFamily: fonts.body, fontSize: 11, lineHeight: 14, color: colors.muted, textAlign: 'center' },
});
