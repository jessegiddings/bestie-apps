import { useState } from "react";
import { View } from "react-native";
import { toYou, type ChoiceCard } from "@/content/decks";
import { scoreReadRoom } from "@/game/night";
import { BigCard, Body, Button, Chip, H2, Label } from "@/ui/kit";
import { useDealtCard, PassTo, type TurnProps } from "./shared";
import { VoteResults } from "./VoteResults";
export function BestieTest({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<ChoiceCard>();
  const [step, setStep] = useState("pass");
  const [answer, setAnswer] = useState<number | null>(null);
  if (!card) return <Body>Getting the next question…</Body>;
  if (step === "pass")
    return <PassTo name={player.name} onReady={() => setStep("secret")} />;
  if (step === "secret")
    return (
      <>
        <BigCard label={`${player.name}, ONLY YOU LOOK`}>
          {toYou(card.question)}
        </BigCard>
        <View style={{ gap: 10 }}>
          {card.options.map((o, i) => (
            <Chip
              key={i}
              label={`${i + 1}. ${o}`}
              selected={answer === i}
              onPress={() => setAnswer(i)}
            />
          ))}
        </View>
        <Button
          title="Lock and hide my answer"
          disabled={answer === null}
          onPress={() => setStep("vote")}
        />
      </>
    );
  if (step === "vote")
    return (
      <>
        <BigCard label={`ABOUT ${player.name.toUpperCase()}`}>
          {card.question}
        </BigCard>
        {card.options.map((o, i) => (
          <H2 key={i}>{`${i + 1}. ${o}`}</H2>
        ))}
        <Body>
          Everyone else: choose privately. On three, hold up 1–4 fingers
          together. Keep them up!
        </Body>
        <Button
          title="Votes are up · reveal"
          onPress={() => setStep("result")}
        />
      </>
    );
  return (
    <>
      <Label>THE REVEAL</Label>
      <BigCard
        label={`${player.name.toUpperCase()} PICKED`}
      >{`${answer! + 1}. ${card.options[answer!]}`}</BigCard>
      <VoteResults
        players={night.players.filter((p) => p.id !== player.id)}
        onConfirm={(ids) =>
          onDone(scoreReadRoom(night.players, player.id, ids))
        }
      />
    </>
  );
}
