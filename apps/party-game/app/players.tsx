import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { MAX_PLAYERS, MIN_PLAYERS, NIGHT_ORDER, type GameId } from '@/game/night';
import { useParty } from '@/state/store';
import { Body, Button, Card, H1, Label, Row, Screen } from '@/ui/kit';
import { colors, fonts, radius, space, TOUCH_MIN } from '@/ui/theme';

export default function Players() {
  const { game } = useLocalSearchParams<{ game?: string }>();
  const players = useParty((s) => s.players);
  const addPlayer = useParty((s) => s.addPlayer);
  const removePlayer = useParty((s) => s.removePlayer);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const full = players.length >= MAX_PLAYERS;

  const add = () => {
    if (!name.trim()) return;
    if (addPlayer(name)) {
      setName('');
      setError(null);
    } else setError(full ? `That’s ${MAX_PLAYERS}, the most a night can hold.` : 'That name is already playing.');
  };

  return (
    <Screen>
      <Label color={colors.accent}>01 / THE GUEST LIST</Label>
      <H1>{'Get your people\nto the table.'}</H1>
      <Body muted>{`${MIN_PLAYERS} to ${MAX_PLAYERS} players. First names or nicknames are perfect.`}</Body>

      <Row>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholderTextColor={colors.muted}
          placeholder={full ? 'Table’s full' : 'Add a name'}
          editable={!full}
          maxLength={16}
          returnKeyType="done"
          blurOnSubmit={false}
          accessibilityLabel="Player name"
          style={{ flex: 1, minHeight: TOUCH_MIN + 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: space.lg, fontFamily: fonts.body, fontSize: 17, color: colors.ink }}
        />
        <Button title="Add" onPress={add} disabled={full || !name.trim()} />
      </Row>
      {error ? <Body muted>{error}</Body> : null}

      <View style={{ gap: space.sm }}>
        {players.map((p, i) => (
          <Card key={p.id}>
            <Row>
              <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: colors.muted, width: 28 }}>{i + 1}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.ink }}>{p.name}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${p.name}`} onPress={() => removePlayer(p.id)} hitSlop={12}>
                <Text style={{ fontFamily: fonts.bold, color: colors.coral }}>Remove</Text>
              </Pressable>
            </Row>
          </Card>
        ))}
      </View>

      <Button title={players.length >= MIN_PLAYERS ? game ? 'Everyone’s in · Let’s play' : 'Save guest list' : `Add ${MIN_PLAYERS - players.length} more`} disabled={players.length < MIN_PLAYERS} onPress={() => {
        if (game === 'night' || NIGHT_ORDER.includes(game as GameId)) {
          const st = useParty.getState();
          if (!st.isVip()) st.setDeck('family');
          st.start(game === 'night' ? undefined : game as GameId);
          router.replace('/night');
        } else router.back();
      }} />
      <Button title="Back to the lounge" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
