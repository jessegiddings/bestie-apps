import { cancel, play } from '@bestie/core';
import { Redirect, router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { RULES } from '@/content/decks';
import { choose, CLOSERS, CROWNS, FINAL_ROUND, GAME_INTROS, OPENERS, SCORE_LINES, TIEBREAK } from '@/content/host';
import { currentGame, leaderIds, multiplier, scoreMood, standings, turnPlayer, turnsFor, type Night } from '@/game/night';
import { TURN_SCREENS } from '@/games';
import { useParty } from '@/state/store';
import { Body, Button, Card, H1, H2, HostLine, Label, PlayerPicker, Row, Screen, styles as kit, useHost } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';

export default function NightScreen() {
  const night = useParty((s) => s.night);
  if (!night) return <Redirect href="/" />;
  return <Runner night={night} />;
}

function Runner({ night }: { night: Night }) {
  const { openNight, beginRound, finishTurn, afterScoreboard, breakTie, endNight, start } = useParty.getState();
  const game = currentGame(night);
  const rules = RULES[game];
  const mult = multiplier(night);
  const roundLabel = night.kind === 'night' ? `ROUND ${night.roundIndex + 1} OF ${night.rounds.length}` : `ROUND ${night.roundIndex + 1}`;

  // One host line per moment; the key changes when the moment does, so it plays once.
  const momentKey = `${night.phase}:${night.roundIndex}`;
  const hostClip = useMemo(() => {
    switch (night.phase) {
      case 'opening':
        return choose(OPENERS);
      case 'round-intro':
        return mult > 1 ? choose(FINAL_ROUND) : choose(GAME_INTROS[game]);
      case 'scoreboard':
        return choose(SCORE_LINES[scoreMood(night)]);
      case 'tiebreak':
        return choose(TIEBREAK);
      case 'crowned':
        return choose(CROWNS);
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [momentKey]);
  useHost(hostClip?.id ?? null);

  const leave = () => {
    cancel();
    router.replace('/');
  };

  const header = (
    <Row>
      <View style={{ flex: 1 }}>
        <Label color={colors.accent}>{night.phase === 'opening' || night.phase === 'crowned' ? 'GAME NIGHT' : roundLabel}</Label>
      </View>
      <Pressable accessibilityRole="button" onPress={leave} hitSlop={12}>
        <Text style={{ fontFamily: fonts.bold, color: colors.muted }}>Pause</Text>
      </Pressable>
    </Row>
  );

  if (night.phase === 'opening') {
    return (
      <Screen>
        {header}
        <H1>{'The room is ready.\nLet’s make a night of it.'}</H1>
        {hostClip ? <HostLine clipId={hostClip.id} /> : null}
        <Card>
          <Body>{night.rounds.map((g, i) => `${String(i + 1).padStart(2, '0')}   ${RULES[g].name}${night.kind === 'night' && i === night.rounds.length - 1 ? ' · double points' : ''}`).join('\n')}</Body>
        </Card>
        <Button title="Let’s play" onPress={openNight} />
      </Screen>
    );
  }

  if (night.phase === 'round-intro') {
    return (
      <Screen>
        {header}
        {mult > 1 ? <Label color={colors.gold}>FINAL ROUND · DOUBLE POINTS</Label> : null}
        <H1>{rules.name}</H1>
        <Body muted>{rules.tagline}</Body>
        {hostClip ? <HostLine clipId={hostClip.id} /> : null}
        <Card>
          <Body>{`1. ${rules.rules[0]}`}</Body>
          <Body style={{ marginTop: space.sm }}>{`2. ${rules.rules[1]}`}</Body>
        </Card>
        <Button title="Start the round" onPress={beginRound} />
      </Screen>
    );
  }

  if (night.phase === 'turn') {
    const player = turnPlayer(night);
    const Turn = TURN_SCREENS[game];
    const total = turnsFor(game, night.players.length);
    return (
      <Screen>
        {header}
        <Body muted style={kit.small}>{`${rules.name} · turn ${night.turnIndex + 1} of ${total}${mult > 1 ? ' · double points' : ''}`}</Body>
        <Turn key={`${night.roundIndex}-${night.turnIndex}`} night={night} player={player} onDone={finishTurn} />
      </Screen>
    );
  }

  if (night.phase === 'scoreboard') {
    const last = night.roundIndex >= night.rounds.length - 1;
    return (
      <Screen>
        {header}
        <Label>THE FRIENDLY RIVALRY CONTINUES</Label><H1>Who’s on top?</H1>
        {hostClip ? <HostLine clipId={hostClip.id} /> : null}
        <Board night={night} />
        {night.kind === 'night' ? (
          <Button title={last ? 'Crown the winner' : `Next: ${RULES[night.rounds[night.roundIndex + 1]].name}`} onPress={() => afterScoreboard('continue')} />
        ) : (
          <>
            <Button title={`Another round of ${rules.name}`} onPress={() => afterScoreboard('again')} />
            <Button title="Crown the winner" kind="secondary" onPress={() => afterScoreboard('finish')} />
          </>
        )}
      </Screen>
    );
  }

  if (night.phase === 'tiebreak') {
    const tied = leaderIds(night.scores);
    const tiedPlayers = night.players.filter((p) => tied.includes(p.id));
    return (
      <Screen>
        {header}
        <Label color={colors.gold}>SUDDEN DEATH</Label>
        <H1>{`It’s a tie between ${tiedPlayers.map((p) => p.name).join(' and ')}.`}</H1>
        {hostClip ? <HostLine clipId={hostClip.id} /> : null}
        <Body>{tied.length === night.players.length ? 'Everyone’s tied! On three, everyone points at who deserves the crown.' : 'Everyone else: on three, point at who deserves the crown.'}</Body>
        <PlayerPicker players={tiedPlayers} onPick={breakTie} />
      </Screen>
    );
  }

  const winner = night.players.find((p) => p.id === night.winnerId);
  return (
    <Screen>
      {header}
      <View style={{ alignItems: 'center', gap: space.sm }}>
        <Crown />
        <Label color={colors.gold}>BESTIE OF THE NIGHT</Label>
        <H1>{winner?.name ?? 'Everyone'}</H1>
      </View>
      {hostClip ? <HostLine clipId={hostClip.id} /> : null}
      <Board night={night} final />
      <Button title="Play again" onPress={() => start(night.kind === 'single' ? night.rounds[0] : undefined)} />
      <Button
        title="Done for tonight"
        kind="secondary"
        onPress={() => {
          play(choose(CLOSERS).id, { interrupt: true });
          endNight();
          router.replace('/');
        }}
      />
    </Screen>
  );
}

function Board({ night, final }: { night: Night; final?: boolean }) {
  const rows = standings(night);
  return (
    <Card>
      {rows.map((r) => (
        <Row key={r.player.id}>
          <Text style={{ width: 28, fontFamily: fonts.bold, fontSize: 17, color: r.place === 1 ? colors.gold : colors.muted }}>{r.place}</Text>
          <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.ink, paddingVertical: space.xs }}>{r.player.name}</Text>
          {!final && r.gained > 0 ? <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.good, marginRight: space.sm }}>{`+${r.gained}`}</Text> : null}
          <Text style={{ fontFamily: fonts.bold, fontSize: 30, color: colors.accent, fontVariant: ['tabular-nums'] }}>{r.score}</Text>
        </Row>
      ))}
    </Card>
  );
}

function Crown() {
  return (
    <Svg width={120} height={96} viewBox="0 0 120 96" accessibilityLabel="Crown">
      <Path d="M10 80 L18 28 L42 52 L60 14 L78 52 L102 28 L110 80 Z" fill={colors.goldSoft} stroke={colors.gold} strokeWidth={5} strokeLinejoin="round" />
      <Circle cx={18} cy={24} r={7} fill={colors.gold} />
      <Circle cx={60} cy={10} r={7} fill={colors.gold} />
      <Circle cx={102} cy={24} r={7} fill={colors.gold} />
      <Path d="M14 88 L106 88" stroke={colors.gold} strokeWidth={6} strokeLinecap="round" />
    </Svg>
  );
}
