import { setMuted, useVoice } from "@bestie/core";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { ALL_GAMES, type GameId } from "@/game/night";
import { RULES } from "@/content/decks";
import { useParty } from "@/state/store";
import { Body, Button, Card, H1, Label, Row, Screen } from "@/ui/kit";
import { GameArt, GAME_LOOK } from "@/ui/GameArt";
import { colors, fonts } from "@/ui/theme";
export default function Home() {
  const { width } = useWindowDimensions();
  const st = useParty();
  const muted = useVoice((s) => s.muted);
  const active = st.night && st.night.phase !== "crowned";
  const play = (game: GameId) => router.push(`/players?game=${game}`);
  return (
    <Screen>
      <Row>
        <View style={{ flex: 1 }}>
          <Label color={colors.ink}>THE GAME NIGHT EDITION</Label>
        </View>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Host sound"
          accessibilityState={{ checked: !muted }}
          onPress={() => setMuted(!muted)}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              color: colors.accent,
              fontSize: 12,
            }}
          >
            {muted ? "SOUND OFF" : "SOUND ON"}
          </Text>
        </Pressable>
      </Row>
      <View style={{ alignItems: "center", gap: 10 }}>
        <Image
          source={require("../assets/mess-around-cover.jpeg")}
          accessibilityLabel="The Mess Around with Hannah Simone and Lamorne Morris"
          resizeMode="contain"
          style={{
            width: Math.min(width - 48, 300),
            height: Math.min(width - 48, 300),
            borderRadius: 18,
          }}
        />
        <Body muted>One phone. A room full of bad influences.</Body>
      </View>
      {active ? (
        <Button title="Resume our game" onPress={() => router.push("/night")} />
      ) : null}
      <View
        style={{
          backgroundColor: colors.ink,
          padding: 24,
          borderRadius: 24,
          gap: 14,
        }}
      >
        <Label color={colors.goldSoft}>NEW FOR GAME NIGHT</Label>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 30,
            lineHeight: 34,
            color: "#FFF8E9",
          }}
        >
          You bring the drama.
        </Text>
        <Text
          style={{
            fontFamily: fonts.body,
            color: "#EDE6D7",
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          Act a ridiculous scene. Keep your answer secret. Catch the friend
          who’s a little off.
        </Text>
        <Button
          title="Start with Take Two →"
          onPress={() => play("take-two")}
        />
      </View>
      <Label>EIGHT WAYS TO MAKE A SCENE</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {ALL_GAMES.map((g, i) => (
          <Pressable
            key={g}
            accessibilityRole="button"
            accessibilityLabel={`Play ${RULES[g].name}`}
            onPress={() => play(g)}
            style={({ pressed }) => ({
              width: "47%",
              flexGrow: 1,
              backgroundColor: GAME_LOOK[g].color,
              borderRadius: 22,
              padding: 17,
              minHeight: 225,
              opacity: pressed ? 0.8 : 1,
              gap: 9,
            })}
          >
            <Label color={colors.ink}>
              {i < 3
                ? "NEW GAME"
                : g === "last-word"
                  ? "ELIMINATION FINALE"
                  : "REMIXED"}
            </Label>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 25,
                lineHeight: 29,
                color: colors.ink,
                letterSpacing: -0.8,
              }}
            >
              {GAME_LOOK[g].short}
            </Text>
            <View style={{ alignSelf: "flex-end", marginTop: "auto" }}>
              <GameArt game={g} size={88} />
            </View>
          </Pressable>
        ))}
      </View>
      <H1>Make a night of it.</H1>
      <Body muted>
        Pick a mix. We handle the order and scores. The finale is worth double.
      </Body>
      <Button
        title="Quick mix · 3 games"
        onPress={() => router.push("/players?mode=short")}
      />
      <Body muted style={{ fontSize: 12 }}>
        Take Two, Who Wrote That?, Last Word
      </Body>
      <Button
        title="The full mess · 5 games"
        kind="secondary"
        onPress={() => router.push("/players?mode=full")}
      />
      <Body muted style={{ fontSize: 12 }}>
        Point Blank, Take Two, Who Wrote That?, Odd One Out, Last Word
      </Body>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Team Hannah versus Team Lamorne"
        onPress={() => router.push("/players?mode=teams")}
      >
        <Card tint={colors.goldSoft}>
          <Label>CHOOSE A SIDE</Label>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 26,
              color: colors.ink,
              marginVertical: 10,
            }}
          >
            Team Hannah vs. Team Lamorne
          </Text>
          <Body>
            Two captains. Five games. One winning side. For 4, 6, 8, or 10
            players.
          </Body>
        </Card>
      </Pressable>
      <Button
        title="Write our own prompts"
        kind="secondary"
        onPress={() => router.push("/house-rules")}
      />
      <Button
        title="Explore the host challenge"
        kind="ghost"
        onPress={() => router.push("/hosts")}
      />
      <Body muted style={{ fontSize: 12 }}>
        The separate host challenge still uses sample puzzles. Personal host
        answers are coming after recording.
      </Body>
      <Body muted style={{ fontSize: 11, textAlign: "center" }}>
        REVIEW BUILD 02 · Temporary synthetic voices. Hannah and Lamorne’s
        recordings are not in this preview. Family decks are open. No purchases.
      </Body>
    </Screen>
  );
}
