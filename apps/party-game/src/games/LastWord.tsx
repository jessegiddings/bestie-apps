import { play, useVoice } from "@bestie/core";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import type { PromptCard } from "@/content/decks";
import { TIME_UP } from "@/content/host";
import { fuseSeconds, pick, scoreElimination } from "@/game/night";
import { useParty } from "@/state/store";
import { BigCard, Body, Button, H1, H2, Label, PlayerPicker } from "@/ui/kit";
import { colors } from "@/ui/theme";
import { useGamePause, useDealtCard, type TurnProps } from "./shared";
export function LastWord({ night, onDone }: TurnProps) {
  const first = useDealtCard<PromptCard>();
  const [card, setCard] = useState<PromptCard | null>(null);
  const [active, setActive] = useState(night.players);
  const [step, setStep] = useState("ready");
  const [holder, setHolder] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [runner, setRunner] = useState<string | null>(null);
  const [challenge, setChallenge] = useState(false);
  const { paused } = useGamePause();
  const remaining = useRef(fuseSeconds() * 1000);
  const ticking = useAudioPlayer(require("../../assets/voice/tick.wav"));
  const muted = useVoice((s) => s.muted);
  useEffect(() => {
    if (!card && first) setCard(first);
  }, [first, card]);
  useEffect(() => {
    if (step !== "live" || paused || challenge) return;
    const started = Date.now();
    const timer = setTimeout(() => {
      play(pick(TIME_UP).id, { interrupt: true });
      setStep("boom");
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started),
      );
    };
  }, [step, paused, challenge]);
  useEffect(() => {
    if (step !== "live" || paused || challenge || muted) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let interval = 850;
    const tick = () => {
      if (stopped) return;
      void ticking
        .seekTo(0)
        .then(() => {
          if (!stopped) ticking.play();
        })
        .catch(() => undefined);
      interval = Math.max(230, interval * 0.94);
      timer = setTimeout(tick, interval);
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
      ticking.pause();
    };
  }, [step, paused, challenge, muted, ticking]);
  if (!card) return <Body>Getting the first category…</Body>;
  const name = (id: string | null) =>
    night.players.find((p) => p.id === id)?.name ?? "";
  const eliminate = () => {
    if (!holder) return;
    const survivors = active.filter((p) => p.id !== holder);
    if (survivors.length === 1) {
      setWinner(survivors[0].id);
      setRunner(holder);
      setStep("winner");
    } else {
      setActive(survivors);
      setHolder(null);
      setCard(useParty.getState().deal() as PromptCard);
      remaining.current = fuseSeconds() * 1000;
      setStep("ready");
    }
  };
  if (step === "winner")
    return (
      <>
        <Label>LAST PLAYER STANDING</Label>
        <H1>{name(winner)}</H1>
        <Body>{`${name(winner)} earns +3. ${name(runner)} is runner-up and earns +1.`}</Body>
        <Button
          title="Bank the finale points"
          onPress={() => onDone(scoreElimination(winner!, runner!))}
        />
      </>
    );
  if (step === "ready")
    return (
      <>
        <Label>{`${active.length} STILL IN`}</Label>
        <BigCard tint="#BBDFF4" label="NEW CATEGORY">
          {card.text}
        </BigCard>
        <Body>{`${active[0].name} starts. Name something that fits, pass left to the next survivor. No repeats. No tapping between answers.`}</Body>
        <Body
          muted
        >{`Playing: ${active.map((p) => p.name).join(", ")}. At the buzzer, the holder is out.`}</Body>
        <Button
          title="Start the hidden clock"
          onPress={() => setStep("live")}
        />
      </>
    );
  if (step === "live")
    return (
      <>
        <Label>{challenge ? "CLOCK FROZEN" : "SAY ONE. PASS LEFT."}</Label>
        <BigCard tint={colors.coralSoft}>{card.text}</BigCard>
        {challenge ? (
          <>
            <H2>The room decides</H2>
            <Body>
              Was that answer valid? If not, the same player keeps the phone and
              gives a new answer. If yes, pass left. The remaining time stays
              the same.
            </Body>
            <Button
              title="Decision made · resume clock"
              onPress={() => setChallenge(false)}
            />
          </>
        ) : (
          <>
            <Body>No repeats. Skip anyone who is already out.</Body>
            <Button
              title="Challenge! Freeze the clock"
              kind="secondary"
              onPress={() => setChallenge(true)}
            />
          </>
        )}
      </>
    );
  return (
    <>
      <Label>TIME’S UP</Label>
      <H1>Who’s holding it?</H1>
      <PlayerPicker players={active} selected={holder} onPick={setHolder} />
      <Body muted>
        Only the holder is eliminated. Check the name before confirming.
      </Body>
      <Button
        title={holder ? `${name(holder)} is out` : "Choose the holder"}
        disabled={!holder}
        onPress={eliminate}
      />
    </>
  );
}
