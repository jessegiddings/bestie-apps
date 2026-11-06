import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import type { PromptCard } from "@/content/decks";
import { scoreAuthorship, shuffle, type Scores } from "@/game/night";
import { BigCard, Body, Button, H2, Label, PlayerPicker } from "@/ui/kit";
import { colors, fonts } from "@/ui/theme";
import { PassTo, useDealtCard, type TurnProps } from "./shared";
type Answer = { authorId: string; text: string };
export function WhoWroteThat({ night, onDone }: TurnProps) {
  const card = useDealtCard<PromptCard>();
  const [seat, setSeat] = useState(0);
  const [step, setStep] = useState("pass");
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [deck, setDeck] = useState<Answer[]>([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const [awards, setAwards] = useState<Scores>({});
  const [error, setError] = useState("");
  const saving = useRef(false);
  if (!card) return <Body>Finding a good question…</Body>;
  const player = night.players[seat];
  const answer = deck[index];
  function save() {
    if (saving.current) return;
    const value = text.replace(/\s+/g, " ").trim();
    if (!value) return;
    if (answers.some((a) => a.text.toLowerCase() === value.toLowerCase())) {
      setError("Someone already wrote that. Give it your own twist.");
      return;
    }
    saving.current = true;
    const next = [...answers, { authorId: player.id, text: value }];
    setAnswers(next);
    setText("");
    setError("");
    setStep("handoff");
  }
  if (step === "pass")
    return (
      <PassTo
        name={player.name}
        note="Write privately. No peeking, and don’t sign your answer."
        onReady={() => {
          saving.current = false;
          setStep("write");
        }}
      />
    );
  if (step === "write")
    return (
      <>
        <BigCard label={`${player.name.toUpperCase()}, FINISH THIS`}>
          {card.text}
        </BigCard>
        <TextInput
          accessibilityLabel="Your secret answer"
          value={text}
          onChangeText={(v) => {
            setText(v);
            setError("");
          }}
          placeholder="Make it sound like someone else…"
          placeholderTextColor={colors.muted}
          maxLength={100}
          multiline
          autoComplete="off"
          autoCorrect={false}
          style={{
            backgroundColor: "white",
            borderRadius: 18,
            padding: 18,
            minHeight: 110,
            fontFamily: fonts.body,
            fontSize: 20,
            color: colors.ink,
          }}
        />
        <Body muted>{`${text.length}/100 · Only kept for this round.`}</Body>
        {error ? <Body>{error}</Body> : null}
        <Button
          title="Save & hide my answer"
          disabled={!text.trim()}
          onPress={save}
        />
      </>
    );
  if (step === "handoff")
    return (
      <>
        <Label>ANSWER HIDDEN</Label>
        <H2>
          {seat === night.players.length - 1
            ? "Everyone’s in. Let’s mix them up."
            : `Pass to ${night.players[seat + 1].name}.`}
        </H2>
        <Body>Answers stay hidden until everyone has written.</Body>
        <Button
          title={
            seat === night.players.length - 1
              ? "Shuffle & start guessing"
              : "Phone passed"
          }
          onPress={() => {
            if (seat === night.players.length - 1) {
              setDeck(shuffle(answers));
              setStep("guess");
            } else {
              setSeat(seat + 1);
              setStep("pass");
            }
          }}
        />
      </>
    );
  const author = night.players.find((p) => p.id === answer.authorId)!;
  const next = () => {
    const earned = scoreAuthorship(night.players, answer.authorId, guess!);
    const totals = { ...awards };
    for (const [id, n] of Object.entries(earned))
      totals[id] = (totals[id] ?? 0) + n;
    setAwards(totals);
    setGuess(null);
    if (index === deck.length - 1) {
      setStep("finished");
      onDone(totals);
    } else {
      setIndex(index + 1);
      setStep("guess");
    }
  };
  return (
    <>
      <Label>{`ANSWER ${index + 1} OF ${deck.length}`}</Label>
      <Body muted>{card.text}</Body>
      <BigCard tint="#DCD0FF">{`“${answer.text}”`}</BigCard>
      {step === "guess" ? (
        <>
          <H2>Who wrote that?</H2>
          <Body>
            Talk it over and agree on one name. The real author can bluff, but
            cannot cast the deciding vote.
          </Body>
          <PlayerPicker
            players={night.players}
            selected={guess}
            onPick={setGuess}
          />
          <Button
            title="Lock our guess & reveal"
            disabled={!guess}
            onPress={() => setStep("reveal")}
          />
        </>
      ) : (
        <>
          <H2>{`${author.name} wrote it!`}</H2>
          <Body>
            {guess === answer.authorId
              ? "Caught! Everyone except the author earns +1."
              : `${author.name} fooled the room and earns +2.`}
          </Body>
          <Button
            title={
              index === deck.length - 1
                ? "See the scores"
                : "Next mystery answer"
            }
            onPress={next}
          />
        </>
      )}
    </>
  );
}
