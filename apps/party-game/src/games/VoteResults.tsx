import { useState } from "react";
import { View } from "react-native";
import type { Player } from "@/game/night";
import { Body, Button, Chip, H2 } from "@/ui/kit";
/** Physical simultaneous votes prevent copying. The scorekeeper only records the result. */
export function VoteResults({
  players,
  onConfirm,
  label = "Who got it right?",
}: {
  players: Player[];
  onConfirm: (ids: string[]) => void;
  label?: string;
}) {
  const [ids, setIds] = useState<string[]>([]);
  return (
    <>
      <H2>{label}</H2>
      <Body muted>
        Keep your votes visible. Tap every correct player, or confirm nobody.
      </Body>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {players.map((p) => (
          <Chip
            key={p.id}
            label={p.name}
            selected={ids.includes(p.id)}
            onPress={() =>
              setIds((v) =>
                v.includes(p.id) ? v.filter((x) => x !== p.id) : [...v, p.id],
              )
            }
          />
        ))}
      </View>
      <Button
        title={ids.length ? `Confirm ${ids.length} correct` : "Nobody got it"}
        onPress={() => onConfirm(ids)}
      />
    </>
  );
}
