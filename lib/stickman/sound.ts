/**
 * Scroll stick figure: sound effects.
 *
 * Everything is synthesised with Web Audio (no audio files to ship). Browsers
 * only allow audio after a user gesture, so the context is created lazily by
 * `unlock()`; until then every call is a silent no-op.
 */

export type SoundName = "step" | "jump" | "land" | "fall";

const MASTER_GAIN = 0.18;

export class StickSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private stepFlip = false;
  private lastStepAt = 0;
  muted = false;

  /** Call from a user gesture (click / key / touch). Safe to call repeatedly. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = MASTER_GAIN;
        this.master.connect(this.ctx.destination);

        // One second of white noise, reused for every footstep and thud.
        const len = this.ctx.sampleRate;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.noise = null;
  }

  play(name: SoundName): void {
    const ctx = this.ctx;
    if (this.muted || !ctx || !this.master || ctx.state !== "running") return;
    const t = ctx.currentTime;

    switch (name) {
      case "step": {
        // Rate limit: fast scrolling must not turn into a buzz.
        if (t - this.lastStepAt < 0.09) return;
        this.lastStepAt = t;
        this.stepFlip = !this.stepFlip;
        this.burst(t, 0.05, this.stepFlip ? 1500 : 1100, 0.5);
        this.tone(t, 0.06, this.stepFlip ? 190 : 160, 90, 0.25, "sine");
        break;
      }
      case "jump": {
        this.tone(t, 0.16, 260, 640, 0.35, "triangle");
        this.burst(t, 0.12, 2400, 0.12);
        break;
      }
      case "land": {
        this.tone(t, 0.18, 130, 45, 0.7, "sine");
        this.burst(t, 0.07, 700, 0.45);
        break;
      }
      case "fall": {
        this.tone(t, 0.5, 520, 110, 0.25, "sine");
        break;
      }
    }
  }

  /** A pitched blip that glides from `f0` to `f1`. */
  private tone(
    t: number,
    dur: number,
    f0: number,
    f1: number,
    gain: number,
    type: OscillatorType
  ): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /** A short band-passed noise tick (footsteps, thuds, air). */
  private burst(t: number, dur: number, freq: number, gain: number): void {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(g).connect(this.master!);
    src.start(t, Math.random() * 0.5, dur + 0.02);
  }
}
