import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { recordedAudio, silentEngine, type SpeechEngine } from './engine';

/**
 * The one voice player, adapted from Legend Lab's controller. Every app registers its host's
 * recorded clips once; screens call `play(id)` and nothing else makes sound.
 * - Real recordings only. A clip with no audio file yet shows its words as a caption and is never
 *   read by a synthetic voice.
 * - No overlap: a higher-priority clip interrupts, equal priority queues (short queue), lower waits.
 * - Every clip sets a caption, so the app reads the same with sound off.
 * - Silent playback is never reported as success: a watchdog marks a clip failed if audio never
 *   starts, and the UI can offer a retry.
 */
export interface Clip {
  id: string;
  /** What she says; also the caption and the script she records from. */
  text: string;
  /** `require()`d audio file, once recorded. */
  asset?: number | null;
  /** Higher interrupts lower; equal priority queues. Default 2. */
  priority?: 1 | 2 | 3;
}

export type VoiceStatus = 'idle' | 'playing' | 'failed' | 'muted';

export interface VoiceState {
  ready: boolean;
  muted: boolean;
  volume: number;
  status: VoiceStatus;
  caption: { id: string; text: string } | null;
  /** True when the current caption has no recording yet. */
  captionOnly: boolean;
  lastError: string | null;
}

export const useVoice = create<VoiceState>(() => ({
  ready: false,
  muted: false,
  volume: 1,
  status: 'idle',
  caption: null,
  captionOnly: false,
  lastError: null,
}));

const START_WATCHDOG_MS = 3000;

interface Line {
  clip: Clip;
  priority: number;
  onDone?: () => void;
}

const clips: Record<string, Clip> = {};
let settingsKey = 'bestie-voice-v1';
let current: Line | null = null;
let currentEngine: SpeechEngine | null = null;
let queue: Line[] = [];
let watchdog: ReturnType<typeof setTimeout> | null = null;
let lastLine: Line | null = null;
let engineFactory: (clip: Clip) => SpeechEngine = (clip) => (clip.asset != null ? recordedAudio(clip.asset) : silentEngine);

export function registerClips(list: readonly Clip[]): void {
  for (const c of list) clips[c.id] = c;
}

export function getClip(id: string): Clip | undefined {
  return clips[id];
}

export function hasRecording(id: string): boolean {
  return clips[id]?.asset != null;
}

/** Tests inject a fake engine. */
export function setEngineFactory(f: ((clip: Clip) => SpeechEngine) | null): void {
  engineFactory = f ?? ((clip) => (clip.asset != null ? recordedAudio(clip.asset) : silentEngine));
}

export async function initVoice(opts: { storageKey?: string } = {}): Promise<void> {
  if (opts.storageKey) settingsKey = opts.storageKey;
  try {
    const raw = await AsyncStorage.getItem(settingsKey);
    if (raw) {
      const s = JSON.parse(raw) as Partial<VoiceState>;
      useVoice.setState({ muted: Boolean(s.muted), volume: typeof s.volume === 'number' ? s.volume : 1 });
    }
  } catch {
    /* defaults */
  }
  try {
    const Audio = await import('expo-audio');
    if (Platform.OS !== 'web') await Audio.setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    /* captions still work */
  }
  useVoice.setState({ ready: true, status: useVoice.getState().muted ? 'muted' : 'idle' });
}

async function persist(): Promise<void> {
  const { muted, volume } = useVoice.getState();
  try {
    await AsyncStorage.setItem(settingsKey, JSON.stringify({ muted, volume }));
  } catch {
    /* best effort */
  }
}

export function setMuted(muted: boolean): void {
  useVoice.setState({ muted, status: muted ? 'muted' : 'idle' });
  if (muted) cancel();
  void persist();
}

function clearWatchdog() {
  if (watchdog) clearTimeout(watchdog);
  watchdog = null;
}

function finish(line: Line, ok: boolean, error?: string) {
  clearWatchdog();
  if (current !== line) return;
  current = null;
  currentEngine = null;
  const st = useVoice.getState();
  useVoice.setState({ status: ok ? (st.muted ? 'muted' : 'idle') : 'failed', lastError: ok ? null : error ?? 'audio_failed' });
  line.onDone?.();
  if (ok) pump();
}

function startLine(line: Line) {
  current = line;
  const engine = engineFactory(line.clip);
  currentEngine = engine;
  useVoice.setState({ status: 'playing', caption: { id: line.clip.id, text: line.clip.text }, captionOnly: false, lastError: null });
  let started = false;
  clearWatchdog();
  watchdog = setTimeout(() => {
    if (!started && current === line) {
      engine.stop();
      finish(line, false, 'no_audio_started');
    }
  }, START_WATCHDOG_MS);
  engine.speak({
    text: line.clip.text,
    rate: 1,
    volume: useVoice.getState().volume,
    onStart: () => {
      started = true;
      clearWatchdog();
    },
    onDone: () => finish(line, true),
    onError: (reason) => finish(line, false, reason),
  });
}

function pump() {
  if (current || queue.length === 0) return;
  startLine(queue.shift()!);
}

export interface PlayOptions {
  interrupt?: boolean;
  onDone?: () => void;
}

/**
 * Play a registered clip. Returns true when audio was started or queued; false when it was shown
 * as a caption only (sound off, or not recorded yet).
 */
export function play(id: string, opts: PlayOptions = {}): boolean {
  const clip = clips[id];
  if (!clip) throw new Error(`Unknown clip ${id}`);
  const line: Line = { clip, priority: clip.priority ?? 2, onDone: opts.onDone };
  lastLine = line;
  const st = useVoice.getState();
  if (st.muted || clip.asset == null) {
    if (current) cancel();
    useVoice.setState({ caption: { id, text: clip.text }, captionOnly: clip.asset == null, status: st.muted ? 'muted' : 'idle' });
    setTimeout(() => opts.onDone?.(), 0);
    return false;
  }
  if (current) {
    if (opts.interrupt || line.priority > current.priority) {
      const prev = current;
      currentEngine?.stop();
      clearWatchdog();
      current = null;
      prev.onDone?.();
      queue = [];
      startLine(line);
      return true;
    }
    queue = [...queue.filter((q) => q.priority >= line.priority), line].slice(-3);
    return true;
  }
  startLine(line);
  return true;
}

/** Drop everything in flight: navigation, skip, mute. */
export function cancel(): void {
  queue = [];
  if (current) {
    const prev = current;
    currentEngine?.stop();
    clearWatchdog();
    current = null;
    currentEngine = null;
    prev.onDone?.();
  }
  const st = useVoice.getState();
  if (st.status === 'playing') useVoice.setState({ status: st.muted ? 'muted' : 'idle' });
}

/** Play the last clip again; also the retry path after a failure. */
export function replay(): boolean {
  if (!lastLine) return false;
  if (useVoice.getState().muted) setMuted(false);
  cancel();
  return play(lastLine.clip.id, { interrupt: true });
}

export function clearCaption(): void {
  cancel();
  useVoice.setState({ caption: null, captionOnly: false, lastError: null });
}

export function isPlaying(): boolean {
  return current != null;
}
