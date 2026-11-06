import { useState } from "react";
import type { WordCard } from "@/content/decks";
import type { PairCard } from "@/content/newGames";
import { currentGame, oddPlayer, pick, scoreOddOneOut } from "@/game/night";
import { BigCard, Body, Button, H1, H2, Label, PlayerPicker } from "@/ui/kit";
import { colors } from "@/ui/theme";
import { PassTo, useDealtCard, type TurnProps } from "./shared";
export function OddOneOut({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<WordCard | PairCard>();
  const close = currentGame(night) === "close-call";
  const odd = oddPlayer(night);
  const [firstClue] = useState(() =>
    pick(night.players.filter((p) => p.id !== odd.id)),
  );
  const [seat, setSeat] = useState(0),
    [peek, setPeek] = useState(false),
    [step, setStep] = useState("reveal"),
    [suspect, setSuspect] = useState<string | null>(null),
    [lap, setLap] = useState(1),
    [guessed, setGuessed] = useState(false);
  if (!card) return <Body>Dealing secret words…</Body>;
  const order = night.players.map(
    (_, i) =>
      night.players[(night.players.indexOf(player) + i) % night.players.length],
  );
  // Classic mode guarantees a real clue first. Close Call gives everyone a word.
  const first = close ? player : firstClue;
  const caught = suspect === odd.id;
  if (step === "reveal") {
    const who = order[seat];
    if (!peek) return <PassTo name={who.name} onReady={() => setPeek(true)} />;
    const word =
      who.id === odd.id ? (close ? (card as PairCard).other : null) : card.word;
    return (
      <>
        <BigCard
          tint={close ? "#FFE2B7" : colors.surface}
          label={`CATEGORY: ${card.category.toUpperCase()}`}
        >
          {word ?? "You’re the Odd One Out. Blend in."}
        </BigCard>
        <Body muted>
          {close
            ? "Remember your word. You might have the odd word."
            : "Memorize this, then hide it before passing."}
        </Body>
        <Button
          title={
            seat === order.length - 1
              ? "Hide it · everyone is ready"
              : "Hide it & pass"
          }
          onPress={() => {
            setPeek(false);
            if (seat === order.length - 1) setStep("clues");
            else setSeat(seat + 1);
          }}
        />
      </>
    );
  }
  if (step === "clues")
    return (
      <>
        <Label>{`CLUE LAP ${lap} · ${card.category.toUpperCase()}`}</Label>
        <H1>One word. Act natural.</H1>
        <Body>{`${first.name} starts, then go left around the room. Give one-word clues. Don’t say the secret word.`}</Body>
        <Button
          title="Everyone gave a clue · discuss"
          onPress={() => setStep("vote")}
        />
      </>
    );
  if (step === "vote")
    return (
      <>
        <H2>Who sounds a little off?</H2>
        <Body>
          Discuss. If the vote ties, hear one more clue and agree on one
          suspect.
        </Body>
        <PlayerPicker
          players={night.players}
          selected={suspect}
          onPick={setSuspect}
        />
        <Button
          title="Lock the room’s vote"
          disabled={!suspect}
          onPress={() => setStep(close ? "result" : "guess")}
        />
        <Button
          title="Another lap of clues"
          kind="secondary"
          onPress={() => {
            setLap(lap + 1);
            setSuspect(null);
            setStep("clues");
          }}
        />
      </>
    );
  if (step === "guess")
    return (
      <>
        <Label>
          {caught ? "CAUGHT… BUT ONE LAST CHANCE" : "THE BLUFFER ESCAPED"}
        </Label>
        <H2>{`${odd.name}, guess the secret word out loud.`}</H2>
        <Body>
          {caught
            ? "A correct guess earns you +2. Everyone else still earns +1 for catching you."
            : "You earned +2 for escaping. Guess the word for bragging rights."}
        </Body>
        <Button
          title="Guess spoken · reveal the word"
          onPress={() => setStep("judge")}
        />
      </>
    );
  if (step === "judge")
    return (
      <>
        <BigCard label="THE SECRET WORD">{card.word}</BigCard>
        <H2>Did the bluffer say this word?</H2>
        <Button
          title="Yes, they got it"
          onPress={() => {
            setGuessed(true);
            setStep("result");
          }}
        />
        <Button
          title="No, they missed"
          kind="secondary"
          onPress={() => {
            setGuessed(false);
            setStep("result");
          }}
        />
      </>
    );
  return (
    <>
      <Label>{caught ? "CAUGHT" : "GOT AWAY WITH IT"}</Label>
      <H1>{odd.name}</H1>
      <Body>
        {close
          ? `Most players had “${card.word}”. ${odd.name} had “${(card as PairCard).other}”.`
          : `The secret word was “${card.word}”.`}
      </Body>
      <Body>
        {caught
          ? `Everyone else +1.${!close && guessed ? " Bluffer +2 for the correct word." : ""}`
          : "Bluffer +2 total."}
      </Body>
      <Button
        title="Bank the points"
        onPress={() =>
          onDone(
            scoreOddOneOut(
              night.players,
              odd.id,
              caught,
              close ? false : guessed,
            ),
          )
        }
      />
    </>
  );
}
