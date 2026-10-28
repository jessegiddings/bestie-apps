import type { SpeechEngine } from './engine';
import { cancel, clearCaption, play, registerClips, setEngineFactory, setMuted, useVoice } from './player';


function fakeEngine(log: string[]): SpeechEngine {
  return {
    name: 'recorded',
    speak(req) {
      log.push(`start:${req.text}`);
      req.onStart();
    },
    stop() {
      log.push('stop');
    },
    async available() {
      return true;
    },
  };
}

describe('voice player', () => {
  const log: string[] = [];
  beforeEach(() => {
    log.length = 0;
    clearCaption();
    setMuted(false);
    setEngineFactory(() => fakeEngine(log));
    registerClips([
      { id: 'a', text: 'Hey you', asset: 1 },
      { id: 'b', text: 'Not recorded yet', asset: null },
      { id: 'urgent', text: 'Right now', asset: 2, priority: 3 },
    ]);
  });
  afterEach(() => cancel());

  it('only credits successful recorded playback', () => {
    const complete = jest.fn();
    let request: Parameters<SpeechEngine['speak']>[0];
    setEngineFactory(() => ({ ...fakeEngine(log), speak: req => { request = req; req.onStart(); } }));
    play('b', { onComplete: complete });
    expect(complete).not.toHaveBeenCalled();
    play('a', { onComplete: complete });
    cancel();
    request!.onDone();
    expect(complete).not.toHaveBeenCalled();
    play('a', { onComplete: complete });
    request!.onError('failed');
    expect(complete).not.toHaveBeenCalled();
    play('a', { onComplete: complete });
    request!.onDone();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('plays a recorded clip and captions it', () => {
    expect(play('a')).toBe(true);
    expect(useVoice.getState().caption?.text).toBe('Hey you');
    expect(log).toEqual(['start:Hey you']);
  });

  it('shows an unrecorded clip as a caption only, never synthesized', () => {
    expect(play('b')).toBe(false);
    expect(useVoice.getState().captionOnly).toBe(true);
    expect(log).toEqual([]);
  });

  it('lets a higher-priority clip interrupt', () => {
    play('a');
    play('urgent');
    expect(log).toEqual(['start:Hey you', 'stop', 'start:Right now']);
  });

  it('captions without sound when muted', () => {
    setMuted(true);
    expect(play('a')).toBe(false);
    expect(useVoice.getState().caption?.text).toBe('Hey you');
    expect(log).toEqual([]);
  });
});
