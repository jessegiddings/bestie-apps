import { router } from 'expo-router';
import { noteById } from '@/content/clips';
import { usePep } from '@/state/store';
import { Body, Button, H1, Card, Label, Screen, VoiceNoteCard } from '@/ui/kit';

export default function Saved() {
  const saved = usePep((s) => s.saved);
  const toggleSaved = usePep((s) => s.toggleSaved);
  const premium = usePep((s) => s.isPremium());
  const notes = saved.map(noteById).filter((n) => n != null);
  return (
    <Screen tab="saved">
      <Label>YOUR KEEPERS</Label><H1>{'The words you\ncome back to.'}</H1>
      {!premium ? (
        <>
          <Body muted>With Premium, tap Save on any note to keep it here for the days you need it again.</Body>
          <Button title="See Premium" kind="secondary" onPress={() => router.push('/premium')} />
        </>
      ) : notes.length === 0 ? (
        <Body muted>Nothing saved yet. Tap Save on any note you love.</Body>
      ) : (
        notes.map((n) => <VoiceNoteCard key={n.id} clipId={n.id} title={n.title ?? 'Note'} saved onToggleSave={() => toggleSaved(n.id)} />)
      )}
      <Card><Body muted>When a note lands, save it. Your favorites will be here when you need them.</Body></Card>
    </Screen>
  );
}
