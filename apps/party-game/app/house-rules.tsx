import { router } from "expo-router";
import { useState } from "react";
import { TextInput } from "react-native";
import { useParty } from "@/state/store";
import { Body, Button, Card, H1, Label, Screen } from "@/ui/kit";
import { colors, fonts } from "@/ui/theme";
export default function HouseRules() {
  const st = useParty();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Screen>
      <Label>HOUSE RULES</Label>
      <H1>Your room. Your prompts.</H1>
      <Body>
        Add a sentence for everyone to finish in Who Wrote That? Your new
        prompts play first, then mix into the regular deck. They stay on this
        device.
      </Body>
      <TextInput
        accessibilityLabel="Your custom prompt"
        value={text}
        onChangeText={setText}
        placeholder="This group’s greatest achievement is…"
        placeholderTextColor={colors.muted}
        maxLength={140}
        multiline
        style={{
          minHeight: 100,
          padding: 18,
          backgroundColor: "white",
          borderRadius: 18,
          color: colors.ink,
          fontFamily: fonts.body,
          fontSize: 18,
        }}
      />
      <Button
        title="Add to our deck"
        disabled={!text.trim()}
        onPress={() => {
          if (st.addHousePrompt(text)) {
            setText("");
            setMessage("Added. Your new prompts play first next time.");
          } else
            setMessage(
              "Already in the deck, or you’ve reached the 40-prompt limit.",
            );
        }}
      />
      {message ? <Body>{message}</Body> : null}
      {st.housePrompts.map((p) => (
        <Card key={p}>
          <Body>{p}</Body>
          <Button
            title="Remove prompt"
            kind="ghost"
            onPress={() => st.removeHousePrompt(p)}
          />
        </Card>
      ))}
      <Button
        title="Play Who Wrote That?"
        onPress={() => router.push("/players?game=who-wrote-that")}
      />
      <Button
        title="Back to games"
        kind="ghost"
        onPress={() => router.replace("/")}
      />
    </Screen>
  );
}
