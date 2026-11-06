import { useState } from "react";
import { View } from "react-native";
import type { ActingCard } from "@/content/newGames";
import { pick, scoreReadRoom } from "@/game/night";
import { BigCard, Body, Button, H2, Label } from "@/ui/kit";
import { colors } from "@/ui/theme";
import { PassTo, useDealtCard, type TurnProps } from "./shared";
import { VoteResults } from "./VoteResults";
export function TakeTwo({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<ActingCard>();
  const [direction] = useState(() => pick([0, 1, 2, 3]));
  const [step, setStep] = useState("pass");
  if (!card) return <Body>Getting your scene ready…</Body>;
  if (step === "pass")
    return (
      <PassTo
        name={player.name}
        note="You’re the actor. Everyone else, look away."
        onReady={() => setStep("secret")}
      />
    );
  if (step === "secret")
    return (
      <>
        <Label>YOUR SECRET DIRECTION</Label>
        <BigCard tint="#FFC2AE" label={`SAY: “${card.line}”`}>
          {card.options[direction]}
        </BigCard>
        <Body>
          Use your voice and body. Don’t name the direction. You can read this
          once more before handing the phone back.
        </Body>
        <Button
          title="Hide direction · let’s perform"
          onPress={() => setStep("perform")}
        />
      </>
    );
  if (step === "perform")
    return (
      <>
        <Label>QUIET ON SET</Label>
        <BigCard
          tint="#FFC2AE"
          label={`${player.name.toUpperCase()}, YOUR LINE`}
        >{`“${card.line}”`}</BigCard>
        <Body>
          Actor: perform your line. The room: decide which direction they were
          given.
        </Body>
        <View style={{ gap: 10 }}>
          {card.options.map((o, i) => (
            <H2 key={i}>{`${i + 1}. ${o}`}</H2>
          ))}
        </View>
        <Body muted>
          Need a second take? Go again. Then everyone except the actor shows 1–4
          fingers at once.
        </Body>
        <Button
          title="Votes are up · reveal the direction"
          onPress={() => setStep("reveal")}
        />
      </>
    );
  return (
    <>
      <Label>AND… CUT!</Label>
      <BigCard
        tint={colors.goldSoft}
        label="THE DIRECTION WAS"
      >{`${direction + 1}. ${card.options[direction]}`}</BigCard>
      <VoteResults
        players={night.players.filter((p) => p.id !== player.id)}
        onConfirm={(ids) =>
          onDone(scoreReadRoom(night.players, player.id, ids))
        }
      />
    </>
  );
}
