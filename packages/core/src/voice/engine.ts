
/**
 * Speech engines. The controller talks to this interface only.
 * - Missing clips remain captioned; no generic voice substitution is allowed.
 * - `recordedAudio`: plays an approved recording through expo-audio.
 * - `silentEngine`: used in tests and when nothing is available; reports failure honestly.
 */
export interface SpeakRequest {
  text: string;
  rate: number;
  volume: number;
  onStart: () => void;
  onDone: () => void;
  onError: (reason: string) => void;
}

export interface SpeechEngine {
  name: 'device' | 'recorded' | 'silent';
  speak(req: SpeakRequest): void;
  stop(): void;
  /** True when the engine can produce sound on this platform. */
  available(): Promise<boolean>;
}

export function recordedAudio(asset: number): SpeechEngine {
  let currentPlayer: { remove: () => void; pause: () => void } | null = null;
  let generation = 0;
  return {
    name: 'recorded',
    speak(req) {
      const token = ++generation;
      void (async () => {
        try {
          const Audio = await import('expo-audio');
          if (token !== generation) return;
          const player = Audio.createAudioPlayer(asset);
          currentPlayer = player;
          player.volume = req.volume;
          let started = false;
          let finished = false;
          const finish = () => {
            if (finished) return;
            finished = true;
            req.onDone();
            try {
              player.remove();
            } catch {
              /* already removed */
            }
            if (currentPlayer === player) currentPlayer = null;
          };
          player.addListener('playbackStatusUpdate', (st) => {
            if (token !== generation || finished) return;
            if (st.error) {
              finished = true;
              player.remove();
              req.onError(String(st.error));
              if (currentPlayer === player) currentPlayer = null;
              return;
            }
            if (st.playing && !started) {
              started = true;
              req.onStart();
            }
            // Native reports didJustFinish; the web player reports the final pause with currentTime at the end.
            const atEnd = st.duration > 0 && st.currentTime >= st.duration - 0.15;
            if (st.didJustFinish || (started && !st.playing && atEnd)) finish();
          });
          player.play();
        } catch (e) {
          if (token === generation) req.onError((e as Error)?.message || 'audio_error');
        }
      })();
    },
    stop() {
      generation++;
      try {
        currentPlayer?.pause();
        currentPlayer?.remove();
      } catch {
        /* ignore */
      }
      currentPlayer = null;
    },
    async available() {
      try {
        await import('expo-audio');
        return true;
      } catch {
        return false;
      }
    },
  };
}

export const silentEngine: SpeechEngine = {
  name: 'silent',
  speak(req) {
    req.onError('unsupported');
  },
  stop() {
    /* nothing */
  },
  async available() {
    return false;
  },
};
