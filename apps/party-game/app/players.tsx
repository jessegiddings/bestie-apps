import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import {
  ALL_GAMES,
  cleanName,
  type GameId,
  type SessionMode,
} from "@/game/night";
import { RULES } from "@/content/decks";
import { useParty } from "@/state/store";
import { Body, Button, Card, H1, Label, Row, Screen } from "@/ui/kit";
import { colors, fonts } from "@/ui/theme";
export default function Players() {
  const params = useLocalSearchParams<{ game?: string; mode?: string }>();
  const st = useParty();
  const game = ALL_GAMES.includes(params.game as GameId)
    ? (params.game as GameId)
    : undefined;
  const mode: SessionMode = game
    ? "single"
    : ["short", "full", "teams"].includes(params.mode ?? "")
      ? (params.mode as SessionMode)
      : "short";
  const [names, setNames] = useState<string[]>(() =>
    Array.from(
      { length: Math.max(mode === "teams" ? 4 : 3, st.players.length) },
      (_, i) => st.players[i]?.name ?? "",
    ),
  );
  const [error, setError] = useState("");
  const [replace, setReplace] = useState(false);
  const [skip, setSkip] = useState(false);
  const valid = mode !== "teams" || names.length % 2 === 0;
  const launch = (withoutNames = false, confirmed = false) => {
    if (!valid) {
      setError("Team mode needs an even number so the teams are balanced.");
      return;
    }
    const roster = names.map((n, i) =>
      withoutNames ? `Player ${i + 1}` : cleanName(n) || `Player ${i + 1}`,
    );
    if (new Set(roster.map((n) => n.toLowerCase())).size !== roster.length) {
      setError("Use a different name or nickname for each person.");
      return;
    }
    if (st.night && st.night.phase !== "crowned" && !confirmed) {
      setSkip(withoutNames);
      setReplace(true);
      return;
    }
    st.launch(roster, game, mode);
    router.replace("/night");
  };
  return (
    <Screen>
      <Label>
        {game
          ? RULES[game].name
          : mode === "teams"
            ? "TEAM HANNAH VS TEAM LAMORNE"
            : mode === "short"
              ? "THE QUICK MIX"
              : "THE FULL MESS"}
      </Label>
      <H1>Who’s in the room?</H1>
      <Body>
        Names make the reveals better. Your crew stays on this device for next
        time.
      </Body>
      <Row>
        <Button
          title="−"
          disabled={names.length <= 3}
          onPress={() => setNames((v) => v.slice(0, -1))}
        />
        <Body>{`${names.length} players`}</Body>
        <Button
          title="+"
          disabled={names.length >= 10}
          onPress={() => setNames((v) => [...v, ""])}
        />
      </Row>
      {names.map((name, i) => (
        <View key={i} style={{ gap: 5 }}>
          <Label>
            {mode === "teams"
              ? i % 2 === 0
                ? "TEAM HANNAH"
                : "TEAM LAMORNE"
              : `PLAYER ${i + 1}`}
          </Label>
          <TextInput
            accessibilityLabel={`Player ${i + 1} name`}
            value={name}
            maxLength={16}
            placeholder={`Player ${i + 1}`}
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            onChangeText={(text) => {
              setNames((v) => v.map((x, j) => (j === i ? text : x)));
              setError("");
            }}
            style={{
              backgroundColor: "white",
              borderRadius: 14,
              minHeight: 52,
              paddingHorizontal: 16,
              fontSize: 18,
              fontFamily: fonts.body,
              color: colors.ink,
            }}
          />
        </View>
      ))}
      {!valid ? <Body>Teams need 4, 6, 8, or 10 players.</Body> : null}
      {error ? <Body>{error}</Body> : null}
      {replace ? (
        <Card tint={colors.goldSoft}>
          <Body>
            This starts a new session and replaces the current scores.
          </Body>
          <Button
            title="Start this new session"
            onPress={() => launch(skip, true)}
          />
          <Button
            title="Keep current game"
            kind="ghost"
            onPress={() => {
              setReplace(false);
              router.replace("/night");
            }}
          />
        </Card>
      ) : (
        <>
          <Button
            title="Everyone’s in · let’s play"
            disabled={!valid}
            onPress={() => launch()}
          />
          <Button
            title="Skip names & play"
            kind="ghost"
            disabled={!valid}
            onPress={() => launch(true)}
          />
        </>
      )}
      <Button
        title="Back to games"
        kind="ghost"
        onPress={() => router.replace("/")}
      />
    </Screen>
  );
}
