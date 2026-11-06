import { useEffect, useRef, useState } from "react";
import { cardsFor, type PromptCard } from "@/content/decks";
import { pick, scoreStory, secretFor } from "@/game/night";
import { BigCard, Body, Button, H1, H2, Label } from "@/ui/kit";
import { colors } from "@/ui/theme";
import { PassTo, useDealtCard, useGamePause, type TurnProps } from "./shared";
import { VoteResults } from "./VoteResults";
export function RealOrMadeUp({ night, player, onDone }: TurnProps) {
  const card = useDealtCard<PromptCard>();
  const [alternative, setAlternative] = useState<PromptCard | null>(null);
  const [chosen, setChosen] = useState<PromptCard | null>(null);
  const [step, setStep] = useState("pass");
  const [secret] = useState(secretFor);
  const [left, setLeft] = useState(45);
  const { paused } = useGamePause();
  const extra = useRef(false);
  useEffect(() => {
    if (card && !extra.current) {
      extra.current = true;
      setAlternative(
        pick(
          (cardsFor("real-or-made-up", night.deck) as PromptCard[]).filter(
            (c) => c.id !== card.id,
          ),
        ),
      );
    }
  }, [card, night.deck]);
  useEffect(() => {
    if (paused || !["story", "questions"].includes(step) || left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, left, paused]);
  if (!card || !alternative) return <Body>Finding two good stories…</Body>;
  if (step === "pass")
    return <PassTo name={player.name} onReady={() => setStep("secret")} />;
  if (step === "secret")
    return (
      <>
        <Label>YOUR SECRET</Label>
        <H1>{secret === "truth" ? "Tell a true story." : "Make it all up."}</H1>
        <Body>Pick the prompt you can sell best.</Body>
        {[card, alternative].map((c) => (
          <Button
            key={c.id}
            title={c.text}
            kind={chosen?.id === c.id ? "primary" : "secondary"}
            onPress={() => setChosen(c)}
          />
        ))}
        <Button
          title="Hide secret · start story"
          disabled={!chosen}
          onPress={() => setStep("story")}
        />
        <Button
          title="Skip this turn · no points"
          kind="ghost"
          onPress={() => onDone({})}
        />
      </>
    );
  if (step === "story" || step === "questions")
    return (
      <>
        <Label>{`${player.name.toUpperCase()} · ${step === "story" ? "STORY TIME" : "CROSS-EXAMINATION"}`}</Label>
        <BigCard>{chosen!.text}</BigCard>
        <H1>{left > 0 ? `${left}s` : "Time!"}</H1>
        <Body>
          {step === "story"
            ? "Tell the room your story. You can finish early."
            : "Everyone else can ask questions. The teller must stay in character."}
        </Body>
        <Button
          title={step === "story" ? "Story done · questions" : "Ready to vote"}
          onPress={() => {
            if (step === "story") {
              setLeft(30);
              setStep("questions");
            } else setStep("vote");
          }}
        />
      </>
    );
  if (step === "vote")
    return (
      <>
        <H1>Real or made up?</H1>
        <Body>
          On three, everyone except the teller shows a thumb: up for REAL, down
          for MADE UP. Keep your vote up until it’s scored.
        </Body>
        <Button
          title="Votes are up · reveal"
          onPress={() => setStep("result")}
        />
      </>
    );
  return (
    <>
      <BigCard tint={colors.goldSoft} label="THE SECRET WAS">
        {secret === "truth" ? "TRUTH" : "MAKE IT UP"}
      </BigCard>
      <VoteResults
        players={night.players.filter((p) => p.id !== player.id)}
        onConfirm={(ids) => onDone(scoreStory(night.players, player.id, ids))}
      />
    </>
  );
}
