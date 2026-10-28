import { play, replay, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { useId, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';
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
      <Glow />
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
      {tab ? <TabBar active={tab} /> : null}
    </SafeAreaView>
  );
}

/** A soft dusk glow at the top of every screen. */
function Glow() {
  const id = useSvgId('g');
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height={420}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.lilac} stopOpacity={0.22} />
            <Stop offset="0.55" stopColor={colors.accent} stopOpacity={0.06} />
            <Stop offset="1" stopColor={colors.ground} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height={420} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const TABS: { tab: Tab; label: string; href: string; icon: IconName }[] = [
  { tab: 'today', label: 'Tonight', href: '/', icon: 'sun' },
  { tab: 'journey', label: 'Journey', href: '/journey', icon: 'chart' },
  { tab: 'badges', label: 'Badges', href: '/badges', icon: 'star' },
  { tab: 'buddy', label: 'Buddy', href: '/buddy', icon: 'people' },
];

export function TabBar({ active }: { active: Tab }) {
  return (
    <View style={styles.tabWrap} pointerEvents="box-none">
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
              <Icon name={t.icon} size={20} color={on ? colors.accentInk : colors.muted} />
              <Text style={[styles.tabLabel, { color: on ? colors.accentInk : colors.muted }]}>{t.label}</Text>
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
    <View style={[styles.card, tint ? { backgroundColor: tint, borderColor: tint } : null, style]}>
      {glow ? <CardGlow colors={glows[glow]} /> : null}
      {children}
    </View>
  );
}

function CardGlow({ colors: [a, b] }: { colors: readonly [string, string] }) {
  const id = useSvgId('c');
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius.md, overflow: 'hidden' }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={a} stopOpacity={0.28} />
            <Stop offset="1" stopColor={b} stopOpacity={0.08} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
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

/** The progress ring on Tonight: a dusk gradient arc around the day count. */
export function Ring({ progress, size = 220, stroke = 16, children }: { progress: number; size?: number; stroke?: number; children?: ReactNode }) {
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
            stroke={`url(#${id})`}
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

const TIER_GRADIENT: Record<Tier, readonly string[]> = {
  bronze: ['#FFD2AE', '#E08A5A', '#9C4F2C'],
  silver: ['#FFFFFF', '#C9C5DE', '#8C87AA'],
  gold: ['#FFF0B5', '#F3C969', '#C98A23'],
  holo: ['#9BF0D6', '#B9A5FF', '#F7B58F'],
};

export const TIER_LABEL: Record<Tier, string> = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', holo: 'Holo' };

/** Polygon points for a regular n-gon or a star, centred in a 100 box. */
function shape(n: number, r: number, inner?: number, rot = -90): string {
  const pts: string[] = [];
  const count = inner ? n * 2 : n;
  for (let i = 0; i < count; i++) {
    const rad = inner && i % 2 ? inner : r;
    const a = ((rot + (360 / count) * i) * Math.PI) / 180;
    pts.push(`${(50 + rad * Math.cos(a)).toFixed(2)},${(50 + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

const TIER_SHAPE: Record<Tier, { outer: string; inner: string } | null> = {
  bronze: null,
  silver: { outer: shape(6, 47), inner: shape(6, 38) },
  gold: { outer: shape(12, 48, 42), inner: shape(12, 38, 34) },
  holo: { outer: shape(8, 48, 40, -67.5), inner: shape(8, 38, 33, -67.5) },
};

/**
 * A collectible badge. Each tier has its own shape and finish: bronze medallion, silver hexagon,
 * gold sunburst, holo star. Locked badges show as an outline so there is always a next one to want.
 */
export function BadgeArt({ badge, earned, size = 96 }: { badge: Badge; earned: boolean; size?: number }) {
  const id = useSvgId('b');
  const shine = useSvgId('s');
  const [a, b, c] = TIER_GRADIENT[badge.tier];
  const tierShape = TIER_SHAPE[badge.tier];
  const fill = earned ? `url(#${id})` : colors.raised;
  const stroke = earned ? 'rgba(255,255,255,0.55)' : colors.line;
  const iconColor = earned ? '#2A1B10' : colors.faint;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={a} />
          <Stop offset="0.55" stopColor={b} />
          <Stop offset="1" stopColor={c} />
        </LinearGradient>
        <LinearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      {tierShape ? (
        <>
          <Polygon points={tierShape.outer} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={earned ? undefined : '4 4'} />
          <Polygon points={tierShape.inner} fill="none" stroke={earned ? 'rgba(42,27,16,0.35)' : colors.line} strokeWidth={1.5} />
          {earned ? <Polygon points={tierShape.outer} fill={`url(#${shine})`} /> : null}
        </>
      ) : (
        <>
          <Circle cx="50" cy="50" r="46" fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={earned ? undefined : '4 4'} />
          <Circle cx="50" cy="50" r="37" fill="none" stroke={earned ? 'rgba(42,27,16,0.35)' : colors.line} strokeWidth={1.5} strokeDasharray="3 3" />
          {earned ? <Circle cx="50" cy="50" r="46" fill={`url(#${shine})`} /> : null}
        </>
      )}
      <G transform={badge.days ? 'translate(35 22) scale(1.25)' : 'translate(29 29) scale(1.75)'}>
        <Path d={ICONS[earned ? badge.icon : 'lock'].d} stroke={iconColor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </G>
      {badge.days ? (
        <SvgText x="50" y="78" fontSize="22" fontWeight="700" textAnchor="middle" fill={iconColor} fontFamily={fonts.display}>
          {String(badge.days)}
        </SvgText>
      ) : null}
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
    if (showing) replay();
    else play(clipId, { interrupt: true });
    onPlayed?.();
  };
  return (
    <Card glow="dusk">
      <Label color={colors.accent}>{`${title.toUpperCase()} · VOICE NOTE FROM ${HOST_NAME.toUpperCase()}`}</Label>
      <Row gap={space.md} style={{ marginTop: space.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={locked ? 'Unlock her voice notes' : playing ? 'Playing' : showing ? 'Play again' : 'Play'}
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
          Her recording is on its way. For now, here are her words.
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
  screenInner: { paddingHorizontal: space.lg + 4, paddingVertical: space.xl, gap: space.lg, maxWidth: 560, width: '100%', alignSelf: 'center' },
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
  tabWrap: { position: 'absolute', left: 0, right: 0, bottom: 20, alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
    padding: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(35,31,52,0.94)',
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  tabItem: { minHeight: 52, minWidth: 74, paddingHorizontal: 10, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabItemOn: { backgroundColor: colors.accent },
  tabLabel: { fontFamily: fonts.bold, fontSize: 11 },
  badgeTile: { width: '31%', alignItems: 'center', gap: 4, paddingVertical: space.sm },
  badgeName: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, textAlign: 'center' },
  badgeHow: { fontFamily: fonts.body, fontSize: 11, lineHeight: 14, color: colors.muted, textAlign: 'center' },
});
