import { play } from "@bestie/core";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FORFEITS, type PromptCard } from "@/content/decks";
import { COUNTDOWN } from "@/content/host";
import { pick, scorePrediction } from "@/game/night";
import {
  HostLine,
  useHost,
  BigCard,
  Body,
  Button,
  Card,
  Chip,
  H2,
  Label,
  PlayerPicker,
} from "@/ui/kit";
import { colors, fonts } from "@/ui/theme";
import { useGamePause, useDealtCard, type TurnProps } from "./shared";

type Step =
  | "read"
  | "count"
  | "who"
  | "story"
  | "forfeit"
  | "bet"
  | "tie"
  | "revote";
const BEATS = ["3", "2", "1", "POINT!"];

export function PointBlank({ night, player, onDone }: TurnProps) {
  const { paused } = useGamePause();
  const card = useDealtCard<PromptCard>();
  const [step, setStep] = useState<Step>("bet");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [tieIds, setTieIds] = useState<string[]>([]);
  const award = (told: boolean) =>
    onDone(scorePrediction(player.id, prediction, pointed, told));
  const [beat, setBeat] = useState(0);
  const [pointed, setPointed] = useState<string | null>(null);
  const [forfeit] = useState(() => pick(FORFEITS));
  const name = night.players.find((p) => p.id === pointed)?.name ?? "";

  useEffect(() => {
    if (paused || step !== "count") return;
    if (beat >= BEATS.length - 1) {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      ).catch(() => undefined);
      const t = setTimeout(() => setStep("who"), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBeat((b) => b + 1), 900);
    return () => clearTimeout(t);
  }, [step, beat, paused]);

  const reaction = step === "story" ? "react-story-hannah" : null;
  useHost(reaction);

  if (!card) return <Body muted>Getting your next card ready…</Body>;

  if (step === "bet")
    return (
      <>
        <Label>{`${player.name.toUpperCase()}, YOUR SECRET BET`}</Label>
        <BigCard>{card.text}</BigCard>
        <Body>
          Everyone else, look away. Who will get the most fingers? A correct
          prediction earns you +2.
        </Body>
        <PlayerPicker
          players={night.players}
          selected={prediction}
          onPick={setPrediction}
        />
        <Button
          title="Hide my prediction"
          disabled={!prediction}
          onPress={() => setStep("read")}
        />
      </>
    );
  if (step === "tie")
    return (
      <>
        <H2>Who is tied?</H2>
        <Body>
          Select everyone with the most fingers. We’ll give them one chance to
          defend themselves.
        </Body>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {night.players.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              selected={tieIds.includes(p.id)}
              onPress={() =>
                setTieIds((v) =>
                  v.includes(p.id) ? v.filter((x) => x !== p.id) : [...v, p.id],
                )
              }
            />
          ))}
        </View>
        <Button
          title="Start the face-off"
          disabled={tieIds.length < 2}
          onPress={() => setStep("revote")}
        />
      </>
    );
  if (step === "revote")
    return (
      <>
        <H2>Plead your case.</H2>
        <Body>
          Each tied player gets one sentence to defend themselves. Then everyone
          points again, only at these players.
        </Body>
        <Label>WHO WON THE RE-VOTE?</Label>
        <PlayerPicker
          players={night.players.filter((p) => tieIds.includes(p.id))}
          onPick={(id) => {
            setPointed(id);
            setStep("story");
          }}
        />
        <Button
          title="Still tied · no points this turn"
          kind="ghost"
          onPress={() => onDone({})}
        />
      </>
    );
  if (step === "read" || step === "count") {
    return (
      <>
        <BigCard label="READ IT OUT LOUD">{card.text}</BigCard>
        {step === "count" ? (
          <Text
            accessibilityLiveRegion="assertive"
            style={{
              fontFamily: fonts.bold,
              fontSize: 64,
              textAlign: "center",
              color: beat === BEATS.length - 1 ? colors.coral : colors.accent,
            }}
          >
            {BEATS[beat]}
          </Text>
        ) : (
          <Button
            title="Count us in"
            onPress={() => {
              play(COUNTDOWN.id, { interrupt: true });
              setBeat(0);
              setStep("count");
            }}
          />
        )}
      </>
    );
  }

  if (step === "who") {
    return (
      <>
        <H2>Who got the most fingers?</H2>
        <PlayerPicker
          players={night.players}
          onPick={(id) => {
            setPointed(id);
            setStep("story");
          }}
        />
        <Button
          title="It’s a tie · face-off"
          kind="secondary"
          onPress={() => setStep("tie")}
        />
      </>
    );
  }

  if (step === "story") {
    return (
      <>
        <Label color={colors.accent}>{name.toUpperCase()}</Label>
        {reaction ? <HostLine clipId={reaction} /> : null}
        <Body>
          {prediction === pointed
            ? `${player.name} called it! +2 for the prediction.`
            : `${player.name} missed the prediction.`}
        </Body>
        <H2>{`${name}, tell us why. Or don’t, and take a forfeit.`}</H2>
        <Button
          title={`${name} told the story (+1)`}
          kind="good"
          onPress={() => award(true)}
        />
        <Button
          title="They’re passing"
          kind="secondary"
          onPress={() => setStep("forfeit")}
        />
      </>
    );
  }

  return (
    <>
      <Card tint={colors.coralSoft}>
        <Label
          color={colors.coral}
        >{`FORFEIT FOR ${name.toUpperCase()}`}</Label>
        <Body style={{ marginTop: 8 }}>{forfeit}</Body>
      </Card>
      <Button title="Done, next" onPress={() => award(false)} />
    </>
  );
}
