import { setMuted, useVoice } from '@bestie/core';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { APP_NAME, HOST_NAME, TAGLINE } from '@/content/brand';
import { DECKS, RULES } from '@/content/decks';
import { MIN_PLAYERS, NIGHT_ORDER, type GameId } from '@/game/night';
import { useParty } from '@/state/store';
import { Body, Button, Card, Chip, H1, H2, Label, Row, Screen, styles as kit } from '@/ui/kit';
import { colors, fonts, space } from '@/ui/theme';

export default function Home() {
  const players = useParty((s) => s.players);
  const deck = useParty((s) => s.deck);
  const night = useParty((s) => s.night);
  const setDeck = useParty((s) => s.setDeck);
  const start = useParty((s) => s.start);
  const vip = useParty((s) => s.isVip());
  const muted = useVoice((s) => s.muted);
  const ready = players.length >= MIN_PLAYERS;
  const activeDeck = DECKS.find((d) => d.id === deck)!;
  const deckLocked = activeDeck.vip && !vip;

  const go = (single?: GameId) => {
    if (!ready) return router.push('/players');
    if (deckLocked) setDeck('family');
    start(single);
    router.push('/night');
  };

  return (
    <Screen>
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.accent}>{`HOSTED BY ${HOST_NAME.toUpperCase()}`}</Label>
        </View>
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: !muted }} onPress={() => setMuted(!muted)} hitSlop={12}>
          <Text style={{ fontFamily: fonts.bold, color: colors.accent }}>{muted ? 'Sound off' : 'Sound on'}</Text>
        </Pressable>
      </Row>
      <H1>{APP_NAME}</H1>
      <Body muted>{`${TAGLINE} Five games, one phone, one crown.`}</Body>

      {night && night.phase !== 'crowned' ? (
        <Card tint={colors.goldSoft}>
          <Label color={colors.gold}>GAME IN PROGRESS</Label>
          <Body style={{ marginVertical: space.sm }}>{`Round ${night.roundIndex + 1}: ${RULES[night.rounds[night.roundIndex]].name}`}</Body>
          <Button title="Jump back in" onPress={() => router.push('/night')} />
        </Card>
      ) : null}

      <Card>
        <Row>
          <View style={{ flex: 1 }}>
            <H2>{ready ? `${players.length} players` : 'Who’s playing?'}</H2>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/players')} hitSlop={12}>
            <Text style={{ fontFamily: fonts.bold, color: colors.accent }}>{players.length ? 'Edit' : 'Add'}</Text>
          </Pressable>
        </Row>
        <Body muted style={kit.small}>{players.length ? players.map((p) => p.name).join(', ') : `Add ${MIN_PLAYERS} to 10 names to start.`}</Body>
      </Card>

      <View style={{ gap: space.sm }}>
        <Label>DECK</Label>
        <Row wrap>
          {DECKS.map((d) => (
            <Chip
              key={d.id}
              label={d.vip && !vip ? `${d.name} · VIP` : d.name}
              selected={deck === d.id && !(d.vip && !vip)}
              onPress={() => (d.vip && !vip ? router.push('/premium') : setDeck(d.id))}
            />
          ))}
        </Row>
        <Body muted style={kit.small}>{(deckLocked ? DECKS[0] : activeDeck).blurb}</Body>
      </View>

      <Button title={ready ? 'Start the night' : 'Add players to start'} onPress={() => go()} />

      <Label>OR PLAY ONE GAME</Label>
      {NIGHT_ORDER.map((g) => (
        <Pressable key={g} accessibilityRole="button" onPress={() => go(g)} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <Card>
            <H2>{RULES[g].name}</H2>
            <Body muted style={kit.small}>{RULES[g].tagline}</Body>
          </Card>
        </Pressable>
      ))}

      {!vip ? <Button title="Get the VIP Pass" kind="ghost" onPress={() => router.push('/premium')} /> : null}
    </Screen>
  );
}
