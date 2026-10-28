import { router } from 'expo-router';
import { noteById } from '@/content/clips';
import { usePep } from '@/state/store';
import { Body, Button, H1, Screen, VoiceNoteCard } from '@/ui/kit';

export default function Saved() {
  const saved = usePep((s) => s.saved);
  const toggleSaved = usePep((s) => s.toggleSaved);
  const premium = usePep((s) => s.isPremium());
  const notes = saved.map(noteById).filter((n) => n != null);
  return (
    <Screen>
      <H1>Saved notes</H1>
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
      <Button title="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
